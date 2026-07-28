import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";

/* ────────────────────────────────────────────────────────────
   Inflio demo seed data
   ─────────────────────────────────────────────────────────────
   This file owns ALL demo content: brands, campaigns and creators.
   `seedDatabase`  — idempotent, only seeds when empty (safe to call anytime)
   `resetAndSeed`  — wipes every table then reseeds clean data (used by the
                     nightly cron in convex/crons.ts and callable via
                     `npx convex run seed:resetAndSeed`)
   `clearAll`      — manual escape hatch, wipes content tables
   ──────────────────────────────────────────────────────────── */

// ── formatting helpers ─────────────────────────────────────────
function fmt(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
	if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
	return String(n);
}

function rupees(n: number): string {
	if (n >= 100_000) return `₹${(n / 100_000).toFixed(1).replace(/\.0$/, "")}L`;
	if (n >= 1_000) return `₹${Math.round(n / 1_000)}K`;
	return `₹${n}`;
}

// deterministic 7-point sparkline so reseeds are stable (no Math.random)
function spark(base: number, seed: number): number[] {
	const pts: number[] = [];
	for (let i = 0; i < 7; i++) {
		const wobble = ((seed * 7 + i * 13) % 11) - 4; // -4..6
		pts.push(Math.max(1, Math.round(base * (0.82 + i * 0.03) + wobble)));
	}
	return pts;
}

// ── brands ─────────────────────────────────────────────────────
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
	{
		name: "Volt Fitness",
		handle: "voltfitness",
		logoColors: ["#fecaca", "#450a0a"],
		bio: "Home fitness gear and coaching for busy people",
		category: "Fitness",
		website: "https://voltfitness.in",
	},
	{
		name: "Nomad Republic",
		handle: "nomadrepublic",
		logoColors: ["#a5f3fc", "#083344"],
		bio: "Travel packs and gear for the modern nomad",
		category: "Travel",
		website: "https://nomadrepublic.in",
	},
	{
		name: "Pixel Play",
		handle: "pixelplay",
		logoColors: ["#c4b5fd", "#2e1065"],
		bio: "Gaming peripherals engineered for esports",
		category: "Gaming",
		website: "https://pixelplay.gg",
	},
];

