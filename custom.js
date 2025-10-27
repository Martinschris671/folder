document.addEventListener("DOMContentLoaded", function () {
  // --- CONSTANTS & STATE ---
  const USD_PER_COIN = 0.016;
  const MIN_COINS = 30;
  const MAX_COINS = 2500000;
  const MIN_USD = MIN_COINS * USD_PER_COIN;
  const MAX_USD = MAX_COINS * USD_PER_COIN;

  let currentView = "coins";
  let inputValue = "";

  // --- DOM ELEMENTS ---
  const mainComponent = document.getElementById("main-component");
  const mainMask = document.getElementById("main-mask");
  const mainSheet = document.getElementById("main-sheet");
  const secondaryComponent = document.getElementById("secondary-component");
  const secondaryMask = document.getElementById("secondary-mask");
  const secondarySheet = document.getElementById("secondary-sheet");

  const inputContainer = document.getElementById("input-container");
  const subDisplayContainer = document.getElementById("sub-display-container");
  const totalPriceDisplay = document.getElementById("total-price");
  const headerTitle = document.getElementById("header-title");
  const viewTriggerLabel = document.getElementById("view-trigger-label");
  const keypadCoins = document.getElementById("keypad-coins");
  const keypadAmount = document.getElementById("keypad-amount");

  const allNumKeys = document.querySelectorAll(".num-key");
  const allBackspaceKeys = document.querySelectorAll(".backspace-key");

  const openModalButton = document.getElementById("open-recharge-modal");
  const closeModalButton = document.getElementById("close-main-component");
  const changeViewTrigger = document.getElementById("change-view-trigger");
  const selectCoinsViewBtn = document.getElementById("select-coins-view");
  const selectAmountViewBtn = document.getElementById("select-amount-view");
  const cancelSecondaryBtn = document.getElementById("cancel-secondary");

  // --- TEMPLATES ---
  const createInputTemplate = (view) => {
    const isCoinsView = view === "coins";
    const placeholder = isCoinsView
      ? `${MIN_COINS.toLocaleString()} - ${MAX_COINS.toLocaleString()}`
      : `${MIN_USD.toFixed(2)} - ${MAX_USD.toLocaleString()}`;

    const coinIcon = `<svg font-size="16px" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><g clip-path="url(#Icon_Color-Tiktok_Coin_svg__a)"><path d="M48 24a24 24 0 1 1-48 0 24 24 0 0 1 48 0Z" fill="#FFB84D"></path><path d="M47 24a23 23 0 1 1-46 0 23 23 0 0 1 46 0Z" fill="#FFDE55"></path><path d="M42 24a18 18 0 1 1-36 0 18 18 0 0 1 36 0Z" fill="#F7A300"></path><path d="M42 24a18 18 0 1 1-36 0 18 18 0 0 1 36 0Z" fill="#F7A80F"></path><path d="M41.94 25.5a18 18 0 1 0-35.88 0 18 18 0 0 1 35.88 0Z" fill="#E88B00"></path><path d="M41.94 25.5a18 18 0 1 0-35.88 0 18 18 0 0 1 35.88 0Z" fill="#F09207"></path><path d="M34.74 17.77v5.86c-2.06 0-4.05-.44-5.81-1.55v7.2a7.79 7.79 0 0 1-7.84 7.75 7.79 7.79 0 0 1-7.8-8.35 7.79 7.79 0 0 1 9.19-8.24v6c-.47-.13-.9-.26-1.39-.26a3.14 3.14 0 0 0-3.09 2.5 3.14 3.14 0 0 0 3.1 2.5c1.74 0 3.14-1.4 3.14-3.11V12.03h4.69a5.6 5.6 0 0 0 5.81 5.74Z" fill="#F09207"></path><path d="M34.34 18.18a5.78 5.78 0 0 1-5.82-5.74h-3.87v15.63c0 1.94-1.6 3.5-3.56 3.5a3.53 3.53 0 0 1-3.55-3.5 3.53 3.53 0 0 1 4.52-3.38v-3.9a7.38 7.38 0 0 0-8.4 7.28 7.38 7.38 0 0 0 7.43 7.34c4.1 0 7.43-3.29 7.43-7.34v-7.98a9.73 9.73 0 0 0 5.82 1.92v-3.83Z" fill="#fff"></path></g><defs><clipPath id="Icon_Color-Tiktok_Coin_svg__a"><path fill="#fff" d="M0 0h48v48H0z"></path></clipPath></defs></svg>`;
    const currencySymbol = `<div class="_9f4d_TpOYW _9f4d_H3-Bold _9f4d_text-color-TextPrimary">$</div>`;

    return `
                    ${isCoinsView ? coinIcon : currencySymbol}
                    <div class="_9f4d_TpOYW _9f4d_H2-Bold" style="flex:1;">
                        <div class="_9f4d_klkZRQ">
                            <input id="main-input" placeholder="${placeholder}" readonly class="_9f4d_bQpkOu">
                            <span id="input-dummy" class="_9f4d_gZKCTv"></span>
                            <div id="input-caret" class="_9f4d_heyfmZ"></div>
                        </div>
                    </div>
                `;
  };

  // --- FORMATTERS ---
  const formatCurrency = (amount) =>
    amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  // --- UI UPDATE FUNCTIONS ---
  const updateDisplay = () => {
    let isBelowMinimum = false;
    let finalPrice = 0;
    let subDisplayHTML = "";

    if (currentView === "coins") {
      const coinValue = parseInt(inputValue, 10) || 0;
      finalPrice = coinValue * USD_PER_COIN;
      if (coinValue > 0 && coinValue < MIN_COINS) {
        isBelowMinimum = true;
        subDisplayHTML = `<div class="_9f4d_text-color-Negative _9f4d_SmallText1-Regular _9f4d_flex _9f4d_items-center">Minimum: ${MIN_COINS} coins</div>`;
      } else {
        subDisplayHTML = `<div class="_9f4d_SmallText1-Regular _9f4d_flex _9f4d_items-center">${formatCurrency(
          finalPrice
        )}</div>`;
      }
      document.getElementById("main-input").value =
        coinValue > 0 ? coinValue.toLocaleString() : "";
    } else {
      // amount view
      const amountValue = parseFloat(inputValue) || 0;
      finalPrice = amountValue;
      if (amountValue > 0 && amountValue < MIN_USD) {
        isBelowMinimum = true;
        subDisplayHTML = `<div class="_9f4d_text-color-Negative _9f4d_SmallText1-Regular _9f4d_flex _9f4d_items-center">Minimum: ${formatCurrency(
          MIN_USD
        )}</div>`;
      } else {
        const calculatedCoins = Math.floor(amountValue / USD_PER_COIN);
        subDisplayHTML = `<div class="_9f4d_SmallText1-Regular _9f4d_flex _9f4d_items-center"><div class="_9f4d_flex"><svg viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><g clip-path="url(#Icon_Color-Tiktok_Coin_svg__a)"><path d="M48 24a24 24 0 1 1-48 0 24 24 0 0 1 48 0Z" fill="#FFB84D"></path><path d="M47 24a23 23 0 1 1-46 0 23 23 0 0 1 46 0Z" fill="#FFDE55"></path><path d="M42 24a18 18 0 1 1-36 0 18 18 0 0 1 36 0Z" fill="#F7A300"></path><path d="M42 24a18 18 0 1 1-36 0 18 18 0 0 1 36 0Z" fill="#F7A80F"></path><path d="M41.94 25.5a18 18 0 1 0-35.88 0 18 18 0 0 1 35.88 0Z" fill="#E88B00"></path><path d="M41.94 25.5a18 18 0 1 0-35.88 0 18 18 0 0 1 35.88 0Z" fill="#F09207"></path><path d="M34.74 17.77v5.86c-2.06 0-4.05-.44-5.81-1.55v7.2a7.79 7.79 0 0 1-7.84 7.75 7.79 7.79 0 0 1-7.8-8.35 7.79 7.79 0 0 1 9.19-8.24v6c-.47-.13-.9-.26-1.39-.26a3.14 3.14 0 0 0-3.09 2.5 3.14 3.14 0 0 0 3.1 2.5c1.74 0 3.14-1.4 3.14-3.11V12.03h4.69a5.6 5.6 0 0 0 5.81 5.74Z" fill="#F09207"></path><path d="M34.34 18.18a5.78 5.78 0 0 1-5.82-5.74h-3.87v15.63c0 1.94-1.6 3.5-3.56 3.5a3.53 3.53 0 0 1-3.55-3.5 3.53 3.53 0 0 1 4.52-3.38v-3.9a7.38 7.38 0 0 0-8.4 7.28 7.38 7.38 0 0 0 7.43 7.34c4.1 0 7.43-3.29 7.43-7.34v-7.98a9.73 9.73 0 0 0 5.82 1.92v-3.83Z" fill="#fff"></path></g><defs><clipPath id="Icon_Color-Tiktok_Coin_svg__a"><path fill="#fff" d="M0 0h48v48H0z"></path></clipPath></defs></svg><span class="_9f4d_ms-2 _9f4d_text-color-TextTertiaryAlt">${calculatedCoins.toLocaleString()}</span></div></div>`;
      }
      document.getElementById("main-input").value = inputValue;
    }

    subDisplayContainer.innerHTML = subDisplayHTML;
    totalPriceDisplay.textContent = formatCurrency(finalPrice);
    updateCaretPosition();
  };

  const updateCaretPosition = () => {
    const mainInput = document.getElementById("main-input");
    const inputDummy = document.getElementById("input-dummy");
    const inputCaret = document.getElementById("input-caret");
    if (!mainInput || !inputDummy || !inputCaret) return;

    inputDummy.textContent = mainInput.value;
    const textWidth = inputDummy.offsetWidth;
    inputCaret.style.marginInlineStart = `${textWidth}px`;
  };

  const switchView = (newView) => {
    currentView = newView;
    inputValue = "";

    inputContainer.innerHTML = createInputTemplate(newView);

    if (newView === "coins") {
      headerTitle.textContent = "Custom";
      viewTriggerLabel.textContent = "Number of Coins";
      keypadCoins.classList.remove("hidden");
      keypadAmount.classList.add("hidden");
    } else {
      headerTitle.textContent = "Custom";
      viewTriggerLabel.textContent = "Payment Amount";
      keypadCoins.classList.add("hidden");
      keypadAmount.classList.remove("hidden");
    }
    updateDisplay();
    closeSecondarySheet();
  };

  // --- SHEET/MODAL VISIBILITY ---
  const openSheet = (sheet, mask, component) => {
    component.classList.remove("hidden");
    setTimeout(() => {
      mask.classList.remove("mask-hidden");
      sheet.classList.add("visible");
    }, 10);
  };

  const closeSheet = (sheet, mask, component) => {
    mask.classList.add("mask-hidden");
    sheet.classList.remove("visible");
    setTimeout(() => component.classList.add("hidden"), 300);
  };

  const openMainSheet = () => openSheet(mainSheet, mainMask, mainComponent);
  const closeMainSheet = () => closeSheet(mainSheet, mainMask, mainComponent);
  const openSecondarySheet = () =>
    openSheet(secondarySheet, secondaryMask, secondaryComponent);
  const closeSecondarySheet = () =>
    closeSheet(secondarySheet, secondaryMask, secondaryComponent);

  // --- EVENT HANDLERS ---
  const handleNumberKey = (keyText) => {
    if (currentView === "coins") {
      if (keyText === "000" && inputValue.length > 0) inputValue += "000";
      else if (keyText !== "000") inputValue += keyText;

      if (inputValue.length > 1 && inputValue.startsWith("0"))
        inputValue = inputValue.substring(1);
      if (parseInt(inputValue, 10) > MAX_COINS) inputValue = String(MAX_COINS);
    } else {
      // amount view
      if (keyText === "." && !inputValue.includes(".")) {
        inputValue += ".";
      } else if (keyText !== ".") {
        const parts = inputValue.split(".");
        if (parts.length === 1 || (parts.length === 2 && parts[1].length < 2)) {
          inputValue += keyText;
        }
      }
      if (parseFloat(inputValue) > MAX_USD) inputValue = MAX_USD.toFixed(2);
    }
    updateDisplay();
  };

  const handleBackspace = () => {
    inputValue = inputValue.slice(0, -1);
    updateDisplay();
  };

  // --- EVENT LISTENERS ---
  openModalButton.addEventListener("click", openMainSheet);
  closeModalButton.addEventListener("click", closeMainSheet);
  mainMask.addEventListener("click", closeMainSheet);

  changeViewTrigger.addEventListener("click", openSecondarySheet);
  secondaryMask.addEventListener("click", closeSecondarySheet);
  cancelSecondaryBtn.addEventListener("click", closeSecondarySheet);

  selectCoinsViewBtn.addEventListener("click", () => switchView("coins"));
  selectAmountViewBtn.addEventListener("click", () => switchView("amount"));

  allNumKeys.forEach((key) =>
    key.addEventListener("click", () => handleNumberKey(key.textContent))
  );
  allBackspaceKeys.forEach((key) =>
    key.addEventListener("click", handleBackspace)
  );

  // --- INITIALIZATION ---
  switchView("coins");
});
