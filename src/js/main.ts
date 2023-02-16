/**
 * Module for the star field background animation.
 *
 * @see module:canvas
 */

// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import { canvasRun } from "./canvas.js";
import { toggleMenuFactory, createDownloadButton } from "./menuButton.js";

const menuBtn: HTMLElement | null = document.getElementById("menu-btn");

if (menuBtn instanceof HTMLButtonElement) {
  menuBtn.addEventListener("click", toggleMenuFactory(false));
  createDownloadButton();
}

canvasRun();