// ── campaigns ──────────────────────────────────────────────────
const CAMPAIGNS_DATA = [
	{
		brandHandle: "lumenaudio",
		title: "Launch reels for the new Lumen Pro 2 earbuds",
		brief:
			"Authentic 30–60s reel showcasing Lumen Pro 2 in a daily-life moment. Highlight ANC and 12-hour battery.",
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
		currency: "₹",
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
		bonus: { threshold: "50k views", amount: "₹2,000" },
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
			"Bonus payout of ₹1,500 if reel crosses 50k views within 72 hours of posting.",
			"No script required — we want authentic, unpolished UGC.",
			"Tag @kavicoffee and use #KaviColdBrew.",
		],
		platform: "Instagram",
		category: "Food & Bev",
		rate: 180,
		currency: "₹",
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
		bonus: { threshold: "50k views in 72h", amount: "₹1,500" },
		status: "active",
	},
	{
		brandHandle: "northform.studio",
		title: "Studio-tour shorts for the SS26 collection",
		brief:
			"Behind-the-scenes shorts from our Mumbai studio. Quiet, cinematic tone preferred.",
		longBrief: [
			"Visit our Mumbai studio and create 2–3 YouTube Shorts capturing the SS26 design process.",
			"Focus on textures, fabrics, and the quiet, cinematic aesthetic of our workspace.",
			"No voiceover required — ambient sound and captions only.",
			"Each short should be 30–45 seconds. Vertical format.",
			"We'll provide studio access and a brief styling guide.",
			"Tag @northform.studio and use #NorthformSS26.",
		],
		platform: "YouTube",
		category: "Fashion",
		rate: 420,
		currency: "₹",
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
		bonus: { threshold: "100k views", amount: "₹5,000" },
		status: "active",
	},
	{
		brandHandle: "rideglide",
		title: "First-ride POV for the Glide G3 e-scooter",
		brief:
			"POV ride through your city. Hooks under 2s. Strong CTA to test-ride event.",
		longBrief: [
			"Record a first-person POV ride through your city on the Glide G3 e-scooter.",
			"Hook must land within the first 2 seconds — speed, scenery, or a surprising moment.",
			"Include a clear call-to-action for our upcoming test-ride events.",
			"60–90 seconds, vertical format. GoPro or phone mount preferred.",
			"Show real streets, traffic, and your genuine riding experience.",
			"Tag @rideglide and use #GlideG3 #FirstRide.",
		],
		platform: "YouTube",
		category: "Auto",
		rate: 310,
		currency: "₹",
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
		bonus: { threshold: "100k views", amount: "₹3,000" },
		status: "active",
	},
	{
		brandHandle: "petalandpress",
		title: "GRWM with our new clean-skin serum",
		brief:
			"Get-ready-with-me clip featuring the Hydra Veil serum. No filters, no over-editing.",
		longBrief: [
			"Create a GRWM (Get Ready With Me) reel featuring our Hydra Veil serum as the hero product.",
			"Show the full application process — no filters, no heavy editing.",
			"Must include a close-up of the product texture on skin.",
			"30–60 seconds. Natural lighting strongly preferred.",
			"Share one genuine observation about the product (texture, scent, absorption).",
			"Tag @petalandpress and use #HydraVeil #CleanSkin.",
		],
		platform: "Instagram",
		category: "Beauty",
		rate: 200,
		currency: "₹",
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
		bonus: { threshold: "30k views", amount: "₹1,000" },
		status: "active",
	},
	{
		brandHandle: "forgefin",
		title: "60-second explainer: why your SIP isn't working",
		brief:
			"Educational short. Calm voiceover, on-screen captions. We'll provide the script outline.",
		longBrief: [
			"Create a 60-second educational YouTube Short explaining common SIP investing mistakes.",
			"We'll provide a script outline — you add your personality and delivery style.",
			"Calm, confident voiceover with on-screen captions/graphics.",
			"Must include our Forge Finance branding in the outro (assets provided).",
			"No clickbait — focus on genuine financial education.",
			"Tag @forgefin and use #ForgeFinance #SIPSmarter.",
		],
		platform: "YouTube",
		category: "Finance",
		rate: 520,
		currency: "₹",
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
		bonus: { threshold: "75k views", amount: "₹4,000" },
		status: "active",
	},
	{
		brandHandle: "halfmoonkitchen",
		title: "60s recipe reel using our miso paste",
		brief: "One recipe, one minute, one pan. Hero shot of the jar at the end.",
		longBrief: [
			"Cook one simple recipe using Halfmoon Miso Paste in under 60 seconds.",
			"One pan, one recipe — keep it simple and visually clean.",
			"End with a hero shot of the Halfmoon jar alongside the finished dish.",
			"Top-down or 45-degree angle preferred. Good lighting is a must.",
			"No voiceover needed — text overlays for ingredients/steps.",
			"Tag @halfmoonkitchen and use #HalfmoonMiso.",
		],
		platform: "Instagram",
		category: "Food & Bev",
		rate: 160,
		currency: "₹",
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
		bonus: { threshold: "40k views", amount: "₹1,200" },
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
			"2–3 minute YouTube video or 60s Short. Cinematic B-roll welcome.",
			"Bonus ₹5,000 if footage includes snow or sub-zero conditions.",
			"Show the jacket's key features: waterproofing, breathability, pocket layout.",
			"Tag @atlas.outdoors and use #AtlasX1 #TrailTested.",
		],
		platform: "YouTube",
		category: "Travel",
		rate: 480,
		currency: "₹",
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
		bonus: { threshold: "Snow footage", amount: "₹5,000" },
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
			"Cozy, ambient vibe — soft lighting, gentle sounds, no talking required.",
			"30–60 seconds. Vertical format.",
			"Include a writing/journaling moment with the notebook.",
			"Tag @sokostationery and use #SokoDaily #DeskSetup.",
		],
		platform: "Instagram",
		category: "Lifestyle",
		rate: 140,
		currency: "₹",
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
		bonus: { threshold: "25k views", amount: "₹800" },
		status: "active",
	},
	{
		brandHandle: "voltfitness",
		title: "30-day transformation with the Volt resistance kit",
		brief:
			"Document a real week of workouts using the Volt kit. Honest, no fitness-model gatekeeping.",
		longBrief: [
			"Show 3–4 real workouts using the Volt resistance kit over a week.",
			"Keep it honest and relatable — beginners welcome, no gatekeeping.",
			"Demonstrate at least two exercises with proper form.",
			"45–90 seconds. Energetic edit, trending audio allowed.",
			"Mention the adjustable resistance and the free coaching app.",
			"Tag @voltfitness and use #VoltKit #30DayVolt.",
		],
		platform: "Instagram",
		category: "Fitness",
		rate: 220,
		currency: "₹",
		perViews: "1k",
		minViews: "8k",
		budget: "3.4L",
		deadline: "Jul 05",
		daysLeft: 54,
		spotsLeft: 14,
		totalSpots: 35,
		trending: true,
		color: "rose",
		tags: ["Fitness", "Transformation"],
		creatorsJoined: 16,
		bonus: { threshold: "60k views", amount: "₹2,500" },
		status: "active",
	},
	{
		brandHandle: "nomadrepublic",
		title: "Pack-with-me for a 5-day carry-on trip",
		brief:
			"Show how the Nomad 40L pack fits everything for a 5-day trip. One bag, no checked luggage.",
		longBrief: [
			"Film a pack-with-me for a 5-day trip using only the Nomad 40L carry-on pack.",
			"Highlight the compartment layout, laptop sleeve, and expandable main.",
			"Show the pack on your back and passing as airline carry-on.",
			"60–120 seconds. Clean, well-lit, satisfying packing shots.",
			"Share one honest pro and one thing you'd change.",
			"Tag @nomadrepublic and use #PackWithNomad.",
		],
		platform: "YouTube",
		category: "Travel",
		rate: 300,
		currency: "₹",
		perViews: "1k",
		minViews: "15k",
		budget: "5.2L",
		deadline: "Jul 12",
		daysLeft: 61,
		spotsLeft: 10,
		totalSpots: 22,
		trending: false,
		color: "cyan",
		tags: ["Travel", "Pack-with-me"],
		creatorsJoined: 12,
		bonus: { threshold: "80k views", amount: "₹3,500" },
		status: "active",
	},
	{
		brandHandle: "pixelplay",
		title: "Ranked grind with the Pixel Play Vortex mouse",
		brief:
			"Gameplay + first impressions of the Vortex wireless mouse during a ranked session.",
		longBrief: [
			"Record a ranked/competitive session using the Pixel Play Vortex wireless mouse.",
			"Give genuine first impressions: weight, sensor, click feel, battery.",
			"Overlay a couple of highlight clips where the mouse made a difference.",
			"90–180 seconds YouTube video or a punchy 60s Short.",
			"Mention the 8k polling rate and 90-hour battery.",
			"Tag @pixelplay and use #VortexMouse #PixelPlay.",
		],
		platform: "YouTube",
		category: "Gaming",
		rate: 360,
		currency: "₹",
		perViews: "1k",
		minViews: "20k",
		budget: "6.8L",
		deadline: "Jul 08",
		daysLeft: 57,
		spotsLeft: 7,
		totalSpots: 18,
		trending: true,
		color: "fuchsia",
		tags: ["Gaming", "Review"],
		creatorsJoined: 13,
		bonus: { threshold: "100k views", amount: "₹4,000" },
		status: "active",
	},
];

