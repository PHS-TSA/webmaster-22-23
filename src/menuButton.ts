/** The menu button. */

// imports popper in the wrong style, and fixing it
// requires breaking the CSP so I commented-out the CSP
import * as bootstrap from "bootstrap";

/**
 * Open the menu.
 *
 * @param this - the menu button
 * @param ev - the event that happened to trigger this (currently just 'click')
 * @returns - Nothing (an effectual function)
 */
function toggleMenu(this: HTMLElement, ev: MouseEvent): void {
  const menuOptionsDiv = document.getElementById("v-pills-tab");
  const menuDiv = document.getElementById("menu");
  const theMenuOptions = menuOptionsDiv.querySelectorAll("a");
  let isToggled = false;

  isToggled = !isToggled;
  menuOptionsDiv.style.visibility = isToggled ? "visible" : "hidden";
  menuOptionsDiv.style.display = isToggled ? "block" : "none";
  menuDiv.style.backgroundColor = isToggled
    ? "rgba(44, 44, 45, 1)"
    : "rgba(44, 44, 45, 0)";
}

/**
 * Create the download button for the PWA.
 * This code was taken and modified from the PWA example on MDN
 *
 * @returns Nothing
 */
function createDownloadButton(): void {
  let deferredPrompt: Event | null;
  const addBtn: HTMLElement = document.querySelector(".add-button");
  addBtn.style.display = "none";
  window.addEventListener("beforeinstallprompt", (event: Event) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    event.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = event;
    // Update UI to notify the user they can add to home screen
    addBtn.style.display = "block";

    addBtn.addEventListener("click", (e: Event) => {
      // hide our user interface that shows our A2HS button
      addBtn.style.display = "none";
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: string) => {
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
