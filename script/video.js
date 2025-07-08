// 現在のカメラストリームとデバイスIDをグローバルに管理します
let currentStream = null;
let currentDeviceId = undefined;
// HTML内のvideo要素とcanvas要素を取得します (グローバルに定義しておくと便利です)
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

window.onload = function () {
  cameraRequest(); // 初回読み込み時にカメラを要求
  setTimeout(function () {
    document.querySelector("header").classList.add("hidden");
  }, 5000);

  // タブの表示・非表示を検知するイベントリスナーを追加
  document.addEventListener("visibilitychange", handleVisibilityChange);
};

// タブの表示状態が変わったときに呼ばれる関数
function handleVisibilityChange() {
  // document.hiddenがtrueなら、タブは非表示状態
  if (document.hidden) {
    console.log("タブが非アクティブになりました。カメラを停止します。");
    stopCamera();
  } else {
    // タブが表示状態になったら、最後に使用していたカメラで再開
    console.log("タブがアクティブになりました。カメラを再開します。");
    cameraRequest(currentDeviceId);
  }
}

// カメラのストリームを停止する関数
function stopCamera() {
  if (currentStream) {
    const tracks = currentStream.getTracks();
    tracks.forEach((track) => {
      track.stop(); // 各トラックを停止
    });
    video.srcObject = null;
    currentStream = null;
  }
}

function cameraRequest(deviceID) {
  // 新しいカメラを要求する前に、古いストリームがあれば停止する
  stopCamera();
  // 現在使用するデバイスIDを保存
  currentDeviceId = deviceID;

  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: 1920,
        height: 1080,
        // deviceIDが指定されていればそれを使用する
        deviceId: deviceID ? { exact: deviceID } : undefined,
      },
      audio: false,
    })
    .then((stream) => {
      // 新しいストリームをグローバル変数に保存
      currentStream = stream;
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
  // 撮影前にカメラが有効かチェック
  if (!currentStream || !currentStream.active) {
    alert("カメラが停止しています。このタブをアクティブにしてください。");
    return;
  }
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL("image/png");
  console.log(dataURL);
  // ファイル名に日時を加えて一意にする
  downloadDataURL(dataURL, `capture-${Date.now()}.png`);
}

function downloadDataURL(url, title = "capture.png") {
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
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === "videoinput");

    // デバイス名（label）が空の場合のフォールバックを追加
    if (videoDevices.length > 0 && videoDevices.every(device => device.label === '')) {
       showSpace.innerHTML = '<li>カメラへのアクセスを許可すると、デバイス名が表示されます。</li>';
    }

    const devicesDom = videoDevices.map((device, index) => {
      const dom = document.createElement("li");
      dom.innerText = device.label || `カメラ ${index + 1}`; // labelが空なら代替テキスト
      dom.onclick = () => {
        changeCameraById(device.deviceId);
      };
      return dom;
    });

    devicesDom.forEach((dom) => {
      showSpace.appendChild(dom);
    });
  } catch(e) {
    console.error("デバイスリストの取得に失敗しました: ", e);
  }
}
