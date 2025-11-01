/**
 * =================================================================================
 * Advanced Payment Flow Controller
 *
 * This script orchestrates the final payment process.
 * It is engineered to:
 * 1.  Enable/disable the 'Pay now' button based on payment method selection.
 * 2.  On payment confirmation, extract the final coin amount from the UI.
 * 3.  Trigger a simulated processing state with a loading animation.
 * 4.  After the processing delay, display a professional success overlay
 *     populated with the correct purchase data.
 * 5.  Manage the visibility and state of all related UI components.
 * =================================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SELECT ALL NECESSARY ELEMENTS ---

  // Payment Method Selection
  const paymentCheckbox = document.getElementById("mastercard-checkbox");

  // Action Button
  const payNowBtn = document.getElementById("pay-now-btn");

  // Overlays
  const loadingOverlay = document.getElementById("loading-overlay");
  const successOverlay = document.getElementById("success-overlay");
  const closeSuccessBtn = document.getElementById("close-success-btn");

  // Data Elements
  const purchaseCoinNumDisplay = document.getElementById("purchase-coin-num"); // Source
  const successTotalCoins = document.getElementById("success-total-coins"); // Destination

  // Professional Safeguard: Exit if critical elements are missing.
  if (
    !paymentCheckbox ||
    !payNowBtn ||
    !loadingOverlay ||
    !successOverlay ||
    !closeSuccessBtn ||
    !purchaseCoinNumDisplay
  ) {
    console.error(
      "Payment Flow Controller: One or more critical elements are missing. Aborting script."
    );
    return;
  }

  // --- 2. DEFINE CORE FUNCTIONS ---

  /**
   * Toggles the 'Pay now' button's state based on the checkbox.
   * This is the master function for controlling button interactivity.
   */
  const updateButtonState = () => {
    if (paymentCheckbox.checked) {
      payNowBtn.disabled = false;
      payNowBtn.setAttribute("aria-disabled", "false");
      payNowBtn.classList.remove("TUXButton--disabled");
      payNowBtn.classList.add("TUXButton--enabled"); // Custom class for styling
    } else {
      payNowBtn.disabled = true;
      payNowBtn.setAttribute("aria-disabled", "true");
      payNowBtn.classList.add("TUXButton--disabled");
      payNowBtn.classList.remove("TUXButton--enabled");
    }
  };

  /**
   * Shows the success overlay with a smooth animation.
   */
  const showSuccessOverlay = () => {
    successOverlay.style.display = "flex";
    requestAnimationFrame(() => {
      successOverlay.classList.add("is-active");
    });
  };

  /**
   * Hides the success overlay with a smooth animation.
   */
  const hideSuccessOverlay = () => {
    successOverlay.classList.remove("is-active");
    // Wait for the animation to finish before hiding the element
    setTimeout(() => {
      successOverlay.style.display = "none";
    }, 300); // Must match CSS transition duration
  };

  /**
   * This is the main payment execution function. It simulates the entire flow.
   */
  const processPayment = () => {
    // Step 1: Extract and clean the coin data from the purchase summary.
    // This is a robust way to ensure we get the right number, regardless of text.
    let totalCoins = "0";
    if (purchaseCoinNumDisplay) {
      const rawText = purchaseCoinNumDisplay.textContent || ""; // e.g., "Purchase of 1,400 Coins"
      const match = rawText.match(/[\d,]+/); // Find the number part
      if (match) {
        totalCoins = match[0]; // e.g., "1,400"
      }
    }

    // Step 2: Show the loading indicator.
    loadingOverlay.style.display = "block";

    // Step 3: Simulate a network delay (3 to 4 seconds).
    const processingTime = 3500; // 3.5 seconds
    setTimeout(() => {
      // Step 4: Hide the loading indicator.
      loadingOverlay.style.display = "none";

      // Step 5: Populate the success overlay with the correct data.
      successTotalCoins.textContent = totalCoins;

      // Step 6: Display the populated success overlay.
      showSuccessOverlay();
    }, processingTime);
  };

  // --- 3. ATTACH EVENT LISTENERS ---

  // Listen for changes on the checkbox to enable/disable the pay button.
  paymentCheckbox.addEventListener("change", updateButtonState);

  // Listen for clicks on the 'Pay now' button to start the process.
  payNowBtn.addEventListener("click", processPayment);

  // Listen for clicks on the 'Done' button to close the success overlay.
  closeSuccessBtn.addEventListener("click", hideSuccessOverlay);

  // --- 4. INITIALIZATION ---

  // Run once on page load to set the initial disabled state of the button.
  updateButtonState();
});
