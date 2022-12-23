/** Module for the star field background animation.
 * @module script
 * @see module:canvas
 */

import { runServiceWorker } from "./serviceWorker.js";
import { canvasRun } from "./canvas.js";
import { toggleMenu, createDownloadButton } from "./menuButton.js";
import {} from "./styles.css";

const menuBtn = document.getElementById("menuBtn");

canvasRun();

menuBtn.addEventListener("click", toggleMenu);

createDownloadButton();

runServiceWorker();
