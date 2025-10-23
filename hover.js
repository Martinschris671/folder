document.addEventListener("DOMContentLoaded", () => {
  // Select all clickable package items
  const packageItems = document.querySelectorAll(".package-item");

  // Select the text span in the footer button
  const buyButtonText = document.querySelector(
    '[data-e2e="wallet-buy-now-button"] [data-test-tag="tux-button-content"]'
  );

  packageItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const clickedItem = event.currentTarget;

      // Remove 'active' state from all items
      packageItems.forEach((pkg) => {
        pkg.classList.remove("active");
        // Ensure non-active, non-custom items have the correct background
        if (pkg.getAttribute("data-e2e") !== "wallet-package-selected") {
          pkg.classList.remove("background-color-BGBrand");
          pkg.classList.add("background-color-BGInput");
        }
      });

      // Add 'active' state to the clicked item
      clickedItem.classList.add("active");

      // Find the price element within the clicked item
      const priceElement = clickedItem.querySelector(
        '[data-e2e^="wallet-package-price-"]'
      );

      // If a price exists (i.e., not the Custom button), update the footer
      if (priceElement) {
        const price = priceElement.textContent;
        buyButtonText.textContent = `Buy for ${price}`;
      }
    });
  });
});
