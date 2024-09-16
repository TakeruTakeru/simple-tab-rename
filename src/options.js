import { getDomainAndPathname } from "./shared.js";

// Save button click event handler
document.getElementById("saveBtn").addEventListener("click", () => {
  const tabName = document.getElementById("tabName").value;

  // Get the currently active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab) {
      return;
    }
    const { domain, pathname } = getDomainAndPathname(activeTab.url);

    // Save the new tab name associated with the domain and pathname
    setTabData(domain, pathname, tabName);

    // Update the tab title in real-time using chrome.scripting.executeScript
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: (newTitle) => {
        document.title = newTitle;
      },
      args: [tabName], // Pass tabName as an argument
    });

    // Confirmation
    alert(`Tab name saved successfully!`);
  });
});

const setTabData = (domain, pathname, tabName) => {
  const key = `${domain}${pathname}`;
  const data = {};
  data[key] = tabName;
  chrome.storage.local.set(data, () => {
    console.log(`Tab name for ${key} saved as ${tabName}`);
  });
};

// Reset button click event handler
document.getElementById("resetBtn").addEventListener("click", () => {
  // Get the currently active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab) {
      return;
    }
    const { domain, pathname } = getDomainAndPathname(activeTab.url);

    // Remove the saved tab name associated with the domain and pathname
    removeTabData(domain, pathname);

    chrome.tabs.reload(activeTab.id, () => {
      alert(`Tab name has been reset and the tab reloaded.`);
    });
  });
});

const removeTabData = (domain, pathname) => {
  const key = `${domain}${pathname}`;
  chrome.storage.local.remove(key, () => {
    console.log(`Tab name for ${key} has been removed.`);
  });
};