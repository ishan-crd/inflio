/**
 * Content script — injected into instagram.com pages.
 *
 * 1. Monkey-patches fetch() and XMLHttpRequest to intercept IG API responses
 * 2. Scrapes profile data from the page DOM
 * 3. Makes direct API calls to fetch reels + insights
 * 4. Sends all captured data back to the background script
 */

(function () {
  "use strict";

  // Avoid double-injection
  if (window.__inflio_injected) return;
  window.__inflio_injected = true;

  const IG_APP_ID = "936619743392459";

  // Extract CSRF token from cookies — required for POST requests
  function getCsrfToken() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : "";
  }

  function getIGHeaders(isPost = false) {
    const headers = {
      "x-ig-app-id": IG_APP_ID,
      "x-requested-with": "XMLHttpRequest",
    };
    if (isPost) {
      headers["x-csrftoken"] = getCsrfToken();
    }
    return headers;
  }

  // ─── Intercept fetch() ──────────────────────────────────────
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    try {
      const url = typeof args[0] === "string" ? args[0] : args[0]?.url || "";
      if (isInstagramAPI(url)) {
        const clone = response.clone();
        clone.text().then((body) => {
          sendCaptured(url, body);
        }).catch(() => {});
      }
    } catch (e) {
      // silently ignore
    }
    return response;
  };

  // ─── Intercept XMLHttpRequest ───────────────────────────────
  const XHROpen = XMLHttpRequest.prototype.open;
  const XHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._inflio_url = url;
    return XHROpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener("load", function () {
      try {
        if (isInstagramAPI(this._inflio_url)) {
          sendCaptured(this._inflio_url, this.responseText);
        }
      } catch (e) {
        // silently ignore
      }
    });
    return XHRSend.apply(this, args);
  };

  // ─── Helpers ────────────────────────────────────────────────

  function isInstagramAPI(url) {
    if (!url) return false;
    return (
      url.includes("/api/v1/") ||
      url.includes("/graphql") ||
      url.includes("i.instagram.com") ||
      (url.includes("/web/") && url.includes("instagram.com"))
    );
  }

  function sendCaptured(url, body) {
    try {
      let parsed = null;
      try {
        parsed = JSON.parse(body);
      } catch {
        // not JSON, store raw
      }
      chrome.runtime.sendMessage({
        type: "API_RESPONSE_CAPTURED",
        data: {
          url,
          timestamp: Date.now(),
          body: parsed || body,
          size: body?.length || 0,
        },
      });
    } catch (e) {
      // extension context may be invalidated
    }
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // Helper to make IG API calls and capture + return the response
  async function igFetch(url, options = {}) {
    const isPost = options.method === "POST";
    const defaultHeaders = getIGHeaders(isPost);
    const res = await originalFetch(url, {
      credentials: "include",
      ...options,
      headers: { ...defaultHeaders, ...(options.headers || {}) },
    });
    const text = await res.text();
    // Capture it
    const shortUrl = url.replace("https://www.instagram.com", "");
    sendCaptured(shortUrl, text);
    // Parse
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  // ─── Profile scraper (DOM) ────────────────────────────────

  function scrapeProfile() {
    const meta = {};

    // Try structured data
    try {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of scripts) {
        const data = JSON.parse(script.textContent);
        if (data["@type"] === "Person" || data["@type"] === "Organization") {
          meta.username = data.alternateName?.replace("@", "");
          meta.fullName = data.name;
          meta.bio = data.description;
        }
      }
    } catch (e) {}

    // Fallback: username from URL
    if (!meta.username) {
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      if (pathParts.length >= 1 && !["p", "reel", "reels", "explore", "direct", "accounts", "stories"].includes(pathParts[0])) {
        meta.username = pathParts[0];
      }
    }

    // Meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && !meta.fullName) {
      const match = ogTitle.content?.match(/^(.+?)\s*\(@/);
      if (match) meta.fullName = match[1];
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && !meta.bio) {
      meta.bio = ogDesc.content;
    }

    // Follower counts from page text
    const statElements = document.querySelectorAll("header li, header span");
    for (const el of statElements) {
      const text = el.textContent?.trim() || "";
      const followerMatch = text.match(/([\d,.]+[KkMm]?)\s*followers?/i);
      const followingMatch = text.match(/([\d,.]+[KkMm]?)\s*following/i);
      const postsMatch = text.match(/([\d,.]+[KkMm]?)\s*posts?/i);
      if (followerMatch) meta.followers = parseCount(followerMatch[1]);
      if (followingMatch) meta.following = parseCount(followingMatch[1]);
      if (postsMatch) meta.posts = parseCount(postsMatch[1]);
    }

    return meta;
  }

  function parseCount(str) {
    if (!str) return 0;
    str = str.replace(/,/g, "");
    const lower = str.toLowerCase();
    if (lower.endsWith("k")) return parseFloat(lower) * 1000;
    if (lower.endsWith("m")) return parseFloat(lower) * 1000000;
    return parseInt(str, 10) || 0;
  }

  // ─── Extraction orchestrator ────────────────────────────────

  async function runExtraction() {
    const profile = scrapeProfile();
    const username = profile.username || window.location.pathname.split("/").filter(Boolean)[0];

    if (!username) {
      chrome.runtime.sendMessage({
        type: "EXTRACTION_PROGRESS",
        data: { status: "error", error: "Could not determine username" },
      });
      return;
    }

    // Step 1: Fetch profile info via API
    console.log("[Inflio] Starting extraction for", username);
    let userId = null;

    try {
      const userData = await igFetch(
        `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`
      );
      userId = userData?.data?.user?.id || userData?.user?.id || userData?.user?.pk;
      console.log("[Inflio] Got userId:", userId);
    } catch (e) {
      console.warn("[Inflio] Failed to fetch profile:", e);
    }

    if (!userId) {
      console.warn("[Inflio] No userId found, extraction will be limited");
      return;
    }

    // Step 2: Fetch reels
    let reelMediaIds = [];
    try {
      const reelsData = await igFetch(
        "https://www.instagram.com/api/v1/clips/user/",
        {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
          body: `target_user_id=${userId}&page_size=50&include_feed_video=true`,
        }
      );

      console.log("[Inflio] Reels raw response:", JSON.stringify(reelsData).slice(0, 500));

      console.log("[Inflio] Reels response keys:", reelsData ? Object.keys(reelsData) : "null");

      // Extract media IDs — handle multiple response shapes
      const items = reelsData?.items || [];
      for (const item of items) {
        const media = item?.media || item;
        const id = media?.pk || media?.id;
        if (id) reelMediaIds.push(String(id));
      }

      // Also check paging_info for more reels
      if (reelsData?.paging_info?.more_available && reelMediaIds.length > 0) {
        try {
          const moreReels = await igFetch(
            "https://www.instagram.com/api/v1/clips/user/",
            {
              method: "POST",
              headers: {
                "content-type": "application/x-www-form-urlencoded",
              },
              body: `target_user_id=${userId}&page_size=50&include_feed_video=true&max_id=${reelsData.paging_info.max_id}`,
            }
          );
          const moreItems = moreReels?.items || [];
          for (const item of moreItems) {
            const media = item?.media || item;
            const id = media?.pk || media?.id;
            if (id && !reelMediaIds.includes(String(id))) {
              reelMediaIds.push(String(id));
            }
          }
        } catch (e) {
          console.warn("[Inflio] Failed to fetch more reels:", e);
        }
      }

      console.log("[Inflio] Found", reelMediaIds.length, "reels");
    } catch (e) {
      console.warn("[Inflio] Failed to fetch reels:", e);
    }

    // Step 3: Fetch per-reel insights
    // Try the media_organic insights API for each reel
    for (const mediaId of reelMediaIds.slice(0, 30)) {
      try {
        const data = await igFetch(
          `https://www.instagram.com/api/v1/insights/media_organic/${mediaId}/summary/?ig_sig_key_version=4`
        );
        if (data) {
          console.log(`[Inflio] Reel ${mediaId} insights:`, data?.status || "ok", Object.keys(data));
        }
      } catch (e) {
        console.warn(`[Inflio] insights failed for ${mediaId}:`, e);
      }
      await sleep(400);
    }

    // Step 4: Fetch account-level insights
    const now = Math.floor(Date.now() / 1000);
    const sevenDaysAgo = now - 7 * 86400;

    const accountEndpoints = [
      `https://www.instagram.com/api/v1/insights/account_organic/summary/?ig_sig_key_version=4`,
      `https://www.instagram.com/api/v1/insights/account_organic/summary/?ig_sig_key_version=4&since=${sevenDaysAgo}&until=${now}`,
      `https://i.instagram.com/api/v1/insights/account_organic/summary/?ig_sig_key_version=4`,
    ];

    for (const endpoint of accountEndpoints) {
      try {
        const data = await igFetch(endpoint);
        console.log("[Inflio] Account insights from", endpoint.split("?")[0], ":", data ? Object.keys(data) : "null");
        if (data && data.status !== "fail" && !data.error) {
          break; // got valid data
        }
      } catch (e) {
        // try next
      }
    }

    // Step 5: Try fetching content publishing data (for additional metrics)
    try {
      await igFetch(
        `https://www.instagram.com/api/v1/users/${userId}/info/`
      );
    } catch (e) {}

    console.log("[Inflio] Extraction complete");

    // Notify popup
    chrome.runtime.sendMessage({
      type: "EXTRACTION_PROGRESS",
      data: { status: "profile_scraped", profile },
    });
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "TRIGGER_EXTRACTION") {
      runExtraction().then(() => sendResponse({ ok: true })).catch((e) => {
        console.error("[Inflio] Extraction error:", e);
        sendResponse({ error: e.message });
      });
      return true;
    }
    if (msg.type === "SCRAPE_PROFILE") {
      sendResponse({ profile: scrapeProfile() });
    }
  });
})();
