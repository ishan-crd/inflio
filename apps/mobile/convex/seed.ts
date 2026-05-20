import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Brand data matching static campaign data
const BRANDS_DATA = [
	{
		name: "Lumen Audio",
		handle: "lumenaudio",
		logoColors: ["#fde68a", "#451a03"],
		bio: "Premium audio brand crafting immersive sound experiences",
		category: "Tech",
		website: "https://lumenaudio.com",
	},
	{
		name: "Kavi Coffee Co.",
		handle: "kavicoffee",
		logoColors: ["#fed7aa", "#431407"],
		bio: "Specialty Indian coffee roasters, farm to cup",
		category: "Food & Bev",
		website: "https://kavicoffee.in",
	},
	{
		name: "Northform",
		handle: "northform.studio",
		logoColors: ["#ddd6fe", "#1e1b4b"],
		bio: "Minimalist fashion house, Mumbai",
		category: "Fashion",
		website: "https://northform.in",
	},
	{
		name: "Glide Mobility",
		handle: "rideglide",
		logoColors: ["#bef264", "#1a2e05"],
		bio: "Electric micro-mobility for Indian cities",
		category: "Auto",
		website: "https://rideglide.in",
	},
	{
		name: "Petal & Press",
		handle: "petalandpress",
		logoColors: ["#fecdd3", "#4c0519"],
		bio: "Clean beauty skincare, dermatologist approved",
		category: "Beauty",
		website: "https://petalandpress.in",
	},
	{
		name: "Forge Finance",
		handle: "forgefin",
		logoColors: ["#bae6fd", "#0c1f33"],
		bio: "Making personal finance simple for millennials",
		category: "Finance",
		website: "https://forgefin.com",
	},
	{
		name: "Halfmoon Kitchen",
		handle: "halfmoonkitchen",
		logoColors: ["#fde68a", "#422006"],
		bio: "Artisanal pantry essentials, handcrafted in Goa",
		category: "Food & Bev",
		website: "https://halfmoonkitchen.in",
	},
	{
		name: "Atlas Outdoors",
		handle: "atlas.outdoors",
		logoColors: ["#a7f3d0", "#022c22"],
		bio: "Performance gear tested in the Himalayas",
		category: "Outdoor",
		website: "https://atlasoutdoors.in",
	},
	{
		name: "Soko Stationery",
		handle: "sokostationery",
		logoColors: ["#e9d5ff", "#2e1065"],
		bio: "Thoughtful stationery for everyday creatives",
		category: "Lifestyle",
		website: "https://sokostationery.in",
	},
];

