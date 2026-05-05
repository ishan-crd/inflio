export const colors = {
	bg: "#0a0a0c",
	bgCard: "#0f0f12",
	bgSecondary: "#141418",
	text: "#f5f5f4",
	textSecondary: "rgba(245,245,244,0.72)",
	textTertiary: "rgba(245,245,244,0.5)",
	accent: "#d9f99d",
	accentStrong: "#bef264",
	border: "rgba(255,255,255,0.07)",
	borderSecondary: "rgba(255,255,255,0.04)",
	divider: "rgba(255,255,255,0.07)",
	success: "#22C55E",
	error: "#EF4444",
	tabBar: "rgba(10,10,12,0.92)",
	tabBarBorder: "rgba(255,255,255,0.07)",
} as const;

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
