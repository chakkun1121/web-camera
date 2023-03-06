window.onload = function () {
  cameraRequest();
};
function cameraRequest(deviceID) {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: 1920,
        height: 1080,
        deviceId: deviceID,
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
function changeCameraById(deviceID) {
  document.getElementById("camerasListPopupMain").style.display = "none";
  cameraRequest(deviceID);
}

async function showCamerasList() {
  const showSpace = document.getElementById("camerasList");
  document.getElementById("camerasListPopupMain").style.display = "block";
  showSpace.innerHTML = "";
  const devices = (await navigator.mediaDevices.enumerateDevices())
    .filter((device) => device.kind === "videoinput")
    .map((device) => {
      showSpace.innerHTML += `<li onclick="changeCameraById('${device.deviceId}')">${device.label}</li>`;
      return {
        text: device.label,
        value: device.deviceId,
      };
    });
}