const CAMPAIGNS_DATA = [
	{
		brandHandle: "lumenaudio",
		title: "Launch reels for the new Lumen Pro 2 earbuds",
		brief:
			"Authentic 30\u201360s reel showcasing Lumen Pro 2 in a daily-life moment. Highlight ANC and 12-hour battery.",
		longBrief: [
			"Create an authentic 30-60 second Instagram Reel showcasing the Lumen Pro 2 earbuds in your daily routine.",
			"Must highlight the Active Noise Cancellation feature and 12-hour battery life naturally.",
			"Show at least one real-use scenario: commute, gym, work-from-home, or travel.",
			"Include the product unboxing or a clean product shot within the first 3 seconds.",
			"Use trending audio or original sound. No stock music.",
			"Caption must include #LumenPro2 and @lumenaudio. Tag us in the reel.",
		],
		platform: "Instagram",
		category: "Tech",
		rate: 240,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "10k",
		budget: "4.8L",
		deadline: "Jun 18",
		daysLeft: 37,
		spotsLeft: 12,
		totalSpots: 30,
		trending: true,
		color: "lime",
		tags: ["Reels", "Unboxing", "Lifestyle"],
		creatorsJoined: 18,
		bonus: { threshold: "50k views", amount: "\u20B92,000" },
		status: "active",
	},
	{
		brandHandle: "kavicoffee",
		title: "Morning ritual UGC for cold brew launch",
		brief:
			"Short-form video starring our cold brew bottle. Bonus payout for >50k views in first 72 hours.",
		longBrief: [
			"Film a short-form video featuring our Kavi Cold Brew bottle in your morning routine.",
			"Show the bottle prominently within the first 2 seconds.",
			"Capture the pour, the first sip, and your genuine reaction.",
			"Bonus payout of \u20B91,500 if reel crosses 50k views within 72 hours of posting.",
			"No script required \u2014 we want authentic, unpolished UGC.",
			"Tag @kavicoffee and use #KaviColdBrew.",
		],
		platform: "Instagram",
		category: "Food & Bev",
		rate: 180,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "5k",
		budget: "2.4L",
		deadline: "Jun 24",
		daysLeft: 43,
		spotsLeft: 6,
		totalSpots: 20,
		trending: true,
		color: "amber",
		tags: ["UGC", "Lifestyle"],
		creatorsJoined: 14,
		bonus: { threshold: "50k views in 72h", amount: "\u20B91,500" },
		status: "active",
	},
	{
		brandHandle: "northform.studio",
		title: "Studio-tour shorts for the SS26 collection",
		brief:
			"Behind-the-scenes shorts from our Mumbai studio. Quiet, cinematic tone preferred.",
		longBrief: [
			"Visit our Mumbai studio and create 2\u20133 YouTube Shorts capturing the SS26 design process.",
			"Focus on textures, fabrics, and the quiet, cinematic aesthetic of our workspace.",
			"No voiceover required \u2014 ambient sound and captions only.",
			"Each short should be 30\u201345 seconds. Vertical format.",
			"We\u2019ll provide studio access and a brief styling guide.",
			"Tag @northform.studio and use #NorthformSS26.",
		],
		platform: "YouTube",
		category: "Fashion",
		rate: 420,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "20k",
		budget: "8.2L",
		deadline: "Jul 02",
		daysLeft: 51,
		spotsLeft: 4,
		totalSpots: 10,
		trending: false,
		color: "violet",
		tags: ["Shorts", "Cinematic"],
		creatorsJoined: 6,
		bonus: { threshold: "100k views", amount: "\u20B95,000" },
		status: "active",
	},
	{
		brandHandle: "rideglide",
		title: "First-ride POV for the Glide G3 e-scooter",
		brief:
			"POV ride through your city. Hooks under 2s. Strong CTA to test-ride event.",
		longBrief: [
			"Record a first-person POV ride through your city on the Glide G3 e-scooter.",
			"Hook must land within the first 2 seconds \u2014 speed, scenery, or a surprising moment.",
			"Include a clear call-to-action for our upcoming test-ride events.",
			"60\u201390 seconds, vertical format. GoPro or phone mount preferred.",
			"Show real streets, traffic, and your genuine riding experience.",
			"Tag @rideglide and use #GlideG3 #FirstRide.",
		],
		platform: "TikTok",
		category: "Auto",
		rate: 310,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "25k",
		budget: "6.0L",
		deadline: "Jun 30",
		daysLeft: 49,
		spotsLeft: 9,
		totalSpots: 25,
		trending: true,
		color: "lime",
		tags: ["POV", "Outdoor"],
		creatorsJoined: 22,
		bonus: { threshold: "100k views", amount: "\u20B93,000" },
		status: "active",
	},
	{
		brandHandle: "petalandpress",
		title: "GRWM with our new clean-skin serum",
		brief:
			"Get-ready-with-me clip featuring the Hydra Veil serum. No filters, no over-editing.",
		longBrief: [
			"Create a GRWM (Get Ready With Me) reel featuring our Hydra Veil serum as the hero product.",
			"Show the full application process \u2014 no filters, no heavy editing.",
			"Must include a close-up of the product texture on skin.",
			"30\u201360 seconds. Natural lighting strongly preferred.",
			"Share one genuine observation about the product (texture, scent, absorption).",
			"Tag @petalandpress and use #HydraVeil #CleanSkin.",
		],
		platform: "Instagram",
		category: "Beauty",
		rate: 200,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "8k",
		budget: "3.0L",
		deadline: "Jun 21",
		daysLeft: 40,
		spotsLeft: 17,
		totalSpots: 40,
		trending: false,
		color: "rose",
		tags: ["GRWM", "Skincare"],
		creatorsJoined: 11,
		bonus: { threshold: "30k views", amount: "\u20B91,000" },
		status: "active",
	},
	{
		brandHandle: "forgefin",
		title: "60-second explainer: why your SIP isn\u2019t working",
		brief:
			"Educational short. Calm voiceover, on-screen captions. We\u2019ll provide the script outline.",
		longBrief: [
			"Create a 60-second educational YouTube Short explaining common SIP investing mistakes.",
			"We\u2019ll provide a script outline \u2014 you add your personality and delivery style.",
			"Calm, confident voiceover with on-screen captions/graphics.",
			"Must include our Forge Finance branding in the outro (assets provided).",
			"No clickbait \u2014 focus on genuine financial education.",
			"Tag @forgefin and use #ForgeFinance #SIPSmarter.",
		],
		platform: "YouTube",
		category: "Finance",
		rate: 520,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "15k",
		budget: "9.5L",
		deadline: "Jul 10",
		daysLeft: 59,
		spotsLeft: 3,
		totalSpots: 8,
		trending: false,
		color: "sky",
		tags: ["Explainer", "Voiceover"],
		creatorsJoined: 5,
		bonus: { threshold: "75k views", amount: "\u20B94,000" },
		status: "active",
	},
	{
		brandHandle: "halfmoonkitchen",
		title: "60s recipe reel using our miso paste",
		brief:
			"One recipe, one minute, one pan. Hero shot of the jar at the end.",
		longBrief: [
			"Cook one simple recipe using Halfmoon Miso Paste in under 60 seconds.",
			"One pan, one recipe \u2014 keep it simple and visually clean.",
			"End with a hero shot of the Halfmoon jar alongside the finished dish.",
			"Top-down or 45-degree angle preferred. Good lighting is a must.",
			"No voiceover needed \u2014 text overlays for ingredients/steps.",
			"Tag @halfmoonkitchen and use #HalfmoonMiso.",
		],
		platform: "Instagram",
		category: "Food & Bev",
		rate: 160,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "10k",
		budget: "1.8L",
		deadline: "Jun 16",
		daysLeft: 35,
		spotsLeft: 22,
		totalSpots: 50,
		trending: false,
		color: "amber",
		tags: ["Recipe", "Reels"],
		creatorsJoined: 9,
		bonus: { threshold: "40k views", amount: "\u20B91,200" },
		status: "active",
	},
	{
		brandHandle: "atlas.outdoors",
		title: "Trail-test the Atlas X1 jacket in the Himalayas",
		brief:
			"Field-test footage with weather details. Bonus payout for snow conditions.",
		longBrief: [
			"Take the Atlas X1 jacket on a real Himalayan trail and film your experience.",
			"Include weather conditions (rain, wind, snow) and how the jacket performs.",
			"2\u20133 minute YouTube video or 60s Short. Cinematic B-roll welcome.",
			"Bonus \u20B95,000 if footage includes snow or sub-zero conditions.",
			"Show the jacket\u2019s key features: waterproofing, breathability, pocket layout.",
			"Tag @atlas.outdoors and use #AtlasX1 #TrailTested.",
		],
		platform: "YouTube",
		category: "Outdoor",
		rate: 480,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "20k",
		budget: "7.6L",
		deadline: "Jul 18",
		daysLeft: 67,
		spotsLeft: 5,
		totalSpots: 12,
		trending: true,
		color: "sky",
		tags: ["Adventure", "Field-test"],
		creatorsJoined: 8,
		bonus: { threshold: "Snow footage", amount: "\u20B95,000" },
		status: "active",
	},
	{
		brandHandle: "sokostationery",
		title: "Desk-setup ASMR with our new notebook line",
		brief:
			"Cozy, ambient desk-setup video. Highlight the textured cover of the Soko Daily.",
		longBrief: [
			"Create an ASMR-style desk setup video featuring the Soko Daily notebook.",
			"Highlight the textured cover, lay-flat binding, and paper quality.",
			"Cozy, ambient vibe \u2014 soft lighting, gentle sounds, no talking required.",
			"30\u201360 seconds. Vertical format for TikTok.",
			"Include a writing/journaling moment with the notebook.",
			"Tag @sokostationery and use #SokoDaily #DeskSetup.",
		],
		platform: "TikTok",
		category: "Lifestyle",
		rate: 140,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "5k",
		budget: "1.2L",
		deadline: "Jun 14",
		daysLeft: 33,
		spotsLeft: 28,
		totalSpots: 60,
		trending: false,
		color: "violet",
		tags: ["ASMR", "Desk"],
		creatorsJoined: 7,
		bonus: { threshold: "25k views", amount: "\u20B9800" },
		status: "active",
	},
];

