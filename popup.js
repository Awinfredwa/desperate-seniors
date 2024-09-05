

  document.addEventListener('DOMContentLoaded', async () => {
    const videoElement = document.getElementById('video');
  
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        // Request access to the camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  
        // Display the video stream in the video element
        videoElement.srcObject = stream;
      } catch (error) {
        console.error("Error accessing camera: ", error);
        handleError(error);
      }
    } else {
      console.error("getUserMedia is not supported in this browser.");
    }
  });
  
  function handleError(error) {
    console.error("DOMException Name: ", error.name);
    console.error("DOMException Message: ", error.message);
    switch (error.name) {
      case 'NotAllowedError':
        console.error("Permission to access the camera was denied.");
        break;
      case 'NotFoundError':
        console.error("No camera devices found.");
        break;
      case 'NotReadableError':
        console.error("The camera is already in use by another application.");
        break;
      case 'OverconstrainedError':
        console.error("The constraints specified cannot be satisfied by any available device.");
        break;
      case 'SecurityError':
        console.error("Camera access is blocked for security reasons.");
        break;
      default:
        console.error("Error accessing camera: ", error);
    }
  }