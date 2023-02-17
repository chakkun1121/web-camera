let nowFacingMode;
let canUseEnvironmentCamera = true;
window.onload = function () {
  cameraRequest();
  // setTimeout(function () {
  //   document.querySelector("header").style.top = "-100px";
  // }, 5000);
};
function cameraRequest(facingMode = "user") {
  nowFacingMode = facingMode;
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: 1920,
        height: 1080,
        facingMode: { exact: facingMode },
      },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((e) => {
      console.log(e);
      alert(
        typeof e == String
          ? "カメラが使用できません。"
          : "フロントカメラ以外は使用できません"
      );
      if (typeof e != String) {
        canUseEnvironmentCamera = false;
      }
      return e;
    });
}
function takePicture() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL();
  console.log(canvas.toDataURL());
  downloadDataURL(dataURL);
}
function downloadDataURL(url, title = "") {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = title;
  a.href = url;
  a.click();
  a.remove();
}
function changeFacingMode() {
  if (canUseEnvironmentCamera) {
    cameraRequest(nowFacingMode == "environment" ? "user" : "environment");
    return;
  } else {
    alert("カメラの切り替えはできません。");
  }
}
