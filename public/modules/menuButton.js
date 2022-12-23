/** The menu button. */

// imports popper in the wrong style, and fixing it
// requires breaking the CSP so I commented-out the CSP
import {} from "bootstrap.esm.min.js";

/** Open the menu.
 *
 * @param {HTMLElement} _button the menu button
 * @param {MouseEvent} _event the event that happened to trigger this (currently just 'click')
 */
function toggleMenu(_button, _event) {
  let menuOptionsDiv = document.getElementById("v-pills-tab");
  let menuDiv = document.getElementById("menu");
  let theMenuOptions = menuOptionsDiv.querySelectorAll("a");
  let is_toggled = false;

  is_toggled = !is_toggled;
  menuOptionsDiv.style.visibility = is_toggled ? "visible" : "hidden";
  menuOptionsDiv.style.display = is_toggled ? "block" : "none";
  menuDiv.style.backgroundColor = is_toggled
    ? "rgba(44, 44, 45, 1)"
    : "rgba(44, 44, 45, 0)";
}

/**
 * Create the download button for the PWA.
 */
function createDownloadButton() {
  /* This code was taken and modified from the PWA example on MDN */
  let deferredPrompt;
  const addBtn = document.querySelector(".add-button");
  addBtn.style.display = "none";
  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    addBtn.style.display = "block";

    addBtn.addEventListener("click", (e) => {
      // hide our user interface that shows our A2HS button
      addBtn.style.display = "none";
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        deferredPrompt = null;
      });
    });
  });
}

export { createDownloadButton, toggleMenu };