export const seedDatabase = mutation({
	args: {},
	handler: async (ctx) => {
		// Check if already seeded
		const existingCampaigns = await ctx.db.query("campaigns").first();
		if (existingCampaigns) {
			return { message: "Database already seeded", seeded: false };
		}

		// 1. Create brands
		const brandIdMap: Record<string, string> = {};
		for (const brand of BRANDS_DATA) {
			const id = await ctx.db.insert("brands", {
				...brand,
				accountStatus: "active",
				followers: "0",
				rating: "4.8",
				totalPaidOut: "\u20B90",
				responseTime: "< 24h",
			});
			brandIdMap[brand.handle] = id;
		}

		// 2. Create campaigns linked to brands
		for (const campaign of CAMPAIGNS_DATA) {
			const brandId = brandIdMap[campaign.brandHandle];
			if (!brandId) continue;
			const { brandHandle, ...campaignData } = campaign;
			await ctx.db.insert("campaigns", {
				...campaignData,
				// biome-ignore lint/suspicious/noExplicitAny: Convex Id type
				brandId: brandId as any,
			});
		}

		return {
			message: `Seeded ${BRANDS_DATA.length} brands and ${CAMPAIGNS_DATA.length} campaigns`,
			seeded: true,
		};
	},
});

export const clearAll = mutation({
	args: { confirm: v.string() },
	handler: async (ctx, args) => {
		if (args.confirm !== "DELETE_ALL") {
			return { message: "Pass confirm: 'DELETE_ALL' to confirm" };
		}

		const tables = [
			"campaigns",
			"brands",
			"applications",
			"submissions",
			"verifications",
			"lists",
		] as const;
		let total = 0;

		for (const table of tables) {
			const docs = await ctx.db.query(table).collect();
			for (const doc of docs) {
				await ctx.db.delete(doc._id);
				total++;
			}
		}

		return { message: `Deleted ${total} documents across ${tables.length} tables` };
	},
});
