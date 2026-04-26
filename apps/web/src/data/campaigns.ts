export interface Campaign {
	id: number;
	brand: string;
	brandHandle: string;
	title: string;
	brief: string;
	platform: string;
	category: string;
	rate: number;
	currency: string;
	perViews: string;
	minViews: string;
	budget: string;
	deadline: string;
	spotsLeft: number;
	totalSpots: number;
	trending: boolean;
	color: string;
	tags: string[];
	creatorsJoined: number;
}

export const CAMPAIGNS: Campaign[] = [
	{
		id: 1,
		brand: "Lumen Audio",
		brandHandle: "@lumenaudio",
		title: "Launch reels for the new Lumen Pro 2 earbuds",
		brief:
			"Authentic 30\u201360s reel showcasing Lumen Pro 2 in a daily-life moment. Highlight ANC and 12-hour battery.",
		platform: "Instagram",
		category: "Tech",
		rate: 240,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "10k",
		budget: "4.8L",
		deadline: "May 18",
		spotsLeft: 12,
		totalSpots: 30,
		trending: true,
		color: "lime",
		tags: ["Reels", "Unboxing", "Lifestyle"],
		creatorsJoined: 18,
	},
	{
		id: 2,
		brand: "Kavi Coffee Co.",
		brandHandle: "@kavicoffee",
		title: "Morning ritual UGC for cold brew launch",
		brief:
			"Short-form video starring our cold brew bottle. Bonus payout for >50k views in first 72 hours.",
		platform: "Instagram",
		category: "Food & Bev",
		rate: 180,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "5k",
		budget: "2.4L",
		deadline: "May 24",
		spotsLeft: 6,
		totalSpots: 20,
		trending: true,
		color: "amber",
		tags: ["UGC", "Lifestyle"],
		creatorsJoined: 14,
	},
	{
		id: 3,
		brand: "Northform",
		brandHandle: "@northform.studio",
		title: "Studio-tour shorts for the SS26 collection",
		brief:
			"Behind-the-scenes shorts from our Mumbai studio. Quiet, cinematic tone preferred.",
		platform: "YouTube",
		category: "Fashion",
		rate: 420,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "20k",
		budget: "8.2L",
		deadline: "Jun 02",
		spotsLeft: 4,
		totalSpots: 10,
		trending: false,
		color: "violet",
		tags: ["Shorts", "Cinematic"],
		creatorsJoined: 6,
	},
	{
		id: 4,
		brand: "Glide Mobility",
		brandHandle: "@rideglide",
		title: "First-ride POV for the Glide G3 e-scooter",
		brief:
			"POV ride through your city. Hooks under 2s. Strong CTA to test-ride event.",
		platform: "TikTok",
		category: "Auto",
		rate: 310,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "25k",
		budget: "6.0L",
		deadline: "May 30",
		spotsLeft: 9,
		totalSpots: 25,
		trending: true,
		color: "lime",
		tags: ["POV", "Outdoor"],
		creatorsJoined: 22,
	},
	{
		id: 5,
		brand: "Petal & Press",
		brandHandle: "@petalandpress",
		title: "GRWM with our new clean-skin serum",
		brief:
			"Get-ready-with-me clip featuring the Hydra Veil serum. No filters, no over-editing.",
		platform: "Instagram",
		category: "Beauty",
		rate: 200,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "8k",
		budget: "3.0L",
		deadline: "May 21",
		spotsLeft: 17,
		totalSpots: 40,
		trending: false,
		color: "rose",
		tags: ["GRWM", "Skincare"],
		creatorsJoined: 11,
	},
	{
		id: 6,
		brand: "Forge Finance",
		brandHandle: "@forgefin",
		title: "60-second explainer: why your SIP isn\u2019t working",
		brief:
			"Educational short. Calm voiceover, on-screen captions. We\u2019ll provide the script outline.",
		platform: "YouTube",
		category: "Finance",
		rate: 520,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "15k",
		budget: "9.5L",
		deadline: "Jun 10",
		spotsLeft: 3,
		totalSpots: 8,
		trending: false,
		color: "sky",
		tags: ["Explainer", "Voiceover"],
		creatorsJoined: 5,
	},
	{
		id: 7,
		brand: "Halfmoon Kitchen",
		brandHandle: "@halfmoonkitchen",
		title: "60s recipe reel using our miso paste",
		brief: "One recipe, one minute, one pan. Hero shot of the jar at the end.",
		platform: "Instagram",
		category: "Food & Bev",
		rate: 160,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "10k",
		budget: "1.8L",
		deadline: "May 16",
		spotsLeft: 22,
		totalSpots: 50,
		trending: false,
		color: "amber",
		tags: ["Recipe", "Reels"],
		creatorsJoined: 9,
	},
	{
		id: 8,
		brand: "Atlas Outdoors",
		brandHandle: "@atlas.outdoors",
		title: "Trail-test the Atlas X1 jacket in the Himalayas",
		brief:
			"Field-test footage with weather details. Bonus payout for snow conditions.",
		platform: "YouTube",
		category: "Outdoor",
		rate: 480,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "20k",
		budget: "7.6L",
		deadline: "Jun 18",
		spotsLeft: 5,
		totalSpots: 12,
		trending: true,
		color: "sky",
		tags: ["Adventure", "Field-test"],
		creatorsJoined: 8,
	},
	{
		id: 9,
		brand: "Soko Stationery",
		brandHandle: "@sokostationery",
		title: "Desk-setup ASMR with our new notebook line",
		brief:
			"Cozy, ambient desk-setup video. Highlight the textured cover of the Soko Daily.",
		platform: "TikTok",
		category: "Lifestyle",
		rate: 140,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "5k",
		budget: "1.2L",
		deadline: "May 14",
		spotsLeft: 28,
		totalSpots: 60,
		trending: false,
		color: "violet",
		tags: ["ASMR", "Desk"],
		creatorsJoined: 7,
	},
];

