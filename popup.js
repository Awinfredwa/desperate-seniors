document.addEventListener('DOMContentLoaded', () => {
  const videoElement = document.getElementById('video');
  const canvasElement = document.getElementById('canvas');
  const snapshotElement = document.getElementById('snapshot');
  const errorElement = document.getElementById('error-message');
  const captureButton = document.getElementById('capture');

  let stream;

  // Function to start the camera and immediately capture the image
  async function startCameraAndCapture() {
    try {
      // Start video stream
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
      videoElement.play(); // Start playing the video feed

      // Wait for video metadata to load (ensures width and height are available)
      videoElement.onloadedmetadata = () => {
        setTimeout(captureImage, 2000); // Delay capture to ensure video is loaded
      };

      errorElement.textContent = '';
    } catch (error) {
      handleError(error);
    }
  }

  // Function to stop the camera
  function stopCamera() {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.srcObject = null; // Clear the video element
      stream = null;
    }
  }

  // Function to capture the image
  function captureImage() {
    // Ensure the video has a valid width and height
    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;
    
    if (width && height) {
      // Capture the video frame and draw it on the canvas
      canvasElement.width = width;
      canvasElement.height = height;
      const context = canvasElement.getContext('2d');
      context.drawImage(videoElement, 0, 0, width, height);

      // Convert the canvas to an image data URL (base64 string)
      const imageDataURL = canvasElement.toDataURL('image/png');
      snapshotElement.src = imageDataURL;
      snapshotElement.style.display = 'block'; // Show the captured image

      // Optionally stop the camera after capturing
      stopCamera();

      // Convert base64 image string to an HTML image element
      const img = new Image();
      img.src = imageDataURL;
      
      img.onload = () => {
        // Once the image is loaded, call the detectMouthOpen function
        detectMouthOpen(img); // Pass the image element to face-api.js
      };
    }
  }

  // Add event listener to the capture button
  captureButton.addEventListener('click', async () => {
    if (!stream) {
      // Start the camera and immediately capture the image
      await startCameraAndCapture();
    }
  });

  // Error handling function
  function handleError(error) {
    console.error('Error accessing the camera: ', error);
    errorElement.textContent = 'An error occurred while accessing the camera.';
  }
});
