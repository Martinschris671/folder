(function () {
  // --- UI Element References (Scoped with 'lookup_') ---
  const containerDiv = document.getElementById("recharge_container_div");
  const inputElement = document.getElementById("lookup_input");
  const profilePreview = document.getElementById("lookup_profilePreview");
  const contentWrapper = document.getElementById("lookup_contentWrapper");
  const avatar = document.getElementById("lookup_avatar");
  const nicknameLine = document.querySelector(".lookup_nicknameLine");
  const nickname = document.getElementById("lookup_nickname");
  const handle = document.getElementById("lookup_handle");
  const followers = document.getElementById("lookup_followers");
  const skeletonContainer = document.getElementById("lookup_skeletonContainer");

  // --- NEW: A self-contained SVG placeholder for the avatar ---
  // This Data URI is a lightweight, generic user icon that will be used when a profile isn't found.
  const PLACEHOLDER_AVATAR_SVG = "nouser.jpg";

  // --- State Management ---
  let debounceTimeout = null;
  let fetchController = null;

  // --- Helper Functions ---
  function abbreviateNumber(value) {
    const num = Number(value);
    if (isNaN(num)) return value;
    const tiers = [
      { value: 1e6, symbol: "M" },
      { value: 1e3, symbol: "K" },
    ];
    const tier = tiers.find((t) => num >= t.value);
    if (tier) {
      const scaled = num / tier.value;
      return scaled.toFixed(1).replace(/\.0$/, "") + tier.symbol;
    }
    return num.toString();
  }

  async function fetchTikTokProfile(username, signal) {
    if (!username || username.length < 1) return null;

    // ================== THE ONLY CHANGE IS HERE ==================
    const apiUrl = `https://tiktok-scraper-backend-myq6.onrender.com/scrape?username=${encodeURIComponent(
      username,
    )}`;
    // =============================================================

    try {
      const response = await fetch(apiUrl, { signal });
      if (!response.ok) {
        console.error(`API returned an HTTP error: ${response.status}`);
        return null;
      }
      const result = await response.json();

      if (
        !result.data ||
        !result.data.unique_id ||
        result.data.unique_id === "No unique_id found"
      ) {
        console.log(
          "Validation failed: Server content indicates no user found.",
        );
        return null;
      }

      const profile = result.data;
      return {
        uniqueId: profile.unique_id,
        nickname: profile.nickname,
        avatar: profile.profile_pic,
        followers: profile.followers,
        verified: profile.verified,
      };
    } catch (error) {
      if (error.name !== "AbortError")
        console.error("An unexpected fetch error occurred:", error);
      return null;
    }
  }

  // --- UI Update Functions ---

  function updateContainerHeight(isActive) {
    if (isActive) {
      containerDiv.style.height = "160px";
    } else {
      containerDiv.style.height = "92px";
    }
  }

  function showSkeleton() {
    updateContainerHeight(true);
    profilePreview.classList.remove("hidden");
    contentWrapper.classList.add("hidden");
    skeletonContainer.classList.remove("hidden");
  }

  function showProfile(data) {
    nickname.textContent = data.nickname;
    handle.textContent = `@${data.uniqueId}`;
    avatar.src = data.avatar;
    followers.textContent = `${abbreviateNumber(data.followers)} Followers`;

    const oldBadge = nicknameLine.querySelector("svg");
    if (oldBadge) oldBadge.remove();

    if (data.verified) {
      const verifiedBadgeSVG = `<svg width="14" data-e2e="" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#20D5EC"></circle><path fill-rule="evenodd" clip-rule="evenodd" d="M37.1213 15.8787C38.2929 17.0503 38.2929 18.9497 37.1213 20.1213L23.6213 33.6213C22.4497 34.7929 20.5503 34.7929 19.3787 33.6213L10.8787 25.1213C9.70711 23.9497 9.70711 22.0503 10.8787 20.8787C12.0503 19.7071 13.9497 19.7071 15.1213 20.8787L21.5 27.2574L32.8787 15.8787C34.0503 14.7071 35.9497 14.7071 37.1213 15.8787Z" fill="white"></path></svg>`;
      nicknameLine.insertAdjacentHTML("beforeend", verifiedBadgeSVG);
    }

    skeletonContainer.classList.add("hidden");
    contentWrapper.classList.remove("hidden");
  }

  function showErrorState(username) {
    // **THE ONLY CHANGE IS HERE: Use the placeholder SVG instead of an empty string.**
    avatar.src = PLACEHOLDER_AVATAR_SVG;

    nickname.textContent = "Profile not found";
    const oldBadge = nicknameLine.querySelector("svg");
    if (oldBadge) oldBadge.remove();
    handle.textContent = `No results for "@${username}"`;
    followers.textContent = "";
    skeletonContainer.classList.add("hidden");
    contentWrapper.classList.remove("hidden");
  }

  function hideProfilePreview() {
    updateContainerHeight(false);
    profilePreview.classList.add("hidden");
  }

  function handleInput() {
    const username = inputElement.value.trim().replace(/^@+/, "");

    clearTimeout(debounceTimeout);
    if (fetchController) fetchController.abort();

    if (!username) {
      hideProfilePreview();
      return;
    }

    showSkeleton();
    fetchController = new AbortController();
    const signal = fetchController.signal;

    debounceTimeout = setTimeout(async () => {
      const profileData = await fetchTikTokProfile(username, signal);
      if (!signal.aborted) {
        if (profileData) {
          showProfile(profileData);
        } else {
          showErrorState(username);
        }
      }
    }, 350);
  }

  inputElement.addEventListener("input", handleInput);
})();
