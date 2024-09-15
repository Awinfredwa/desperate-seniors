(async () => {
  try {
    // Request camera access
    await navigator.mediaDevices.getUserMedia({ video: true });
    // Send a message back to the popup indicating permission was granted
    chrome.runtime.sendMessage({ type: 'permissionResult', granted: true });
  } catch (error) {
    console.error('Error requesting camera permission: ', error);
    // Send a message back to the popup indicating permission was denied
    chrome.runtime.sendMessage({ type: 'permissionResult', granted: false });
  } finally {
    // Close the window after sending the message
    window.close();
  }
})();
