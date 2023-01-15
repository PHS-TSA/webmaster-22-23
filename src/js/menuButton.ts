/** The menu button. */

import * as bootstrap from "bootstrap";

/**
 * Open the menu.
 *
 * @param this - The menu button.
 * @param ev - The event that happened to trigger this (currently just 'click').
 * @returns - Nothing (an effectual function).
 */
function toggleMenuFactory(
  isToggled: boolean
): (this: HTMLButtonElement, ev: MouseEvent) => void {
  function toggleMenu(this: HTMLButtonElement, ev: MouseEvent) {
    const menuOptionsDiv: HTMLElement | null =
      document.getElementById("v-pills-tab");
    const menuDiv: HTMLElement | null = document.getElementById("menu");
    if (
      menuOptionsDiv instanceof HTMLDivElement &&
      menuDiv instanceof HTMLDivElement
    ) {
      const theMenuOptions: NodeListOf<HTMLAnchorElement> =
        menuOptionsDiv.querySelectorAll("a");

      isToggled = !isToggled;
      menuOptionsDiv.style.visibility = isToggled ? "visible" : "hidden";
      menuOptionsDiv.style.display = isToggled ? "block" : "none";
      menuDiv.style.backgroundColor = isToggled
        ? "rgba(44, 44, 45, 1)"
        : "rgba(44, 44, 45, 0)";
    }
  }
  return toggleMenu;
}

// from https://stackoverflow.com/questions/51503754/typescript-type-beforeinstallpromptevent

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

// no longer from stackoverflow

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let BeforeInstallPromptEvent: {
  prototype: BeforeInstallPromptEvent;
  new (): BeforeInstallPromptEvent;
};

/**
 * Create the download button for the PWA.
 * This code was taken and modified from the PWA example on MDN
 *
 * @returns Nothing
 */
function createDownloadButton(): void {
  let deferredPrompt: Event | null;
  const addBtn: HTMLElement | null = document.querySelector(".add-button");
  if (addBtn instanceof HTMLButtonElement) {
    addBtn.style.display = "none";
    window.addEventListener(
      "beforeinstallprompt",
      (event: BeforeInstallPromptEvent) => {
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
          if (deferredPrompt instanceof BeforeInstallPromptEvent) {
            deferredPrompt.prompt().catch(() => {
              console.log("Error with loading the A2HS prompt.");
            });
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice
              .then((choiceResult): "accepted" | "dismissed" => {
                if (choiceResult.outcome === "accepted") {
                  console.log("User accepted the A2HS prompt");
                } else {
                  console.log("User dismissed the A2HS prompt");
                }
                deferredPrompt = null;
                return choiceResult.outcome;
              })
              .catch(() => {
                console.log("Error with loading the A2HS prompt.");
              });
          }
        });
      }
    );
  }
}

export { createDownloadButton, toggleMenuFactory };
