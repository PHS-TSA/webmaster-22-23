/**
 * Module for the star field background animation.
 *
 * @module script
 * @see module:canvas
 */

import { canvasRun } from "./canvas.js";
import { toggleMenu, createDownloadButton } from "./menuButton.js";

canvasRun();

const menuBtn: HTMLElement | null = document.getElementById("menuBtn");

if (menuBtn instanceof HTMLElement) {
  menuBtn.addEventListener("click", toggleMenu);
  createDownloadButton();
}
