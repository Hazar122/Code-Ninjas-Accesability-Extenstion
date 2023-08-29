
chrome.runtime.onMessage.addListener((message) => {
    if (message.refresh) {
        location.reload();
    }

    if (message.action === "executeScript") {
        console.log("Received message to execute script:", message.text); // Log the received message
        convertTextToSpeech(message.text);
    }
});


function applyFont(font) {
    const style = document.createElement("style");
    style.textContent = `
    @font-face {
      font-family: 'dyslexic';
      src: url(${chrome.runtime.getURL('OpenDyslexic.woff2')}) format('woff2');
    }
    html, body, p, text, div, span.blocklyTreeLabel, .ui.input>input, ui.button, span.ui.text,
    span.docs.inlineblock, span.common-button-label, span.name-short, span.name, select[_ngcontent-isw-c57],span.program-title, option, select,
    .course-preview-container[_ngcontent-swj-c53] .title-levels-container[_ngcontent-swj-c53] h1.title[_ngcontent-swj-c53],
    h1.title.ng-tns-c53-1.ng-trigger.ng-trigger-slideIn, iframe 
    {
      font-family: ${font === "dyslexic" ? "'dyslexic', sans-serif" : "initial"} !important;
    }
  `;
    document.head.appendChild(style);
}


// Load the toggle state and apply font change if enabled
chrome.storage.sync.get("fontChangeEnabled", ({ fontChangeEnabled }) => {
    if (fontChangeEnabled) {
        applyFont("dyslexic");
    }
});

// Listen for the contextmenu event
document.addEventListener("contextmenu", function (event) {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        // Send a message to the background script with the selected text
        chrome.runtime.sendMessage({ action: "readSelectedText", text: selectedText });
    }
});

// Function to convert selected text to speech
function convertTextToSpeech(text) {
    console.log("Converting text to speech:", text);
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    // Set desired parameters for the speech
    utterance.lang = "en-US";
    utterance.volume = 1.0;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Play the speech
    synth.speak(utterance);
}