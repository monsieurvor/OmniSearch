// Content script (contentScript.js)
// Retrieve the search query from the URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');

// Send the search query to the background script
if (query) {
  chrome.runtime.sendMessage(query.trim());
}
