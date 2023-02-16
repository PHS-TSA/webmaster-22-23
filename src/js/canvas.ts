/**
 * The canvas managing module for the star field background animation.
 */

/** Class representing a star. */
class Star {
  x: number;
  y: number;
  z: number;
  alpha: number;
  radius: number;
  isFadingIn: boolean;

  /**
   * @param x - The x of the star.
   * @param y - The y of the star.
   * @param z - The z of the star.
   * @param alpha - The star's alpha.
   * @param radius - The star's radius.
   * @param fading - If the star is fading in.
   */
  constructor(
    x: number,
    y: number,
    z: number,
    alpha = 0.1,
    radius: number,
    fading = true
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.alpha = alpha;
    this.radius = radius;
    this.isFadingIn = fading;
  }

  /**
   * Draw the circle.
   *
   * @param ctx - The canvas, kinda.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.fill();
  }

  /**
   * Update the position of the star.
   *
   * @param dx - The amount to move the `x` by.
   * @param dy - The amount to move the `y` by.
   */
  updatePos(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }

  /**
   * Update the alpha.
   *
   * @param deltaAlpha - The amount to move the `alpha` by.
   */
  updateAlphaVal(deltaAlpha: number): void {
    this.alpha += deltaAlpha;
  }

  /**
   * Set the alpha.
   *
   * @param alphaVal - What to set the new `alpha` to.
   */
  setAlphaVal(alphaVal: number): void {
    this.alpha = alphaVal;
  }

  /**
   * Set if a star is fading out.
   *
   * @param isFading - Set if the stars are fading.
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
  const backgroundCanvas: HTMLElement | null =
    document.getElementById("background");
  const container = document.getElementById("container");
  const allowMoving = false;

  if (
    backgroundCanvas instanceof HTMLCanvasElement &&
    container instanceof HTMLDivElement
  ) {
    // container.width = maxX; // @Ash-Greninja101 - replaced this with the below
    container.setAttribute("width", maxX.toString());
    container.setAttribute("height", maxY.toString());
    backgroundCanvas.setAttribute("width", maxX.toString());
    backgroundCanvas.setAttribute("width", maxY.toString());
    const ctx: CanvasRenderingContext2D | null =
      backgroundCanvas.getContext("2d");

    if (ctx instanceof CanvasRenderingContext2D) {
      const starsArray: Star[] = [];

      for (let i = 0; i < 450; i++) {
        createRandomStar(starsArray);
      }
      for (let i = 0; i < starsArray.length; i++) {
        starsArray[i].draw(ctx);
      }

      document.onmousemove = getMouseCoordsFactory(allowMoving);
      document.onmouseenter = setMouseCoordsFactory(
        starsArray,
        ctx,
        maxX,
        maxY,
        backgroundCanvas,
        allowMoving
      );
      document.onmouseleave = setAllowMovingFactory(allowMoving);

      setInterval(createRandomStar, 250);
    }
  }
}

/**
 * Clear the stars from the viewer's eye.
 *
 * @param ctx - The canvas, kinda.
 * @param backgroundCanvas - The background.
 */
function clear(
  ctx: CanvasRenderingContext2D,
  backgroundCanvas: HTMLCanvasElement
): void {
  ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
}

/**
 * Draw all the stars in the {@link starsArray}.
 *
 * @param starsArray - The list of stars
 * @param ctx - The canvas, kinda.
 */
function drawStars(starsArray: Star[], ctx: CanvasRenderingContext2D): void {
  for (let i = 0; i < starsArray.length; i++) {
    starsArray[i].draw(ctx);
  }
}

interface MousePosition {
  x: number;
  y: number;
}

// function remove. @Ash-Greninja101 what did you mean?
/**
 * Update the stars and their alphas.
 *
 * @param starsArray - The list of stars
 * @param mP - The mouse position.
 * @param maxX - The width of the screen.
 * @param maxY - The height of the screen.
 * @param allowMoving - If the stars can move.
 * @returns Nothing (an effectual function).
 */
function updateStarPositionsAndAlphaVal(
  starsArray: Star[],
  mP: MousePosition,
  maxX: number,
  maxY: number,
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
    checkAndStartFadingAllStars(starsArray, maxX, maxY);
  }
}

/**
 * Makes sure all stars fade out.
 *
 * @param starsArray - The list of stars
 * @param maxX - The max `x` of the stars.
 * @param maxY - The max `y` of the stars.
 */
function checkAndStartFadingAllStars(
  starsArray: Star[],
  maxX: number,
  maxY: number
): void {
  for (let i = 0; i < starsArray.length; i++) {
    const star = starsArray[i];
    if (star.isFadingIn) {
      star.updateAlphaVal(0.01);
      if (star.alpha <= 0) {
        starsArray.splice(i, 1);
        createRandomStarOnBorder(starsArray, maxX, maxY);
      }
    } else {
      star.setAlphaVal(1);
    }
  }
}

