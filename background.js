chrome.tabs.onCreated.addListener((tab) => {
  const tabId = tab.id;
  const startTime = Date.now();

  chrome.storage.local.get({ tabTimers: {} }, (result) => {
    let tabTimers = result.tabTimers;
    tabTimers[tabId] = startTime; // Set new start time for this tab
    chrome.storage.local.set({ tabTimers: tabTimers });
  });
});

// Detect when a tab is reloaded and reset its timer
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading") {
    // Reset on reload
    chrome.storage.local.get({ tabTimers: {} }, (result) => {
      let tabTimers = result.tabTimers;
      tabTimers[tabId] = Date.now(); // Reset the start time
      chrome.storage.local.set({ tabTimers: tabTimers });
    });
  }
});

// Remove the timer when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.get({ tabTimers: {} }, (result) => {
    let tabTimers = result.tabTimers;
    delete tabTimers[tabId]; // Remove timer for the closed tab
    chrome.storage.local.set({ tabTimers: tabTimers });
  });
});

// Update elapsed times every second
setInterval(() => {
  chrome.storage.local.get({ tabTimers: {} }, (result) => {
    let tabTimers = result.tabTimers;
    let elapsedTimes = {};

    for (let tabId in tabTimers) {
      elapsedTimes[tabId] = Math.floor((Date.now() - tabTimers[tabId]) / 1000);
    }

    chrome.storage.local.set({ elapsedTimes: elapsedTimes });
  });
}, 1000);
