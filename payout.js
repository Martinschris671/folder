document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SELECT ALL NECESSARY ELEMENTS ---
  const paymentCheckbox = document.getElementById("mastercard-checkbox");
  const payNowBtn = document.getElementById("pay-now-btn");
  const loadingOverlay = document.getElementById("loading-overlay");
  const successOverlay = document.getElementById("success-overlay");

  const closeSuccessBtn = document.getElementById("close-success-final-btn");
  const goBackBtn = document.querySelector(".success-go-back-btn");

  const purchaseCoinNumDisplay = document.getElementById("purchase-coin-num");
  const successTotalCoins = document.getElementById(
    "success-total-coins-final",
  );

  // NEW: Elements for nickname synchronization
  const previewNickname = document.getElementById("preview-nickname");
  const successTargetNickname = document.getElementById(
    "success-target-nickname",
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
   * GSAP ANIMATION: SLIDE UP (Smoothly slide from bottom to top)
   */
  const showSuccessOverlay = () => {
    if (!successOverlay) return;

    // Reset position to bottom before starting
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
   * GSAP ANIMATION: SLIDE DOWN (Smoothly slide from center to bottom)
   */
  const hideSuccessOverlay = () => {
    if (!successOverlay) return;

    gsap.to(successOverlay, {
      y: "100%",
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(successOverlay, { visibility: "hidden", opacity: 0 });
        if (typeof pf_resetAnimation === "function") pf_resetAnimation();
      },
    });
  };

  const processPayment = () => {
    // 1. Get the Coin Number
    let totalCoins = "0";
    if (purchaseCoinNumDisplay) {
      const rawText = purchaseCoinNumDisplay.textContent || "";
      const match = rawText.match(/[\d,]+/);
      if (match) totalCoins = match[0];
    }

    // 2. Get the current Nickname from the Action Preview Controller
    const currentNickname = previewNickname
      ? previewNickname.textContent
      : "Quest";

    showLoadingOverlay();

    const processingTime = 3500;
    setTimeout(() => {
      hideLoadingOverlay();

      // Update the success screen text before showing it
      setTimeout(() => {
        if (successTotalCoins) successTotalCoins.textContent = totalCoins;
        if (successTargetNickname)
          successTargetNickname.textContent = currentNickname;

        showSuccessOverlay();
      }, 300);
    }, processingTime);
  };

  // --- 3. ATTACH EVENT LISTENERS ---
  paymentCheckbox.addEventListener("change", updateButtonState);
  payNowBtn.addEventListener("click", processPayment);

  // Close triggers: 'X' and 'Go back' buttons
  closeSuccessBtn.addEventListener("click", hideSuccessOverlay);
  if (goBackBtn) {
    goBackBtn.addEventListener("click", hideSuccessOverlay);
  }

  updateButtonState();
});