/* ────────────────────────────────────────────────────────────
   creators — compact specs expanded by makeCreator()
   ──────────────────────────────────────────────────────────── */
type Sec = { name: string; followers: number };
type CreatorSpec = {
	name: string;
	handle: string;
	city: string;
	category: string;
	tier: "Micro" | "Mid" | "Macro";
	primary: "Instagram" | "YouTube" | "X";
	followers: number;
	monthlyViews: number;
	engagement: number;
	avgRate: number;
	completedDeals: number;
	rating: number;
	ratingCount: number;
	accent: string;
	avatar: [string, string];
	tags: string[];
	bio: string;
	secondary?: Sec[];
	trending?: boolean;
	verified?: boolean;
	exclusive?: boolean;
	available?: boolean;
	responseTime?: string;
	genderF?: number; // audience skew, default 50
};

const CREATOR_SPECS: CreatorSpec[] = [
	{
		name: "Aanya Verma", handle: "aanya.shoots", city: "Mumbai", category: "Fashion",
		tier: "Mid", primary: "Instagram", followers: 412_000, monthlyViews: 2_800_000,
		engagement: 7.4, avgRate: 28_000, completedDeals: 41, rating: 4.9, ratingCount: 38,
		accent: "amber", avatar: ["#fde68a", "#7c2d12"], tags: ["Fashion", "GRWM", "Lifestyle"],
		bio: "Everyday fashion & GRWM, Mumbai", trending: true, verified: true, genderF: 78,
		secondary: [{ name: "YouTube", followers: 96_000 }], responseTime: "~2h",
	},
	{
		name: "Rohan Iyer", handle: "rohaneats", city: "Bengaluru", category: "Food",
		tier: "Mid", primary: "YouTube", followers: 640_000, monthlyViews: 5_100_000,
		engagement: 6.1, avgRate: 42_000, completedDeals: 57, rating: 4.8, ratingCount: 52,
		accent: "orange", avatar: ["#fed7aa", "#7c2d12"], tags: ["Food", "Recipe", "Reviews"],
		bio: "Street food & home recipes, Bengaluru", verified: true, genderF: 46,
		secondary: [{ name: "Instagram", followers: 210_000 }], responseTime: "~4h",
	},
	{
		name: "Simran Kaur", handle: "simran.glow", city: "Delhi", category: "Beauty",
		tier: "Mid", primary: "Instagram", followers: 388_000, monthlyViews: 2_400_000,
		engagement: 8.2, avgRate: 26_000, completedDeals: 63, rating: 4.9, ratingCount: 60,
		accent: "rose", avatar: ["#fecdd3", "#7f1d1d"], tags: ["Beauty", "Skincare", "GRWM"],
		bio: "Clean beauty & honest skincare, Delhi", trending: true, verified: true, genderF: 84,
		responseTime: "~1h",
	},
	{
		name: "Kabir Menon", handle: "kabirbuilds", city: "Pune", category: "Tech",
		tier: "Mid", primary: "YouTube", followers: 520_000, monthlyViews: 3_900_000,
		engagement: 5.6, avgRate: 38_000, completedDeals: 34, rating: 4.7, ratingCount: 31,
		accent: "lime", avatar: ["#d9f99d", "#365314"], tags: ["Tech", "Reviews", "Unboxing"],
		bio: "Gadget reviews & unboxings, Pune", verified: true, genderF: 32,
		secondary: [{ name: "X", followers: 74_000 }], responseTime: "~6h",
	},
	{
		name: "Meera Nair", handle: "meerawanders", city: "Kochi", category: "Travel",
		tier: "Mid", primary: "Instagram", followers: 296_000, monthlyViews: 1_900_000,
		engagement: 7.9, avgRate: 24_000, completedDeals: 29, rating: 4.8, ratingCount: 27,
		accent: "cyan", avatar: ["#a5f3fc", "#155e75"], tags: ["Travel", "Vlogs", "Pack-with-me"],
		bio: "Slow travel across India, Kochi", trending: true, verified: true, genderF: 63,
		secondary: [{ name: "YouTube", followers: 132_000 }],
	},
	{
		name: "Arjun Sethi", handle: "arjunlifts", city: "Chandigarh", category: "Fitness",
		tier: "Mid", primary: "Instagram", followers: 452_000, monthlyViews: 3_100_000,
		engagement: 6.8, avgRate: 30_000, completedDeals: 48, rating: 4.8, ratingCount: 44,
		accent: "emerald", avatar: ["#a7f3d0", "#065f46"], tags: ["Fitness", "Transformation"],
		bio: "Beginner-friendly fitness, Chandigarh", verified: true, genderF: 41,
	},
	{
		name: "Nikhil Rao", handle: "nikhilplays", city: "Hyderabad", category: "Gaming",
		tier: "Macro", primary: "YouTube", followers: 1_280_000, monthlyViews: 9_400_000,
		engagement: 5.2, avgRate: 65_000, completedDeals: 72, rating: 4.9, ratingCount: 68,
		accent: "fuchsia", avatar: ["#f5d0fe", "#701a75"], tags: ["Gaming", "Esports", "Review"],
		bio: "Ranked grinds & gear reviews, Hyderabad", trending: true, verified: true, genderF: 22,
		secondary: [{ name: "Instagram", followers: 340_000 }], responseTime: "~3h",
	},
	{
		name: "Ishita Bose", handle: "ishita.reads", city: "Kolkata", category: "Education",
		tier: "Mid", primary: "YouTube", followers: 358_000, monthlyViews: 2_200_000,
		engagement: 6.4, avgRate: 27_000, completedDeals: 22, rating: 4.7, ratingCount: 20,
		accent: "sky", avatar: ["#bae6fd", "#0c4a6e"], tags: ["Education", "Explainer", "Finance"],
		bio: "Money & productivity explainers, Kolkata", verified: true, genderF: 55,
	},
	{
		name: "Dev Malhotra", handle: "devdaily", city: "Delhi", category: "Comedy",
		tier: "Macro", primary: "Instagram", followers: 1_020_000, monthlyViews: 8_600_000,
		engagement: 9.1, avgRate: 58_000, completedDeals: 51, rating: 4.8, ratingCount: 47,
		accent: "amber", avatar: ["#fde68a", "#78350f"], tags: ["Comedy", "Skits", "Lifestyle"],
		bio: "Relatable daily-life skits, Delhi", trending: true, verified: true, genderF: 49,
		secondary: [{ name: "YouTube", followers: 410_000 }], responseTime: "~5h",
	},
	{
		name: "Tara Shetty", handle: "tara.styles", city: "Mumbai", category: "Fashion",
		tier: "Micro", primary: "Instagram", followers: 84_000, monthlyViews: 620_000,
		engagement: 10.4, avgRate: 9_000, completedDeals: 18, rating: 4.9, ratingCount: 17,
		accent: "violet", avatar: ["#ddd6fe", "#4c1d95"], tags: ["Fashion", "Thrift", "Styling"],
		bio: "Thrift styling & outfit ideas, Mumbai", verified: false, genderF: 81,
	},
	{
		name: "Aditya Kulkarni", handle: "adi.codes", city: "Pune", category: "Tech",
		tier: "Micro", primary: "X", followers: 62_000, monthlyViews: 410_000,
		engagement: 4.8, avgRate: 8_000, completedDeals: 14, rating: 4.6, ratingCount: 12,
		accent: "sky", avatar: ["#bae6fd", "#0c4a6e"], tags: ["Tech", "Coding", "SaaS"],
		bio: "Dev tools & indie SaaS threads, Pune", verified: false, genderF: 28,
	},
	{
		name: "Zoya Khan", handle: "zoya.glow", city: "Lucknow", category: "Beauty",
		tier: "Micro", primary: "Instagram", followers: 118_000, monthlyViews: 890_000,
		engagement: 9.6, avgRate: 12_000, completedDeals: 26, rating: 4.9, ratingCount: 24,
		accent: "rose", avatar: ["#fecdd3", "#831843"], tags: ["Beauty", "Makeup", "Affordable"],
		bio: "Affordable makeup looks, Lucknow", trending: true, verified: false, genderF: 88,
	},
	{
		name: "Vivaan Reddy", handle: "vivaan.rides", city: "Hyderabad", category: "Tech",
		tier: "Mid", primary: "YouTube", followers: 274_000, monthlyViews: 1_700_000,
		engagement: 5.9, avgRate: 22_000, completedDeals: 19, rating: 4.7, ratingCount: 18,
		accent: "lime", avatar: ["#d9f99d", "#3f6212"], tags: ["Auto", "EV", "Reviews"],
		bio: "EV & mobility reviews, Hyderabad", verified: true, genderF: 30,
	},
	{
		name: "Priya Deshmukh", handle: "priyacooks", city: "Nagpur", category: "Food",
		tier: "Micro", primary: "Instagram", followers: 96_000, monthlyViews: 740_000,
		engagement: 8.8, avgRate: 10_000, completedDeals: 21, rating: 4.8, ratingCount: 19,
		accent: "orange", avatar: ["#fed7aa", "#7c2d12"], tags: ["Food", "Recipe", "Regional"],
		bio: "Maharashtrian home recipes, Nagpur", verified: false, genderF: 72,
	},
	{
		name: "Sana Qureshi", handle: "sana.sings", city: "Delhi", category: "Music",
		tier: "Mid", primary: "Instagram", followers: 486_000, monthlyViews: 4_200_000,
		engagement: 8.4, avgRate: 34_000, completedDeals: 33, rating: 4.9, ratingCount: 30,
		accent: "fuchsia", avatar: ["#f5d0fe", "#86198f"], tags: ["Music", "Covers", "Vocals"],
		bio: "Indie covers & original vocals, Delhi", trending: true, verified: true, genderF: 66,
		secondary: [{ name: "YouTube", followers: 220_000 }],
	},
	{
		name: "Karan Bhatia", handle: "karanhikes", city: "Manali", category: "Travel",
		tier: "Micro", primary: "YouTube", followers: 142_000, monthlyViews: 1_050_000,
		engagement: 7.1, avgRate: 14_000, completedDeals: 16, rating: 4.8, ratingCount: 15,
		accent: "teal", avatar: ["#99f6e4", "#115e59"], tags: ["Travel", "Adventure", "Gear"],
		bio: "Himalayan treks & gear tests, Manali", verified: false, genderF: 38,
	},
	{
		name: "Ananya Pillai", handle: "ananya.moves", city: "Chennai", category: "Fitness",
		tier: "Micro", primary: "Instagram", followers: 74_000, monthlyViews: 560_000,
		engagement: 11.2, avgRate: 8_500, completedDeals: 12, rating: 4.9, ratingCount: 11,
		accent: "emerald", avatar: ["#a7f3d0", "#064e3b"], tags: ["Fitness", "Yoga", "Wellness"],
		bio: "Yoga & mobility for desk workers, Chennai", trending: true, verified: false, genderF: 74,
	},
	{
		name: "Farhan Ali", handle: "farhan.frames", city: "Jaipur", category: "Comedy",
		tier: "Mid", primary: "Instagram", followers: 332_000, monthlyViews: 2_600_000,
		engagement: 9.4, avgRate: 25_000, completedDeals: 28, rating: 4.7, ratingCount: 26,
		accent: "amber", avatar: ["#fde68a", "#713f12"], tags: ["Comedy", "Skits", "Local"],
		bio: "Small-town humour & skits, Jaipur", verified: true, genderF: 44,
	},
	{
		name: "Riya Kapoor", handle: "riya.decor", city: "Gurugram", category: "Fashion",
		tier: "Micro", primary: "Instagram", followers: 108_000, monthlyViews: 820_000,
		engagement: 8.1, avgRate: 11_000, completedDeals: 20, rating: 4.8, ratingCount: 18,
		accent: "violet", avatar: ["#ddd6fe", "#5b21b6"], tags: ["Home & Decor", "DIY", "Lifestyle"],
		bio: "Rental-friendly home makeovers, Gurugram", verified: false, genderF: 69,
	},
	{
		name: "Manav Gupta", handle: "manav.money", city: "Mumbai", category: "Education",
		tier: "Macro", primary: "YouTube", followers: 1_540_000, monthlyViews: 11_200_000,
		engagement: 5.4, avgRate: 78_000, completedDeals: 44, rating: 4.9, ratingCount: 41,
		accent: "sky", avatar: ["#bae6fd", "#0c4a6e"], tags: ["Finance", "Education", "Explainer"],
		bio: "Personal finance, simplified, Mumbai", trending: true, verified: true, genderF: 37,
		secondary: [{ name: "Instagram", followers: 520_000 }], responseTime: "~8h",
	},
	{
		name: "Neha Joshi", handle: "neha.paints", city: "Ahmedabad", category: "Education",
		tier: "Micro", primary: "YouTube", followers: 128_000, monthlyViews: 940_000,
		engagement: 6.9, avgRate: 12_500, completedDeals: 15, rating: 4.7, ratingCount: 14,
		accent: "teal", avatar: ["#99f6e4", "#134e4a"], tags: ["Education", "Art", "Tutorials"],
		bio: "Watercolour & art tutorials, Ahmedabad", verified: false, genderF: 71,
	},
	{
		name: "Aryan Chopra", handle: "aryan.games", city: "Bengaluru", category: "Gaming",
		tier: "Mid", primary: "YouTube", followers: 592_000, monthlyViews: 4_800_000,
		engagement: 6.6, avgRate: 40_000, completedDeals: 37, rating: 4.8, ratingCount: 35,
		accent: "fuchsia", avatar: ["#f5d0fe", "#701a75"], tags: ["Gaming", "Reviews", "Setup"],
		bio: "PC builds & game reviews, Bengaluru", verified: true, genderF: 25,
	},
	{
		name: "Diya Menon", handle: "diya.brews", city: "Kochi", category: "Food",
		tier: "Micro", primary: "Instagram", followers: 88_000, monthlyViews: 610_000,
		engagement: 9.9, avgRate: 9_500, completedDeals: 17, rating: 4.9, ratingCount: 16,
		accent: "orange", avatar: ["#fed7aa", "#7c2d12"], tags: ["Food", "Coffee", "UGC"],
		bio: "Coffee & cafe UGC, Kochi", trending: true, verified: false, genderF: 64,
	},
];

