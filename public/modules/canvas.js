/** The canvas managing module */

/** Class representing a star. */
class Star {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} alpha
   * @param {number} radius
   * @param {boolean} isFadingIn
   * @returns {Star}
   */
  constructor(x, y, z, alpha = 0.1, radius, fading = true) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.alpha = alpha;
    this.radius = radius;
    this.isFadingIn = fading;
  }

  /** Draw the circle. */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
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
    this.isFadingIn = isFading;
  }
}

function canvasRun() {
  const maxX = window.innerWidth;
  const maxY = window.innerHeight;
  const backgroundCanv = document.getElementById("background");
  const ctx = backgroundCanv.getContext("2d");
  let allowMoving = false;
  const container = document.getElementById("container");
  container.width = maxX; /* Something's wrong with this.
  Uncaught TypeError: Cannot set properties of undefined (setting 'width')
  at script.js:formatted:12:17
  */
  container.height = maxY;
  backgroundCanv.width = container.width;
  backgroundCanv.height = container.height;

  const starsArray = [];
  for (let i = 0; i < 450; i++) {
    createRandomStar(starsArray);
  }
  for (let i = 0; i < starsArray.length; i++) {
    starsArray[i].draw(ctx);
  }

  document.onmousemove = getMouseCoords;
  document.onmouseenter = setMouseCoords;
  document.onmouseleave = (_handler, _event) => {
    allowMoving = false;
  };

  setInterval(createRandomStar, 250);
}
/**
 * Clear the stars from the viewer's eye.
 */
function clear(ctx) {
  ctx.clearRect(0, 0, backgroundCanv.width, backgroundCanv.height);
}

/**
 * Draw all the stars in the {@link starsArray}.
 */
function drawStars(ctx) {
  for (let i = 0; i < starsArray.length; i++) {
    starsArray[i].draw(ctx);
  }
}

// function remove. @Ash-Greninja101 what did you mean?
/**
 * Update the stars and their alphas.
 * @param {mousePosition} mP
 */
function updateStarPositionsAndAlphaVal(mP, maxX, maxY, starsArray) {
  if (allowMoving) {
    const mousePos = mP;
    for (let i = 0; i < starsArray.length; i++) {
      const star = starsArray[i];
      const dx = ((mousePos.x - star.x) * star.z * -0.005) / star.radius;
      const dy = ((mousePos.y - star.y) * star.z * -0.005) / star.radius;
      star.updatePos(dx, dy);
      const dist = getDistance(mousePos.x, mousePos.y, star.x, star.y);
      if (dist >= 50) {
        star.setFadingBool(true);
      } else {
        star.setFadingBool(false);
      }
    }
    checkAndStartFadingAllStars(maxX, maxY, starsArray);
  }
}

/**
 * Makes sure all stars fade out.
 */
function checkAndStartFadingAllStars(maxX, maxY, starsArray) {
  for (let i = 0; i < starsArray.length; i++) {
    const star = starsArray[i];
    if (star.fading) {
      star.updateAlphaVal(0.01);
      if (star.alpha <= 0) {
        starsArray.splice(i, 1);
        createRandomStarOnBorder(maxX, maxY, starsArray);
      }
    } else {
      star.setAlphaVal(1);
    }
  }
}

/**
 * Update the stars location.
 * @param {*} ctx
 * @param {*} mousePosition
 * @param {number} maxX
 * @param {number} maxY
 */
function update(ctx, mousePosition, maxX, maxY, starsArray) {
  clear(ctx);
  drawStars(ctx);
  updateStarPositionsAndAlphaVal(mousePosition, maxX, maxY, starsArray);
  requestAnimationFrame(
    (
      callback // FrameRequestCallback or number?
    ) => {
      return callback;
    }
  );
}

/**
 * Get the mouse coordinates.
 * @param {GlobalEventHandlers}
 * @param {Event} event
 */
function getMouseCoords(_handler, event) {
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
function setMouseCoords(ctx, event, maxX, maxY, starsArray) {
  const mousePosition = { x: event.clientX, y: event.clientY };
  update(ctx, mousePosition, maxX, maxY, starsArray);
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
 * This should conform to TimerHandler
 */
function createRandomStar(starsArray) {
  const newRadius = Math.floor(Math.random() * 4);
  const newZ = Math.random();
  const newX = Math.random() * (window.innerWidth - newRadius * 2);
  const newY = Math.random() * (window.innerHeight - newRadius * 2);
  createStar(starsArray, newRadius, newX, newY, newZ);
}

/**
 * Create a random star on the border of the canvas.
 */
function createRandomStarOnBorder(maxX, maxY, starsArray) {
  const border = Math.floor(Math.random() * 4);
  const newRadius = Math.floor(Math.random() * 4);
  const newZ = Math.random();
  switch (border) {
    case 0: {
      const newY = Math.random() * (window.innerHeight - newRadius * 2);
      createStar(starsArray, newRadius, 10, newY, newZ);
      break;
    }
    case 1: {
      const newX = Math.random() * (window.innerWidth - newRadius * 2);
      createStar(starsArray, newRadius, newX, 10, newZ);
      break;
    }
    case 2: {
      const newY = Math.random() * (window.innerHeight - newRadius * 2);
      createStar(starsArray, newRadius, maxX, newY, newZ);
      break;
    }
    default: {
      const newX = Math.random() * (window.innerWidth - newRadius * 2);
      createStar(starsArray, newRadius, newX, maxY, newZ);
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
function createStar(starsArray, radius, xPos, yPos, zVal) {
  starsArray.push(new Star(xPos, yPos, zVal, 0.1, radius));
}

export { Star, canvasRun };
