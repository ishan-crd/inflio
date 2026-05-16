import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

import { type BarterProduct, PRODUCTS } from "../(tabs)/barter";

const C = {
	bg: "#000000",
	card: "#0f0f12",
	border: "#22222a",
	text: "#F5E8E8",
	textDim: "#9CA3AF",
	textMute: "#6B7280",
};

// ── Icons ────────────────────────────────────────────────────────────
function ChevronLeftIcon({
	size = 20,
	color = "#fff",
}: {
	size?: number;
	color?: string;
}) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<Path
				d="M15 6l-6 6 6 6"
				stroke={color}
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function HeartIcon({
	size = 18,
	color = "#fff",
	filled = false,
}: {
	size?: number;
	color?: string;
	filled?: boolean;
}) {
	return (
		<Svg
			width={size}
			height={size}
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

function ShareIcon({
	size = 16,
	color = "#fff",
}: {
	size?: number;
	color?: string;
}) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<Circle cx={18} cy={5} r={3} stroke={color} strokeWidth={1.7} />
			<Circle cx={6} cy={12} r={3} stroke={color} strokeWidth={1.7} />
			<Circle cx={18} cy={19} r={3} stroke={color} strokeWidth={1.7} />
			<Path
				d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"
				stroke={color}
				strokeWidth={1.7}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function StarIcon({
	size = 11,
	color = "#FBBF24",
}: {
	size?: number;
	color?: string;
}) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24">
			<Path
				d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z"
				fill={color}
			/>
		</Svg>
	);
}

