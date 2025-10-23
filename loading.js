document.addEventListener("DOMContentLoaded", function () {
  // 1. Add the 'loader-active' class to the body
  document.body.classList.add("loader-active");

  // 2. Define how long the loader should run (3500ms = 3.5 seconds)
  const loaderDuration = 3500;

  // 3. Set a timer to remove the loader
  setTimeout(function () {
    const loader = document.getElementById("loader-container");

    // Hide the loader element
    if (loader) {
      loader.style.display = "none";
    }

    // Remove the 'loader-active' class from the body
    document.body.classList.remove("loader-active");
  }, loaderDuration);
});
