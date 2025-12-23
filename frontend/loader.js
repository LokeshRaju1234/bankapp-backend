// function showLoader() {
//   const loader = document.getElementById("globalLoader");
//   if (loader) loader.classList.remove("hidden");
// }

// function hideLoader() {
//   const loader = document.getElementById("globalLoader");
//   if (loader) loader.classList.add("hidden");
// }

// added new 
let lottieInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("lottieLoader");

  if (container) {
    lottieInstance = lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: "loader.json" // change path only if file is elsewhere
    });
  }
});

function showLoader() {
  const loader = document.getElementById("globalLoader");
  if (!loader) return;

  loader.classList.remove("hidden");
  if (lottieInstance) lottieInstance.play();
}

function hideLoader() {
  const loader = document.getElementById("globalLoader");
  if (!loader) return;

  if (lottieInstance) lottieInstance.stop();
  loader.classList.add("hidden");
}
