import { getDomainAndPathname } from "./shared.js";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const { domain, pathname } = getDomainAndPathname(tab.url);
    const key = `${domain}${pathname}`;
    chrome.storage.local.get([key], (result) => {
      const tabName = result[key];
      if (!tabName) {
        return;
      }
      chrome.scripting.executeScript({
        target: { tabId },
        function: (tabNameArg) => {
          document.title = tabNameArg;
        },
        args: [tabName],
      });
    });
  }
});
