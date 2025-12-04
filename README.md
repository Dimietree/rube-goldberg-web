# Rube Goldberg Web — Machine inutilement compliquée (demo)

**Description**
This is a small web demo of a Rube Goldberg machine: a chain of simple animated steps that together produce a silly final action (a virtual "ding!" and confetti). Built with plain HTML, CSS and JavaScript using p5.js for drawing and simple state-machine logic.

**What's included**
- `index.html` — demo page
- `script.js` — animation logic (p5.js)
- `style.css` — simple styling
- `assets/` — placeholder for images or sounds (empty)
- `LICENSE` — MIT

**How to run locally**
1. Clone or download this repository.
2. Open `index.html` in a modern browser. (No build step required.)
3. Press the **Space** key to start the machine. Press **R** to reset.

**How to publish to GitHub**
```bash
git init
git add .
git commit -m "Initial Rube Goldberg web demo"
# create a GitHub repo named rube-goldberg-web and follow instructions to push:
git remote add origin https://github.com/<your-username>/rube-goldberg-web.git
git push -u origin main
```

**Notes / Ideas to extend**
- Replace the simple shapes with LEGO-style sprites.
- Add real physics using matter.js or planck.js.
- Add user interaction: let visitors rearrange steps.
- Turn it into a data validation pipeline "Rube Goldberg style" by wiring fetch calls / API calls between steps.

Enjoy — and remember: the point is the journey, not the efficient result. 🛠️🤹‍♂️
