/**
 * =================================================================================
 * NEW Animation Controller (pf- safe prefix)
 *
 * This script listens for the success overlay to become visible and then
 * triggers the advanced, multi-stage animation. It is self-contained and
 * designed to not conflict with any other scripts.
 * =================================================================================
 */
const pf_overlayContainer = document.querySelector(
  ".success-overlay-container"
);
let pf_isDetailsView = false;
let pf_animationTimeout; // Keep track of the timeout

/**
 * Triggers the second stage of the animation after a delay.
 */
function pf_startAdvancedAnimation() {
  // Clear any existing timeout to prevent duplicates
  clearTimeout(pf_animationTimeout);

  // Wait 2.5 seconds before starting the animation
  pf_animationTimeout = setTimeout(() => {
    if (pf_overlayContainer && !pf_isDetailsView) {
      pf_overlayContainer.classList.add("pf-details-view");
      pf_isDetailsView = true;
    }
  }, 2500);
}

/**
 * Allows clicking the header to toggle the animation state.
 * It also resets the view to its initial state when the overlay is hidden.
 */
function pf_toggleAnimationView() {
  if (pf_overlayContainer) {
    pf_overlayContainer.classList.toggle("pf-details-view");
    pf_isDetailsView = !pf_isDetailsView;
    // If we are returning to the main view, cancel any pending animation
    if (!pf_isDetailsView) {
      clearTimeout(pf_animationTimeout);
    }
  }
}

/**
 * Resets the entire animation to its starting state. This is crucial
 * so that the animation plays correctly every time the user makes a purchase.
 */
function pf_resetAnimation() {
  if (pf_overlayContainer) {
    pf_overlayContainer.classList.remove("pf-details-view");
    pf_isDetailsView = false;
    clearTimeout(pf_animationTimeout);
  }
}