export const PLATFORMS = ["All", "Instagram", "YouTube", "TikTok"];
export const CATEGORIES = [
	"All",
	"Tech",
	"Fashion",
	"Beauty",
	"Food & Bev",
	"Finance",
	"Outdoor",
	"Auto",
	"Lifestyle",
];
export const SORTS = ["Trending", "Highest paying", "Newest", "Ending soon"];

export const ACCENT_MAP: Record<
	string,
	{ from: string; to: string; chip: string; text: string }
> = {
	lime: {
		from: "rgba(190, 242, 100, 0.22)",
		to: "rgba(190, 242, 100, 0.04)",
		chip: "#bef264",
		text: "#d9f99d",
	},
	amber: {
		from: "rgba(251, 191, 36, 0.22)",
		to: "rgba(251, 191, 36, 0.04)",
		chip: "#fbbf24",
		text: "#fde68a",
	},
	violet: {
		from: "rgba(167, 139, 250, 0.22)",
		to: "rgba(167, 139, 250, 0.04)",
		chip: "#a78bfa",
		text: "#ddd6fe",
	},
	rose: {
		from: "rgba(251, 113, 133, 0.22)",
		to: "rgba(251, 113, 133, 0.04)",
		chip: "#fb7185",
		text: "#fecdd3",
	},
	sky: {
		from: "rgba(125, 211, 252, 0.22)",
		to: "rgba(125, 211, 252, 0.04)",
		chip: "#7dd3fc",
		text: "#bae6fd",
	},
};

export const BRAND_COLORS: Record<string, [string, string]> = {
	"Lumen Audio": ["#fde68a", "#451a03"],
	"Kavi Coffee Co.": ["#fed7aa", "#431407"],
	Northform: ["#ddd6fe", "#1e1b4b"],
	"Glide Mobility": ["#bef264", "#1a2e05"],
	"Petal & Press": ["#fecdd3", "#4c0519"],
	"Forge Finance": ["#bae6fd", "#0c1f33"],
	"Halfmoon Kitchen": ["#fde68a", "#422006"],
	"Atlas Outdoors": ["#a7f3d0", "#022c22"],
	"Soko Stationery": ["#e9d5ff", "#2e1065"],
};
