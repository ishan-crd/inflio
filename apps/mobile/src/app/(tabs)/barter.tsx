import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Dimensions,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

// ── Colors ──────────────────────────────────────────────────────────
const C = {
	bg: "#000000",
	card: "#0f0f12",
	border: "#22222a",
	text: "#F5E8E8",
	textDim: "#9CA3AF",
	textMute: "#6B7280",
	accent: "#bef264",
	pink: "#EC4899",
};

// ── Data ────────────────────────────────────────────────────────────
export type BarterProduct = {
	id: string;
	brand: string;
	brandHandle: string;
	category: string;
	title: string;
	short: string;
	worth: number;
	minFollowers: string;
	deliverable: string;
	platform: string;
	spotsLeft: number;
	totalSpots: number;
	creatorsJoined: number;
	deadline: string;
	rating: number;
	reviewers: number;
	tag: string;
	chip: string;
	palette: [string, string, string];
	colors: [string, string];
	description: string;
	perks: string[];
};

export const PRODUCTS: BarterProduct[] = [
	{
		id: "p1",
		brand: "Beam Beauty",
		brandHandle: "@beam.beauty",
		category: "Beauty",
		title: "Niacinamide 10% Glow Serum",
		short: "30ml \u00b7 Brightening serum",
		worth: 1299,
		minFollowers: "8K",
		deliverable: "1 Reel + 2 Stories",
		platform: "Instagram",
		spotsLeft: 14,
		totalSpots: 50,
		creatorsJoined: 36,
		deadline: "23 May",
		rating: 4.8,
		reviewers: 142,
		tag: "Trending",
		chip: "#fb923c",
		palette: ["#0f1011", "#3f1d0a", "#fb923c"],
		colors: ["#1f2937", "#fb923c"],
		description:
			"Brightening niacinamide serum that fades dark spots and evens skin tone in 4 weeks. Vegan, fragrance-free, dermatologist tested.",
		perks: [
			"Free product worth \u20B91,299",
			"Featured on @beam.beauty",
			"Discount code for followers",
			"15% commission on referrals",
		],
	},
	{
		id: "p2",
		brand: "Soundwave",
		brandHandle: "@soundwave.audio",
		category: "Tech",
		title: "Pulse Pro Wireless Earbuds",
		short: "ANC \u00b7 36hr battery",
		worth: 6499,
		minFollowers: "25K",
		deliverable: "1 Reel + 1 Long-form",
		platform: "YouTube",
		spotsLeft: 4,
		totalSpots: 20,
		creatorsJoined: 16,
		deadline: "18 May",
		rating: 4.6,
		reviewers: 84,
		tag: "Almost gone",
		chip: "#38bdf8",
		palette: ["#0a1620", "#0c2840", "#38bdf8"],
		colors: ["#0c4a6e", "#38bdf8"],
		description:
			"Studio-grade active noise cancellation, 36 hours total playback, IP67 sweatproof. Drops May 25.",
		perks: [
			"Pulse Pro worth \u20B96,499",
			"Early access drop",
			"20% affiliate commission",
			"Soundwave creator badge",
		],
	},
	{
		id: "p3",
		brand: "Loom & Co",
		brandHandle: "@loomandco",
		category: "Fashion",
		title: "Heavyweight Linen Tee",
		short: "Oat \u00b7 Unisex \u00b7 240gsm",
		worth: 2199,
		minFollowers: "15K",
		deliverable: "2 Reels + 3 Stories",
		platform: "Instagram",
		spotsLeft: 22,
		totalSpots: 40,
		creatorsJoined: 18,
		deadline: "29 May",
		rating: 4.9,
		reviewers: 211,
		tag: "Just dropped",
		chip: "#fbbf24",
		palette: ["#1a1614", "#3a2e1f", "#e7c98a"],
		colors: ["#fef3c7", "#92400e"],
		description:
			"Premium 240gsm pure linen. Pre-washed, garment-dyed in small batches in Tirupur. Pick any 2 colors.",
		perks: [
			"Pick any 2 tees (\u20B94,398)",
			"Featured in lookbook",
			"Personal discount code",
			"Free shipping on all orders",
		],
	},
	{
		id: "p4",
		brand: "Bolt Nutrition",
		brandHandle: "@boltbars",
		category: "Food",
		title: "Protein Bar Variety Pack",
		short: "12 bars \u00b7 6 flavors",
		worth: 999,
		minFollowers: "5K",
		deliverable: "1 Reel",
		platform: "Instagram",
		spotsLeft: 31,
		totalSpots: 60,
		creatorsJoined: 29,
		deadline: "02 Jun",
		rating: 4.7,
		reviewers: 96,
		tag: "Easy apply",
		chip: "#bef264",
		palette: ["#0a0f16", "#1a2e05", "#bef264"],
		colors: ["#1e3a8a", "#bef264"],
		description:
			"20g whey protein per bar. Six flavors: cocoa, peanut, hazelnut, coffee, vanilla, salted caramel. No sugar alcohols.",
		perks: [
			"Variety pack worth \u20B9999",
			"30% affiliate commission",
			"Repeat order discount",
			"Tag in monthly creator post",
		],
	},
	{
		id: "p5",
		brand: "Asana",
		brandHandle: "@asanamovement",
		category: "Fitness",
		title: "Cork Yoga Mat 6mm",
		short: "Cork \u00b7 Natural rubber",
		worth: 3499,
		minFollowers: "12K",
		deliverable: "1 Reel + 1 Story",
		platform: "Instagram",
		spotsLeft: 9,
		totalSpots: 25,
		creatorsJoined: 16,
		deadline: "25 May",
		rating: 4.9,
		reviewers: 178,
		tag: "Eco",
		chip: "#d9f99d",
		palette: ["#0d1108", "#1c2a0d", "#d9f99d"],
		colors: ["#365314", "#d9f99d"],
		description:
			"Sustainable cork surface, natural tree rubber base. Sweat-absorbing, antimicrobial, biodegradable. 183 \u00d7 66 cm.",
		perks: [
			"Cork mat worth \u20B93,499",
			"Yoga strap free",
			"25% commission code",
			"Asana creator program",
		],
	},
	{
		id: "p6",
		brand: "Lumi",
		brandHandle: "@lumi.cosmetics",
		category: "Beauty",
		title: "Volume Boost Mascara",
		short: "Blackout \u00b7 12hr wear",
		worth: 899,
		minFollowers: "6K",
		deliverable: "1 Reel + 1 Story",
		platform: "Instagram",
		spotsLeft: 18,
		totalSpots: 45,
		creatorsJoined: 27,
		deadline: "21 May",
		rating: 4.5,
		reviewers: 67,
		tag: "New",
		chip: "#f0abfc",
		palette: ["#150a1e", "#2d1147", "#f0abfc"],
		colors: ["#581c87", "#f0abfc"],
		description:
			"Hourglass brush, smudge-proof formula, 12-hour wear. No flaking, no clumping. Vegan + cruelty-free.",
		perks: [
			"Mascara worth \u20B9899",
			"Sample 3 other shades",
			"20% off code for followers",
			"Repost on @lumi",
		],
	},
];

