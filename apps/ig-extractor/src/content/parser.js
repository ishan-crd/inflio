/**
 * Parses captured Instagram API responses into structured analytics data.
 */

function parseExtractionData(capturedResponses) {
	const result = {
		profile: null,
		reels: [],
		accountInsights: null,
		extractedAt: new Date().toISOString(),
		apiRequestsCaptured: capturedResponses.length,
		apiEndpoints: [...new Set(capturedResponses.map((r) => r.url))],
		rawDebug: [], // include raw response summaries for debugging
	};

	for (const resp of capturedResponses) {
		const { url, body } = resp;
		if (!body || typeof body !== "object") continue;

		// Log what we got for debugging
		result.rawDebug.push({
			url,
			status: body?.status,
			message: body?.message,
			keys: Object.keys(body).slice(0, 10),
			hasItems: !!body?.items,
			itemsCount: body?.items?.length,
		});

		try {
			// Profile info
			if (url.includes("web_profile_info")) {
				result.profile = parseProfileInfo(body);
			}

			// Reels list from clips/user
			if (url.includes("/clips/user/")) {
				const reels = parseReelsList(body);
				for (const reel of reels) {
					if (!result.reels.find((r) => r.mediaId === reel.mediaId)) {
						result.reels.push(reel);
					}
				}
			}

			// Individual reel insights
			if (url.includes("/insights/media_organic/")) {
				const mediaId = url.match(/media_organic\/(\d+)/)?.[1];
				if (mediaId) {
					const insights = parseMediaInsights(body, mediaId);
					const existing = result.reels.find((r) => r.mediaId === mediaId);
					if (existing) {
						Object.assign(existing, insights);
					} else {
						result.reels.push(insights);
					}
				}
			}

			// Account-level insights
			if (
				url.includes("/insights/account_organic/") ||
				url.includes("/insights/creator/") ||
				url.includes("/insights/account/")
			) {
				const parsed = parseAccountInsights(body);
				if (result.accountInsights) {
					result.accountInsights = { ...result.accountInsights, ...parsed };
				} else {
					result.accountInsights = parsed;
				}
			}

			// User info endpoint (additional profile data)
			if (url.includes("/users/") && url.includes("/info/")) {
				if (body?.user) {
					const u = body.user;
					if (!result.profile) result.profile = {};
					if (u.follower_count) result.profile.followers = u.follower_count;
					if (u.following_count) result.profile.following = u.following_count;
					if (u.media_count) result.profile.posts = u.media_count;
				}
			}

			// GraphQL responses (fallback)
			if (url.includes("/graphql") && body?.data) {
				parseGraphQL(body.data, result);
			}
		} catch (e) {
			console.warn("[Inflio Parser] Error parsing response:", url, e);
		}
	}

	return result;
}

function parseProfileInfo(data) {
	const user = data?.data?.user || data?.user || {};
	return {
		username: user.username || "",
		fullName: user.full_name || "",
		bio: user.biography || "",
		profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url || "",
		followers: user.edge_followed_by?.count ?? user.follower_count ?? 0,
		following: user.edge_follow?.count ?? user.following_count ?? 0,
		posts: user.edge_owner_to_timeline_media?.count ?? user.media_count ?? 0,
		isVerified: user.is_verified || false,
		isBusinessAccount:
			user.is_business_account || user.is_professional_account || false,
		category: user.category_name || user.category || null,
		externalUrl: user.external_url || null,
		id: user.id || user.pk || null,
	};
}

function parseReelsList(data) {
	// Handle multiple response formats
	const items = data?.items || [];
	const reels = [];

	for (const item of items) {
		const media = item.media || item;
		const pk = media.pk || media.id;
		if (!pk) continue;

		reels.push({
			mediaId: String(pk),
			shortcode: media.code || "",
			caption: media.caption?.text || "",
			coverUrl: media.image_versions2?.candidates?.[0]?.url || "",
			timestamp: media.taken_at || 0,
			duration: media.video_duration || 0,
			plays: media.play_count || media.video_play_count || 0,
			likes: media.like_count || 0,
			comments: media.comment_count || 0,
			shares: media.reshare_count || 0,
			saves: media.save_count || 0,
			reach: 0,
			impressions: 0,
		});
	}

	return reels;
}

function parseMediaInsights(data, mediaId) {
	const metrics = {};

	// The response might be wrapped in various ways
	const root = data?.data || data;

	// Handle the organic insights format (direct fields)
	if (root?.reach) metrics.reach = extractMetricValue(root.reach);
	if (root?.impressions)
		metrics.impressions = extractMetricValue(root.impressions);
	if (root?.engagement)
		metrics.engagement = extractMetricValue(root.engagement);
	if (root?.saved) metrics.saves = extractMetricValue(root.saved);
	if (root?.shares) metrics.shares = extractMetricValue(root.shares);
	if (root?.video_views) metrics.plays = extractMetricValue(root.video_views);
	if (root?.likes) metrics.likes = extractMetricValue(root.likes);
	if (root?.comments) metrics.comments = extractMetricValue(root.comments);
	if (root?.profile_visits)
		metrics.profileVisits = extractMetricValue(root.profile_visits);
	if (root?.follows) metrics.follows = extractMetricValue(root.follows);

	// Handle nested metrics array format
	if (Array.isArray(root?.metrics)) {
		for (const m of root.metrics) {
			const name = m.name || m.id;
			const val = extractMetricValue(m);
			if (name === "reach") metrics.reach = val;
			if (name === "impressions") metrics.impressions = val;
			if (name === "plays" || name === "video_views") metrics.plays = val;
			if (name === "likes") metrics.likes = val;
			if (name === "comments") metrics.comments = val;
			if (name === "shares") metrics.shares = val;
			if (name === "saved") metrics.saves = val;
			if (name === "profile_visits") metrics.profileVisits = val;
			if (name === "follows") metrics.follows = val;
		}
	}

	// Handle inline_insights_node format (from GraphQL)
	if (root?.inline_insights_node) {
		const node = root.inline_insights_node;
		if (node.metrics?.impression_count)
			metrics.impressions = node.metrics.impression_count;
		if (node.metrics?.reach_count) metrics.reach = node.metrics.reach_count;
		if (node.metrics?.profile_visits_count)
			metrics.profileVisits = node.metrics.profile_visits_count;
	}

	return {
		mediaId,
		...metrics,
	};
}

