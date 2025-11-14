/**
 * =================================================================================
 * Advanced Payment Flow Controller (V3 - With Final UI)
 *
 * This script orchestrates the final payment process.
 * It is engineered to:
 * 1.  Enable/disable the 'Pay now' button based on payment method selection.
 * 2.  Trigger a professional, animated loading overlay immediately on click.
 * 3.  After the processing delay, smoothly transition to the final, high-fidelity
 *     success screen, populated with the correct purchase data.
 * =================================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SELECT ALL NECESSARY ELEMENTS (Updated Selectors) ---

  const paymentCheckbox = document.getElementById("mastercard-checkbox");
  const payNowBtn = document.getElementById("pay-now-btn");
  const loadingOverlay = document.getElementById("loading-overlay");
  const successOverlay = document.getElementById("success-overlay");

  // UPDATED: This now targets the new 'X' button in the final UI.
  const closeSuccessBtn = document.getElementById("close-success-final-btn");

  const purchaseCoinNumDisplay = document.getElementById("purchase-coin-num");

  // UPDATED: This now targets the new 'strong' tag in the final UI.
  const successTotalCoins = document.getElementById(
    "success-total-coins-final"
  );

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

  // --- 2. DEFINE CORE FUNCTIONS (No changes here) ---

  const updateButtonState = () => {
    if (paymentCheckbox.checked) {
      payNowBtn.disabled = false;
      payNowBtn.setAttribute("aria-disabled", "false");
      payNowBtn.classList.remove("TUXButton--disabled");
      payNowBtn.classList.add("TUXButton--enabled");
    } else {
      payNowBtn.disabled = true;
      payNowBtn.setAttribute("aria-disabled", "true");
      payNowBtn.classList.add("TUXButton--disabled");
      payNowBtn.classList.remove("TUXButton--enabled");
    }
  };

  const showLoadingOverlay = () => {
    if (!loadingOverlay) return;
    loadingOverlay.classList.add("is-active");
  };

  const hideLoadingOverlay = () => {
    if (!loadingOverlay) return;
    loadingOverlay.classList.remove("is-active");
  };

  const showSuccessOverlay = () => {
    // The new success overlay uses a different animation class on its main wrapper.
    if (!successOverlay) return;
    successOverlay.classList.add("is-active");
  };

  const hideSuccessOverlay = () => {
    if (!successOverlay) return;
    successOverlay.classList.remove("is-active");
    // ▼▼▼ ADD THIS ONE LINE ▼▼▼
    pf_resetAnimation(); // This ensures the animation is ready for the next time.
  };

  const processPayment = () => {
    let totalCoins = "0";
    if (purchaseCoinNumDisplay) {
      const rawText = purchaseCoinNumDisplay.textContent || "";
      const match = rawText.match(/[\d,]+/);
      if (match) {
        totalCoins = match[0];
      }
    }

    showLoadingOverlay();

    const processingTime = 3500;
    setTimeout(() => {
      hideLoadingOverlay();

      setTimeout(() => {
        // The logic remains the same, it just targets the new element.
        successTotalCoins.textContent = totalCoins;
        showSuccessOverlay();
        // ▼▼▼ ADD THIS ONE LINE ▼▼▼
        pf_startAdvancedAnimation(); // This triggers the new animation sequence.
      }, 300);
    }, processingTime);
  };

  // --- 3. ATTACH EVENT LISTENERS (No changes here) ---

  paymentCheckbox.addEventListener("change", updateButtonState);
  payNowBtn.addEventListener("click", processPayment);
  closeSuccessBtn.addEventListener("click", hideSuccessOverlay);

  // --- 4. INITIALIZATION (No changes here) ---
  updateButtonState();
});