const CATEGORIES = [
	{ id: "all", label: "All", count: 124 },
	{ id: "beauty", label: "Beauty", count: 38 },
	{ id: "tech", label: "Tech", count: 12 },
	{ id: "fashion", label: "Fashion", count: 29 },
	{ id: "food", label: "Food", count: 22 },
	{ id: "fitness", label: "Fitness", count: 14 },
];

const COUPONS = [
	{
		id: "c1",
		brand: "Beam Beauty",
		code: "CREATOR40",
		label: "40% OFF",
		sub: "On full skincare order",
		color: "#fb923c",
	},
	{
		id: "c2",
		brand: "Soundwave",
		code: "PULSE100",
		label: "\u20B91000 OFF",
		sub: "On Pulse Pro & above",
		color: "#38bdf8",
	},
	{
		id: "c3",
		brand: "Loom & Co",
		code: "LINEN2",
		label: "BUY 1 GET 1",
		sub: "On all linen tees",
		color: "#fbbf24",
	},
	{
		id: "c4",
		brand: "Bolt",
		code: "BARSFREE",
		label: "FREE SHIP",
		sub: "On orders above \u20B9499",
		color: "#bef264",
	},
];

type HeroSlide = {
	id: string;
	eyebrow: string;
	title: string;
	cta: string;
	palette: [string, string, string];
	pid: string;
};

