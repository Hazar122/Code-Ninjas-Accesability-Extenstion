// Create the context menu item
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "readSelected",
        title: "Read with Text-to-Speech",
        contexts: ["selection"]
    });
});

// Handle context menu item click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "readSelected") {
        const selectedText = info.selectionText;
        chrome.tabs.sendMessage(tab.id, { action: "executeScript", text: selectedText });
    }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "readSelectedText") {
        // Execute the function for reading selected text
        chrome.tabs.sendMessage(sender.tab.id, { action: "convertTextToSpeech", text: message.text });
    }
});
