import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	type DimensionValue,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import { api } from "../../../convex/_generated/api";
import { ACCENT_MAP, colors } from "~/utils/theme";

function Skel({ w, h, r = 8, mb = 0 }: { w: DimensionValue; h: number; r?: number; mb?: number }) {
	return <View style={{ width: w, height: h, borderRadius: r, marginBottom: mb, backgroundColor: "rgba(255,255,255,0.06)" }} />;
}

const PLATFORMS = ["All", "Instagram", "YouTube", "TikTok"];

function BellIcon() {
	return (
		<Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
			<Path
				d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z"
				stroke={colors.textSecondary}
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M13.73 21a2 2 0 0 1-3.46 0"
				stroke={colors.textSecondary}
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function PlatformIcon({ platform }: { platform: string }) {
	if (platform === "Instagram") {
		return (
			<Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
				<Path
					d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2z"
					stroke="currentColor"
					strokeWidth={1.5}
				/>
				<Circle cx={12} cy={12} r={4} stroke="currentColor" strokeWidth={1.5} />
			</Svg>
		);
	}
	if (platform === "YouTube") {
		return (
			<Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
				<Path
					d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58z"
					stroke="currentColor"
					strokeWidth={1.5}
				/>
				<Path
					d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z"
					stroke="currentColor"
					strokeWidth={1.5}
				/>
			</Svg>
		);
	}
	return (
		<Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
			<Path
				d="M9 12a4 4 0 108 0 4 4 0 00-8 0zM16 8v8"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinecap="round"
			/>
		</Svg>
	);
}

const CREATOR_DOT_COLORS: string[] = ["#f472b6", "#60a5fa", "#fb923c"];

const initials = (s: string) =>
	s
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

function VerifiedIcon() {
	return (
		<Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
			<Path
				d="M9 12l2 2 4-4"
				stroke="#22C55E"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				stroke="#22C55E"
				strokeWidth={2}
			/>
		</Svg>
	);
}

function CampaignCard({
	campaign,
	onPress,
}: {
	campaign: {
		_id: string;
		brand: string;
		brandHandle: string;
		brandLogoColors: string[];
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
	};
	onPress: () => void;
}) {
	const accent = ACCENT_MAP[campaign.color] || ACCENT_MAP.lime;
	const brandColor = campaign.brandLogoColors || ["#d9f99d", "#1a2e05"];
	const spotsPercent =
		((campaign.totalSpots - campaign.spotsLeft) / campaign.totalSpots) * 100;

	return (
		<TouchableOpacity activeOpacity={0.85} onPress={onPress}>
			<View style={styles.card}>
				{/* Card top — brand, title, brief, tags */}
				<View style={styles.cardTop}>
					{/* Brand cluster */}
					<View style={styles.brandCluster}>
						<View
							style={[styles.brandAvatar, { backgroundColor: brandColor[0] }]}
						>
							<Text style={[styles.brandAvatarText, { color: brandColor[1] }]}>
								{initials(campaign.brand)}
							</Text>
						</View>
						<View>
							<View style={styles.brandNameRow}>
								<Text style={styles.brandName}>{campaign.brand}</Text>
								<VerifiedIcon />
							</View>
							<Text style={styles.brandHandle}>{campaign.brandHandle}</Text>
						</View>
					</View>

					{/* Platform pill */}
					<View style={styles.platformPill}>
						<PlatformIcon platform={campaign.platform} />
						<Text style={styles.platformText}>{campaign.platform}</Text>
					</View>

					{/* Title & brief */}
					<Text style={styles.cardTitle}>{campaign.title}</Text>
					<Text style={styles.cardBrief}>{campaign.brief}</Text>

					{/* Tags */}
					<View style={styles.tagsRow}>
						{campaign.tags.map((tag) => (
							<View key={tag} style={styles.tag}>
								<Text style={styles.tagText}>#{tag}</Text>
							</View>
						))}
					</View>
				</View>

				{/* Rate card — glass background with accent glow */}
				<View style={styles.rateCardWrapper}>
					<LinearGradient
						colors={[accent.from, accent.to]}
						start={{ x: 0.8, y: 0 }}
						end={{ x: 0.2, y: 1 }}
						style={styles.rateCard}
					>
						<Text style={styles.rateLabel}>CPM RATE</Text>
						<View style={styles.rateRow}>
							<Text style={[styles.rateAmount, { color: accent.text }]}>
								<Text style={[styles.rateCurrency, { color: accent.chip }]}>
									{campaign.currency}{" "}
								</Text>
								{campaign.rate}
							</Text>
							<Text style={styles.ratePer}>per {campaign.perViews} views</Text>
						</View>

						<View style={styles.rateMeta}>
							<Text style={styles.rateMetaText}>
								Min.{" "}
								<Text style={styles.rateMetaMono}>{campaign.minViews}</Text>{" "}
								views
							</Text>
							<Text style={styles.rateMetaText}>
								Budget{" "}
								<Text style={styles.rateMetaMono}>
									{campaign.currency}
									{campaign.budget}
								</Text>
							</Text>
							<Text style={styles.rateMetaText}>
								Ends{" "}
								<Text style={styles.rateMetaMono}>{campaign.deadline}</Text>
							</Text>
						</View>
					</LinearGradient>
				</View>

				{/* Footer — spots + creators */}
				<View style={styles.cardFoot}>
					<View style={styles.spotsCluster}>
						<View style={styles.spotsBarBg}>
							<View
								style={[
									styles.spotsBarFill,
									{ width: `${spotsPercent}%`, backgroundColor: accent.chip },
								]}
							/>
						</View>
						<Text style={styles.spotsText}>
							<Text
								style={{ color: colors.text, fontFamily: "Inter-SemiBold" }}
							>
								{campaign.spotsLeft}
							</Text>{" "}
							spots left
						</Text>
					</View>

					<View style={styles.creatorsStack}>
						<View style={styles.creatorDots}>
							{CREATOR_DOT_COLORS.map((c) => (
								<View
									key={c}
									style={[styles.creatorDot, { backgroundColor: c }]}
								/>
							))}
							{campaign.creatorsJoined > 3 && (
								<View style={[styles.creatorDot, styles.creatorDotMore]}>
									<Text style={styles.creatorDotMoreText}>
										+{campaign.creatorsJoined - 3}
									</Text>
								</View>
							)}
						</View>
						<Text style={styles.creatorsText}>
							{campaign.creatorsJoined} joined
						</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}

export default function CampaignsScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const [activePlatform, setActivePlatform] = useState("All");
	const campaigns = useQuery(api.campaigns.listActiveWithBrands);

	const filtered =
		!campaigns
			? []
			: activePlatform === "All"
				? campaigns
				: campaigns.filter((c) => c.platform === activePlatform);

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeArea} edges={["top"]}>
				{/* Header */}
				<View style={styles.header}>
					<View>
						<Text style={styles.heading}>Campaigns</Text>
						<Text style={styles.subheading}>
							{campaigns?.length ?? 0} active campaigns
						</Text>
					</View>
					<TouchableOpacity style={styles.bellBtn}>
						<BellIcon />
					</TouchableOpacity>
				</View>

				{/* Platform filters */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.filterScroll}
					contentContainerStyle={styles.filterContent}
				>
					{PLATFORMS.map((p) => (
						<TouchableOpacity
							key={p}
							onPress={() => setActivePlatform(p)}
							style={[
								styles.filterPill,
								activePlatform === p && styles.filterPillActive,
							]}
						>
							<Text
								style={[
									styles.filterPillText,
									activePlatform === p && styles.filterPillTextActive,
								]}
							>
								{p}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>

				{/* Campaign list */}
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={{
						paddingBottom: insets.bottom + 100,
						paddingHorizontal: 16,
					}}
					showsVerticalScrollIndicator={false}
				>
					{campaigns === undefined ? (
						<View style={{ gap: 16, marginTop: 8 }}>
							{[0, 1, 2, 3].map((i) => (
								<Skel key={i} w="100%" h={160} r={16} />
							))}
						</View>
					) : (
						filtered.map((campaign) => (
							<CampaignCard
								key={campaign._id}
								campaign={campaign}
								onPress={() => router.push(`/campaign/${campaign._id}`)}
							/>
						))
					)}
				</ScrollView>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},
	safeArea: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 8,
		paddingBottom: 16,
	},
	heading: {
		fontSize: 26,
		fontFamily: "Inter-SemiBold",
		color: colors.text,
		letterSpacing: -0.5,
	},
	subheading: {
		fontSize: 13,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
		marginTop: 2,
	},
	bellBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.bgCard,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
	},
	filterScroll: {
		flexGrow: 0,
		marginBottom: 12,
	},
	filterContent: {
		paddingHorizontal: 20,
		gap: 8,
	},
	filterPill: {
		paddingHorizontal: 16,
		height: 36,
		alignItems: "center" as const,
		justifyContent: "center" as const,
		borderRadius: 20,
		backgroundColor: colors.bgCard,
		borderWidth: 1,
		borderColor: colors.border,
	},
	filterPillActive: {
		backgroundColor: "rgba(190, 242, 100, 0.12)",
		borderColor: "rgba(190, 242, 100, 0.3)",
	},
	filterPillText: {
		fontSize: 13,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},
	filterPillTextActive: {
		color: colors.accent,
	},
	scrollView: {
		flex: 1,
	},

	// Card styles
	card: {
		backgroundColor: colors.bgCard,
		borderRadius: 18,
		overflow: "hidden",
		marginBottom: 16,
		borderWidth: 1,
		borderColor: colors.border,
	},
	cardTop: {
		padding: 16,
		paddingBottom: 14,
	},
	brandCluster: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	brandAvatar: {
		width: 40,
		height: 40,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	brandAvatarText: {
		fontSize: 14,
		fontFamily: "Inter-SemiBold",
	},
	brandNameRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	brandName: {
		fontSize: 14,
		fontFamily: "Inter-SemiBold",
		color: colors.text,
	},
	brandHandle: {
		fontSize: 11,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
		marginTop: 1,
	},
	platformPill: {
		position: "absolute",
		top: 16,
		right: 16,
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: "rgba(255,255,255,0.06)",
		borderRadius: 16,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.08)",
	},
	platformText: {
		fontSize: 12,
		fontFamily: "Inter-Regular",
		color: colors.textSecondary,
	},
	cardTitle: {
		fontSize: 17,
		fontFamily: "Inter-Regular",
		color: colors.text,
		lineHeight: 24,
		letterSpacing: -0.2,
		marginTop: 18,
	},
	cardBrief: {
		fontSize: 13,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
		lineHeight: 19,
		marginTop: 6,
	},
	tagsRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 6,
		marginTop: 12,
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
		fontSize: 11,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},

	// Rate card
	rateCardWrapper: {
		paddingHorizontal: 16,
		marginTop: -4,
	},
	rateCard: {
		borderRadius: 12,
		padding: 14,
		paddingBottom: 12,
	},
	rateLabel: {
		fontSize: 9,
		fontFamily: "Inter-SemiBold",
		color: colors.textTertiary,
		textTransform: "uppercase",
		letterSpacing: 1,
		marginBottom: 4,
	},
	rateRow: {
		flexDirection: "row",
		alignItems: "baseline",
		gap: 8,
	},
	rateAmount: {
		fontSize: 26,
		fontFamily: "Inter-SemiBold",
		letterSpacing: -0.8,
	},
	rateCurrency: {
		fontSize: 15,
	},
	ratePer: {
		fontSize: 13,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},
	rateMeta: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
	},
	rateMetaText: {
		fontSize: 11,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},
	rateMetaMono: {
		fontFamily: "Inter-SemiBold",
		color: colors.textSecondary,
	},

	// Footer
	cardFoot: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	spotsCluster: {
		gap: 6,
	},
	spotsBarBg: {
		height: 4,
		borderRadius: 2,
		backgroundColor: "rgba(255,255,255,0.08)",
		overflow: "hidden",
		width: 80,
	},
	spotsBarFill: {
		height: 4,
		borderRadius: 2,
	},
	spotsText: {
		fontSize: 12,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},
	creatorsStack: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	creatorDots: {
		flexDirection: "row",
		paddingLeft: 6,
	},
	creatorDot: {
		width: 24,
		height: 24,
		borderRadius: 12,
		marginLeft: -7,
		borderWidth: 2,
		borderColor: colors.bgCard,
	},
	creatorDotMore: {
		backgroundColor: "rgba(255,255,255,0.12)",
		alignItems: "center",
		justifyContent: "center",
	},
	creatorDotMoreText: {
		fontSize: 9,
		fontFamily: "Inter-SemiBold",
		color: colors.textSecondary,
	},
	creatorsText: {
		fontSize: 11,
		fontFamily: "Inter-Regular",
		color: colors.textTertiary,
	},
});