function makeCreator(spec: CreatorSpec, idx: number) {
	const growth = `+${(spec.engagement / 2).toFixed(1)}%`;
	const platforms = [
		{
			name: spec.primary,
			handle: `@${spec.handle}`,
			followers: fmt(spec.followers),
			growth,
			primary: true,
		},
		...(spec.secondary ?? []).map((s) => ({
			name: s.name,
			handle: `@${spec.handle}`,
			followers: fmt(s.followers),
			growth: `+${(spec.engagement / 3).toFixed(1)}%`,
			primary: false,
		})),
	];

	const genderF = spec.genderF ?? 50;
	const ig = rupees(spec.avgRate);
	const yt = rupees(Math.round(spec.avgRate * 1.8));
	const tt = rupees(Math.round(spec.avgRate * 0.75));

	return {
		name: spec.name,
		handle: spec.handle,
		accountStatus: "active",
		avatarColor: spec.avatar,
		location: spec.city,
		bio: spec.bio,
		longBio: [
			`${spec.tags.slice(0, 2).join(" & ")} creator based in ${spec.city}.`,
			`${spec.completedDeals} brand collaborations completed with a ${spec.rating.toFixed(1)}★ average rating.`,
			`Best known for ${spec.tags[spec.tags.length - 1].toLowerCase()} content that consistently over-delivers on views.`,
		],
		primaryPlatform: spec.primary,
		platforms,
		followers: spec.followers,
		monthlyViews: spec.monthlyViews,
		engagement: spec.engagement,
		avgRate: spec.avgRate,
		currency: "₹",
		category: spec.category,
		tags: spec.tags,
		completedDeals: spec.completedDeals,
		trending: spec.trending ?? false,
		tier: spec.tier,
		verified: spec.verified ?? false,
		spark: spark(Math.max(6, Math.round(spec.monthlyViews / 200_000)), idx + 1),
		timezone: "IST",
		responseTime: spec.responseTime ?? "~12h",
		rating: spec.rating,
		ratingCount: spec.ratingCount,
		available: spec.available ?? true,
		exclusive: spec.exclusive ?? false,
		color: spec.accent,
		audience: {
			genderF,
			genderM: 100 - genderF,
			ageBuckets: [
				{ label: "18-24", pct: 42 },
				{ label: "25-34", pct: 38 },
				{ label: "35+", pct: 20 },
			],
			topGeo: [
				{ city: spec.city, pct: 34 },
				{ city: "Mumbai", pct: 18 },
				{ city: "Delhi", pct: 15 },
			],
			interests: spec.tags,
		},
		rates: [
			{ kind: "Reel / Short", ig, yt, tt },
			{
				kind: "Story",
				ig: rupees(Math.round(spec.avgRate * 0.35)),
				yt: "—",
				tt: "—",
			},
			{
				kind: "Dedicated video",
				ig: rupees(Math.round(spec.avgRate * 1.4)),
				yt: rupees(Math.round(spec.avgRate * 2.6)),
				tt: rupees(Math.round(spec.avgRate * 1.1)),
			},
		],
	};
}

