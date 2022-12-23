/** Module for the star field background animation.
 * @module script
 * @see module:canvas
 */

import * as serviceWorker from "./modules/serviceWorker.js";
import { canvasRun } from "./modules/canvas.js";
import { toggleMenu, createDownloadButton } from "./modules/menuButton.js";

let menuBtn = document.getElementById("menuBtn");

canvasRun();

menuBtn.addEventListener("click", toggleMenu);

createDownloadButton();

serviceWorker();
