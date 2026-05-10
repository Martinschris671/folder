document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SELECT ALL NECESSARY ELEMENTS ---
  const paymentCheckbox = document.getElementById("mastercard-checkbox");
  const payNowBtn = document.getElementById("pay-now-btn");
  const loadingOverlay = document.getElementById("loading-overlay");
  const successOverlay = document.getElementById("success-overlay");

  const closeSuccessBtn = document.getElementById("close-success-final-btn");
  // Select the "Go back" button
  const goBackBtn = document.querySelector(".success-go-back-btn");

  const purchaseCoinNumDisplay = document.getElementById("purchase-coin-num");
  const successTotalCoins = document.getElementById(
    "success-total-coins-final",
  );

  if (
    !paymentCheckbox ||
    !payNowBtn ||
    !loadingOverlay ||
    !successOverlay ||
    !closeSuccessBtn ||
    !purchaseCoinNumDisplay
  ) {
    console.error("Payment Flow Controller: Missing elements.");
    return;
  }

  // --- 2. DEFINE CORE FUNCTIONS ---

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

  /**
   * GSAP ANIMATION: SLIDE UP
   */
  const showSuccessOverlay = () => {
    if (!successOverlay) return;

    // Ensure it starts from the bottom before animating
    gsap.set(successOverlay, { y: "100%", opacity: 1, visibility: "visible" });

    gsap.to(successOverlay, {
      y: "0%",
      duration: 0.5,
      ease: "power3.out",
      onStart: () => {
        if (typeof pf_startAdvancedAnimation === "function")
          pf_startAdvancedAnimation();
      },
    });
  };

  /**
   * GSAP ANIMATION: SLIDE DOWN
   */
  const hideSuccessOverlay = () => {
    if (!successOverlay) return;

    gsap.to(successOverlay, {
      y: "100%",
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(successOverlay, { visibility: "hidden", opacity: 0 });
        if (typeof pf_resetAnimation === "function") pf_resetAnimation();
      },
    });
  };

  const processPayment = () => {
    let totalCoins = "0";
    if (purchaseCoinNumDisplay) {
      const rawText = purchaseCoinNumDisplay.textContent || "";
      const match = rawText.match(/[\d,]+/);
      if (match) totalCoins = match[0];
    }

    showLoadingOverlay();

    const processingTime = 3500;
    setTimeout(() => {
      hideLoadingOverlay();
      setTimeout(() => {
        successTotalCoins.textContent = totalCoins;
        showSuccessOverlay();
      }, 300);
    }, processingTime);
  };

  // --- 3. ATTACH EVENT LISTENERS ---
  paymentCheckbox.addEventListener("change", updateButtonState);
  payNowBtn.addEventListener("click", processPayment);

  // Close triggers
  closeSuccessBtn.addEventListener("click", hideSuccessOverlay);
  if (goBackBtn) {
    goBackBtn.addEventListener("click", hideSuccessOverlay);
  }

  updateButtonState();
});
