export interface Creator {
	id: number;
	name: string;
	handle: string;
	avatarColor: [string, string];
	location: string;
	bio: string;
	primaryPlatform: string;
	platforms: Record<string, string>;
	followers: number;
	monthlyViews: number;
	engagement: number;
	avgRate: number;
	category: string;
	tags: string[];
	completedDeals: number;
	trending: boolean;
	tier: string;
	verified: boolean;
	spark: number[];
}

export const CREATORS: Creator[] = [
	{
		id: 1,
		name: "Aanya Verma",
		handle: "@aanya.shoots",
		avatarColor: ["#fde68a", "#7c2d12"],
		location: "Mumbai",
		bio: "Cinematic fashion reels & street style. Worked with 38 indie labels.",
		primaryPlatform: "Instagram",
		platforms: { Instagram: "412K", YouTube: "82K" },
		followers: 412000,
		monthlyViews: 6800000,
		engagement: 7.8,
		avgRate: 280,
		category: "Fashion",
		tags: ["Reels", "Street", "GRWM"],
		completedDeals: 38,
		trending: true,
		tier: "Mid",
		verified: true,
		spark: [3, 5, 4, 6, 8, 7, 9],
	},
	{
		id: 2,
		name: "Rohan Sethi",
		handle: "@rohansetsbeats",
		avatarColor: ["#bae6fd", "#0c1f33"],
		location: "Bengaluru",
		bio: "Tech reviewer. Honest, slow takes. No sponsored fluff.",
		primaryPlatform: "YouTube",
		platforms: { YouTube: "1.2M", Instagram: "180K" },
		followers: 1200000,
		monthlyViews: 18400000,
		engagement: 5.4,
		avgRate: 480,
		category: "Tech",
		tags: ["Reviews", "Long-form"],
		completedDeals: 24,
		trending: false,
		tier: "Macro",
		verified: true,
		spark: [4, 4, 5, 6, 6, 7, 8],
	},
	{
		id: 3,
		name: "Tara Iyer",
		handle: "@tarainthekitchen",
		avatarColor: ["#fed7aa", "#451a03"],
		location: "Chennai",
		bio: "60-second recipes with one pan, one mood. South-Indian-first.",
		primaryPlatform: "Instagram",
		platforms: { Instagram: "286K", TikTok: "94K" },
		followers: 286000,
		monthlyViews: 4200000,
		engagement: 9.2,
		avgRate: 220,
		category: "Food",
		tags: ["Recipes", "Reels"],
		completedDeals: 51,
		trending: true,
		tier: "Mid",
		verified: true,
		spark: [5, 6, 6, 8, 9, 9, 10],
	},
	{
		id: 4,
		name: "Kabir Joshi",
		handle: "@kabirrides",
		avatarColor: ["#bef264", "#1a2e05"],
		location: "Delhi",
		bio: "POV motovlogs. Long roads, short edits. RE & Triumph regular.",
		primaryPlatform: "YouTube",
		platforms: { YouTube: "640K", Instagram: "210K" },
		followers: 640000,
		monthlyViews: 9100000,
		engagement: 6.7,
		avgRate: 360,
		category: "Auto",
		tags: ["POV", "Travel"],
		completedDeals: 19,
		trending: true,
		tier: "Mid",
		verified: true,
		spark: [6, 5, 7, 8, 7, 9, 9],
	},
	{
		id: 5,
		name: "Ishaan Kapoor",
		handle: "@ishaan.lifts",
		avatarColor: ["#fecaca", "#450a0a"],
		location: "Pune",
		bio: "Strength coaching. Form > volume. Cert. NSCA-CSCS.",
		primaryPlatform: "Instagram",
		platforms: { Instagram: "94K", YouTube: "22K" },
		followers: 94000,
		monthlyViews: 1800000,
		engagement: 11.4,
		avgRate: 140,
		category: "Fitness",
		tags: ["Coaching", "Reels"],
		completedDeals: 27,
		trending: false,
		tier: "Micro",
		verified: true,
		spark: [4, 6, 7, 9, 10, 11, 11],
	},
	{
		id: 6,
		name: "Naina Bhatt",
		handle: "@nainacleanskin",
		avatarColor: ["#fecdd3", "#4c0519"],
		location: "Hyderabad",
		bio: "Dermat-backed skincare reviews. No filters, real textures.",
		primaryPlatform: "Instagram",
		platforms: { Instagram: "528K", YouTube: "140K" },
		followers: 528000,
		monthlyViews: 7600000,
		engagement: 8.1,
		avgRate: 320,
		category: "Beauty",
		tags: ["GRWM", "Reviews"],
		completedDeals: 44,
		trending: false,
		tier: "Mid",
		verified: true,
		spark: [6, 7, 7, 8, 8, 8, 9],
	},
	{
		id: 7,
		name: "Devansh Mehra",
		handle: "@devansh.codes",
		avatarColor: ["#a7f3d0", "#022c22"],
		location: "Bengaluru",
		bio: "Practical AI tutorials and dev-tool deep-dives. Shipped at 2 startups.",
		primaryPlatform: "YouTube",
		platforms: { YouTube: "318K", Instagram: "56K" },
		followers: 318000,
		monthlyViews: 5200000,
		engagement: 4.6,
		avgRate: 540,
		category: "Tech",
		tags: ["Tutorials", "Long-form"],
		completedDeals: 12,
		trending: true,
		tier: "Mid",
		verified: true,
		spark: [3, 4, 5, 5, 6, 7, 9],
	},
	{
		id: 8,
		name: "Meher Khurana",
		handle: "@mehermoves",
		avatarColor: ["#ddd6fe", "#1e1b4b"],
		location: "Mumbai",
		bio: "Choreographer. Trending audio, before they trend.",
		primaryPlatform: "TikTok",
		platforms: { TikTok: "2.1M", Instagram: "740K" },
		followers: 2100000,
		monthlyViews: 38000000,
		engagement: 12.8,
		avgRate: 620,
		category: "Dance",
		tags: ["Choreo", "Trends"],
		completedDeals: 61,
		trending: true,
		tier: "Macro",
		verified: true,
		spark: [7, 8, 8, 10, 11, 12, 13],
	},
	{
		id: 9,
		name: "Arjun Pillai",
		handle: "@arjun.outsides",
		avatarColor: ["#a5f3fc", "#083344"],
		location: "Manali",
		bio: "Trail runner & solo trekker. Field-tested kit. Slow content.",
		primaryPlatform: "YouTube",
		platforms: { YouTube: "186K", Instagram: "104K" },
		followers: 186000,
		monthlyViews: 2900000,
		engagement: 7.3,
		avgRate: 260,
		category: "Outdoor",
		tags: ["Cinematic", "Field-test"],
		completedDeals: 16,
		trending: false,
		tier: "Mid",
		verified: false,
		spark: [4, 5, 5, 6, 6, 7, 7],
	},
	{
		id: 10,
		name: "Saira Qureshi",
		handle: "@sairareadsbooks",
		avatarColor: ["#e9d5ff", "#2e1065"],
		location: "Lucknow",
		bio: "Slow book reviews & quiet aesthetic shorts. Penguin India regular.",
		primaryPlatform: "Instagram",
		platforms: { Instagram: "72K", YouTube: "18K" },
		followers: 72000,
		monthlyViews: 980000,
		engagement: 9.8,
		avgRate: 110,
		category: "Lifestyle",
		tags: ["BookTok", "Aesthetic"],
		completedDeals: 22,
		trending: false,
		tier: "Micro",
		verified: true,
		spark: [3, 4, 5, 6, 7, 8, 9],
	},
	{
		id: 11,
		name: "Vivaan Rao",
		handle: "@vivaaninvests",
		avatarColor: ["#bfdbfe", "#172554"],
		location: "Mumbai",
		bio: "Personal finance for first-jobbers. SEBI-registered RIA.",
		primaryPlatform: "YouTube",
		platforms: { YouTube: "880K", Instagram: "320K" },
		followers: 880000,
		monthlyViews: 12400000,
		engagement: 6.2,
		avgRate: 520,
		category: "Finance",
		tags: ["Explainer", "Voiceover"],
		completedDeals: 31,
		trending: true,
		tier: "Macro",
		verified: true,
		spark: [5, 6, 7, 7, 8, 8, 10],
	},
	{
		id: 12,
		name: "Pari Gulati",
		handle: "@parithedaily",
		avatarColor: ["#fef3c7", "#422006"],
		location: "Goa",
		bio: "Daily-vlog girlie. Soft, sunlit, very thrifted.",
		primaryPlatform: "Instagram",
		platforms: { Instagram: "248K", TikTok: "120K" },
		followers: 248000,
		monthlyViews: 3800000,
		engagement: 8.6,
		avgRate: 200,
		category: "Lifestyle",
		tags: ["Vlogs", "Aesthetic"],
		completedDeals: 35,
		trending: false,
		tier: "Mid",
		verified: true,
		spark: [5, 6, 7, 8, 8, 9, 9],
	},
];

export const C_PLATFORMS = ["All", "Instagram", "YouTube", "TikTok"];
export const C_CATEGORIES = [
	"All",
	"Fashion",
	"Tech",
	"Beauty",
	"Food",
	"Finance",
	"Fitness",
	"Outdoor",
	"Auto",
	"Dance",
	"Lifestyle",
];
export const C_TIERS = ["All", "Micro", "Mid", "Macro"];
export const C_ENGAGEMENT = ["All", "3%+", "6%+", "9%+"];
export const C_SORTS = [
	"Trending",
	"Most followers",
	"Highest engagement",
	"Most monthly views",
	"Newest",
];

export function fmtFollowers(n: number): string {
	if (n >= 1_000_000)
		return (
			(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(/\.0$/, "") + "M"
		);
	if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
	return String(n);
}

export function fmtViews(n: number): string {
	if (n >= 1_000_000)
		return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
	if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
	return String(n);
}

export function initials(s: string): string {
	return s
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}
