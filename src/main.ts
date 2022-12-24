/** Module for the star field background animation.
 * @module script
 * @see module:canvas
 */

import { canvasRun } from "./canvas.js";
import { toggleMenu, createDownloadButton } from "./menuButton.js";
import {} from "./styles.css";

canvasRun();

const menuBtn = document.getElementById("menuBtn");
menuBtn.addEventListener("click", toggleMenu);

createDownloadButton();
