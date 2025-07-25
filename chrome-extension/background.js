chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "postoptimaAnalyze",
    title: "Analyze with PostOptima AI",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "postoptimaAnalyze") {
    chrome.storage.local.get("token", async (data) => {
      const token = data.token;
      const post = info.selectionText;

      const res = await fetch("https://postoptima-ai.vercel.app/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postContent: post, platform: "X" }),
      });

      const result = await res.json();
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "PostOptima Result",
        message: `Score: ${result.algorithm_score}, Engage: ${result.engagement_prediction}%`,
      });
    });
  }
});
