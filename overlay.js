/**
 * =================================================================================
 * TUXSheet Advanced Controller
 *
 * This script manages the functionality of the final payment confirmation TUXSheet.
 * It is engineered to:
 * 1.  Flawlessly handle the opening and closing animations.
 * 2.  Intelligently fetch the final purchase data (coins and price) from the
 *     'Recharge' button at the moment it's clicked.
 * 3.  Dynamically update the purchase summary in the TUXSheet *before* it becomes
 *     visible, ensuring a seamless and professional user experience.
 * =================================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SELECT ALL NECESSARY ELEMENTS ---

  // Main trigger button from the first modal
  const rechargeBtn = document.getElementById("open-overlay-btn");

  // Elements within the TUXSheet Overlay
  const closeBtn = document.getElementById("close-overlay-btn");
  const overlay = document.querySelector(".TUXSheet-overlay");
  const sheetContainer = document.querySelector(".TUXSheet-container");

  // Dynamic content elements in the TUXSheet that we will update
  const purchaseCoinNumDisplay = document.getElementById("purchase-coin-num");
  const purchaseCoinPriceDisplay = document.getElementById(
    "purchase-coin-price"
  );
  const purchaseTotalPriceDisplay = document.getElementById(
    "purchase-total-price"
  );

  // --- 2. DEFINE CORE OVERLAY VISIBILITY FUNCTIONS ---

  /**
   * Opens the TUXSheet with a smooth, optimized animation.
   * Uses requestAnimationFrame to ensure the browser is ready for the transition,
   * preventing visual glitches.
   */
  const openOverlay = () => {
    if (!overlay || !sheetContainer) return;
    // This ensures that the display property is set before the transition starts
    requestAnimationFrame(() => {
      overlay.classList.add("is-active");
      sheetContainer.classList.add("is-active");
    });
  };

  /**
   * Closes the TUXSheet by reversing the animation.
   */
  const closeOverlay = () => {
    if (!overlay || !sheetContainer) return;
    overlay.classList.remove("is-active");
    sheetContainer.classList.remove("is-active");
  };

  /**
   * Formats a number into a standard currency string (e.g., $1,234.56).
   * @param {number} amount - The numerical value to format.
   * @returns {string} - The formatted currency string.
   */
  const formatAsCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // --- 3. ATTACH ADVANCED EVENT LISTENERS ---

  if (rechargeBtn) {
    rechargeBtn.addEventListener("click", (event) => {
      // Fetch the final, validated data stored in the button's data attributes.
      const finalPrice =
        parseFloat(event.currentTarget.dataset.finalPrice) || 0;
      const finalCoins =
        parseInt(event.currentTarget.dataset.finalCoins, 10) || 0;

      // ULTIMATE FUNCTIONALITY: Before showing the sheet, update its content.
      // This is the core of the professional experience. The user never sees
      // the old or default values.

      if (purchaseCoinNumDisplay) {
        // Use Intl.NumberFormat for clean, comma-separated numbers.
        const formattedCoins = new Intl.NumberFormat("en-US").format(
          finalCoins
        );
        purchaseCoinNumDisplay.textContent = `Purchase of ${formattedCoins} Coins`;
      }

      if (purchaseCoinPriceDisplay) {
        purchaseCoinPriceDisplay.textContent = formatAsCurrency(finalPrice);
      }

      if (purchaseTotalPriceDisplay) {
        purchaseTotalPriceDisplay.textContent = formatAsCurrency(finalPrice);
      }

      // Now, with the content perfectly updated, open the overlay.
      openOverlay();
    });
  }

  // Listener for the "Close" button inside the TUXSheet.
  if (closeBtn) {
    closeBtn.addEventListener("click", closeOverlay);
  }

  // Listener for the dark background, allowing a click outside to close.
  if (overlay) {
    overlay.addEventListener("click", (event) => {
      // This check ensures the click is on the background itself,
      // not on the white sheet, preventing accidental closing.
      if (event.target === overlay) {
        closeOverlay();
      }
    });
  }
});
