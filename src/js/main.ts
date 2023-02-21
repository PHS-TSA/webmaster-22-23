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

window.onload = () => {
  const maxX = window.innerWidth;
  const maxY = window.innerHeight;
  const backgroundCanvas: HTMLElement | null =
    document.getElementById("background");
  const container = document.getElementById("container");
  let allowMoving = false;
  {
    const menuDiv = document.getElementById("menu");
    const menuBtn = document.getElementById("menuBtn");
    // if (backgroundCanvas instanceof HTMLCanvasElement) {
    const ctx = backgroundCanvas.getContext("2d");
    const menuOptionsDiv = document.getElementById("v-pills-tab");
    const theMenuOptions = menuOptionsDiv.querySelectorAll("a");
    let toggleMenu = false;
    let mousePosition = {};
    let allowMoving = false;
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    backgroundCanvas.width = container.width;
    backgroundCanvas.height = container.height;
  }

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
      let starsArray: Star[] = [];

      for (let i = 0; i < 450; i++) {
        createRandomStar();
      }
      for (let i = 0; i < starsArray.length; i++) {
        starsArray[i].draw(ctx);
      }

      document.onmousemove = getMouseCoords();
      document.onmouseenter = setMouseCoords();
      document.onmouseleave = setAllowMoving();

      setInterval(createRandomStar, 250);

      interface MousePosition {
        x: number;
        y: number;
      }

      /**
       * Clear the stars from the viewer's eye.
       */
      function clear(): void {
        ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
      }

      /**
       *
       */
      function drawStars(): void {
        for (let i = 0; i < starsArray.length; i++) {
          starsArray[i].draw(ctx);
        }
      }
      // function remove
      /**
       * Update the stars and their alphas.
       *
       * @param mP - The mouse position.
       * @returns Nothing (an effectual function).
       */
      function updateStarPositionsAndAlphaVal(mP: MousePosition): void {
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
      /**
       * Makes sure all stars fade out.
       */
      function checkAndStartFadingAllStars() {
        for (let i = 0; i < starsArray.length; i++) {
          let star = starsArray[i];
          if (star.isFadingIn) {
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
      function update(mousePosition: MousePosition) {
        clear();
        drawStars();
        updateStarPositionsAndAlphaVal(mousePosition);
        requestAnimationFrame((callback: number) => {
          update(mousePosition);
          return callback;
        });
      }

      document.onmousemove = getMouseCoords;
      document.onmouseenter = setMouseCoords;
      document.onmouseleave = (e) => {
        allowMoving = false;
      };

      /**
       *
       * @param this - The event handler
       * @param ev - The event that happened to trigger this.
       */
      function getMouseCoords(this: GlobalEventHandlers, ev: MouseEvent) {
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
          if (!(ev.target === null)) {
            eventDoc = ev.target.ownerDocument(); // @Ash-Greninja101 what is this?
          } else {
            eventDoc = document;
          }

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
      }

      /**
       * Set the mouse coordinates.
       *
       * @param this - Event handlers.
       * @param ev - The event that happened to trigger this (currently just 'click').
       */
      function setMouseCoords(this: GlobalEventHandlers, ev: MouseEvent) {
        const mP: MousePosition = { x: ev.clientX, y: ev.clientY };
        update(mP);
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
        let newY: number;
        let newX: number;

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
      /**
       * Create a star.
       *
       * @param radius - The star's radius.
       * @param xPos - The `x` position of the star.
       * @param yPos - The `y` position of the star.
       * @param zVal - The `z` position of the star.
       */
      function createStar(
        radius: number,
        xPos: number,
        yPos: number,
        zVal: number
      ): void {
        starsArray.push(new Star(xPos, yPos, zVal, 0.1, radius));
      }
    }
  }
};

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

export { Star, getDistance };
