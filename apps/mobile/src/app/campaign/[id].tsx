import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import { colors, ACCENT_MAP, BRAND_COLORS } from "~/utils/theme";

interface Campaign {
	id: number;
	brand: string;
	brandHandle: string;
	title: string;
	brief: string;
	longBrief: string[];
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

const CAMPAIGNS_DATA: Record<string, Campaign> = {
	"1": {
		id: 1,
		brand: "Lumen Audio",
		brandHandle: "@lumenaudio",
		title: "Launch reels for the new Lumen Pro 2 earbuds",
		brief: "Authentic 30\u201360s reel showcasing Lumen Pro 2 in a daily-life moment. Highlight ANC and 12-hour battery.",
		longBrief: [
			"Create an authentic 30\u201360s reel featuring the Lumen Pro 2 earbuds in a daily-life scenario.",
			"Highlight the Active Noise Cancellation feature and 12-hour battery life.",
			"Content should feel organic and relatable \u2014 commute, workout, WFH are all great setups.",
			"Include the product clearly visible in at least 3 seconds of footage.",
			"Mention @lumenaudio in caption. No scripts \u2014 we want your voice.",
		],
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
	"2": {
		id: 2,
		brand: "Kavi Coffee Co.",
		brandHandle: "@kavicoffee",
		title: "Morning ritual UGC for cold brew launch",
		brief: "Short-form video starring our cold brew bottle. Bonus payout for >50k views in first 72 hours.",
		longBrief: [
			"Feature our cold brew bottle in your morning routine.",
			"Keep it cozy, aesthetic, and authentic \u2014 no hard selling.",
			"Bonus payout if your reel crosses 50k views in the first 72 hours.",
			"Tag @kavicoffee and use #KaviMornings.",
		],
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
	"3": {
		id: 3,
		brand: "Northform",
		brandHandle: "@northform.studio",
		title: "Studio-tour shorts for the SS26 collection",
		brief: "Behind-the-scenes shorts from our Mumbai studio. Quiet, cinematic tone preferred.",
		longBrief: [
			"Film a behind-the-scenes short from our Mumbai design studio.",
			"Quiet, cinematic tone \u2014 think soft lighting, fabric textures, minimal dialogue.",
			"Duration: 30\u201390 seconds. Vertical format preferred.",
			"We\u2019ll provide studio access and pieces from the SS26 line.",
		],
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
	"4": {
		id: 4,
		brand: "Glide Mobility",
		brandHandle: "@rideglide",
		title: "First-ride POV for the Glide G3 e-scooter",
		brief: "POV ride through your city. Hooks under 2s. Strong CTA to test-ride event.",
		longBrief: [
			"Film a first-person POV ride through your city on the Glide G3.",
			"Hook must land in under 2 seconds \u2014 speed, wind, city energy.",
			"End with a strong CTA directing viewers to our test-ride event page.",
			"We ship the scooter to you. Return after 7 days.",
		],
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
	"5": {
		id: 5,
		brand: "Petal & Press",
		brandHandle: "@petalandpress",
		title: "GRWM with our new clean-skin serum",
		brief: "Get-ready-with-me clip featuring the Hydra Veil serum. No filters, no over-editing.",
		longBrief: [
			"Get-ready-with-me clip featuring the Hydra Veil serum.",
			"No beauty filters, no heavy editing \u2014 we want real skin.",
			"Show application and talk about texture/feel naturally.",
			"Minimum 20 seconds, maximum 60 seconds.",
		],
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
	"6": {
		id: 6,
		brand: "Forge Finance",
		brandHandle: "@forgefin",
		title: "60-second explainer: why your SIP isn\u2019t working",
		brief: "Educational short. Calm voiceover, on-screen captions. We\u2019ll provide the script outline.",
		longBrief: [
			"Create a 60-second educational short on SIP investing mistakes.",
			"Calm voiceover with on-screen captions/graphics.",
			"We provide the script outline \u2014 you add your style.",
			"Must include our app download CTA at the end.",
		],
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
	"7": {
		id: 7,
		brand: "Halfmoon Kitchen",
		brandHandle: "@halfmoonkitchen",
		title: "60s recipe reel using our miso paste",
		brief: "One recipe, one minute, one pan. Hero shot of the jar at the end.",
		longBrief: [
			"Cook one recipe in one minute using our miso paste.",
			"One pan only \u2014 keep it simple and satisfying.",
			"End with a hero shot of the jar. Tag @halfmoonkitchen.",
		],
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
	"8": {
		id: 8,
		brand: "Atlas Outdoors",
		brandHandle: "@atlas.outdoors",
		title: "Trail-test the Atlas X1 jacket in the Himalayas",
		brief: "Field-test footage with weather details. Bonus payout for snow conditions.",
		longBrief: [
			"Test the Atlas X1 jacket on a real Himalayan trail.",
			"Show weather conditions \u2014 rain, wind, snow all qualify.",
			"Bonus payout for verified snow-condition footage.",
			"Duration: 60\u2013180 seconds. Include altitude/location overlays if possible.",
		],
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
	"9": {
		id: 9,
		brand: "Soko Stationery",
		brandHandle: "@sokostationery",
		title: "Desk-setup ASMR with our new notebook line",
		brief: "Cozy, ambient desk-setup video. Highlight the textured cover of the Soko Daily.",
		longBrief: [
			"Create a cozy desk-setup ASMR video featuring the Soko Daily notebook.",
			"Highlight the textured cover \u2014 close-ups are encouraged.",
			"Ambient sounds only, no voiceover needed.",
			"30\u201360 seconds. Portrait or landscape both fine.",
		],
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
};

const TABS = ["Brief", "Requirements", "Details"] as const;
type Tab = (typeof TABS)[number];

function BackIcon() {
	return (
		<Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
			<Path
				d="M19 12H5M5 12L12 19M5 12L12 5"
				stroke={colors.text}
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

export default function CampaignDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const [activeTab, setActiveTab] = useState<Tab>("Brief");

	const campaign = id ? CAMPAIGNS_DATA[id] : null;

	if (!campaign) {
		return (
			<View style={styles.notFound}>
				<Text style={styles.notFoundText}>Campaign not found</Text>
			</View>
		);
	}

	const accent = ACCENT_MAP[campaign.color] || ACCENT_MAP.lime;
	const brandColor = BRAND_COLORS[campaign.brand] || ["#d9f99d", "#1a2e05"];
	const spotsPercent = ((campaign.totalSpots - campaign.spotsLeft) / campaign.totalSpots) * 100;

	return (
		<View style={styles.container}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
			>
				{/* Header */}
				<LinearGradient
					colors={[accent.from, "transparent"]}
					style={[styles.heroSection, { paddingTop: insets.top + 12 }]}
				>
					{/* Nav row */}
					<View style={styles.navRow}>
						<Pressable onPress={() => router.back()} style={styles.backBtn}>
							<BackIcon />
						</Pressable>
						<View style={styles.platformBadge}>
							<Text style={styles.platformBadgeText}>{campaign.platform}</Text>
						</View>
					</View>

					{/* Brand */}
					<View style={styles.brandSection}>
						<View style={[styles.brandAvatar, { backgroundColor: brandColor[0] }]}>
							<Text style={[styles.brandAvatarText, { color: brandColor[1] }]}>
								{campaign.brand[0]}
							</Text>
						</View>
						<View>
							<Text style={styles.brandName}>{campaign.brand}</Text>
							<Text style={styles.brandHandle}>{campaign.brandHandle}</Text>
						</View>
					</View>

					{/* Title */}
					<Text style={styles.title}>{campaign.title}</Text>

					{/* Tags */}
					<View style={styles.tagsRow}>
						{campaign.tags.map((tag) => (
							<View key={tag} style={styles.tag}>
								<Text style={styles.tagText}>{tag}</Text>
							</View>
						))}
						<View style={styles.tag}>
							<Text style={styles.tagText}>{campaign.category}</Text>
						</View>
					</View>
				</LinearGradient>

				{/* Stats cards */}
				<View style={styles.statsRow}>
					<View style={styles.statCard}>
						<Text style={styles.statLabel}>Rate</Text>
						<Text style={[styles.statValue, { color: accent.chip }]}>
							{campaign.currency}{campaign.rate}
						</Text>
						<Text style={styles.statSub}>per {campaign.perViews} views</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statLabel}>Budget</Text>
						<Text style={styles.statValue}>{campaign.currency}{campaign.budget}</Text>
						<Text style={styles.statSub}>total pool</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statLabel}>Deadline</Text>
						<Text style={styles.statValue}>{campaign.deadline}</Text>
						<Text style={styles.statSub}>min {campaign.minViews} views</Text>
					</View>
				</View>

				{/* Spots progress */}
				<View style={styles.spotsCard}>
					<View style={styles.spotsHeader}>
						<Text style={styles.spotsLabel}>Creator Spots</Text>
						<Text style={[styles.spotsCount, { color: accent.chip }]}>
							{campaign.spotsLeft}/{campaign.totalSpots}
						</Text>
					</View>
					<View style={styles.spotsBarBg}>
						<View style={[styles.spotsBarFill, { width: `${spotsPercent}%`, backgroundColor: accent.chip }]} />
					</View>
					<View style={styles.spotsFooter}>
						<Text style={styles.spotsFooterText}>{campaign.creatorsJoined} creators joined</Text>
						<Text style={styles.spotsFooterText}>{campaign.spotsLeft} spots remaining</Text>
					</View>
				</View>

				{/* Tabs */}
				<View style={styles.tabRow}>
					{TABS.map((tab) => {
						const isActive = activeTab === tab;
						return (
							<Pressable
								key={tab}
								onPress={() => setActiveTab(tab)}
								style={[styles.tabBtn, isActive && { borderBottomColor: accent.chip, borderBottomWidth: 2 }]}
							>
								<Text style={[styles.tabText, isActive && { color: colors.text }]}>
									{tab}
								</Text>
							</Pressable>
						);
					})}
				</View>

				{/* Tab content */}
				<View style={styles.tabContent}>
					{activeTab === "Brief" && (
						<>
							<Text style={styles.sectionTitle}>Campaign Brief</Text>
							<Text style={styles.briefText}>{campaign.brief}</Text>
							<View style={styles.briefList}>
								{campaign.longBrief.map((item, i) => (
									<View key={i} style={styles.briefItem}>
										<View style={[styles.briefDot, { backgroundColor: accent.chip }]} />
										<Text style={styles.briefItemText}>{item}</Text>
									</View>
								))}
							</View>
						</>
					)}

					{activeTab === "Requirements" && (
						<>
							<Text style={styles.sectionTitle}>Content Requirements</Text>
							<View style={styles.reqList}>
								{[
									{ label: "Platform", value: campaign.platform },
									{ label: "Min. Views", value: campaign.minViews },
									{ label: "Content Style", value: campaign.tags.join(", ") },
									{ label: "Duration", value: "30\u201360 seconds" },
									{ label: "Format", value: "Vertical (9:16)" },
								].map((item) => (
									<View key={item.label} style={styles.reqRow}>
										<Text style={styles.reqLabel}>{item.label}</Text>
										<Text style={styles.reqValue}>{item.value}</Text>
									</View>
								))}
							</View>

							<Text style={[styles.sectionTitle, { marginTop: 24 }]}>Guidelines</Text>
							<View style={styles.briefList}>
								{[
									"Content must be original \u2014 no reposts or recycled footage",
									"Include brand mention in caption or voiceover",
									"Post must remain live for minimum 30 days",
									"No competitor products visible in frame",
									"Submit within deadline for payment eligibility",
								].map((item, i) => (
									<View key={i} style={styles.briefItem}>
										<View style={[styles.briefNumber, { backgroundColor: `${accent.chip}18` }]}>
											<Text style={[styles.briefNumberText, { color: accent.chip }]}>{i + 1}</Text>
										</View>
										<Text style={styles.briefItemText}>{item}</Text>
									</View>
								))}
							</View>
						</>
					)}

					{activeTab === "Details" && (
						<>
							<Text style={styles.sectionTitle}>Campaign Details</Text>
							<View style={styles.detailsGrid}>
								{[
									{ label: "Brand", value: campaign.brand },
									{ label: "Category", value: campaign.category },
									{ label: "Platform", value: campaign.platform },
									{ label: "Rate", value: `${campaign.currency}${campaign.rate} / ${campaign.perViews} views` },
									{ label: "Min Views", value: campaign.minViews },
									{ label: "Total Budget", value: `${campaign.currency}${campaign.budget}` },
									{ label: "Deadline", value: campaign.deadline },
									{ label: "Spots", value: `${campaign.spotsLeft} of ${campaign.totalSpots} left` },
								].map((item) => (
									<View key={item.label} style={styles.detailItem}>
										<Text style={styles.detailLabel}>{item.label}</Text>
										<Text style={styles.detailValue}>{item.value}</Text>
									</View>
								))}
							</View>

							{/* Brand card */}
							<View style={styles.brandCard}>
								<View style={[styles.brandCardAvatar, { backgroundColor: brandColor[0] }]}>
									<Text style={[styles.brandCardAvatarText, { color: brandColor[1] }]}>
										{campaign.brand[0]}
									</Text>
								</View>
								<View style={{ flex: 1 }}>
									<Text style={styles.brandCardName}>{campaign.brand}</Text>
									<Text style={styles.brandCardHandle}>{campaign.brandHandle}</Text>
								</View>
								<View style={styles.verifiedBadge}>
									<Text style={styles.verifiedText}>Verified</Text>
								</View>
							</View>
						</>
					)}
				</View>
			</ScrollView>

			{/* Bottom CTA */}
			<View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
				<View style={styles.bottomBarInner}>
					<View>
						<Text style={[styles.bottomRate, { color: accent.chip }]}>
							{campaign.currency}{campaign.rate}
						</Text>
						<Text style={styles.bottomRateSub}>per {campaign.perViews} views</Text>
					</View>
					<Pressable
						style={({ pressed }) => [
							styles.applyBtn,
							{ backgroundColor: accent.chip },
							pressed && { opacity: 0.85 },
						]}
					>
						<Text style={styles.applyBtnText}>Apply Now</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.bg,
	},
	notFound: {
		flex: 1,
		backgroundColor: colors.bg,
		alignItems: "center",
		justifyContent: "center",
	},
	notFoundText: {
		fontFamily: "Inter-Regular",
		fontSize: 16,
		color: colors.textTertiary,
	},

	// Hero
	heroSection: {
		paddingHorizontal: 20,
		paddingBottom: 24,
	},
	navRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	backBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255,255,255,0.06)",
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
	},
	platformBadge: {
		backgroundColor: "rgba(255,255,255,0.06)",
		borderRadius: 14,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderWidth: 1,
		borderColor: colors.border,
	},
	platformBadgeText: {
		fontSize: 12,
		fontFamily: "Inter-Regular",
		color: colors.textSecondary,
	},
	brandSection: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginBottom: 16,
	},
	brandAvatar: {
		width: 40,
		height: 40,
		borderRadius: 11,
		alignItems: "center",
		justifyContent: "center",
	},
	brandAvatarText: {
		fontSize: 16,
		fontFamily: "Inter-SemiBold",
	},
	brandName: {
		fontSize: 14,
		fontFamily: "Inter-SemiBold",
		color: colors.text,
	},
	brandHandle: {
		fontSize: 12,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},
	title: {
		fontSize: 22,
		fontFamily: "Inter-SemiBold",
		color: colors.text,
		letterSpacing: -0.4,
		lineHeight: 30,
	},
	tagsRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginTop: 14,
	},
	tag: {
		backgroundColor: "rgba(255,255,255,0.05)",
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.07)",
	},
	tagText: {
		fontSize: 12,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},

	// Stats
	statsRow: {
		flexDirection: "row",
		paddingHorizontal: 16,
		gap: 10,
		marginTop: 4,
	},
	statCard: {
		flex: 1,
		backgroundColor: colors.bgCard,
		borderRadius: 14,
		padding: 14,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
		gap: 4,
	},
	statLabel: {
		fontSize: 10,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	statValue: {
		fontSize: 16,
		fontFamily: "Inter-SemiBold",
		color: colors.text,
	},
	statSub: {
		fontSize: 10,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},

	// Spots
	spotsCard: {
		marginHorizontal: 16,
		marginTop: 14,
		backgroundColor: colors.bgCard,
		borderRadius: 14,
		padding: 16,
		borderWidth: 1,
		borderColor: colors.border,
	},
	spotsHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	spotsLabel: {
		fontSize: 13,
		fontFamily: "Inter-SemiBold",
		color: colors.textSecondary,
	},
	spotsCount: {
		fontSize: 14,
		fontFamily: "Inter-SemiBold",
	},
	spotsBarBg: {
		height: 4,
		borderRadius: 2,
		backgroundColor: "rgba(255,255,255,0.06)",
		overflow: "hidden",
	},
	spotsBarFill: {
		height: 4,
		borderRadius: 2,
	},
	spotsFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
	},
	spotsFooterText: {
		fontSize: 11,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},

	// Tabs
	tabRow: {
		flexDirection: "row",
		marginHorizontal: 16,
		marginTop: 24,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	tabBtn: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 2,
		borderBottomColor: "transparent",
	},
	tabText: {
		fontSize: 14,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},

	// Tab content
	tabContent: {
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	sectionTitle: {
		fontSize: 15,
		fontFamily: "Inter-SemiBold",
		color: colors.text,
		marginBottom: 12,
	},
	briefText: {
		fontSize: 14,
		fontFamily: "Inter-Regular",
		color: colors.textSecondary,
		lineHeight: 22,
		marginBottom: 20,
	},
	briefList: {
		gap: 14,
	},
	briefItem: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
	},
	briefDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		marginTop: 7,
	},
	briefNumber: {
		width: 22,
		height: 22,
		borderRadius: 11,
		alignItems: "center",
		justifyContent: "center",
	},
	briefNumberText: {
		fontSize: 11,
		fontFamily: "Inter-SemiBold",
	},
	briefItemText: {
		flex: 1,
		fontSize: 14,
		fontFamily: "Inter-Regular",
		color: colors.textSecondary,
		lineHeight: 21,
	},

	// Requirements
	reqList: {
		backgroundColor: colors.bgCard,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: colors.border,
		overflow: "hidden",
	},
	reqRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	reqLabel: {
		fontSize: 13,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},
	reqValue: {
		fontSize: 13,
		fontFamily: "Inter-SemiBold",
		color: colors.text,
		maxWidth: "55%",
		textAlign: "right",
	},

	// Details
	detailsGrid: {
		backgroundColor: colors.bgCard,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: colors.border,
		overflow: "hidden",
	},
	detailItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	detailLabel: {
		fontSize: 13,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},
	detailValue: {
		fontSize: 13,
		fontFamily: "Inter-SemiBold",
		color: colors.text,
	},
	brandCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginTop: 20,
		backgroundColor: colors.bgCard,
		borderRadius: 14,
		padding: 16,
		borderWidth: 1,
		borderColor: colors.border,
	},
	brandCardAvatar: {
		width: 44,
		height: 44,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	brandCardAvatarText: {
		fontSize: 18,
		fontFamily: "Inter-SemiBold",
	},
	brandCardName: {
		fontSize: 14,
		fontFamily: "Inter-SemiBold",
		color: colors.text,
	},
	brandCardHandle: {
		fontSize: 12,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},
	verifiedBadge: {
		backgroundColor: "rgba(34, 197, 94, 0.12)",
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	verifiedText: {
		fontSize: 11,
		fontFamily: "Inter-SemiBold",
		color: "#22C55E",
	},

	// Bottom bar
	bottomBar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: colors.bg,
		borderTopWidth: 1,
		borderTopColor: colors.border,
		paddingTop: 14,
		paddingHorizontal: 20,
	},
	bottomBarInner: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	bottomRate: {
		fontSize: 20,
		fontFamily: "Inter-SemiBold",
		letterSpacing: -0.5,
	},
	bottomRateSub: {
		fontSize: 12,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},
	applyBtn: {
		borderRadius: 12,
		paddingHorizontal: 28,
		paddingVertical: 14,
	},
	applyBtnText: {
		fontSize: 15,
		fontFamily: "Inter-SemiBold",
		color: "#0a0a0c",
	},
});