const HERO_SLIDES: HeroSlide[] = [
	{
		id: "h1",
		eyebrow: "Beam Beauty \u00b7 48hr window",
		title: "Get the new Glow Serum.\nWorth \u20B91,299.",
		cta: "Apply free",
		palette: ["#0f1011", "#3f1d0a", "#fb923c"],
		pid: "p1",
	},
	{
		id: "h2",
		eyebrow: "Soundwave \u00b7 4 spots left",
		title: "Pulse Pro Earbuds before\nthe public drop.",
		cta: "See barter",
		palette: ["#0a1620", "#0c2840", "#38bdf8"],
		pid: "p2",
	},
	{
		id: "h3",
		eyebrow: "Asana \u00b7 Eco partner",
		title: "Cork yoga mat,\nmade in Karnataka.",
		cta: "Get yours",
		palette: ["#0d1108", "#1c2a0d", "#d9f99d"],
		pid: "p5",
	},
];

// ── Icons ───────────────────────────────────────────────────────────
function SearchIcon() {
	return (
		<Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
			<Circle cx={11} cy={11} r={7} stroke={C.textMute} strokeWidth={1.8} />
			<Path
				d="M21 21l-4.3-4.3"
				stroke={C.textMute}
				strokeWidth={1.8}
				strokeLinecap="round"
			/>
		</Svg>
	);
}
function FilterIcon() {
	return (
		<Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
			<Path
				d="M3 6h18M6 12h12M10 18h4"
				stroke={C.text}
				strokeWidth={1.7}
				strokeLinecap="round"
			/>
		</Svg>
	);
}
function BellIcon() {
	return (
		<Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
			<Path
				d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9Z"
				stroke={C.text}
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M13.73 21a2 2 0 01-3.46 0"
				stroke={C.text}
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}
function HeartIconSmall({ filled, color }: { filled: boolean; color: string }) {
	return (
		<Svg
			width={14}
			height={14}
			viewBox="0 0 24 24"
			fill={filled ? color : "none"}
		>
			<Path
				d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 000-7.8z"
				stroke={color}
				strokeWidth={1.7}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}
function SparkIcon({ color = C.accent }: { color?: string }) {
	return (
		<Svg width={10} height={10} viewBox="0 0 24 24">
			<Path
				d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"
				fill={color}
			/>
		</Svg>
	);
}
function TicketIcon({ color = "#fff" }: { color?: string }) {
	return (
		<Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
			<Path
				d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4V8z"
				stroke={color}
				strokeWidth={1.7}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M13 7v10"
				stroke={color}
				strokeWidth={1.5}
				strokeLinecap="round"
			/>
		</Svg>
	);
}
function ChevronRightIcon({
	size = 14,
	color = C.textDim,
}: {
	size?: number;
	color?: string;
}) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<Path
				d="M9 6l6 6-6 6"
				stroke={color}
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

// ── Components ──────────────────────────────────────────────────────
const SCREEN_W = Dimensions.get("window").width;

function HeaderBar() {
	return (
		<View style={st.header}>
			<View>
				<View style={st.headerEyebrow}>
					<View style={st.headerDot} />
					<Text style={st.headerEyebrowText}>
						124 live drops {"\u00b7"} Apply free
					</Text>
				</View>
				<Text style={st.headerTitle}>Barter</Text>
			</View>
			<View style={st.headerActions}>
				<View style={st.headerBtn}>
					<BellIcon />
					<View style={st.notifDot} />
				</View>
			</View>
		</View>
	);
}

function SearchRow() {
	return (
		<View style={st.searchRow}>
			<View style={st.searchInput}>
				<SearchIcon />
				<Text style={st.searchPlaceholder}>Search brands, products...</Text>
			</View>
			<View style={st.filterBtn}>
				<FilterIcon />
			</View>
		</View>
	);
}

function HeroCarousel({ onOpen }: { onOpen: (id: string) => void }) {
	const [idx, setIdx] = useState(0);
	const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		setIdx(Math.round(e.nativeEvent.contentOffset.x / (SCREEN_W - 32)));
	};
	return (
		<View style={{ marginTop: 6 }}>
			<ScrollView
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScroll={onScroll}
				scrollEventThrottle={16}
				decelerationRate="fast"
				snapToInterval={SCREEN_W - 32}
				contentContainerStyle={{ paddingHorizontal: 16 }}
			>
				{HERO_SLIDES.map((s) => (
					<Pressable
						key={s.id}
						onPress={() => onOpen(s.pid)}
						style={{ width: SCREEN_W - 32 }}
					>
						<View style={st.heroCard}>
							<LinearGradient
								colors={[s.palette[1], s.palette[0]]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={StyleSheet.absoluteFill}
							/>
							<Text style={[st.heroGlyph, { color: s.palette[2] }]}>
								{s.eyebrow[0].toLowerCase()}
							</Text>
							<View style={st.heroContent}>
								<View style={st.heroEyebrowPill}>
									<View
										style={[
											st.heroEyebrowDot,
											{ backgroundColor: s.palette[2] },
										]}
									/>
									<Text style={st.heroEyebrowTextInner}>{s.eyebrow}</Text>
								</View>
								<View style={{ flex: 1 }} />
								<Text style={st.heroTitle}>{s.title}</Text>
								<View style={[st.heroCta, { backgroundColor: s.palette[2] }]}>
									<Text style={st.heroCtaText}>{s.cta}</Text>
									<ChevronRightIcon size={14} color="#0a0a0c" />
								</View>
							</View>
						</View>
					</Pressable>
				))}
			</ScrollView>
			<View style={st.heroIndicator}>
				{HERO_SLIDES.map((s, i) => (
					<View
						key={s.id}
						style={[st.heroDot, idx === i && st.heroDotActive]}
					/>
				))}
			</View>
		</View>
	);
}

function SectionHead({
	title,
	eyebrow,
	seeAll = true,
	accent,
}: {
	title: string;
	eyebrow?: string;
	seeAll?: boolean;
	accent?: string;
}) {
	return (
		<View style={st.sectionHead}>
			<View>
				{eyebrow ? (
					<View style={st.sectionEyebrow}>
						<SparkIcon color={accent || C.accent} />
						<Text
							style={[st.sectionEyebrowText, { color: accent || C.accent }]}
						>
							{eyebrow}
						</Text>
					</View>
				) : null}
				<Text style={st.sectionTitle}>{title}</Text>
			</View>
			{seeAll ? (
				<Pressable style={st.seeAllBtn}>
					<Text style={st.seeAllText}>See all</Text>
					<ChevronRightIcon size={12} />
				</Pressable>
			) : null}
		</View>
	);
}

function CouponRow() {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
		>
			{COUPONS.map((c) => (
				<View key={c.id} style={st.couponCard}>
					<View style={[st.couponLeft, { backgroundColor: `${c.color}15` }]}>
						<View
							style={[
								st.couponIcon,
								{
									backgroundColor: `${c.color}26`,
									borderColor: `${c.color}66`,
								},
							]}
						>
							<TicketIcon color={c.color} />
						</View>
						<View style={[st.perfDot, { top: -5, right: -5 }]} />
						<View style={[st.perfDot, { bottom: -5, right: -5 }]} />
					</View>
					<View style={st.couponRight}>
						<Text style={st.couponBrand}>{c.brand}</Text>
						<Text style={[st.couponLabel, { color: c.color }]}>{c.label}</Text>
						<Text style={st.couponSub}>{c.sub}</Text>
						<View style={st.couponCode}>
							<Text style={st.couponCodeText}>{c.code}</Text>
						</View>
					</View>
				</View>
			))}
		</ScrollView>
	);
}

function CategoryChips({
	active,
	setActive,
}: {
	active: string;
	setActive: (id: string) => void;
}) {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
		>
			{CATEGORIES.map((c) => {
				const on = active === c.id;
				return (
					<Pressable
						key={c.id}
						onPress={() => setActive(c.id)}
						style={[st.chip, on && st.chipOn]}
					>
						<Text style={[st.chipText, on && st.chipTextOn]}>{c.label}</Text>
						<View style={[st.chipCount, on && st.chipCountOn]}>
							<Text style={[st.chipCountText, on && st.chipCountTextOn]}>
								{c.count}
							</Text>
						</View>
					</Pressable>
				);
			})}
		</ScrollView>
	);
}

