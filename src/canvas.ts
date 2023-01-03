/** The canvas managing module */

/** Class representing a star. */
class Star {
  x: number;
  y: number;
  z: number;
  alpha: number;
  radius: number;
  isFadingIn: boolean;

  /**
   * @param {number} x the x of the star
   * @param {number} y the y of the star
   * @param {number} z the z of the star
   * @param {number} alpha the star's alpha
   * @param {number} radius the star's radius
   * @param {boolean} fading if the star is fading in
   */
  constructor(
    x: number,
    y: number,
    z: number,
    alpha: number = 0.1,
    radius: number,
    fading: boolean = true
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.alpha = alpha;
    this.radius = radius;
    this.isFadingIn = fading;
  }

  /** Draw the circle. */
  draw(ctx: CanvasRenderingContext2D): void {
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
  updatePos(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }

  /**
   * Update the alpha.
   * @param {number} deltaAlpha
   */
  updateAlphaVal(deltaAlpha: number): void {
    this.alpha += deltaAlpha;
  }

  /**
   * Set the alpha.
   * @param {number} alphaVal
   */
  setAlphaVal(alphaVal: number): void {
    this.alpha = alphaVal;
  }

  /**
   * Set if a star is fading out.
   * @param {boolean} isFading
   */
  setFadingBool(isFading: boolean): void {
    this.isFadingIn = isFading;
  }
}

/**
 *
 */
function canvasRun(): void {
  const maxX = window.innerWidth;
  const maxY = window.innerHeight;
  const backgroundCanv: HTMLCanvasElement =
    document.getElementById("background");
  const ctx: CanvasRenderingContext2D = backgroundCanv.getContext("2d");
  let allowMoving = false;
  const container = document.getElementById("container");
  container.width = maxX; /* Something's wrong with this.
  Uncaught TypeError: Cannot set properties of undefined (setting 'width')
  at script.js:formatted:12:17
  */
  container.height = maxY;
  backgroundCanv.width = container.width;
  backgroundCanv.height = container.height;

  const starsArray: Star[] = [];
  for (let i = 0; i < 450; i++) {
    createRandomStar(starsArray);
  }
  for (let i = 0; i < starsArray.length; i++) {
    starsArray[i].draw(ctx);
  }

  document.onmousemove = getMouseCoords;
  document.onmouseenter = setMouseCoords;
  document.onmouseleave = setAllowMoving;

  setInterval(createRandomStar, 250);
}
/**
 * Clear the stars from the viewer's eye.
 */
function clear(
  ctx: CanvasRenderingContext2D,
  backgroundCanv: HTMLCanvasElement
): void {
  ctx.clearRect(0, 0, backgroundCanv.width, backgroundCanv.height);
}

/**
 * Draw all the stars in the {@link starsArray}.
 */
function drawStars(ctx: CanvasRenderingContext2D, starsArray: Star[]): void {
  for (let i = 0; i < starsArray.length; i++) {
    starsArray[i].draw(ctx);
  }
}

// function remove. @Ash-Greninja101 what did you mean?
/**
 * Update the stars and their alphas.
 *
 * @param {*} mP the mouse position
 * @param {number} mP.x the mouse location (x)
 * @param {number} mP.y the mouse location (y)
 * @param {number} maxX the width of the screen
 * @param {number} maxY the height of the screen
 * @param {Star[]} starsArray the list of stars
 * @param {boolean} allowMoving If the stars can move
 * @returns {void}
 */
function updateStarPositionsAndAlphaVal(
  mP: { x: number; y: number },
  maxX: number,
  maxY: number,
  starsArray: Star[],
  allowMoving: boolean
): void {
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
function checkAndStartFadingAllStars(
  maxX: number,
  maxY: number,
  starsArray: Star[]
): void {
  for (let i = 0; i < starsArray.length; i++) {
    const star = starsArray[i];
    if (star.isFadingIn) {
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
function update(
  ctx: CanvasRenderingContext2D,
  mousePosition: { x: number; y: number },
  maxX: number,
  maxY: number,
  starsArray: Star[],
  backgroundCanv: HTMLCanvasElement
): void {
  clear(ctx, backgroundCanv);
  drawStars(ctx, starsArray);
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
 * @param {GlobalEventHandlers} this
 * @param {MouseEvent} ev
 */
function getMouseCoords(this: GlobalEventHandlers, ev: MouseEvent): void {
  let eventDoc, doc, body;
  ev = ev || window.event; // IE-ism

  // If pageX/Y aren't available and clientX/Y are,
  // calculate pageX/Y - logic taken from jQuery.
  // (This is to support old IE)
  if (ev.pageX == null && ev.clientX != null) {
    eventDoc = (ev.target != null && ev.target.ownerDocument) || document;
    doc = eventDoc.documentElement;
    body = eventDoc.body;

    ev.pageX =
      ev.clientX +
      ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
      ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
    ev.pageY =
      ev.clientY +
      ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
      ((doc && doc.clientTop) || (body && body.clientTop) || 0);
  }
  mousePosition = {
    x: ev.clientX,
    y: ev.clientY,
  };
  allowMoving = true;
}

/**
 * Set the mouse coordinates.
 * @param {Event} ev
 */
function setMouseCoords(
  this: GlobalEventHandlers,
  ev: MouseEvent,
  ctx: CanvasRenderingContext2D,
  maxX: number,
  maxY: number,
  starsArray: Star[]
): void {
  const mousePosition = { x: ev.clientX, y: ev.clientY };
  update(ctx, mousePosition, maxX, maxY, starsArray);
}

/**
 *
 * @param {GlobalEventHandlers} this
 * @param {MouseEvent} ev
 * @return {void}
 */
function setAllowMoving(this: GlobalEventHandlers, ev: MouseEvent): void {
  allowMoving = false;
}

/**
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

/**
 * Create a random star.
 * This should conform to TimerHandler
 */
function createRandomStar(starsArray: Star[]): void {
  const newRadius = Math.floor(Math.random() * 4);
  const newZ = Math.random();
  const newX = Math.random() * (window.innerWidth - newRadius * 2);
  const newY = Math.random() * (window.innerHeight - newRadius * 2);
  createStar(starsArray, newRadius, newX, newY, newZ);
}

/**
 * Create a random star on the border of the canvas.
 */
function createRandomStarOnBorder(
  maxX: number,
  maxY: number,
  starsArray: Star[]
): void {
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
function createStar(
  starsArray: Star[],
  radius: number,
  xPos: number,
  yPos: number,
  zVal: number
): void {
  starsArray.push(new Star(xPos, yPos, zVal, 0.1, radius));
}

export { Star, canvasRun, getDistance };
