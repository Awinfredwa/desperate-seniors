    // Load face-api.js models
    async function loadModels() {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      }
  
      // Detect if mouth is open
      async function detectMouthOpen(image) {
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
  
      // Load the models when the page loads
      loadModels();