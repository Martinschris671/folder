/**
 * =================================================================================
 * Package Purchase Controller
 *
 * This script manages the functionality for the pre-set coin packages.
 * It is engineered to:
 * 1.  Work with the existing package selection UI and button text updates.
 * 2.  Intelligently extract both the price AND the coin amount from the
 *     currently selected package.
 * 3.  Store this data on the main "Buy for..." button.
 * 4.  Use this stored data to perfectly populate the TUXSheet when the button is
 *     clicked, then trigger the overlay.
 * =================================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. DEFINE CONSTANTS & SELECT ELEMENTS ---

  // The main button for pre-set packages
  const buyNowBtn = document.getElementById("open-overlay-btn-2");
  if (!buyNowBtn) return; // Stop if the main button isn't on the page

  const packageItems = document.querySelectorAll(".package-item");
  const buyButtonText = buyNowBtn.querySelector(
    '[data-test-tag="tux-button-content"]',
  );

  // TUXSheet elements that we need to control and populate
  const overlay = document.querySelector(".TUXSheet-overlay");
  const sheetContainer = document.querySelector(".TUXSheet-container");
  const purchaseCoinNumDisplay = document.getElementById("purchase-coin-num");
  const purchaseCoinPriceDisplay = document.getElementById(
    "purchase-coin-price",
  );
  const purchaseTotalPriceDisplay = document.getElementById(
    "purchase-total-price",
  );

  // --- 2. DEFINE CORE HELPER & OVERLAY FUNCTIONS ---

  /**
   * Opens the TUXSheet with a smooth, optimized animation.
   */
  /**
   * Opens the TUXSheet with a smooth, optimized animation.
   */
  const openOverlay = () => {
    if (!overlay || !sheetContainer) return;

    // 1. Make the overlay visible first
    overlay.classList.add("is-active");

    // 2. Force a browser layout reflow (CRITICAL FIX for mobile slide-up bug)
    void sheetContainer.offsetWidth;

    // 3. Trigger the slide up animation
    sheetContainer.classList.add("is-active");
  };

  /**
   * A robust function that finds the currently selected package and updates the
   * main "Buy for..." button with the correct price and coin data.
   */
  const updateButtonData = () => {
    // Find which package currently has the 'active' class
    const activePackage = document.querySelector(".package-item.active");
    if (!activePackage) return;

    // Find the coin and price elements within that specific active package
    const coinElement = activePackage.querySelector(
      '[data-e2e^="wallet-package-coin-num-"]',
    );
    const priceElement = activePackage.querySelector(
      '[data-e2e^="wallet-package-price-"]',
    );

    if (coinElement && priceElement) {
      // --- DATA EXTRACTION & CLEANING ---
      // Get the raw text (e.g., "1,400" and "$22.40")
      const coinText = coinElement.textContent;
      const priceText = priceElement.textContent;

      // Convert the text into clean numbers (e.g., 1400 and 22.40)
      // This is crucial for reliable data handling.
      const coins = parseInt(coinText.replace(/,/g, ""), 10);
      const price = parseFloat(priceText.replace("$", ""));

      // --- STORE THE CLEAN DATA ---
      // We store the clean, numerical data directly on the button's dataset.
      // This is the most reliable way to pass information.
      buyNowBtn.dataset.price = price;
      buyNowBtn.dataset.coins = coins;

      // Also update the button's visible text, just like your other script
      if (buyButtonText) {
        buyButtonText.textContent = `Buy for ${priceText}`;
      }
    }
  };

  // --- 3. ATTACH EVENT LISTENERS ---

  // Add a click listener to EACH package item.
  packageItems.forEach((item) => {
    item.addEventListener("click", () => {
      // First, handle the visual selection (the 'active' class)
      packageItems.forEach((pkg) => pkg.classList.remove("active"));
      item.classList.add("active");

      // SECOND, and most importantly, run our function to update the
      // button's hidden data based on the NEW active item.
      updateButtonData();
    });
  });

  // Add the main click listener for the "Buy for..." button.
  buyNowBtn.addEventListener("click", (event) => {
    // Read the clean data directly from the button that was just clicked
    const price = parseFloat(event.currentTarget.dataset.price) || 0;
    const coins = parseInt(event.currentTarget.dataset.coins, 10) || 0;

    // --- POPULATE THE TUXSHEET ---
    // This happens instantly before the sheet is visible to the user.
    if (purchaseCoinNumDisplay) {
      const formattedCoins = new Intl.NumberFormat("en-US").format(coins);
      purchaseCoinNumDisplay.textContent = `Purchase of ${formattedCoins} Coins`;
    }

    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

    if (purchaseCoinPriceDisplay) {
      purchaseCoinPriceDisplay.textContent = formattedPrice;
    }

    if (purchaseTotalPriceDisplay) {
      purchaseTotalPriceDisplay.textContent = formattedPrice;
    }

    // Finally, open the fully prepared TUXSheet overlay
    openOverlay();
  });

  // --- 4. INITIALIZATION ---
  // When the page first loads, run the function once to ensure the
  // button has the correct data for the default selected package.
  updateButtonData();
});
