document.addEventListener("DOMContentLoaded", function () {
  const timerElement = document.getElementById("timer");

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  }

  function updateTimer(tabId) {
    chrome.storage.local.get(["elapsedTimes"], (result) => {
      const elapsedTimes = result.elapsedTimes || {};
      const elapsedTime = elapsedTimes[tabId] || 0;
      timerElement.textContent = formatTime(elapsedTime);
    });
  }

  // Get the current tab ID and update the timer
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      setInterval(() => updateTimer(tabId), 1000);
      updateTimer(tabId); // Initial update
    }
  });
});