/**
 * Update the stars location.
 *
 * @param starsArray - The list of stars
 * @param ctx - The canvas, kinda.
 * @param mP - The mouse position.
 * @param maxX - The width of the screen.
 * @param maxY - The height of the screen.
 * @param backgroundCanvas - The background.
 */
function update(
  starsArray: Star[],
  ctx: CanvasRenderingContext2D,
  mP: MousePosition,
  maxX: number,
  maxY: number,
  backgroundCanvas: HTMLCanvasElement,
  allowMoving: boolean
): void {
  clear(ctx, backgroundCanvas);
  drawStars(starsArray, ctx);
  updateStarPositionsAndAlphaVal(starsArray, mP, maxX, maxY, allowMoving);
  requestAnimationFrame((callback: number) => {
    return callback;
  });
}

/**
 * Get the mouse coordinates.
 */
function getMouseCoordsFactory(
  allowMoving: boolean
): (this: GlobalEventHandlers, ev: MouseEvent) => void {
  /**
   *
   * @param this - The event handler
   * @param ev - The event that happened to trigger this.
   */
  function name(this: GlobalEventHandlers, ev: MouseEvent) {
    let eventDoc: Document;
    let doc: HTMLElement;
    let body: HTMLElement;

    const mP: MousePosition = { x: ev.clientX, y: ev.clientY };

    ev = ev || window.event; // IE-ism

    /**
     * If pageX/Y aren't available and clientX/Y are,
     * calculate pageX/Y - logic taken from jQuery.
     * (This is to support old IE)
     **/
    if (ev.pageX === null && !(ev.clientX === null)) {
      // if (!(ev.target === null)) {
      //   eventDoc = ev.target.ownerDocument(); // @Ash-Greninja101 what is this?
      // } else {
      eventDoc = document;
      // }

      doc = eventDoc.documentElement;
      body = eventDoc.body;

      // let ev.pageX =
      //   ev.clientX +
      //   ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
      //   ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);

      // let ev.pageY =
      //   ev.clientY +
      //   ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
      //   ((doc && doc.clientTop) || (body && body.clientTop) || 0);
    }

    allowMoving = true;
  }
  return name;
}

/**
 * Create a function to set the mouse coordinates.
 *
 * @param starsArray - The list of stars
 * @param ctx - The canvas, kinda.
 * @param maxX - The max `x` of the stars.
 * @param maxY - The max `y` of the stars.
 * @returns Nothing (an effectual function).
 */
function setMouseCoordsFactory(
  starsArray: Star[],
  ctx: CanvasRenderingContext2D,
  maxX: number,
  maxY: number,
  backgroundCanvas: HTMLCanvasElement,
  allowMoving: boolean
): (this: GlobalEventHandlers, ev: MouseEvent) => void {
  /**
   * Set the mouse coordinates.
   *
   * @param this - Event handlers.
   * @param ev - The event that happened to trigger this (currently just 'click').
   */
  function setMouseCoords(this: GlobalEventHandlers, ev: MouseEvent) {
    const mP: MousePosition = { x: ev.clientX, y: ev.clientY };
    update(starsArray, ctx, mP, maxX, maxY, backgroundCanvas, allowMoving);
  }
  return setMouseCoords;
}

/**
 *
 * @param this - The event handler
 * @param ev - The event that happened to trigger this.
 * @returns Nothing (an effectual function).
 */
function setAllowMovingFactory(
  allowMoving: boolean
): (this: GlobalEventHandlers, ev: MouseEvent) => void {
  /**
   * Set whether or not stars are allowed to move.
   *
   * @param this - The event handler
   * @param ev - The event that happened to trigger this.
   */
  function setAllowMoving(this: GlobalEventHandlers, ev: MouseEvent) {
    allowMoving = false;
  }
  return setAllowMoving;
}

/**
 *
 * @param x1 - `x` for the first location
 * @param y1 - `y` for the first location
 * @param x2 - `x` for the second location
 * @param y2 - `y` for the second location
 * @returns The distance
 */
function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  const d: number = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  return d;
}

/**
 * Create a random star.
 * This should conform to TimerHandler
 *
 * @param starsArray - The list of stars
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
 *
 * @param starsArray - The list of stars
 * @param maxX - The width of the screen.
 * @param maxY - The height of the screen.
 */
function createRandomStarOnBorder(
  starsArray: Star[],
  maxX: number,
  maxY: number
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
 *
 * @param starsArray - The list of stars
 * @param radius - The star's radius.
 * @param xPos - The `x` position of the star.
 * @param yPos - The `y` position of the star.
 * @param zVal - The `z` position of the star.
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
