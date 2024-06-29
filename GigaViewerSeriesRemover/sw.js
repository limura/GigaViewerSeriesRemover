chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "toggleSeriesList" });
});
  
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(tabId, { action: 'isGigaViewerSiteCheck'}, (result) => {
            if (chrome.runtime.lastError || !result || !result.message) {
                console.log("set gray.", result);
              chrome.action.setIcon({ path: "icon/icon128-gray.png", tabId: tab.id });
            } else {
                console.log("set white.", result);
              chrome.action.setIcon({ path: "icon/icon128.png", tabId: tab.id });
            }
        });
    }
});
  