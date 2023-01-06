window.onload = function () {
  cameraRequest()
  setTimeout(function () {
    document.querySelector('header').style.top = "-100px";
  }, 5000)
}
function cameraRequest(facingMode = "user") {
  navigator.mediaDevices.getUserMedia({
    video: {
      width: 1920, height: 1080, facingMode: { exact: facingMode }
    },
    audio: false
  }).then(stream => {
    video.srcObject = stream;
    video.play()
  }).catch(e => {
    console.log(e)
    alert('カメラが使用できません。')
    return e;
  })
}
function takePicture() {
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
  const dataURL = canvas.toDataURL()
  console.log(canvas.toDataURL());
  // window.open(canvas.toDataURL(), "_target")
  downloadDataURL(dataURL)
}
function downloadDataURL(url, title = "picture") {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = title;
  a.href = url;
  a.click();
  a.remove();
}