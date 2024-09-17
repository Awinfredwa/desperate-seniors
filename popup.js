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
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
      videoElement.style.display = 'block'; // Show the video feed

      // Wait for the video feed to be ready before capturing
      videoElement.onloadedmetadata = () => {
        // Capture the image
        captureImage();
        // Stop the camera after capturing
        stopCamera();
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
      videoElement.style.display = 'none'; // Hide the video feed
    }
  }

  // Function to capture the image
  function captureImage() {
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    canvasElement.getContext('2d').drawImage(videoElement, 0, 0);

    // Convert the canvas to an image
    const imageDataURL = canvasElement.toDataURL('image/png');
    snapshotElement.src = imageDataURL;
    snapshotElement.style.display = 'block'; // Show the captured image
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
