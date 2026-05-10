/**
 * =================================================================================
 * Action Preview Controller
 *
 * This script is responsible for dynamically updating the user account preview
 * within the final action section (e.g., the TUXSheet payment overlay).
 *
 * It operates on an advanced, decoupled architecture using a MutationObserver.
 * Instead of being directly called by other scripts, it independently "observes"
 * the results of the main user lookup UI. When it detects a change to the
 * fetched user's name or avatar, it instantly mirrors that information in its
 * own preview section.
 *
 * This ensures the preview is always synchronized, handles success and failure
 * states gracefully, and requires zero modifications to the original data-fetching logic.
 * =================================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. DEFINE CONSTANTS & SELECT ELEMENTS ---

  // The placeholder to use when no valid user is found.
  const PLACEHOLDER_AVATAR_URL = "nouser.jpg";
  const GUEST_NICKNAME = "Quest";

  // --- Target Elements (The preview we want to UPDATE) ---
  const previewAvatarContainer = document.getElementById(
    "preview-avatar-container",
  );
  const previewNickname = document.getElementById("preview-nickname");

  // --- Source Elements (The user info we want to WATCH for changes) ---
  const sourceProfilePreview = document.getElementById("lookup_profilePreview");
  const sourceAvatar = document.getElementById("lookup_avatar");
  const sourceNickname = document.getElementById("lookup_nickname");

  // Professional Safeguard: If any essential elements are missing, stop the script
  // to prevent errors.
  if (
    !previewAvatarContainer ||
    !previewNickname ||
    !sourceProfilePreview ||
    !sourceAvatar ||
    !sourceNickname
  ) {
    console.error(
      "Action Preview Controller: One or more required UI elements could not be found. Aborting.",
    );
    return;
  }

  // --- 2. CORE LOGIC ---

  /**
   * This is the heart of the controller. It reads the current state from the
   * source elements and updates the action preview accordingly.
   */
  const syncPreview = () => {
    // Check if the source profile preview is hidden. If it is, we should
    // always show the guest/default state.
    const isSourceHidden = sourceProfilePreview.classList.contains("hidden");

    // Get the current nickname from the source.
    const currentNickname = sourceNickname.textContent;

    // Get the current avatar URL from the source.
    const currentAvatarSrc = sourceAvatar.src;

    // --- DECISION LOGIC: Determine if a valid profile is displayed ---
    // A profile is considered invalid if:
    // 1. The source preview area is hidden (e.g., input is cleared).
    // 2. The nickname text indicates an error state.
    if (isSourceHidden || currentNickname === "Profile not found") {
      // No valid user found, so display the placeholder/guest info.
      previewNickname.textContent = GUEST_NICKNAME;
      previewAvatarContainer.style.backgroundImage = `url('${PLACEHOLDER_AVATAR_URL}')`;
    } else {
      // A valid user was found, so mirror their info.
      previewNickname.textContent = currentNickname;
      previewAvatarContainer.style.backgroundImage = `url('${currentAvatarSrc}')`;
    }
  };

  // --- 3. ADVANCED OBSERVER SETUP ---

  // Create a MutationObserver. This powerful tool will execute the syncPreview
  // function automatically whenever the observed elements are changed by ANY script.
  const observer = new MutationObserver(syncPreview);

  // Configure the observer to watch for:
  // - attributes: Catches changes to the `src` of the avatar image.
  // - characterData: Catches changes to the text inside the nickname span.
  // - subtree: Necessary to monitor text changes within child elements.
  // - childList: Catches if elements are added/removed.
  const observerConfig = {
    attributes: true,
    characterData: true,
    subtree: true,
    childList: true,
  };

  // Tell the observer to start watching the main profile preview container
  // for any of the changes defined in the config.
  observer.observe(sourceProfilePreview, observerConfig);

  // --- 4. INITIALIZATION ---

  // Run the function once when the script loads. This ensures the action preview
  // displays the correct default ("Quest") state before the user has searched
  // for anyone.
  syncPreview();
});
