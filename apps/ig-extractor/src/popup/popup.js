/**
 * Popup script — controls the extension popup UI.
 */

(function () {
  "use strict";

  // ─── DOM refs ───────────────────────────────────────────────
  const views = {
    notInstagram: document.getElementById("not-instagram"),
    ready: document.getElementById("ready"),
    extracting: document.getElementById("extracting"),
    results: document.getElementById("results"),
    error: document.getElementById("error"),
  };

  const profileAvatar = document.getElementById("profile-avatar");
  const profileName = document.getElementById("profile-name");
  const profileHandle = document.getElementById("profile-handle");
  const statFollowers = document.getElementById("stat-followers");
  const statFollowing = document.getElementById("stat-following");
  const statPosts = document.getElementById("stat-posts");

  const btnExtract = document.getElementById("btn-extract");
  const extractStatus = document.getElementById("extract-status");
  const progressFill = document.getElementById("progress-fill");
  const apiCount = document.getElementById("api-count");

  const resultStats = document.getElementById("result-stats");
  const btnCopy = document.getElementById("btn-copy");
  const btnDownload = document.getElementById("btn-download");
  const btnNew = document.getElementById("btn-new");
  const btnRetry = document.getElementById("btn-retry");
  const errorMsg = document.getElementById("error-msg");

  let currentTabId = null;
  let extractedData = null;
  let pollInterval = null;

  // ─── Show a specific view ──────────────────────────────────
  function showView(name) {
    Object.values(views).forEach((v) => {
      if (v) v.style.display = "none";
    });
    if (views[name]) views[name].style.display = "flex";
  }

  // ─── Format numbers ────────────────────────────────────────
  function formatNum(n) {
    if (n == null || isNaN(n)) return "—";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
  }

  // ─── Initialize ────────────────────────────────────────────
  async function init() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      showView("notInstagram");
      return;
    }

    currentTabId = tab.id;
    const url = tab.url || "";

    if (!url.includes("instagram.com")) {
      showView("notInstagram");
      return;
    }

    // Try to scrape profile info from the page
    try {
      const response = await chrome.tabs.sendMessage(currentTabId, {
        type: "SCRAPE_PROFILE",
      });

      if (response?.profile) {
        populateProfile(response.profile);
      }
    } catch (e) {
      // Content script not ready — try injecting it
      try {
        await chrome.scripting.executeScript({
          target: { tabId: currentTabId },
          files: ["src/content/index.js"],
        });
        // Retry after injection
        await new Promise((r) => setTimeout(r, 500));
        const response = await chrome.tabs.sendMessage(currentTabId, {
          type: "SCRAPE_PROFILE",
        });
        if (response?.profile) {
          populateProfile(response.profile);
        }
      } catch (e2) {
        // Ignore — show ready state with defaults
      }
    }

    showView("ready");
  }

  function populateProfile(profile) {
    if (profile.fullName) {
      profileName.textContent = profile.fullName;
    } else if (profile.username) {
      profileName.textContent = profile.username;
    }

    if (profile.username) {
      profileHandle.textContent = "@" + profile.username;
    }

    if (profile.followers != null) statFollowers.textContent = formatNum(profile.followers);
    if (profile.following != null) statFollowing.textContent = formatNum(profile.following);
    if (profile.posts != null) statPosts.textContent = formatNum(profile.posts);

    // Avatar — show first letter
    const initial = (profile.fullName || profile.username || "?").charAt(0).toUpperCase();
    profileAvatar.textContent = initial;
  }

  // ─── Extraction ────────────────────────────────────────────
  async function startExtraction() {
    showView("extracting");
    extractStatus.textContent = "Initializing...";
    progressFill.style.width = "5%";
    apiCount.textContent = "0";

    // Tell background to start capturing
    await chrome.runtime.sendMessage({
      type: "START_EXTRACTION",
      tabId: currentTabId,
    });

    // Tell content script to run extraction
    try {
      await chrome.tabs.sendMessage(currentTabId, {
        type: "TRIGGER_EXTRACTION",
      });
    } catch (e) {
      // Try injecting content script first
      try {
        await chrome.scripting.executeScript({
          target: { tabId: currentTabId },
          files: ["src/content/index.js"],
        });
        await new Promise((r) => setTimeout(r, 500));
        await chrome.tabs.sendMessage(currentTabId, {
          type: "TRIGGER_EXTRACTION",
        });
      } catch (e2) {
        showError("Could not connect to Instagram page. Try refreshing the page.");
        return;
      }
    }

    // Update progress status
    extractStatus.textContent = "Fetching profile data...";
    progressFill.style.width = "15%";

    // Poll for captured data
    let stableCount = 0;
    let lastCount = 0;

    pollInterval = setInterval(async () => {
      const result = await chrome.runtime.sendMessage({
        type: "GET_CAPTURED_DATA",
        tabId: currentTabId,
      });

      const count = result?.responses?.length || 0;
      apiCount.textContent = String(count);

      // Update progress and status based on count
      if (count <= 1) {
        extractStatus.textContent = "Fetching profile data...";
        progressFill.style.width = "20%";
      } else if (count <= 3) {
        extractStatus.textContent = "Loading reels...";
        progressFill.style.width = "40%";
      } else if (count <= 10) {
        extractStatus.textContent = "Fetching reel insights...";
        progressFill.style.width = "60%";
      } else {
        extractStatus.textContent = "Gathering audience data...";
        progressFill.style.width = Math.min(85, 60 + count).toFixed(0) + "%";
      }

      // Check if extraction is done (no new data for 3 seconds)
      if (count === lastCount && count > 0) {
        stableCount++;
        if (stableCount >= 6) {
          // 6 * 500ms = 3 seconds of no new data
          finishExtraction();
        }
      } else {
        stableCount = 0;
      }

      lastCount = count;
    }, 500);

    // Safety timeout — finish after 30 seconds regardless
    setTimeout(() => {
      if (pollInterval) {
        finishExtraction();
      }
    }, 30000);
  }

  async function finishExtraction() {
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }

    progressFill.style.width = "95%";
    extractStatus.textContent = "Processing data...";

    // Get all captured data
    const result = await chrome.runtime.sendMessage({
      type: "GET_CAPTURED_DATA",
      tabId: currentTabId,
    });

    const responses = result?.responses || [];

    if (responses.length === 0) {
      showError("No data was captured. Make sure you're on an Instagram profile page and you're logged in.");
      return;
    }

    // Parse with our parser
    extractedData = window.__inflio_parser.parseExtractionData(responses);

    progressFill.style.width = "100%";

    // Stop extraction
    await chrome.runtime.sendMessage({
      type: "STOP_EXTRACTION",
      tabId: currentTabId,
    });

    // Show results
    showResults();
  }

  function showResults() {
    showView("results");

    // Build result stats
    resultStats.innerHTML = "";

    if (extractedData.profile) {
      addResultStat("Profile", extractedData.profile.username || "Loaded");
    }

    if (extractedData.reels.length > 0) {
      addResultStat("Reels", String(extractedData.reels.length));
    }

    const reelsWithInsights = extractedData.reels.filter((r) => r.reach > 0 || r.impressions > 0).length;
    if (reelsWithInsights > 0) {
      addResultStat("With Insights", String(reelsWithInsights));
    }

    if (extractedData.accountInsights) {
      addResultStat("Account Insights", "Yes");
    }

    addResultStat("API Calls", String(extractedData.apiRequestsCaptured));
  }

  function addResultStat(label, value) {
    const el = document.createElement("div");
    el.className = "result-stat";
    el.innerHTML = `<strong>${value}</strong> ${label}`;
    resultStats.appendChild(el);
  }

  function showError(msg) {
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
    errorMsg.textContent = msg;
    showView("error");
  }

  // ─── Actions ───────────────────────────────────────────────
  function copyJSON() {
    if (!extractedData) return;
    const json = JSON.stringify(extractedData, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      showToast("Copied to clipboard!");
    });
  }

  function downloadJSON() {
    if (!extractedData) return;
    const json = JSON.stringify(extractedData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const username = extractedData.profile?.username || "instagram";
    const a = document.createElement("a");
    a.href = url;
    a.download = `inflio-${username}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function showToast(msg) {
    let toast = document.querySelector(".copied-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "copied-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  }

  async function resetExtraction() {
    extractedData = null;
    if (currentTabId) {
      await chrome.runtime.sendMessage({
        type: "CLEAR_DATA",
        tabId: currentTabId,
      });
    }
    init();
  }

  // ─── Event Listeners ──────────────────────────────────────
  btnExtract.addEventListener("click", startExtraction);
  btnCopy.addEventListener("click", copyJSON);
  btnDownload.addEventListener("click", downloadJSON);
  btnNew.addEventListener("click", resetExtraction);
  btnRetry.addEventListener("click", resetExtraction);

  // ─── Start ─────────────────────────────────────────────────
  init();
})();
