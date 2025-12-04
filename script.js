// Rube Goldberg Web demo using p5.js
// Press SPACE to start, R to reset.

let steps = [];
let state = 'idle'; // 'idle', 'running', 'finished'
let stepIndex = 0;
let confetti = [];

function setup(){
  const canvas = createCanvas(860, 500);
  canvas.parent('canvas-holder');
  initSteps();
  textFont('Segoe UI');
}

function draw(){
  background(7,16,41);
  drawGround();
  for(let s of steps) s.draw();
  if(state === 'running'){
    let current = steps[stepIndex];
    if(current){
      current.update();
      if(current.done){
        stepIndex++;
        if(stepIndex >= steps.length){
          state = 'finished';
          triggerFinish();
        } else {
          // small delay before next
          steps[stepIndex].startDelay = millis() + 400;
        }
      }
    }
  }
  if(state === 'finished'){
    updateConfetti();
  }
  drawHUD();
}

function drawGround(){
  noStroke();
  fill(20,30,60);
  rect(0, height-40, width, 40);
}

function drawHUD(){
  push();
  noStroke();
  fill(200);
  textSize(12);
  textAlign(LEFT,TOP);
  text('Etat: ' + state + '    Etape: ' + (min(stepIndex, steps.length)), 12,12);
  pop();
}

function initSteps(){
  steps = [];
  stepIndex = 0;
  state = 'idle';
  confetti = [];
  // Step 1: ball rolls down ramp and hits domino trigger
  steps.push(new RollingBall(80, 120, 18));
  // Step 2: dominoes fall in sequence, final one hits a lever
  steps.push(new DominoTrain(220, height-60, 8));
  // Step 3: lever flips a small cart
  steps.push(new LeverAndCart(420, height-80));
  // Step 4: cart knocks over a book that drops a marble
  steps.push(new BookDrop(600, height-120));
  // Step 5: marble hits a bell (final)
  steps.push(new Bell(760, height-120));
  // set initial delays so they can play sequentially
  steps[0].startDelay = 0;
}

// ----- Step classes -----
class RollingBall{
  constructor(x,y,r){ this.x=x; this.y=y; this.r=r; this.v=0; this.started=false; this.done=false; this.startDelay = 0; }
  start(){ this.started = true; }
  update(){
    if(!this.started && millis() < this.startDelay) return;
    if(!this.started){ this.started=true; this.v=3.2; }
    this.x += this.v;
    this.v *= 1.00; // no friction for fun
    if(this.x > 190){ this.done = true; }
  }
  draw(){
    push();
    fill(240,200,60);
    noStroke();
    ellipse(this.x, this.y, this.r*2);
    // ramp
    stroke(140); strokeWeight(3);
    line(40, this.y+20, 140, this.y+60);
    pop();
  }
}

class DominoTrain{
  constructor(x,y,count){
    this.x=x; this.y=y; this.count=count;
    this.dominoes = [];
    let spacing = 18;
    for(let i=0;i<count;i++){
      this.dominoes.push({x: x + i*spacing, y: y-20, angle:0, falling:false});
    }
    this.done=false; this.started=false; this.startDelay=0; this.timer=0;
  }
  start(){ this.started=true; }
  update(){
    if(!this.started && millis() < this.startDelay) return;
    if(!this.started){ this.started=true; this.dominoes[0].falling=true; }
    let allDone = true;
    for(let i=0;i<this.dominoes.length;i++){
      let d=this.dominoes[i];
      if(d.falling && d.angle < PI/1.6) d.angle += 0.06 + i*0.002;
      if(d.falling && d.angle >= PI/1.6 && i+1 < this.dominoes.length) this.dominoes[i+1].falling = true;
      if(d.angle < PI/1.6) allDone=false;
    }
    if(allDone) this.done=true;
  }
  draw(){
    push();
    translate(0,0);
    for(let d of this.dominoes){
      push();
      translate(d.x, d.y);
      rotate(d.angle);
      rectMode(CENTER);
      fill(180);
      rect(0,0,8,30);
      pop();
    }
    pop();
  }
}

