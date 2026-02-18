chrome.action.onClicked.addListener((tab) => {
    console.log("Button clicked, sending message to content script...");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});

// chrome.tabs.query({active: true, currentWindow: true}, tabs => {
//   chrome.scripting.executeScript({
//     target: {tabId: tabs[0].id},
//     files: ['content.js']
//   });
// });

chrome.tabs.query({url : "https://chatgpt.com/*"}, (tabs) => {
  for (let tab of tabs) {
    if (tab.url && tab.url.startsWith("https://chatgpt.com/")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
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
      files: ["content.js"]
    }).catch(err => console.error("Script injection failed:", err));
  }
});
