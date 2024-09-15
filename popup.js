document.addEventListener('DOMContentLoaded', () => {
  const videoElement = document.getElementById('video');
  const errorElement = document.getElementById('error-message');
  const requestPermissionButton = document.getElementById('request-permission');

  async function attemptCameraAccess() {
    try {
      // Try to access the camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
      requestPermissionButton.style.display = 'none';
      errorElement.textContent = '';
    } catch (error) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        // Permission not granted, show the request permission button
        requestPermissionButton.style.display = 'block';
        requestPermissionButton.onclick = openPermissionWindow;
      } else {
        handleError(error);
      }
    }
  }

  function openPermissionWindow() {
    chrome.windows.create(
      {
        url: chrome.runtime.getURL('permission.html'),
        type: 'popup',
        width: 400,
        height: 300,
      },
      (newWindow) => {
        // Listen for messages from the permission window
        chrome.runtime.onMessage.addListener(function messageListener(message, sender, sendResponse) {
          if (message.type === 'permissionResult') {
            // Stop listening for messages
            chrome.runtime.onMessage.removeListener(messageListener);
            // Retry accessing the camera
            attemptCameraAccess();
          }
        });
      }
    );
  }

  // Initial attempt to access the camera
  attemptCameraAccess();
});

function handleError(error) {
  const errorElement = document.getElementById('error-message');
  console.error('Error accessing the camera: ', error);
  switch (error.name) {
    case 'NotAllowedError':
      errorElement.textContent = 'Permission to access the camera was denied.';
      break;
    case 'NotFoundError':
      errorElement.textContent = 'No camera devices found.';
      break;
    case 'NotReadableError':
      errorElement.textContent = 'The camera is already in use by another application.';
      break;
    case 'OverconstrainedError':
      errorElement.textContent = 'The specified video constraints cannot be satisfied.';
      break;
    case 'SecurityError':
      errorElement.textContent = 'Camera access is blocked due to security reasons.';
      break;
    default:
      errorElement.textContent = 'An unknown error occurred while accessing the camera.';
  }
}