function VerifiedIcon({ size = 13 }: { size?: number }) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<Path
				d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				stroke="#22C55E"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M9 12l2 2 4-4"
				stroke="#22C55E"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function CheckIcon({
	size = 11,
	color = "#fff",
}: {
	size?: number;
	color?: string;
}) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<Path
				d="M5 12l5 5L20 7"
				stroke={color}
				strokeWidth={3}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function ChevronRightIcon({
	size = 14,
	color = "#0a0a0c",
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

// ── Circle button (back / heart / share) ─────────────────────────────
function CircleBtn({
	onPress,
	children,
}: {
	onPress?: () => void;
	children: React.ReactNode;
}) {
	return (
		<Pressable onPress={onPress} style={s.circleBtn}>
			{children}
		</Pressable>
	);
}

// ── Detail Hero ──────────────────────────────────────────────────────
function DetailHero({ p }: { p: BarterProduct }) {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const [hearted, setHearted] = useState(false);
	const [activeThumb, setActiveThumb] = useState(0);
	const tiles = [0, 1, 2, 3];

	return (
		<View>
			<LinearGradient
				colors={[p.palette[1], p.palette[0]]}
				start={{ x: 0.35, y: 0.25 }}
				end={{ x: 0.8, y: 1 }}
				style={{ height: 420, overflow: "hidden" }}
			>
				{/* big glyph */}
				<View style={s.glyphWrap}>
					<Text style={[s.glyphText, { color: p.palette[2] }]}>
						{p.brand[0].toLowerCase()}
					</Text>
				</View>

				{/* top bar */}
				<View style={[s.topBar, { top: insets.top + 8 }]}>
					<CircleBtn onPress={() => router.back()}>
						<ChevronLeftIcon size={20} color="#fff" />
					</CircleBtn>
					<View style={{ flexDirection: "row", gap: 8 }}>
						<CircleBtn onPress={() => setHearted(!hearted)}>
							<HeartIcon
								size={18}
								color={hearted ? "#EC4899" : "#fff"}
								filled={hearted}
							/>
						</CircleBtn>
						<CircleBtn>
							<ShareIcon size={16} color="#fff" />
						</CircleBtn>
					</View>
				</View>

				{/* low-stock badge */}
				{p.spotsLeft / p.totalSpots < 0.3 && (
					<View style={[s.lowStockBadge, { top: insets.top + 60 }]}>
						<View style={s.lowStockDot} />
						<Text style={s.lowStockText}>Only {p.spotsLeft} spots left</Text>
					</View>
				)}
			</LinearGradient>

			{/* thumbnails */}
			<View style={s.thumbRow}>
				{tiles.map((i) => (
					<Pressable key={i} onPress={() => setActiveThumb(i)}>
						<LinearGradient
							colors={[p.palette[1], p.palette[0]]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={[
								s.thumb,
								{
									borderColor:
										activeThumb === i ? p.palette[2] : "rgba(255,255,255,0.15)",
									borderWidth: activeThumb === i ? 2 : 1,
									opacity: activeThumb === i ? 1 : 0.6,
								},
							]}
						>
							{i === 0 && (
								<Text style={[s.thumbGlyph, { color: p.palette[2] }]}>
									{p.brand[0].toLowerCase()}
								</Text>
							)}
						</LinearGradient>
					</Pressable>
				))}
			</View>
		</View>
	);
}

// ── Stat Tile ────────────────────────────────────────────────────────
function StatTile({
	label,
	value,
	accent,
}: {
	label: string;
	value: string;
	accent?: string;
}) {
	return (
		<View style={s.statTile}>
			<Text style={s.statLabel}>{label}</Text>
			<Text style={[s.statValue, accent ? { color: accent } : null]}>
				{value}
			</Text>
		</View>
	);
}

// ── Detail Body ──────────────────────────────────────────────────────
function DetailBody({ p }: { p: BarterProduct }) {
	const router = useRouter();
	const filled = ((p.totalSpots - p.spotsLeft) / p.totalSpots) * 100;
	const brandInitials = p.brand
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("");
	const similar = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 4);

	return (
		<View style={{ padding: 16, paddingTop: 20 }}>
			{/* brand row */}
			<View style={s.brandRow}>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
					<View style={[s.brandAvatar, { backgroundColor: p.colors[0] }]}>
						<Text style={[s.brandInitials, { color: p.colors[1] }]}>
							{brandInitials}
						</Text>
					</View>
					<View>
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
						>
							<Text style={s.brandName}>{p.brand}</Text>
							<VerifiedIcon size={13} />
						</View>
						<Text style={s.brandSub}>
							{p.brandHandle} · {p.category}
						</Text>
					</View>
				</View>
				<View style={s.ratingBadge}>
					<StarIcon size={11} color="#FBBF24" />
					<Text style={s.ratingText}>{p.rating}</Text>
					<Text style={s.ratingCount}>({p.reviewers})</Text>
				</View>
			</View>

			{/* title */}
			<Text style={s.title}>{p.title}</Text>
			<Text style={s.subtitle}>{p.short}</Text>

			{/* price card */}
			<View style={s.priceCard}>
				<View>
					<Text style={s.priceLabel}>You get</Text>
					<View
						style={{
							flexDirection: "row",
							alignItems: "baseline",
							gap: 8,
							marginTop: 4,
						}}
					>
						<Text style={s.priceValue}>₹{p.worth.toLocaleString("en-IN")}</Text>
						<Text style={s.priceMrp}>MRP</Text>
					</View>
				</View>
				<View
					style={[
						s.freeBadge,
						{
							borderColor: `${p.palette[2]}55`,
							backgroundColor: `${p.palette[2]}18`,
						},
					]}
				>
					<Text style={[s.freePercent, { color: p.palette[2] }]}>100%</Text>
					<Text style={[s.freeLabel, { color: p.palette[2] }]}>
						FREE BARTER
					</Text>
				</View>
			</View>

			{/* about */}
			<Text style={s.sectionHead}>About this drop</Text>
			<Text style={s.description}>{p.description}</Text>

			{/* stats */}
			<View style={s.statsRow}>
				<StatTile label="Min followers" value={`${p.minFollowers}+`} />
				<StatTile label="Deliverable" value={p.deliverable} />
				<StatTile label="Platform" value={p.platform} />
			</View>

			{/* perks */}
			<Text style={[s.sectionHead, { marginTop: 22 }]}>What you get</Text>
			<View style={s.perksCard}>
				{p.perks.map((perk, i) => (
					<View key={perk} style={[s.perkRow, i > 0 && s.perkBorder]}>
						<View
							style={[
								s.perkCheck,
								{ backgroundColor: `${p.chip}1f`, borderColor: `${p.chip}55` },
							]}
						>
							<CheckIcon size={11} color={p.chip} />
						</View>
						<Text style={s.perkText}>{perk}</Text>
					</View>
				))}
			</View>

			{/* availability */}
			<Text style={[s.sectionHead, { marginTop: 22 }]}>Availability</Text>
			<View style={s.availCard}>
				<View style={s.availHeader}>
					<Text style={s.availText}>
						<Text style={{ color: "#fff", fontWeight: "700" }}>
							{p.spotsLeft}
						</Text>{" "}
						of {p.totalSpots} spots left
					</Text>
					<Text style={s.availDeadline}>Closes {p.deadline}</Text>
				</View>
				<View style={s.progressTrack}>
					<LinearGradient
						colors={[p.chip, p.palette[2]]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={[
							s.progressFill,
							{ width: `${filled}%` as unknown as number },
						]}
					/>
				</View>
				<View style={s.creatorsRow}>
					<View style={{ flexDirection: "row" }}>
						{["#f472b6", "#60a5fa", "#fb923c", "#bef264"].map((c, i) => (
							<View
								key={c}
								style={[
									s.creatorDot,
									{ backgroundColor: c, marginLeft: i === 0 ? 0 : -7 },
								]}
							/>
						))}
						<View style={[s.creatorDot, s.creatorMore, { marginLeft: -7 }]}>
							<Text style={s.creatorMoreText}>+{p.creatorsJoined - 4}</Text>
						</View>
					</View>
					<Text style={s.creatorsLabel}>
						<Text style={{ color: "#fff", fontWeight: "600" }}>
							{p.creatorsJoined}
						</Text>{" "}
						creators already applied
					</Text>
				</View>
			</View>

			{/* similar barters */}
			<Text style={[s.sectionHead, { marginTop: 22 }]}>Similar barters</Text>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={{ marginTop: 10 }}
			>
				{similar.map((item) => (
					<Pressable
						key={item.id}
						onPress={() => router.push(`/barter/${item.id}`)}
						style={s.similarCard}
					>
						<LinearGradient
							colors={[item.palette[1], item.palette[0]]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={s.similarHero}
						>
							<Text style={[s.similarGlyph, { color: item.palette[2] }]}>
								{item.brand[0].toLowerCase()}
							</Text>
						</LinearGradient>
						<View style={{ padding: 8, paddingBottom: 10 }}>
							<Text style={s.similarTitle} numberOfLines={1}>
								{item.title}
							</Text>
							<Text style={[s.similarPrice, { color: item.chip }]}>
								₹{item.worth.toLocaleString("en-IN")}
							</Text>
						</View>
					</Pressable>
				))}
			</ScrollView>

			{/* bottom spacer for sticky CTA */}
			<View style={{ height: 120 }} />
		</View>
	);
}

// ── Sticky Apply CTA ─────────────────────────────────────────────────
function StickyApply({
	p,
	applied,
	onApply,
}: {
	p: BarterProduct;
	applied: boolean;
	onApply: () => void;
}) {
	const insets = useSafeAreaInsets();

	return (
		<LinearGradient
			colors={["transparent", "rgba(0,0,0,0.92)", "#000"]}
			locations={[0, 0.3, 0.6]}
			style={[s.stickyWrap, { paddingBottom: insets.bottom + 8 }]}
		>
			<View style={s.stickyCard}>
				<View style={{ flex: 1 }}>
					<Text style={s.stickyLabel}>You pay</Text>
					<View
						style={{ flexDirection: "row", alignItems: "baseline", gap: 5 }}
					>
						<Text style={s.stickyPrice}>₹0</Text>
						<Text style={s.stickyMrp}>₹{p.worth.toLocaleString("en-IN")}</Text>
					</View>
				</View>
				<Pressable
					onPress={onApply}
					disabled={applied}
					style={[
						s.applyBtn,
						applied
							? {
									backgroundColor: "rgba(34,197,94,0.15)",
									borderWidth: 1,
									borderColor: "rgba(34,197,94,0.4)",
								}
							: { backgroundColor: p.palette[2] },
					]}
				>
					{applied ? (
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
						>
							<CheckIcon size={14} color="#86efac" />
							<Text style={[s.applyText, { color: "#86efac" }]}>Applied</Text>
						</View>
					) : (
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
						>
							<Text style={[s.applyText, { color: "#0a0a0c" }]}>
								Apply for barter
							</Text>
							<ChevronRightIcon size={14} color="#0a0a0c" />
						</View>
					)}
				</Pressable>
			</View>
		</LinearGradient>
	);
}

// ── Main Page ────────────────────────────────────────────────────────
export default function BarterDetailPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const product = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];
	const [applied, setApplied] = useState(false);

	return (
		<View style={{ flex: 1, backgroundColor: C.bg }}>
			<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
				<DetailHero p={product} />
				<DetailBody p={product} />
			</ScrollView>
			<StickyApply
				p={product}
				applied={applied}
				onApply={() => setApplied(true)}
			/>
		</View>
	);
}

// ── Styles ───────────────────────────────────────────────────────────
const s = StyleSheet.create({
	circleBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(0,0,0,0.45)",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.1)",
		alignItems: "center",
		justifyContent: "center",
	},
	glyphWrap: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
	},
	glyphText: {
		fontSize: 260,
		fontStyle: "italic",
		opacity: 0.78,
		lineHeight: 300,
		fontWeight: "300",
	},
	topBar: {
		position: "absolute",
		left: 16,
		right: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	lowStockBadge: {
		position: "absolute",
		left: 16,
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: "rgba(236,72,153,0.18)",
		borderWidth: 1,
		borderColor: "rgba(236,72,153,0.4)",
		borderRadius: 999,
		paddingHorizontal: 11,
		paddingVertical: 5,
	},
	lowStockDot: {
		width: 5,
		height: 5,
		borderRadius: 3,
		backgroundColor: "#EC4899",
	},
	lowStockText: {
		fontSize: 11,
		fontWeight: "600",
		color: "#fda4d3",
		textTransform: "uppercase",
		letterSpacing: 0.3,
	},
	thumbRow: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 8,
		marginTop: -36,
	},
	thumb: {
		width: 52,
		height: 52,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	thumbGlyph: {
		fontSize: 26,
		fontStyle: "italic",
		fontWeight: "300",
		lineHeight: 30,
	},
	// brand row
	brandRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	brandAvatar: {
		width: 36,
		height: 36,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	brandInitials: {
		fontSize: 14,
		fontWeight: "700",
	},
	brandName: {
		fontSize: 13.5,
		fontWeight: "600",
		color: "#F5E8E8",
	},
	brandSub: {
		fontSize: 11,
		color: "#6B7280",
	},
	ratingBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		backgroundColor: "rgba(251,191,36,0.1)",
		borderWidth: 1,
		borderColor: "rgba(251,191,36,0.25)",
		borderRadius: 999,
		paddingHorizontal: 9,
		paddingVertical: 4,
	},
	ratingText: {
		fontSize: 11.5,
		fontWeight: "600",
		color: "#FBBF24",
	},
	ratingCount: {
		fontSize: 10.5,
		color: "#FBBF24",
		opacity: 0.6,
	},
	// title
	title: {
		fontSize: 24,
		fontWeight: "700",
		color: "#F5E8E8",
		letterSpacing: -0.6,
		lineHeight: 28,
		marginTop: 14,
	},
	subtitle: {
		fontSize: 13,
		color: "#9CA3AF",
		lineHeight: 20,
		marginTop: 4,
	},
	// price card
	priceCard: {
		marginTop: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 14,
		backgroundColor: "#0f0f12",
		borderWidth: 1,
		borderColor: "#22222a",
		borderRadius: 14,
	},
	priceLabel: {
		fontSize: 10.5,
		fontWeight: "600",
		color: "#6B7280",
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	priceValue: {
		fontSize: 26,
		fontWeight: "700",
		color: "#fff",
		letterSpacing: -0.6,
	},
	priceMrp: {
		fontSize: 13,
		color: "#6B7280",
		textDecorationLine: "line-through",
	},
	freeBadge: {
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 8,
		alignItems: "center",
	},
	freePercent: {
		fontSize: 12,
		fontWeight: "700",
		lineHeight: 16,
	},
	freeLabel: {
		fontSize: 9.5,
		fontWeight: "600",
		opacity: 0.85,
	},
	// sections
	sectionHead: {
		fontSize: 13,
		fontWeight: "700",
		color: "#F5E8E8",
		letterSpacing: -0.1,
		marginTop: 22,
	},
	description: {
		fontSize: 13.5,
		lineHeight: 21,
		color: "#D1D5DB",
		marginTop: 10,
	},
	// stats
	statsRow: {
		flexDirection: "row",
		gap: 8,
		marginTop: 18,
	},
	statTile: {
		flex: 1,
		backgroundColor: "#0f0f12",
		borderWidth: 1,
		borderColor: "#22222a",
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	statLabel: {
		fontSize: 9.5,
		fontWeight: "600",
		color: "#6B7280",
		textTransform: "uppercase",
		letterSpacing: 0.6,
	},
	statValue: {
		fontSize: 15,
		fontWeight: "700",
		color: "#F5E8E8",
		marginTop: 4,
		letterSpacing: -0.2,
	},
	// perks
	perksCard: {
		marginTop: 10,
		backgroundColor: "#0f0f12",
		borderWidth: 1,
		borderColor: "#22222a",
		borderRadius: 14,
		overflow: "hidden",
	},
	perkRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 11,
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
	perkBorder: {
		borderTopWidth: 1,
		borderTopColor: "rgba(255,255,255,0.05)",
	},
	perkCheck: {
		width: 22,
		height: 22,
		borderRadius: 11,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	perkText: {
		fontSize: 13,
		color: "#F5E8E8",
		lineHeight: 18,
		flex: 1,
	},
	// availability
	availCard: {
		marginTop: 10,
		padding: 14,
		backgroundColor: "#0f0f12",
		borderWidth: 1,
		borderColor: "#22222a",
		borderRadius: 14,
	},
	availHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "baseline",
	},
	availText: {
		fontSize: 13,
		color: "#9CA3AF",
	},
	availDeadline: {
		fontSize: 11,
		color: "#6B7280",
	},
	progressTrack: {
		height: 6,
		marginTop: 8,
		borderRadius: 3,
		backgroundColor: "rgba(255,255,255,0.08)",
		overflow: "hidden",
	},
	progressFill: {
		height: 6,
		borderRadius: 3,
	},
	creatorsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 9,
		marginTop: 12,
	},
	creatorDot: {
		width: 22,
		height: 22,
		borderRadius: 11,
		borderWidth: 2,
		borderColor: "#0f0f12",
	},
	creatorMore: {
		backgroundColor: "rgba(255,255,255,0.1)",
		alignItems: "center",
		justifyContent: "center",
	},
	creatorMoreText: {
		fontSize: 8.5,
		fontWeight: "700",
		color: "#fff",
	},
	creatorsLabel: {
		fontSize: 11.5,
		color: "#9CA3AF",
	},
	// similar
	similarCard: {
		width: 130,
		backgroundColor: "#0f0f12",
		borderWidth: 1,
		borderColor: "#22222a",
		borderRadius: 12,
		overflow: "hidden",
		marginRight: 10,
	},
	similarHero: {
		height: 90,
		alignItems: "center",
		justifyContent: "center",
	},
	similarGlyph: {
		fontSize: 52,
		fontStyle: "italic",
		fontWeight: "300",
		opacity: 0.7,
		lineHeight: 56,
	},
	similarTitle: {
		fontSize: 11.5,
		fontWeight: "600",
		color: "#F5E8E8",
		lineHeight: 15,
	},
	similarPrice: {
		fontSize: 10.5,
		fontWeight: "600",
		marginTop: 3,
	},
	// sticky CTA
	stickyWrap: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
	},
	stickyCard: {
		marginHorizontal: 16,
		padding: 12,
		paddingLeft: 16,
		backgroundColor: "#0f0f12",
		borderWidth: 1,
		borderColor: "#22222a",
		borderRadius: 18,
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	stickyLabel: {
		fontSize: 10.5,
		color: "#6B7280",
		fontWeight: "500",
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	stickyPrice: {
		fontSize: 19,
		fontWeight: "700",
		color: "#fff",
		letterSpacing: -0.4,
	},
	stickyMrp: {
		fontSize: 11,
		color: "#6B7280",
		textDecorationLine: "line-through",
	},
	applyBtn: {
		borderRadius: 12,
		paddingHorizontal: 22,
		paddingVertical: 14,
	},
	applyText: {
		fontSize: 14,
		fontWeight: "700",
		letterSpacing: -0.2,
	},
});
