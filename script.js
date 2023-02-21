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
container.width = window.innerWidth;
container.height = window.innerHeight;
backgroundCanv.width = container.width;
backgroundCanv.height = container.height;

class Star {
  constructor(x, y, z, alpha = 1, radius, fading = false) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.alpha = alpha;
    this.radius = radius;
    this.fading = fading;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 255, " + this.alpha + ")";
    ctx.fill();
  }
  updatePos(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
  updateAlphaVal(deltaAlpha) {
    this.alpha += deltaAlpha;
  }
  setAlphaVal(alphaVal) {
    this.alpha = alphaVal;
  }
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

function clear() {
  ctx.clearRect(0, 0, backgroundCanv.width, backgroundCanv.height);
}
function drawStars() {
  for (let i = 0; i < starsArray.length; i++) {
    starsArray[i].draw();
  }
}
// function remove
function updateStarPositionsAndAlphaVal(mP) {
  if (allowMoving) {
    let mousePos = mP;
    for (let i = 0; i < starsArray.length; i++) {
      let star = starsArray[i];
      let dx = ((mousePos.x - star.x) * star.z * 0.0005) / star.radius;
      let dy = ((mousePos.y - star.y) * star.z * 0.0005) / star.radius;
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
function setMouseCoords(event) {
  mousePosition = { x: event.clientX, y: event.clientY };
  update();
}
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
function createRandomStar() {
  let newRadius = Math.floor(Math.random() * 4);
  let newZ = Math.random();
  let newX = Math.random() * (window.innerWidth - newRadius * 2);
  let newY = Math.random() * (window.innerHeight - newRadius * 2);
  createStar(newRadius, newX, newY, newZ);
}
function createRandomStarOnBorder() {
  let border = Math.floor(Math.random() * 4);
  let newRadius = Math.floor(Math.random() * 4);
  let newZ = Math.random();
  switch (border) {
    case 0:
      newY = Math.random() * (window.innerHeight - newRadius * 2);
      createStar(newRadius, 10, newY, newZ);
      break;
    case 1:
      newX = Math.random() * (window.innerWidth - newRadius * 2);
      createStar(newRadius, newX, 10, newZ);
      break;
    case 2:
      newY = Math.random() * (window.innerHeight - newRadius * 2);
      createStar(newRadius, maxX, newY, newZ);
      break;
    default:
      newX = Math.random() * (window.innerWidth - newRadius * 2);
      createStar(newRadius, newX, maxY, newZ);
  }
}
function createStar(radius, xPos, yPos, zVal) {
  starsArray.push(new Star(xPos, yPos, zVal, 1, radius));
}
function openMenu() {
  toggleMenu = !toggleMenu;
  menuOptionsDiv.style.visibility = toggleMenu ? "visible" : "hidden";
  menuOptionsDiv.style.display = toggleMenu ? "block" : "none";
  menuDiv.style.backgroundColor = toggleMenu
    ? "rgba(44, 44, 45, 1)"
    : "rgba(44, 44, 45, 0)";
}
