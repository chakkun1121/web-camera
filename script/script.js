document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    console.log(
      `Element: ${document.fullscreenElement.id} entered fullscreen mode.`,
    );
    document.querySelector("header").classList.add("hidden");
    document.querySelector("nav").classList.add("hidden");
  } else {
    console.log("Leaving fullscreen mode.");
    document.querySelector("header").classList.add("block");
    document.querySelector("nav").classList.add("grid");
  }
});
function showFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}
