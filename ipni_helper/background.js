// Background script for IPNI Extension
// Handles cross-origin requests to IPNI

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  // Handle search API request
  if (request.action === 'searchIPNI') {
    const url = `https://ipni.org/api/1/search?q=${encodeURIComponent(request.query)}`;
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        sendResponse({ success: true, data: data });
      })
      .catch(error => {
        console.error('Search API error:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Indicates async response
  }
  
  // Handle detail page fetch request
  if (request.action === 'fetchIPNIPage') {
    fetch(request.url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.text();
      })
      .then(html => {
        sendResponse({ success: true, html: html });
      })
      .catch(error => {
        console.error('Page fetch error:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Indicates async response
  }
  
  // Unknown action
  sendResponse({ success: false, error: 'Unknown action' });
  return false;
});

console.log("IPNI Extension Background Script Loaded");