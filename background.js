chrome.action.onClicked.addListener((tab) => {
    console.log("Button clicked, sending message to content script...");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["dist/content.bundle.js"]
  });
});

chrome.tabs.query({url : "https://chatgpt.com/*"}, (tabs) => {
  for (let tab of tabs) {
    if (tab.url && tab.url.startsWith("https://chatgpt.com/")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["dist/content.bundle.js"]
      });
    }
  }
});

// Listen for tab updates (page load or reload)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only run when the page has fully loaded
  if (changeInfo.status === "complete" && tab.url ) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["dist/content.bundle.js"]
    }).catch(err => console.error("Script injection failed:", err));
  }
});
