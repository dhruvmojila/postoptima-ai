chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "postoptimaAnalyze",
    title: "Analyze with PostOptima AI",
    contexts: ["selection"],
  });
});

const ANALYZE_API_URL = "https://postoptima.com/api/analyze";

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== "postoptimaAnalyze") return;

  const selectedText = info.selectionText || "";

  chrome.storage.local.get(["token"], async (data) => {
    const token = data.token;

    // If not logged in, open popup to login and prefill text
    if (!token) {
      await chrome.storage.local.set({
        prefillText: selectedText,
        latestResult: null,
      });
      try {
        await chrome.action.openPopup();
      } catch (_) {
        // Fallback: open popup.html in a small window
        chrome.windows.create({
          url: chrome.runtime.getURL("popup.html"),
          type: "popup",
          width: 420,
          height: 640,
        });
      }
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Login required",
        message: "Please log in to analyze text.",
      });
      return;
    }

    // Persist selected text for the popup UI
    await chrome.storage.local.set({ prefillText: selectedText });

    try {
      const res = await fetch(ANALYZE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postContent: selectedText, platform: "X" }),
      });

      const result = await res.json();

      // Store result so popup can render it immediately
      await chrome.storage.local.set({ latestResult: result });

      // Notify
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "PostOptima Result",
        message: result?.error
          ? `Analysis failed: ${result.error}`
          : `Score: ${result.algorithm_score}, Engage: ${result.engagement_prediction}%`,
      });

      // Open the popup to show full result
      try {
        await chrome.action.openPopup();
      } catch (_) {
        chrome.windows.create({
          url: chrome.runtime.getURL("popup.html"),
          type: "popup",
          width: 420,
          height: 640,
        });
      }
    } catch (e) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "PostOptima Error",
        message: "Network error. Please try again.",
      });
    }
  });
});

let pendingAuthTab = null;

// Listen for messages from popup and website
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle Google login initiation from popup
  if (request.type === "INITIATE_GOOGLE_LOGIN") {
    initiateGoogleLogin();
    sendResponse({ success: true });
    return true;
  }

  // Handle auth success from website
  if (request.type === "AUTH_SUCCESS") {
    handleAuthSuccess(request, sender);
    sendResponse({ success: true });
    return true;
  }

  // Handle auth error from website
  if (request.type === "AUTH_ERROR") {
    handleAuthError(request);
    sendResponse({ success: true });
    return true;
  }
});

// Function to initiate Google login
async function initiateGoogleLogin() {
  try {
    // Create login tab with extension flag
    const tab = await chrome.tabs.create({
      url: "https://postoptima.com/login?extension=true",
      active: true,
    });

    // Store tab ID for cleanup
    pendingAuthTab = tab.id;

    console.log("Google login tab created:", tab.id);
  } catch (error) {
    console.error("Error creating login tab:", error);
    notifyPopup("AUTH_ERROR", { error: error.message });
  }
}

// Handle successful authentication from website
async function handleAuthSuccess(request, sender) {
  try {
    // Store authentication data
    await chrome.storage.local.set({
      token: request.token,
      refreshToken: request.refreshToken,
      user: request.user,
    });

    console.log("Auth data stored successfully");

    // Close the login tab if it's still open
    if (pendingAuthTab && sender.tab?.id === pendingAuthTab) {
      try {
        await chrome.tabs.remove(pendingAuthTab);
      } catch (e) {
        // Tab might already be closed
      }
      pendingAuthTab = null;
    }

    // Notify popup about successful authentication
    notifyPopup("AUTH_SUCCESS", {
      token: request.token,
      user: request.user,
    });
  } catch (error) {
    console.error("Error handling auth success:", error);
    notifyPopup("AUTH_ERROR", { error: error.message });
  }
}

// Handle authentication errors
function handleAuthError(request) {
  console.error("Auth error:", request.error);

  // Clean up pending tab
  if (pendingAuthTab) {
    chrome.tabs.remove(pendingAuthTab).catch(() => {});
    pendingAuthTab = null;
  }

  // Notify popup about error
  notifyPopup("AUTH_ERROR", { error: request.error });
}

// Helper function to notify popup (if it's open)
function notifyPopup(type, data) {
  // Try to send message to popup
  chrome.runtime
    .sendMessage({
      type: type,
      ...data,
    })
    .catch(() => {
      // Popup might be closed, that's fine
      console.log("Popup closed, message not delivered");
    });
}

// Clean up on tab close
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === pendingAuthTab) {
    pendingAuthTab = null;
    console.log("Auth tab closed manually");
  }
});

// Listen for tab updates to detect navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // If this is our auth tab and it navigated to dashboard, auth was successful
  if (
    tabId === pendingAuthTab &&
    changeInfo.url &&
    changeInfo.url.includes("/dashboard")
  ) {
    console.log("User navigated to dashboard, auth likely successful");
  }
});
