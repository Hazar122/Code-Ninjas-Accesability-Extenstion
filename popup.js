const toggleFontChange = document.getElementById("toggleFontChange");

// Load the initial state from storage
chrome.storage.sync.get("fontChangeEnabled", ({ fontChangeEnabled }) => {
    toggleFontChange.checked = fontChangeEnabled;
});

// Listen for changes in the toggle button
toggleFontChange.addEventListener("change", () => {
    const fontChangeEnabled = toggleFontChange.checked;
    // Store the state in chrome.storage.sync
    chrome.storage.sync.set({ fontChangeEnabled });

    // Send a message to content script to trigger a page refresh
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { refresh: true });
        }
    });
});