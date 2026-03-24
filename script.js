const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const letterDisplay = document.getElementById("letter");
const sentenceDisplay = document.getElementById("sentence");

let camera;

// sentence building
let sentence = "";
let lastLetter = "";
let lastDetectionTime = 0;
const detectionDelay = 1200;

// MediaPipe Hands setup
const hands = new Hands({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

// results from mediapipe
hands.onResults((results) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  if (results.multiHandLandmarks) {
    const landmarks = results.multiHandLandmarks[0];

    drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
      color: "green",
      lineWidth: 3,
    });

    drawLandmarks(ctx, landmarks, {
      color: "red",
      lineWidth: 2,
    });

    const letter = detectLetter(landmarks);
    letterDisplay.innerText = letter;

    const currentTime = Date.now();

    if (
      letter !== "" &&
      letter !== lastLetter &&
      currentTime - lastDetectionTime > detectionDelay
    ) {
      if (letter === "SPACE") {
        sentence += " ";
      } else if (letter === "DELETE") {
        sentence = sentence.slice(0, -1);
      } else {
        sentence += letter;
      }

      sentenceDisplay.innerText = sentence;

      lastLetter = letter;
      lastDetectionTime = currentTime;
    }
  }
});

// start camera
function startCamera() {
  if (camera) return;

  camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 640,
    height: 480,
  });

  camera.start();
}

// stop camera
function stopCamera() {
  if (camera) {
    camera.stop();
    camera = null;
  }
}

// clear sentence
function clearText() {
  sentence = "";
  sentenceDisplay.innerText = "";
}

// detect finger states
function getFingerState(landmarks) {
  return {
    thumb: landmarks[4].x < landmarks[3].x,
    index: landmarks[8].y < landmarks[6].y,
    middle: landmarks[12].y < landmarks[10].y,
    ring: landmarks[16].y < landmarks[14].y,
    pinky: landmarks[20].y < landmarks[18].y,
  };
}

// gesture recognition
function detectLetter(landmarks) {
  const f = getFingerState(landmarks);

  // A
  if (!f.index && !f.middle && !f.ring && !f.pinky) return "A";

  // B
  if (f.index && f.middle && f.ring && f.pinky) return "B";

  // D
  if (f.index && !f.middle && !f.ring && !f.pinky) return "D";

  // U
  if (f.index && f.middle && !f.ring && !f.pinky) return "U";

  // L
  if (f.thumb && f.index && !f.middle && !f.ring && !f.pinky) return "L";

  // Y
  if (f.thumb && !f.index && !f.middle && !f.ring && f.pinky) return "Y";

  // F
  if (!f.thumb && f.index && f.middle && f.ring && f.pinky) return "F";

  // K
  if (!f.thumb && f.index && f.middle && !f.ring && !f.pinky) return "K";

  // SPACE gesture
  if (f.index && f.middle && f.ring && !f.pinky) return "SPACE";

  // DELETE gesture
  if (!f.thumb && !f.index && !f.middle && !f.ring && f.pinky) return "DELETE";

  return "";
}