/* ────────────────────────────────────────────────────────────
   core seed routine (shared by seedDatabase + resetAndSeed)
   ──────────────────────────────────────────────────────────── */
// biome-ignore lint/suspicious/noExplicitAny: Convex ctx typing
async function insertSeedData(ctx: any) {
	// 1. brands
	const brandIdMap: Record<string, string> = {};
	for (const brand of BRANDS_DATA) {
		const id = await ctx.db.insert("brands", {
			...brand,
			accountStatus: "active",
			followers: "0",
			rating: "4.8",
			totalPaidOut: "₹0",
			responseTime: "< 24h",
		});
		brandIdMap[brand.handle] = id;
	}

	// 2. campaigns linked to brands
	for (const campaign of CAMPAIGNS_DATA) {
		const brandId = brandIdMap[campaign.brandHandle];
		if (!brandId) continue;
		const { brandHandle, ...campaignData } = campaign;
		await ctx.db.insert("campaigns", { ...campaignData, brandId });
	}

	// 3. creators
	let i = 0;
	for (const spec of CREATOR_SPECS) {
		await ctx.db.insert("creators", makeCreator(spec, i));
		i++;
	}

	return {
		brands: BRANDS_DATA.length,
		campaigns: CAMPAIGNS_DATA.length,
		creators: CREATOR_SPECS.length,
	};
}

