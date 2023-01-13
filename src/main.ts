/**
 * Module for the star field background animation.
 *
 * @see module:canvas
 */

import { canvasRun } from "./canvas.js";
import { toggleMenuFactory, createDownloadButton } from "./menuButton.js";

canvasRun();

const menuBtn: HTMLElement | null = document.getElementById("menuBtn");

if (menuBtn instanceof HTMLButtonElement) {
  menuBtn.addEventListener("click", toggleMenuFactory());
  createDownloadButton();
}
