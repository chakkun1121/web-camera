document.addEventListener("fullscreenchange", (event) => {
  if (document.fullscreenElement) {
    console.log(
      `Element: ${document.fullscreenElement.id} entered fullscreen mode.`
    );
    document.querySelector("header").style.display = "none";
    document.querySelector("nav").style.display = "none";
  } else {
    console.log("Leaving fullscreen mode.");
    document.querySelector("header").style.display = "block";
    document.querySelector("nav").style.display = "grid";
  }
});
function showFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}
