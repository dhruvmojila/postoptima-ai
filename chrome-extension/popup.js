// ========== SOLUTION 1: Updated popup.js (Simplified) ==========

const SUPABASE_URL = "https://lcwpfenluxcowhbfgvjw.supabase.co";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjd3BmZW5sdXhjb3doYmZndmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjc4ODQsImV4cCI6MjA2ODc0Mzg4NH0.6-yoClCl5MFwxInyVknxpGsQFfl84TTxtkfwz4-gvdg";
const ANALYZE_API_URL = "https://postoptima.com/api/analyze";
const CHECKOUT_URL = "https://postoptima.com/pricing";
const SITE_LOGIN_URL = "https://postoptima.com/login";

// ========== Utilities ==========
function setView(isLoggedIn) {
  document.getElementById("loginForm").style.display = isLoggedIn
    ? "none"
    : "block";
  document.getElementById("analyzerUI").style.display = isLoggedIn
    ? "block"
    : "none";
}

function renderResult(result) {
  const el = document.getElementById("result");
  if (!result) {
    el.innerHTML = "";
    return;
  }
  if (result.error) {
    el.innerHTML = `<span style="color:#f87171">${result.error}</span>`;
    return;
  }
  el.innerHTML = `
    <strong>Score:</strong> ${result.algorithm_score}<br/>
    <strong>Engagement:</strong> ${result.engagement_prediction}%<br/>
    <strong>Tips:</strong><ul>${(result.suggestions || [])
      .map((x) => `<li>${x}</li>`)
      .join("")}</ul>
  `;
}

// ========== Event Bindings ==========

// Regular email/password login (unchanged)
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) return alert("Enter email and password");

  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_API_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data.error || !data?.access_token) return alert("Login failed");

  chrome.storage.local.set(
    {
      token: data.access_token,
      refreshToken: data.refresh_token,
    },
    async () => {
      setView(true);
      await loadUserDetails(data.access_token);
    }
  );
});

// ========== FIXED: Google Login via Background Script ==========
document.getElementById("googleBtn").addEventListener("click", () => {
  // Send message to background script to handle Google login
  chrome.runtime.sendMessage({ type: "INITIATE_GOOGLE_LOGIN" }, (response) => {
    if (response?.success) {
      console.log("Google login initiated by background script");
    } else {
      alert("Failed to initiate Google login");
    }
  });
});

// ========== Listen for Auth State Changes from Background ==========
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "AUTH_SUCCESS") {
    // Update UI when background script receives auth success
    setView(true);
    loadUserDetails(request.token);
    alert("Successfully logged in with Google!");
  } else if (request.type === "AUTH_ERROR") {
    alert("Google login failed: " + request.error);
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await chrome.storage.local.remove(["token", "refreshToken", "latestResult"]);
  setView(false);
  renderResult(null);
});

// ========== On Load ==========
chrome.storage.local.get(
  ["token", "prefillText", "latestResult"],
  async (data) => {
    const { token, prefillText, latestResult } = data || {};

    if (token) {
      setView(true);
      await loadUserDetails(token);
    } else {
      setView(false);
    }

    if (prefillText) {
      document.getElementById("postText").value = prefillText;
      chrome.storage.local.remove(["prefillText"]);
    }

    if (latestResult) {
      renderResult(latestResult);
    }
  }
);

// ========== Load Profile Function ==========
async function loadUserDetails(token) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=plan`, {
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (Array.isArray(data) && data[0]?.plan === "free") {
      document.getElementById("upgrade").style.display = "block";
    } else {
      document.getElementById("upgrade").style.display = "none";
    }
    document.getElementById("upgrade").onclick = () => {
      chrome.tabs.create({ url: CHECKOUT_URL });
    };
  } catch (error) {
    console.error("Profile load error:", error);
  }
}

// ========== Analyze Function ==========
document.getElementById("analyzeBtn").addEventListener("click", () => {
  chrome.storage.local.get(["token"], async (data) => {
    const token = data.token;
    if (!token) return alert("Please log in first");

    const post = document.getElementById("postText").value.trim();
    if (!post) return alert("Enter some text to analyze");

    try {
      const res = await fetch(ANALYZE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postContent: post, platform: "X" }),
      });
      const result = await res.json();
      renderResult(result);
      await chrome.storage.local.set({ latestResult: result });
    } catch (e) {
      renderResult({ error: "Network error" });
    }
  });
});