function ProductTile({
	p,
	onOpen,
}: {
	p: BarterProduct;
	onOpen: (id: string) => void;
}) {
	const [hearted, setHearted] = useState(false);
	const filled = ((p.totalSpots - p.spotsLeft) / p.totalSpots) * 100;
	const lowStock = p.spotsLeft / p.totalSpots < 0.25;
	return (
		<Pressable onPress={() => onOpen(p.id)} style={st.tile}>
			<View style={st.tileImage}>
				<LinearGradient
					colors={[p.palette[1], p.palette[0]]}
					start={{ x: 0.3, y: 0.2 }}
					end={{ x: 0.8, y: 0.8 }}
					style={StyleSheet.absoluteFill}
				/>
				<Text style={[st.tileGlyph, { color: p.palette[2] }]}>
					{p.brand[0].toLowerCase()}
				</Text>
				<View style={st.tileTopRow}>
					<View style={st.tileBrandPill}>
						<View style={[st.tileBrandDot, { backgroundColor: p.colors[0] }]}>
							<Text style={[st.tileBrandDotText, { color: p.colors[1] }]}>
								{p.brand[0]}
							</Text>
						</View>
						<Text style={st.tileBrandName}>{p.brand}</Text>
					</View>
					<Pressable
						onPress={() => setHearted(!hearted)}
						style={st.tileHeartBtn}
					>
						<HeartIconSmall
							filled={hearted}
							color={hearted ? C.pink : "#fff"}
						/>
					</Pressable>
				</View>
				<View
					style={[
						st.tileTag,
						{
							backgroundColor: lowStock
								? "rgba(236,72,153,0.18)"
								: "rgba(190,242,100,0.15)",
							borderColor: lowStock
								? "rgba(236,72,153,0.35)"
								: "rgba(190,242,100,0.3)",
						},
					]}
				>
					<Text
						style={[
							st.tileTagText,
							{ color: lowStock ? "#fda4d3" : "#d9f99d" },
						]}
					>
						{p.tag}
					</Text>
				</View>
			</View>
			<View style={st.tileMeta}>
				<Text style={st.tileTitle} numberOfLines={2}>
					{p.title}
				</Text>
				<View style={st.tileWorthRow}>
					<Text style={st.tileWorthLabel}>WORTH</Text>
					<Text style={st.tileWorthValue}>
						{"\u20B9"}
						{p.worth.toLocaleString("en-IN")}
					</Text>
				</View>
				<View style={st.tileSpotsRow}>
					<View style={st.tileSpotsBar}>
						<View
							style={[
								st.tileSpotsBarFill,
								{
									width: `${filled}%` as `${number}%`,
									backgroundColor: p.chip,
								},
							]}
						/>
					</View>
					<Text style={st.tileSpotsText}>{p.spotsLeft} left</Text>
				</View>
			</View>
		</Pressable>
	);
}

