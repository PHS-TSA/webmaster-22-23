/** Module for the star field background animation.
 * @module script
 * @see module:importmap
 */

// import * as bootstrap from "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.esm.min.js";

import * as serviceWorker from "./service-worker.js";

const maxX = window.innerWidth;
const maxY = window.innerHeight;
let backgroundCanv = document.getElementById("background");
let menuDiv = document.getElementById("menu");
let menuBtn = document.getElementById("menuBtn");
let ctx = backgroundCanv.getContext("2d");
let menuOptionsDiv = document.getElementById("v-pills-tab");
let theMenuOptions = menuOptionsDiv.querySelectorAll("a");
let toggleMenu = false;
let mousePosition = {};
var allowMoving = false;
container.width = maxX; /* Something's wrong with this.
  Uncaught TypeError: Cannot set properties of undefined (setting 'width')
  at script.js:formatted:12:17
*/
container.height = maxY;
backgroundCanv.width = container.width;
backgroundCanv.height = container.height;
menuBtn.addEventListener("click", openMenu);

/** Class representing a star. */
class Star {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} alpha
   * @param {number} radius
   * @param {boolean} fading
   * @returns {Star}
   */

  constructor(x, y, z, alpha = 0.1, radius, fading = false) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.alpha = alpha;
    this.radius = radius;
    this.fading = fading;
  }

  /** Draw the circle. */
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 255, " + this.alpha + ")";
    ctx.fill();
  }
  /**
   * Update the position of the star.
   * @param {number} dx
   * @param {number} dy
   */
  updatePos(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.alpha += 0.005;
  }

  /**
   * Update the alpha.
   * @param {number} deltaAlpha
   */
  updateAlphaVal(deltaAlpha) {
    this.alpha += deltaAlpha;
  }

  /**
   * Set the alpha.
   * @param {number} alphaVal
   */
  setAlphaVal(alphaVal) {
    this.alpha = alphaVal;
  }

  /**
   * Set if a star is fading out.
   * @param {boolean} isFading
   */
  setFadingBool(isFading) {
    this.fading = isFading;
  }
}

let starsArray = [];
for (let i = 0; i < 450; i++) {
  createRandomStar();
}
for (let i = 0; i < starsArray.length; i++) {
  starsArray[i].draw();
}

/**
 * Clear the stars from the viewer's eye.
 */
function clear() {
  ctx.clearRect(0, 0, backgroundCanv.width, backgroundCanv.height);
}

/**
 * Draw all the stars in the {@link starsArray}.
 */
function drawStars() {
  for (let i = 0; i < starsArray.length; i++) {
    starsArray[i].draw();
  }
}

// function remove. @Ash-Greninja101 what did you mean?
/**
 * Update the stars and their alphas.
 * @param {mousePosition} mP
 */
function updateStarPositionsAndAlphaVal(mP) {
  if (allowMoving) {
    let mousePos = mP;
    for (let i = 0; i < starsArray.length; i++) {
      let star = starsArray[i];
      let dx = ((mousePos.x - star.x) * star.z * -0.005) / star.radius;
      let dy = ((mousePos.y - star.y) * star.z * -0.005) / star.radius;
      star.updatePos(dx, dy);
      let dist = getDistance(mousePos.x, mousePos.y, star.x, star.y);
      if (dist <= 50) {
        star.setFadingBool(true);
      } else {
        star.setFadingBool(false);
      }
    }
    checkAndStartFadingAllStars();
  }
}

/**
 * Makes sure all stars fade out.
 */
function checkAndStartFadingAllStars() {
  for (let i = 0; i < starsArray.length; i++) {
    let star = starsArray[i];
    if (star.fading) {
      star.updateAlphaVal(-0.01);
      if (star.alpha <= 0) {
        starsArray.splice(i, 1);
        createRandomStarOnBorder();
      }
    } else {
      star.setAlphaVal(1);
    }
  }
}

/**
 * Update the stars location.
 */
function update() {
  clear();
  drawStars();
  updateStarPositionsAndAlphaVal(mousePosition);
  requestAnimationFrame(update);
}

document.onmousemove = getMouseCoords;
document.onmouseenter = setMouseCoords;
document.onmouseleave = (e) => {
  allowMoving = false;
};

/**
 * Get the mouse coordinates.
 * @param {Event} event
 */
function getMouseCoords(event) {
  let eventDoc, doc, body;
  event = event || window.event; // IE-ism

  // If pageX/Y aren't available and clientX/Y are,
  // calculate pageX/Y - logic taken from jQuery.
  // (This is to support old IE)
  if (event.pageX == null && event.clientX != null) {
    eventDoc = (event.target && event.target.ownerDocument) || document;
    doc = eventDoc.documentElement;
    body = eventDoc.body;

    event.pageX =
      event.clientX +
      ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
      ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
    event.pageY =
      event.clientY +
      ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
      ((doc && doc.clientTop) || (body && body.clientTop) || 0);
  }
  mousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
  allowMoving = true;
}

/**
 * Set the mouse coordinates.
 * @param {Event} event
 */
function setMouseCoords(event) {
  mousePosition = { x: event.clientX, y: event.clientY };
  update();
}

/**
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

/**
 * Create a random star.
 */
function createRandomStar() {
  let newRadius = Math.floor(Math.random() * 4);
  let newZ = Math.random();
  let newX = Math.random() * (window.innerWidth - newRadius * 2);
  let newY = Math.random() * (window.innerHeight - newRadius * 2);
  createStar(newRadius, newX, newY, newZ);
}

/**
 * Create a random star on the border of the canvas.
 */
function createRandomStarOnBorder() {
  let border = Math.floor(Math.random() * 4);
  let newRadius = Math.floor(Math.random() * 4);
  let newZ = Math.random();
  switch (border) {
    case 0: {
      let newY = Math.random() * (window.innerHeight - newRadius * 2);
      createStar(newRadius, 10, newY, newZ);
      break;
    }
    case 1: {
      let newX = Math.random() * (window.innerWidth - newRadius * 2);
      createStar(newRadius, newX, 10, newZ);
      break;
    }
    case 2: {
      let newY = Math.random() * (window.innerHeight - newRadius * 2);
      createStar(newRadius, maxX, newY, newZ);
      break;
    }
    default: {
      let newX = Math.random() * (window.innerWidth - newRadius * 2);
      createStar(newRadius, newX, maxY, newZ);
    }
  }
}

/**
 * Create a star.
 * @param {number} radius
 * @param {number} xPos
 * @param {number} yPos
 * @param {number} zVal
 */
function createStar(radius, xPos, yPos, zVal) {
  starsArray.push(new Star(xPos, yPos, zVal, 0.1, radius));
}

/**
 * Open the menu.
 */
function openMenu() {
  toggleMenu = !toggleMenu;
  menuOptionsDiv.style.visibility = toggleMenu ? "visible" : "hidden";
  menuOptionsDiv.style.display = toggleMenu ? "block" : "none";
  menuDiv.style.backgroundColor = toggleMenu
    ? "rgba(44, 44, 45, 1)"
    : "rgba(44, 44, 45, 0)";
}
setInterval(createRandomStar, 250);

/* This code was taken and modified from the PWA example on MDN */
let deferredPrompt;
const addBtn = document.querySelector(".add-button");
addBtn.style.display = "none";

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = "block";

  addBtn.addEventListener("click", (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = "none";
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      deferredPrompt = null;
    });
  });
});