function parseAccountInsights(data) {
	const insights = {};
	const root = data?.data || data;

	if (root?.summary) {
		const s = root.summary;
		insights.accountsReached7d = extractMetricValue(
			s.accounts_reached_7d || s.reach_7d || s.accounts_reached,
		);
		insights.accountsReached30d = extractMetricValue(
			s.accounts_reached_30d || s.reach_30d,
		);
		insights.accountsEngaged7d = extractMetricValue(
			s.accounts_engaged_7d || s.engagement_7d || s.accounts_engaged,
		);
		insights.accountsEngaged30d = extractMetricValue(
			s.accounts_engaged_30d || s.engagement_30d,
		);
		insights.totalFollowers = extractMetricValue(
			s.total_followers || s.follower_count || s.followers_count,
		);
	}

	// Handle metrics array
	if (Array.isArray(root?.metrics || root?.organic_metrics)) {
		for (const m of root.metrics || root.organic_metrics) {
			const name = m.name || m.id || m.metric_type;
			const val = extractMetricValue(m);
			if (name?.includes("reach")) insights.accountsReached7d = val;
			if (name?.includes("engaged") || name?.includes("engagement"))
				insights.accountsEngaged7d = val;
			if (name?.includes("follower") && name?.includes("count"))
				insights.totalFollowers = val;
			if (name?.includes("impression")) insights.totalImpressions = val;
		}
	}

	// Direct fields
	if (root?.followers_count) insights.totalFollowers = root.followers_count;
	if (root?.reach) insights.accountsReached7d = extractMetricValue(root.reach);
	if (root?.engagement)
		insights.accountsEngaged7d = extractMetricValue(root.engagement);
	if (root?.impressions)
		insights.totalImpressions = extractMetricValue(root.impressions);
	if (root?.accountsReached7d)
		insights.accountsReached7d = root.accountsReached7d;
	if (root?.accountsEngaged7d)
		insights.accountsEngaged7d = root.accountsEngaged7d;
	if (root?.totalFollowers) insights.totalFollowers = root.totalFollowers;

	// Demographic breakdowns
	if (root?.gender || root?.audience_gender) {
		insights.followerGender = (root.gender || root.audience_gender).map(
			(g) => ({
				key: g.key || g.gender,
				percentage: g.value || g.percentage || 0,
			}),
		);
	}

	if (root?.age || root?.audience_age) {
		insights.followerAge = (root.age || root.audience_age).map((a) => ({
			range: a.key || a.range || a.bucket,
			percentage: a.value || a.percentage || 0,
		}));
	}

	if (root?.top_cities || root?.audience_city) {
		insights.followerTopCities = (root.top_cities || root.audience_city).map(
			(c) => ({
				city: c.key || c.name || c.city,
				percentage: c.value || c.percentage || 0,
			}),
		);
	}

	if (root?.top_countries || root?.audience_country) {
		insights.followerTopCountries = (
			root.top_countries || root.audience_country
		).map((c) => ({
			country: c.key || c.name || c.country,
			percentage: c.value || c.percentage || 0,
		}));
	}

	return insights;
}

function parseGraphQL(data, result) {
	// Handle xdt_api__v1__clips__user__connection_v2 (reels)
	if (data?.xdt_api__v1__clips__user__connection_v2) {
		const edges = data.xdt_api__v1__clips__user__connection_v2.edges || [];
		for (const edge of edges) {
			const media = edge.node?.media;
			if (!media) continue;
			const reel = {
				mediaId: String(media.pk || media.id || ""),
				shortcode: media.code || "",
				caption: media.caption?.text || "",
				coverUrl: media.image_versions2?.candidates?.[0]?.url || "",
				timestamp: media.taken_at || 0,
				duration: media.video_duration || 0,
				plays: media.play_count || 0,
				likes: media.like_count || 0,
				comments: media.comment_count || 0,
				shares: 0,
				saves: 0,
				reach: 0,
				impressions: 0,
			};
			if (!result.reels.find((r) => r.mediaId === reel.mediaId)) {
				result.reels.push(reel);
			}
		}
	}

	// Handle user profile from GraphQL
	if (data?.user && data.user.username) {
		if (!result.profile) {
			result.profile = parseProfileInfo({ data: { user: data.user } });
		}
	}
}

function extractMetricValue(metric) {
	if (metric == null) return 0;
	if (typeof metric === "number") return metric;
	if (typeof metric === "object") {
		if (metric.value != null) return extractMetricValue(metric.value);
		if (metric.count != null) return metric.count;
		if (metric.total_value != null) return metric.total_value;
		if (metric.results?.[0]?.total_value != null)
			return metric.results[0].total_value;
	}
	const num = Number(metric);
	return isNaN(num) ? 0 : num;
}

// Export for use in popup
if (typeof window !== "undefined") {
	window.__inflio_parser = { parseExtractionData };
}