// biome-ignore lint/suspicious/noExplicitAny: Convex ctx typing
async function wipeAll(ctx: any) {
	const tables = [
		"campaigns",
		"brands",
		"creators",
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
	return total;
}

/* ────────────────────────────────────────────────────────────
   public / internal entry points
   ──────────────────────────────────────────────────────────── */

// Idempotent — only seeds if the DB is empty. Safe to call anytime.
export const seedDatabase = mutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query("campaigns").first();
		const existingCreator = await ctx.db.query("creators").first();
		if (existing && existingCreator) {
			return { message: "Database already seeded", seeded: false };
		}
		// If partially seeded (e.g. campaigns but no creators), reset for a clean state.
		if (existing || existingCreator) {
			await wipeAll(ctx);
		}
		const counts = await insertSeedData(ctx);
		return {
			message: `Seeded ${counts.brands} brands, ${counts.campaigns} campaigns, ${counts.creators} creators`,
			seeded: true,
			...counts,
		};
	},
});

// Wipes every content table then reseeds clean demo data.
// Called nightly by convex/crons.ts and manually via:
//   npx convex run seed:resetAndSeed
export const resetAndSeed = internalMutation({
	args: {},
	handler: async (ctx) => {
		const deleted = await wipeAll(ctx);
		const counts = await insertSeedData(ctx);
		return {
			message: `Reset complete — deleted ${deleted} docs, reseeded ${counts.brands} brands / ${counts.campaigns} campaigns / ${counts.creators} creators`,
			...counts,
		};
	},
});

export const clearAll = mutation({
	args: { confirm: v.string() },
	handler: async (ctx, args) => {
		if (args.confirm !== "DELETE_ALL") {
			return { message: "Pass confirm: 'DELETE_ALL' to confirm" };
		}
		const total = await wipeAll(ctx);
		return { message: `Deleted ${total} documents` };
	},
});
