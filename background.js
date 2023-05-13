// Background script (background.js)
chrome.omnibox.onInputEntered.addListener(async function (request) {
  const searchQuery = request.trim();

  const tab = await getCurrentTab();
  if (tab && tab.url) {
    const searchEngine = extractSearchEngine(searchQuery);
    if (searchEngine) {
      const searchQueryWithoutPrefix = searchQuery.substring(searchEngine.length + 1);
      const searchURL = constructSearchURL(searchEngine, searchQueryWithoutPrefix);
      redirectTab(tab.id, searchURL);
    }
  }
});

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function extractSearchEngine(query) {
  const prefixIndex = query.indexOf(':');
  if (prefixIndex > 0) {
    return query.substring(0, prefixIndex);
  }
  return null;
}

function constructSearchURL(searchEngine, query) {
  switch (searchEngine) {
    case 'bing':
      return `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    case 'yahoo':
      return `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`;
    default:
      return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
}

function redirectTab(tabId, url) {
  chrome.tabs.update(tabId, { url: url, selected: false });
}