class LeverAndCart{
  constructor(x,y){
    this.x=x; this.y=y; this.leverAngle= -0.2; this.cartX = x+20; this.cartV=0;
    this.started=false; this.done=false; this.startDelay=0;
    this.triggered=false;
  }
  start(){ this.started=true; }
  update(){
    if(!this.started && millis() < this.startDelay) return;
    if(!this.started){ this.started=true; }
    // simulate lever being hit after a short time
    if(!this.triggered && millis() > (this.startDelay + 600)){
      this.triggered = true;
      this.cartV = 3.8;
    }
    if(this.triggered){
      this.cartX += this.cartV;
      this.cartV *= 0.995;
      if(this.cartX > this.x + 120) this.done=true;
    }
  }
  draw(){
    push();
    // lever
    translate(this.x,this.y);
    stroke(120); strokeWeight(4);
    line(-40,0,60,0);
    push();
    translate(-10,0);
    rotate(this.leverAngle);
    fill(200,120,90);
    rect(0,0,60,8);
    pop();
    // cart
    fill(90,200,160);
    rectMode(CENTER);
    rect(this.cartX, -12, 40, 18, 4);
    pop();
  }
}

class BookDrop{
  constructor(x,y){
    this.x=x; this.y=y; this.bookY = y-40; this.started=false; this.done=false; this.startDelay=0; this.released=false;
  }
  start(){ this.started=true; }
  update(){
    if(!this.started && millis() < this.startDelay) return;
    if(!this.started){ this.started=true; }
    // cart collision is faked by time when this step starts
    if(!this.released && millis() > (this.startDelay + 300)) this.released = true;
    if(this.released){
      this.bookY += 6;
      if(this.bookY > height-80){ this.done = true; }
    }
  }
  draw(){
    push();
    // book
    rectMode(CENTER);
    fill(140,80,200);
    rect(this.x, this.bookY, 60, 30, 4);
    pop();
  }
}

class Bell{
  constructor(x,y){
    this.x=x; this.y=y; this.rung=false; this.done=false; this.startDelay=0;
  }
  start(){ this.rung=true; }
  update(){
    if(!this.rung && millis() < this.startDelay) return;
    if(this.rung && !this.done){
      // small ringing animation then done
      this.done = true;
    }
  }
  draw(){
    push();
    translate(this.x,this.y);
    fill(220,200,60);
    ellipse(0,0,48,44);
    fill(180);
    rect(-6,18,12,6,3);
    pop();
    if(this.done) {
      push();
      textAlign(CENTER);
      textSize(20);
      fill(255,220,120);
      text('DING!', this.x, this.y-60);
      pop();
    }
  }
}

function triggerFinish(){
  // create confetti particles
  for(let i=0;i<80;i++) confetti.push({
    x: random(width*0.2, width*0.9),
    y: random(-40, -10),
    vy: random(1,4),
    rot: random(TWO_PI),
    size: random(4,9)
  });
}
function updateConfetti(){
  for(let p of confetti){
    p.y += p.vy;
    p.rot += 0.08;
    push();
    translate(p.x,p.y);
    rotate(p.rot);
    rectMode(CENTER);
    rect(0,0,p.size,p.size*0.6);
    pop();
  }
}

function keyPressed(){
  if(key === ' '){ // space
    if(state === 'idle' || state === 'finished'){
      state = 'running';
      stepIndex = 0;
      // start first
      steps[0].startDelay = millis();
      for(let i=1;i<steps.length;i++) steps[i].startDelay = 99999999; // will be set when previous finishes
      // ensure each step's start called when previous done
      scheduleChain();
    }
  }
  if(key === 'r' || key === 'R'){
    initSteps();
  }
}

function scheduleChain(){
  // Polling approach: when a step becomes done, set next's startDelay = now
  let checker = setInterval(()=>{
    if(state !== 'running'){ clearInterval(checker); return; }
    if(stepIndex < steps.length && steps[stepIndex] && steps[stepIndex].done){
      // start next if any
      if(stepIndex+1 < steps.length) steps[stepIndex+1].startDelay = millis();
      stepIndex++;
      if(stepIndex >= steps.length){ clearInterval(checker); }
    }
  }, 120);
}
