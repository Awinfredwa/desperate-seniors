let modelsLoaded = false;

async function loadModels() {
  // Load models from the Chrome extension's local assets
  //const modelUrl = chrome.runtime.getURL('models'); // Get the correct path for your models
  // await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
  // await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
  await faceapi.loadTinyFaceDetectorModel('/models');
  await faceapi.loadFaceLandmarkTinyModel('/models');
 
  //await faceapi.loadModels(modelUrl);
  console.log('Models are loaded');
  modelsLoaded = true;  // Mark models as loaded
}

// Detect if the mouth is open
async function detectMouthOpen(image) {
  if (!modelsLoaded) {
    console.error("Models not loaded yet!");
    return;
  }
  
  const detections = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
  if (!detections) {
    document.getElementById('mouthStatus').innerText = "Mouth Status: No face detected";
    return;
  }

  const mouthOpenThreshold = 20; // Adjust this threshold based on testing

  const landmarks = detections.landmarks;
  const upperLip = landmarks.getMouth()[14]; // Point on upper lip
  const lowerLip = landmarks.getMouth()[18]; // Point on lower lip

  // Calculate vertical distance between upper and lower lips
  const distance = Math.abs(lowerLip.y - upperLip.y);

  // Check if the mouth is open based on distance threshold
  if (distance > mouthOpenThreshold) {
    document.getElementById('mouthStatus').innerText = "Mouth Status: Open";
  } else {
    document.getElementById('mouthStatus').innerText = "Mouth Status: Closed";
  }
}

// Ensure models are loaded before any detection
document.addEventListener('DOMContentLoaded', async () => {
  await loadModels();  // Load models when the extension is opened
});