function JustDroppedRow({ onOpen }: { onOpen: (id: string) => void }) {
	const items = PRODUCTS.filter((p) => p.tag !== "Trending").slice(0, 5);
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
		>
			{items.map((p) => (
				<Pressable
					key={p.id}
					onPress={() => onOpen(p.id)}
					style={{ width: 150 }}
				>
					<View style={st.droppedImage}>
						<LinearGradient
							colors={[p.palette[1], p.palette[0]]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={StyleSheet.absoluteFill}
						/>
						<Text style={[st.droppedGlyph, { color: p.palette[2] }]}>
							{p.brand[0].toLowerCase()}
						</Text>
						<View style={st.droppedCatPill}>
							<Text style={st.droppedCatText}>{p.category}</Text>
						</View>
					</View>
					<Text style={st.droppedTitle} numberOfLines={2}>
						{p.title}
					</Text>
					<View style={st.droppedMeta}>
						<Text style={st.droppedBrand}>{p.brand}</Text>
						<View style={st.droppedSep} />
						<Text style={[st.droppedWorth, { color: p.chip }]}>
							{"\u20B9"}
							{p.worth.toLocaleString("en-IN")}
						</Text>
					</View>
				</Pressable>
			))}
		</ScrollView>
	);
}

// ── Main ────────────────────────────────────────────────────────────
export default function BarterScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const [cat, setCat] = useState("all");
	const filtered = PRODUCTS.filter(
		(p) => cat === "all" || p.category.toLowerCase() === cat,
	);
	const onOpen = (id: string) => router.push(`/barter/${id}` as never);

	return (
		<SafeAreaView style={st.container} edges={["top"]}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
			>
				<HeaderBar />
				<SearchRow />
				<HeroCarousel onOpen={onOpen} />
				<View style={{ marginTop: 26 }}>
					<SectionHead
						title="Creator coupons"
						eyebrow="Save more"
						accent="#fb923c"
					/>
					<CouponRow />
				</View>
				<View style={{ marginTop: 24 }}>
					<SectionHead title="Browse by category" seeAll={false} />
					<CategoryChips active={cat} setActive={setCat} />
				</View>
				<View style={{ marginTop: 26 }}>
					<SectionHead title="Trending now" eyebrow="124 live" />
					<View style={st.grid}>
						{filtered.map((p) => (
							<ProductTile key={p.id} p={p} onOpen={onOpen} />
						))}
					</View>
				</View>
				<View style={{ marginTop: 28 }}>
					<SectionHead
						title="Just dropped"
						eyebrow="This week"
						accent={C.pink}
					/>
					<JustDroppedRow onOpen={onOpen} />
				</View>
				<View style={{ height: 24 }} />
			</ScrollView>
		</SafeAreaView>
	);
}

