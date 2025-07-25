const SUPABASE_URL = "https://lcwpfenluxcowhbfgvjw.supabase.co";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjd3BmZW5sdXhjb3doYmZndmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjc4ODQsImV4cCI6MjA2ODc0Mzg4NH0.6-yoClCl5MFwxInyVknxpGsQFfl84TTxtkfwz4-gvdg";
const ANALYZE_API_URL = "https://postoptima-ai.vercel.app/api/analyze";
const CHECKOUT_URL = "https://postoptima-ai.vercel.app/checkout"; // Stripe checkout

// ========== Login ==========
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { session, error } = await supabaseAuth(email, password);
  if (error) return alert("Login failed");

  chrome.storage.local.set({ token: session.access_token }, () => {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("analyzerUI").style.display = "block";
    loadUserDetails(session.access_token);
  });
});

async function supabaseAuth(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_API_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  return { session: data, error: data.error };
}

// ========== On Load ==========
chrome.storage.local.get("token", (data) => {
  if (data.token) {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("analyzerUI").style.display = "block";
    loadUserDetails(data.token);
  }
});

// ========== Load Profile ==========
async function loadUserDetails(token) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=plan`, {
    headers: {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (data[0]?.plan === "free") {
    document.getElementById("upgrade").style.display = "block";
  }

  document.getElementById("upgrade").onclick = () => {
    chrome.tabs.create({ url: CHECKOUT_URL });
  };
}

// ========== Analyze ==========
document.getElementById("analyzeBtn").addEventListener("click", () => {
  chrome.storage.local.get("token", async (data) => {
    const post = document.getElementById("postText").value;
    const res = await fetch(ANALYZE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify({ postContent: post, platform: "X" }),
    });

    const result = await res.json();
    document.getElementById("result").innerHTML = `
      <strong>Score:</strong> ${result.algorithm_score}<br/>
      <strong>Engagement:</strong> ${result.engagement_prediction}%<br/>
      <strong>Tips:</strong><ul>${result.suggestions
        .map((x) => `<li>${x}</li>`)
        .join("")}</ul>
    `;
  });
});
