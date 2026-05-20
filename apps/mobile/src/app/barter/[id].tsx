import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useAuth } from "~/providers/auth";
import { colors } from "~/utils/theme";

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

function CheckSmallIcon({ color = "#0a0a0c" }: { color?: string }) {
	return (
		<Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
			<Path
				d="M20 6L9 17l-5-5"
				stroke={color}
				strokeWidth={3}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function CheckBigIcon({ color }: { color: string }) {
	return (
		<Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
			<Path
				d="M20 6L9 17l-5-5"
				stroke={color}
				strokeWidth={2.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function IGIcon() {
	return (
		<Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
			<Rect
				x={2}
				y={2}
				width={20}
				height={20}
				rx={5}
				stroke={colors.textSecondary}
				strokeWidth={1.5}
			/>
			<Circle
				cx={12}
				cy={12}
				r={5}
				stroke={colors.textSecondary}
				strokeWidth={1.5}
			/>
			<Circle cx={17.5} cy={6.5} r={1} fill={colors.textSecondary} />
		</Svg>
	);
}

function YTIcon() {
	return (
		<Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
			<Path
				d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58z"
				stroke={colors.textSecondary}
				strokeWidth={1.5}
			/>
			<Path
				d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z"
				stroke={colors.textSecondary}
				strokeWidth={1.5}
			/>
		</Svg>
	);
}

function TTIcon() {
	return (
		<Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
			<Path
				d="M9 12a4 4 0 108 0 4 4 0 00-8 0zM16 8v8"
				stroke={colors.textSecondary}
				strokeWidth={1.5}
				strokeLinecap="round"
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

// ── Apply Modal ──────────────────────────────────────────────────────
type PlatformOpt = { name: string; handle: string; followers: string };

function ApplyModal({
	sheetRef,
	product,
	platformOpts,
	onDismiss,
	onApplied,
}: {
	sheetRef: React.RefObject<BottomSheetModal | null>;
	product: BarterProduct;
	platformOpts: PlatformOpt[];
	onDismiss: () => void;
	onApplied: () => void;
}) {
	const insets = useSafeAreaInsets();
	const accent = product.palette[2];
	const snapPoints = useMemo(() => ["70%", "90%"], []);
	const [step, setStep] = useState(0);
	const [selectedPlatform, setSelectedPlatform] = useState(0);
	const [pitch, setPitch] = useState("");
	const [checkGuidelines, setCheckGuidelines] = useState(false);
	const [checkDeadline, setCheckDeadline] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const renderBackdrop = useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: BottomSheet backdrop props
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				opacity={0.6}
			/>
		),
		[],
	);

	const canNext =
		step === 0
			? platformOpts.length > 0
			: step === 1
				? pitch.length >= 20
				: step === 2
					? checkGuidelines && checkDeadline
					: false;

	function handleNext() {
		if (step < 2) {
			setStep(step + 1);
		} else {
			setSubmitted(true);
			onApplied();
		}
	}

	function handleClose() {
		sheetRef.current?.dismiss();
		setStep(0);
		setPitch("");
		setCheckGuidelines(false);
		setCheckDeadline(false);
		setSubmitted(false);
		setSelectedPlatform(0);
	}

	const PlatformIconComp = (name: string) => {
		if (name === "Instagram") return <IGIcon />;
		if (name === "YouTube") return <YTIcon />;
		return <TTIcon />;
	};

	return (
		<BottomSheetModal
			ref={sheetRef}
			snapPoints={snapPoints}
			backdropComponent={renderBackdrop}
			backgroundStyle={ms.sheetBg}
			handleIndicatorStyle={ms.handleIndicator}
			onDismiss={onDismiss}
		>
			<BottomSheetScrollView
				contentContainerStyle={[
					ms.sheetContent,
					{ paddingBottom: insets.bottom + 24 },
				]}
			>
				{submitted ? (
					<>
						<View style={ms.successRow}>
							<View
								style={[ms.successIcon, { backgroundColor: `${accent}30` }]}
							>
								<CheckBigIcon color={accent} />
							</View>
							<View style={{ flex: 1 }}>
								<Text style={ms.successTitle}>Application sent!</Text>
								<Text style={ms.successSub}>
									You're #{product.creatorsJoined + 1} in the queue.{" "}
									{product.brand} will review your profile.
								</Text>
							</View>
						</View>

						<View style={ms.summaryRow}>
							<View style={ms.summaryCard}>
								<Text style={ms.summaryLabel}>Platform</Text>
								<Text style={ms.summaryValue}>
									{platformOpts[selectedPlatform]?.name ?? "—"}
								</Text>
							</View>
							<View style={ms.summaryCard}>
								<Text style={ms.summaryLabel}>Product</Text>
								<Text style={ms.summaryValue}>
									₹{product.worth.toLocaleString("en-IN")}
								</Text>
							</View>
							<View style={ms.summaryCard}>
								<Text style={ms.summaryLabel}>Deadline</Text>
								<Text style={ms.summaryValue}>{product.deadline}</Text>
							</View>
						</View>

						<View style={ms.successActions}>
							<Pressable onPress={handleClose} style={ms.doneBtn}>
								<Text style={ms.doneBtnText}>Done</Text>
							</Pressable>
							<Pressable
								onPress={handleClose}
								style={[ms.viewAppsBtn, { backgroundColor: accent }]}
							>
								<Text style={ms.viewAppsBtnText}>View Applications</Text>
							</Pressable>
						</View>
					</>
				) : (
					<>
						{/* Step dots */}
						<View style={ms.dotsRow}>
							{[0, 1, 2].map((i) => (
								<View
									key={i}
									style={[
										ms.dot,
										{
											width: i === step ? 20 : 6,
											backgroundColor:
												i === step ? accent : "rgba(255,255,255,0.1)",
										},
									]}
								/>
							))}
						</View>

						<Text style={ms.stepLabel}>Step {step + 1} of 3</Text>
						<Text style={ms.stepTitle}>
							{step === 0
								? "Select your account"
								: step === 1
									? "Write your pitch"
									: "Confirm & apply"}
						</Text>

						{/* Step 0: Account picker */}
						{step === 0 && (
							<View style={ms.platformList}>
								{platformOpts.length === 0 && (
									<Text
										style={{
											color: colors.textTertiary,
											fontSize: 13,
											textAlign: "center",
											paddingVertical: 24,
										}}
									>
										No connected accounts. Complete your profile to add platform
										accounts.
									</Text>
								)}
								{platformOpts.map((p, i) => {
									const selected = selectedPlatform === i;
									return (
										<Pressable
											key={p.name}
											onPress={() => setSelectedPlatform(i)}
											style={[
												ms.platformCard,
												{
													borderColor: selected ? accent : colors.border,
													backgroundColor: selected
														? `${accent}18`
														: colors.bgCard,
												},
											]}
										>
											<View style={ms.platformIconBox}>
												{PlatformIconComp(p.name)}
											</View>
											<View style={{ flex: 1 }}>
												<Text style={ms.platformName}>{p.name}</Text>
												<Text style={ms.platformMeta}>
													{p.handle} · {p.followers}
												</Text>
											</View>
											<View
												style={[
													ms.radioOuter,
													{
														borderColor: selected
															? accent
															: colors.textTertiary,
														backgroundColor: selected ? accent : "transparent",
													},
												]}
											>
												{selected && <CheckSmallIcon />}
											</View>
										</Pressable>
									);
								})}
							</View>
						)}

						{/* Step 1: Pitch */}
						{step === 1 && (
							<View style={ms.pitchContainer}>
								<Text style={ms.inputLabel}>
									Your pitch{" "}
									<Text style={{ color: colors.textTertiary }}>
										(min 20 characters)
									</Text>
								</Text>
								<TextInput
									value={pitch}
									onChangeText={setPitch}
									placeholder="Tell the brand why you'd love this product and how you'll promote it..."
									placeholderTextColor={colors.textTertiary}
									multiline
									numberOfLines={4}
									style={ms.textArea}
									textAlignVertical="top"
								/>
								<Text
									style={[
										ms.charCount,
										{
											color: pitch.length >= 20 ? accent : colors.textTertiary,
										},
									]}
								>
									{pitch.length}/20
								</Text>
							</View>
						)}

						{/* Step 2: Confirm */}
						{step === 2 && (
							<View style={ms.confirmContainer}>
								<Pressable
									onPress={() => setCheckGuidelines(!checkGuidelines)}
									style={[
										ms.checkCard,
										{
											borderColor: checkGuidelines
												? `${accent}66`
												: colors.border,
											backgroundColor: checkGuidelines
												? `${accent}18`
												: colors.bgCard,
										},
									]}
								>
									<View
										style={[
											ms.checkbox,
											{
												borderColor: checkGuidelines
													? accent
													: colors.textTertiary,
												backgroundColor: checkGuidelines
													? accent
													: "transparent",
											},
										]}
									>
										{checkGuidelines && <CheckSmallIcon />}
									</View>
									<Text style={ms.checkText}>
										I'll create the required deliverables ({product.deliverable}
										) and follow the brand's content guidelines.
									</Text>
								</Pressable>

								<Pressable
									onPress={() => setCheckDeadline(!checkDeadline)}
									style={[
										ms.checkCard,
										{
											borderColor: checkDeadline
												? `${accent}66`
												: colors.border,
											backgroundColor: checkDeadline
												? `${accent}18`
												: colors.bgCard,
										},
									]}
								>
									<View
										style={[
											ms.checkbox,
											{
												borderColor: checkDeadline
													? accent
													: colors.textTertiary,
												backgroundColor: checkDeadline ? accent : "transparent",
											},
										]}
									>
										{checkDeadline && <CheckSmallIcon />}
									</View>
									<Text style={ms.checkText}>
										I understand the deadline is {product.deadline} and the
										content must stay live for 30 days.
									</Text>
								</Pressable>
							</View>
						)}

						{/* Navigation buttons */}
						<View style={ms.navRow}>
							{step > 0 && (
								<Pressable
									onPress={() => setStep(step - 1)}
									style={ms.backStepBtn}
								>
									<Text style={ms.backStepBtnText}>Back</Text>
								</Pressable>
							)}
							<Pressable
								onPress={handleNext}
								disabled={!canNext}
								style={[
									ms.nextBtn,
									{
										backgroundColor: canNext
											? accent
											: "rgba(255,255,255,0.06)",
										flex: 1,
									},
								]}
							>
								<Text
									style={[
										ms.nextBtnText,
										{ color: canNext ? "#0a0a0c" : colors.textTertiary },
									]}
								>
									{step === 2 ? "Submit application" : "Continue"}
								</Text>
							</Pressable>
						</View>
					</>
				)}
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}

// ── Main Page ────────────────────────────────────────────────────────
export default function BarterDetailPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const product = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];
	const [applied, setApplied] = useState(false);
	const applySheetRef = useRef<BottomSheetModal>(null);
	const { user } = useAuth();

	const creatorProfile = useQuery(
		api.creators.getByUserId,
		user?.id ? { userId: user.id } : "skip",
	);

	const platformOpts: PlatformOpt[] = (creatorProfile?.platforms ?? []).map(
		(p) => ({ name: p.name, handle: p.handle, followers: p.followers }),
	);

	return (
		<View style={{ flex: 1, backgroundColor: C.bg }}>
			<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
				<DetailHero p={product} />
				<DetailBody p={product} />
			</ScrollView>
			<StickyApply
				p={product}
				applied={applied}
				onApply={() => applySheetRef.current?.present()}
			/>
			<ApplyModal
				sheetRef={applySheetRef}
				product={product}
				platformOpts={platformOpts}
				onDismiss={() => {}}
				onApplied={() => setApplied(true)}
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

// ── Modal Styles ─────────────────────────────────────────────────────
const ms = StyleSheet.create({
	sheetBg: {
		backgroundColor: colors.bg,
	},
	handleIndicator: {
		backgroundColor: "rgba(255,255,255,0.2)",
		width: 36,
	},
	sheetContent: {
		paddingHorizontal: 24,
		paddingTop: 8,
	},
	dotsRow: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 6,
		marginBottom: 16,
	},
	dot: {
		height: 6,
		borderRadius: 3,
	},
	stepLabel: {
		fontSize: 11,
		color: colors.textTertiary,
		textTransform: "uppercase",
		letterSpacing: 0.8,
		marginBottom: 4,
	},
	stepTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: colors.text,
		marginBottom: 20,
	},
	platformList: {
		gap: 8,
	},
	platformCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		padding: 14,
		borderRadius: 12,
		borderWidth: 1.5,
	},
	platformIconBox: {
		width: 36,
		height: 36,
		borderRadius: 9,
		backgroundColor: "rgba(255,255,255,0.06)",
		alignItems: "center",
		justifyContent: "center",
	},
	platformName: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.text,
	},
	platformMeta: {
		fontSize: 12,
		color: colors.textTertiary,
		marginTop: 1,
	},
	radioOuter: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		alignItems: "center",
		justifyContent: "center",
	},
	pitchContainer: {
		gap: 0,
	},
	inputLabel: {
		fontSize: 13,
		color: colors.textSecondary,
		marginBottom: 6,
	},
	textArea: {
		backgroundColor: colors.bgCard,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 12,
		padding: 14,
		fontSize: 14,
		color: colors.text,
		minHeight: 100,
		lineHeight: 21,
	},
	charCount: {
		fontSize: 11,
		textAlign: "right",
		marginTop: 4,
	},
	confirmContainer: {
		gap: 10,
	},
	checkCard: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
		padding: 14,
		borderRadius: 12,
		borderWidth: 1,
	},
	checkbox: {
		width: 22,
		height: 22,
		borderRadius: 6,
		borderWidth: 1.5,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 1,
	},
	checkText: {
		flex: 1,
		fontSize: 13,
		color: colors.textSecondary,
		lineHeight: 20,
	},
	navRow: {
		flexDirection: "row",
		gap: 10,
		marginTop: 24,
	},
	backStepBtn: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
	},
	backStepBtnText: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.textSecondary,
	},
	nextBtn: {
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	nextBtnText: {
		fontSize: 14,
		fontWeight: "600",
	},
	successRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		marginBottom: 20,
	},
	successIcon: {
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: "center",
		justifyContent: "center",
	},
	successTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: colors.text,
	},
	successSub: {
		fontSize: 13,
		color: colors.textTertiary,
		lineHeight: 20,
		marginTop: 4,
	},
	summaryRow: {
		flexDirection: "row",
		gap: 8,
		marginBottom: 20,
	},
	summaryCard: {
		flex: 1,
		backgroundColor: colors.bgCard,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		padding: 10,
		alignItems: "center",
	},
	summaryLabel: {
		fontSize: 10,
		color: colors.textTertiary,
		textTransform: "uppercase",
		letterSpacing: 0.4,
		marginBottom: 2,
	},
	summaryValue: {
		fontSize: 13,
		fontWeight: "600",
		color: colors.text,
	},
	successActions: {
		flexDirection: "row",
		gap: 10,
	},
	doneBtn: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.bgCard,
		alignItems: "center",
	},
	doneBtnText: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.textSecondary,
	},
	viewAppsBtn: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	viewAppsBtnText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#0a0a0c",
	},
});
