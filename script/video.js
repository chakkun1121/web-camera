window.onload = function () {
  cameraRequest();
  setTimeout(function () {
    document.querySelector("header").classList.add("hidden");
  }, 5000);
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
      alert("カメラが使用できません。");
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
  document.getElementById("camerasListPopupMain").classList.add("hidden");
  cameraRequest(deviceID);
}

async function showCamerasList() {
  const showSpace = document.getElementById("camerasList");
  document.getElementById("camerasListPopupMain").classList.remove("hidden");
  showSpace.innerHTML = "";
  const devicesDom = (await navigator.mediaDevices.enumerateDevices())
    .filter((device) => device.kind === "videoinput")
    .map((device) => {
      // showSpace.innerHTML += `<li onclick="changeCameraById('${device.deviceId}')">${device.label}</li>`;
      const dom = document.createElement("li");
      dom.innerText = device.label;
      dom.onclick = () => {
        changeCameraById(device.deviceId);
      };
      return dom;
      return {
        text: device.label,
        value: device.deviceId,
      };
    });
  devicesDom.forEach((dom) => {
    showSpace.appendChild(dom);
  });
}
