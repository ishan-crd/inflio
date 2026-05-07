/**
 * Background service worker
 * Intercepts Instagram API responses and stores raw data for parsing.
 */

const capturedResponses = new Map(); // tabId -> responses[]
const extractionActive = new Map(); // tabId -> boolean

// Listen for messages from popup/content scripts
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	const tabId = sender.tab?.id || msg.tabId;

	switch (msg.type) {
		case "START_EXTRACTION":
			extractionActive.set(msg.tabId, true);
			capturedResponses.set(msg.tabId, []);
			sendResponse({ ok: true });
			break;

		case "STOP_EXTRACTION":
			extractionActive.set(msg.tabId, false);
			sendResponse({ ok: true });
			break;

		case "GET_CAPTURED_DATA":
			sendResponse({
				responses: capturedResponses.get(msg.tabId) || [],
			});
			break;

		case "CLEAR_DATA":
			capturedResponses.delete(msg.tabId);
			extractionActive.delete(msg.tabId);
			sendResponse({ ok: true });
			break;

		case "API_RESPONSE_CAPTURED":
			if (extractionActive.get(tabId)) {
				const existing = capturedResponses.get(tabId) || [];
				existing.push(msg.data);
				capturedResponses.set(tabId, existing);
			}
			sendResponse({ ok: true });
			break;

		default:
			sendResponse({ error: "Unknown message type" });
	}

	return true; // keep channel open for async
});

// Clean up when tab closes
chrome.tabs.onRemoved.addListener((tabId) => {
	capturedResponses.delete(tabId);
	extractionActive.delete(tabId);
});