// ── Styles ──────────────────────────────────────────────────────────
const st = StyleSheet.create({
	container: { flex: 1, backgroundColor: C.bg },
	header: {
		paddingHorizontal: 16,
		paddingTop: 6,
		paddingBottom: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	headerEyebrow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginBottom: 3,
	},
	headerDot: {
		width: 5,
		height: 5,
		borderRadius: 999,
		backgroundColor: C.accent,
	},
	headerEyebrowText: {
		fontSize: 10.5,
		color: C.textMute,
		fontWeight: "500",
		letterSpacing: 0.4,
		textTransform: "uppercase",
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "700",
		color: C.text,
		letterSpacing: -0.8,
	},
	headerActions: { flexDirection: "row", gap: 8 },
	headerBtn: {
		width: 38,
		height: 38,
		borderRadius: 12,
		backgroundColor: C.card,
		borderWidth: 1,
		borderColor: C.border,
		alignItems: "center",
		justifyContent: "center",
	},
	notifDot: {
		position: "absolute",
		top: 8,
		right: 9,
		width: 7,
		height: 7,
		borderRadius: 999,
		backgroundColor: C.pink,
		borderWidth: 1.5,
		borderColor: C.card,
	},
	searchRow: {
		flexDirection: "row",
		gap: 8,
		paddingHorizontal: 16,
		paddingBottom: 14,
	},
	searchInput: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		gap: 9,
		backgroundColor: C.card,
		borderWidth: 1,
		borderColor: C.border,
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	searchPlaceholder: { fontSize: 13, color: C.textMute },
	filterBtn: {
		width: 42,
		height: 42,
		borderRadius: 12,
		backgroundColor: C.card,
		borderWidth: 1,
		borderColor: C.border,
		alignItems: "center",
		justifyContent: "center",
	},
	heroCard: {
		borderRadius: 22,
		height: 218,
		position: "relative",
		overflow: "hidden",
	},
	heroGlyph: {
		position: "absolute",
		right: -28,
		bottom: -50,
		fontStyle: "italic",
		fontSize: 280,
		lineHeight: 280,
		opacity: 0.18,
		letterSpacing: -6,
	},
	heroContent: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		padding: 20,
		justifyContent: "space-between",
	},
	heroEyebrowPill: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: "rgba(0,0,0,0.4)",
		borderRadius: 999,
		paddingVertical: 5,
		paddingHorizontal: 10,
		alignSelf: "flex-start",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.08)",
	},
	heroEyebrowDot: { width: 6, height: 6, borderRadius: 999 },
	heroEyebrowTextInner: {
		fontSize: 10.5,
		fontWeight: "600",
		color: "#fff",
		letterSpacing: 0.4,
		textTransform: "uppercase",
	},
	heroTitle: {
		fontSize: 30,
		lineHeight: 32,
		color: "#fff",
		letterSpacing: -0.5,
		fontWeight: "400",
		marginBottom: 14,
	},
	heroCta: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		borderRadius: 999,
		paddingVertical: 10,
		paddingHorizontal: 16,
		alignSelf: "flex-start",
	},
	heroCtaText: {
		fontSize: 13,
		fontWeight: "700",
		color: "#0a0a0c",
		letterSpacing: -0.1,
	},
	heroIndicator: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 5,
		marginTop: 12,
	},
	heroDot: {
		width: 5,
		height: 5,
		borderRadius: 999,
		backgroundColor: "rgba(255,255,255,0.18)",
	},
	heroDotActive: { width: 18, backgroundColor: C.accent },
	sectionHead: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		marginBottom: 12,
	},
	sectionEyebrow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
		marginBottom: 4,
	},
	sectionEyebrowText: {
		fontSize: 10,
		fontWeight: "600",
		letterSpacing: 0.6,
		textTransform: "uppercase",
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: "700",
		color: C.text,
		letterSpacing: -0.5,
	},
	seeAllBtn: { flexDirection: "row", alignItems: "center", gap: 3 },
	seeAllText: { fontSize: 12, fontWeight: "600", color: C.textDim },
	couponCard: {
		width: 240,
		flexDirection: "row",
		backgroundColor: C.card,
		borderWidth: 1,
		borderColor: C.border,
		borderRadius: 14,
		overflow: "hidden",
	},
	couponLeft: {
		width: 70,
		alignItems: "center",
		justifyContent: "center",
		borderRightWidth: 1,
		borderRightColor: "rgba(255,255,255,0.12)",
	},
	couponIcon: {
		width: 30,
		height: 30,
		borderRadius: 999,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	perfDot: {
		position: "absolute",
		width: 10,
		height: 10,
		borderRadius: 999,
		backgroundColor: "#000",
	},
	couponRight: { flex: 1, padding: 10, paddingLeft: 12 },
	couponBrand: {
		fontSize: 10,
		color: C.textMute,
		fontWeight: "500",
		letterSpacing: 0.4,
		textTransform: "uppercase",
	},
	couponLabel: {
		fontSize: 15,
		fontWeight: "700",
		marginTop: 2,
		letterSpacing: -0.3,
	},
	couponSub: { fontSize: 10.5, color: C.textDim, marginTop: 2, lineHeight: 14 },
	couponCode: {
		marginTop: 6,
		backgroundColor: "rgba(255,255,255,0.06)",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.15)",
		borderRadius: 5,
		paddingHorizontal: 6,
		paddingVertical: 2,
		alignSelf: "flex-start",
	},
	couponCodeText: {
		fontSize: 10,
		color: C.text,
		fontWeight: "500",
		letterSpacing: 0.5,
	},
	chip: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: "rgba(255,255,255,0.05)",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.08)",
		paddingVertical: 7,
		paddingHorizontal: 13,
		borderRadius: 999,
	},
	chipOn: { backgroundColor: "#fff", borderColor: "#fff" },
	chipText: { fontSize: 12.5, fontWeight: "600", color: C.text },
	chipTextOn: { color: "#0a0a0c" },
	chipCount: {
		backgroundColor: "rgba(255,255,255,0.08)",
		paddingHorizontal: 6,
		paddingVertical: 1,
		borderRadius: 999,
	},
	chipCountOn: { backgroundColor: "rgba(10,10,12,0.1)" },
	chipCountText: { fontSize: 10, color: C.text, opacity: 0.55 },
	chipCountTextOn: { color: "#0a0a0c" },
	grid: {
		paddingHorizontal: 16,
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	tile: {
		width: (SCREEN_W - 44) / 2,
		backgroundColor: C.card,
		borderWidth: 1,
		borderColor: C.border,
		borderRadius: 18,
		overflow: "hidden",
	},
	tileImage: { aspectRatio: 1, position: "relative", overflow: "hidden" },
	tileGlyph: {
		position: "absolute",
		alignSelf: "center",
		top: "15%",
		fontStyle: "italic",
		fontSize: 96,
		lineHeight: 96,
		opacity: 0.85,
		letterSpacing: -2,
	},
	tileTopRow: {
		position: "absolute",
		top: 10,
		left: 10,
		right: 10,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	tileBrandPill: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: "rgba(0,0,0,0.55)",
		borderRadius: 999,
		paddingVertical: 4,
		paddingLeft: 5,
		paddingRight: 9,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.08)",
	},
	tileBrandDot: {
		width: 16,
		height: 16,
		borderRadius: 999,
		alignItems: "center",
		justifyContent: "center",
	},
	tileBrandDotText: { fontSize: 9, fontWeight: "700" },
	tileBrandName: {
		fontSize: 10.5,
		fontWeight: "600",
		color: "#fff",
		letterSpacing: 0.1,
	},
	tileHeartBtn: {
		width: 28,
		height: 28,
		borderRadius: 999,
		backgroundColor: "rgba(0,0,0,0.55)",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.08)",
		alignItems: "center",
		justifyContent: "center",
	},
	tileTag: {
		position: "absolute",
		bottom: 10,
		left: 10,
		borderRadius: 999,
		paddingVertical: 3,
		paddingHorizontal: 8,
		borderWidth: 1,
	},
	tileTagText: { fontSize: 10, fontWeight: "600" },
	tileMeta: { padding: 11, paddingBottom: 13 },
	tileTitle: {
		fontSize: 13,
		fontWeight: "600",
		color: C.text,
		lineHeight: 16,
		letterSpacing: -0.1,
	},
	tileWorthRow: {
		flexDirection: "row",
		alignItems: "baseline",
		gap: 6,
		marginTop: 8,
	},
	tileWorthLabel: { fontSize: 11, color: C.textMute, fontWeight: "500" },
	tileWorthValue: {
		fontSize: 15,
		fontWeight: "700",
		color: "#fff",
		letterSpacing: -0.3,
	},
	tileSpotsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginTop: 9,
	},
	tileSpotsBar: {
		flex: 1,
		height: 3,
		borderRadius: 999,
		backgroundColor: "rgba(255,255,255,0.08)",
		overflow: "hidden",
	},
	tileSpotsBarFill: { height: 3, borderRadius: 999 },
	tileSpotsText: { fontSize: 10, color: C.textMute, fontWeight: "500" },
	droppedImage: {
		aspectRatio: 4 / 5,
		borderRadius: 14,
		overflow: "hidden",
		position: "relative",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.05)",
	},
	droppedGlyph: {
		position: "absolute",
		alignSelf: "center",
		top: "18%",
		fontStyle: "italic",
		fontSize: 72,
		lineHeight: 72,
		opacity: 0.7,
		letterSpacing: -1,
	},
	droppedCatPill: {
		position: "absolute",
		top: 8,
		left: 8,
		backgroundColor: "rgba(0,0,0,0.45)",
		borderRadius: 999,
		paddingVertical: 3,
		paddingHorizontal: 7,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.08)",
	},
	droppedCatText: {
		fontSize: 9.5,
		fontWeight: "700",
		letterSpacing: 0.5,
		textTransform: "uppercase",
		color: "#fff",
	},
	droppedTitle: {
		fontSize: 12,
		fontWeight: "600",
		color: C.text,
		marginTop: 8,
		lineHeight: 15,
	},
	droppedMeta: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginTop: 3,
	},
	droppedBrand: { fontSize: 11, color: C.textMute },
	droppedSep: {
		width: 2,
		height: 2,
		borderRadius: 999,
		backgroundColor: "#4B5563",
	},
	droppedWorth: { fontSize: 11, fontWeight: "600" },
});
