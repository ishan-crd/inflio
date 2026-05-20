export const PLATFORMS = ["All", "Instagram", "YouTube", "X"];
export const CATEGORIES = [
	"All",
	"Tech",
	"Fashion",
	"Beauty",
	"Food & Bev",
	"Finance",
	"Lifestyle",
	"Travel",
	"Fitness",
	"Gaming",
	"Education",
	"Entertainment",
	"Health",
	"Auto",
	"Home & Decor",
	"Parenting",
	"Pets",
	"Sports",
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
	cyan: {
		from: "rgba(34, 211, 238, 0.22)",
		to: "rgba(34, 211, 238, 0.04)",
		chip: "#22d3ee",
		text: "#a5f3fc",
	},
	emerald: {
		from: "rgba(110, 231, 183, 0.22)",
		to: "rgba(110, 231, 183, 0.04)",
		chip: "#6ee7b7",
		text: "#a7f3d0",
	},
	fuchsia: {
		from: "rgba(232, 121, 249, 0.22)",
		to: "rgba(232, 121, 249, 0.04)",
		chip: "#e879f9",
		text: "#f5d0fe",
	},
	orange: {
		from: "rgba(251, 146, 60, 0.22)",
		to: "rgba(251, 146, 60, 0.04)",
		chip: "#fb923c",
		text: "#fed7aa",
	},
	teal: {
		from: "rgba(45, 212, 191, 0.22)",
		to: "rgba(45, 212, 191, 0.04)",
		chip: "#2dd4bf",
		text: "#99f6e4",
	},
};

// Creator filter constants
export const C_PLATFORMS = ["All", "Instagram", "YouTube", "X"];
export const C_CATEGORIES = [
	"All",
	"Fashion",
	"Tech",
	"Beauty",
	"Food",
	"Travel",
	"Fitness",
	"Gaming",
	"Music",
	"Comedy",
	"Education",
];
export const C_TIERS = ["All", "Micro", "Mid", "Macro"];
export const C_ENGAGEMENT = ["All", "3%+", "6%+", "9%+"];
export const C_SORTS = [
	"Trending",
	"Most followers",
	"Highest engagement",
	"Most deals",
	"Newest",
];

// Formatting helpers
export function fmtFollowers(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1000) return `${Math.round(n / 1000)}K`;
	return String(n);
}

export function fmtViews(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
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
