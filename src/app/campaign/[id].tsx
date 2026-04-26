import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
	Animated,
	Pressable,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

const CAMPAIGNS_DATA: Record<
	string,
	{
		id: string;
		title: string;
		image: string;
		type: string;
		spent: number;
		total: number;
		deadline: string;
		brandName: string;
		brandColor: string;
		cpm: string;
		description: string;
		platforms: string[];
		contentType: string;
		status: string;
	}
> = {
	"1": {
		id: "1",
		title: "Philips Razor Promotion",
		image: "https://picsum.photos/seed/philips/800/400",
		type: "REEL",
		spent: 230,
		total: 850,
		deadline: "Oct 24, 2023",
		brandName: "Philips",
		brandColor: "#0B3D91",
		cpm: "$2.50",
		description:
			"Create an engaging short-form video showcasing the Philips OneBlade razor. Highlight the versatility, ease of use, and sleek design. Content should feel authentic and relatable to a young male audience.",
		platforms: ["YouTube", "Instagram"],
		contentType: "Short-form Video",
		status: "Active",
	},
	"2": {
		id: "2",
		title: "Nike Summer Collection",
		image: "https://picsum.photos/seed/nike/800/400",
		type: "REEL",
		spent: 500,
		total: 1200,
		deadline: "Nov 15, 2023",
		brandName: "Nike",
		brandColor: "#111111",
		cpm: "$3.00",
		description:
			"Showcase the new Nike Summer '24 collection in your unique style. Focus on lifestyle content — workouts, outdoor activities, or street style. Must feature at least one product from the collection.",
		platforms: ["YouTube", "Instagram"],
		contentType: "Short-form Video",
		status: "Active",
	},
	"3": {
		id: "3",
		title: "Apple Music Campaign",
		image: "https://picsum.photos/seed/apple/800/400",
		type: "LOGO",
		spent: 180,
		total: 600,
		deadline: "Dec 01, 2023",
		brandName: "Apple",
		brandColor: "#FB5C74",
		cpm: "$1.80",
		description:
			"Create content that highlights your music discovery experience on Apple Music. Share your favorite playlists, new artist discoveries, or how Apple Music fits into your daily routine.",
		platforms: ["Instagram"],
		contentType: "Logo Placement",
		status: "Active",
	},
	"4": {
		id: "4",
		title: "Samsung Galaxy Launch",
		image: "https://picsum.photos/seed/samsung/800/400",
		type: "REEL",
		spent: 400,
		total: 1000,
		deadline: "Jan 10, 2024",
		brandName: "Samsung",
		brandColor: "#1428A0",
		cpm: "$2.80",
		description:
			"Unbox and showcase the Samsung Galaxy S24 Ultra. Highlight camera capabilities, AI features, and design. Content should feel premium and tech-forward.",
		platforms: ["YouTube"],
		contentType: "Short-form Video",
		status: "Active",
	},
};

const DETAIL_TABS = ["Overview", "Requirements", "Submissions"] as const;
type DetailTab = (typeof DETAIL_TABS)[number];

const IMAGE_HEIGHT = 320;

// ── Icons ────────────────────────────────────────────────────────────

function BackIcon() {
	return (
		<Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
			<Path
				d="M19 12H5M5 12L12 19M5 12L12 5"
				stroke="#FFFFFF"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function ClockIcon() {
	return (
		<Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
			<Path
				d="M12 6v6l4 2"
				stroke="#9CA3AF"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Circle cx={12} cy={12} r={10} stroke="#9CA3AF" strokeWidth={2} />
		</Svg>
	);
}

function EyeIcon() {
	return (
		<Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
			<Path
				d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
				stroke="#9CA3AF"
				strokeWidth={2}
			/>
			<Circle cx={12} cy={12} r={3} stroke="#9CA3AF" strokeWidth={2} />
		</Svg>
	);
}

function DollarIcon() {
	return (
		<Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
			<Path
				d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
				stroke="#9CA3AF"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function CheckCircleIcon() {
	return (
		<Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
			<Path
				d="M22 11.08V12a10 10 0 11-5.93-9.14"
				stroke="#22C55E"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M22 4L12 14.01l-3-3"
				stroke="#22C55E"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

// ── Main Screen ──────────────────────────────────────────────────────

export default function CampaignDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { width } = useWindowDimensions();
	const [activeTab, setActiveTab] = useState<DetailTab>("Overview");
	const scrollY = useRef(new Animated.Value(0)).current;

	const campaign = id ? CAMPAIGNS_DATA[id] : null;

	if (!campaign) {
		return (
			<View style={styles.notFound}>
				<Text style={styles.notFoundText}>Campaign not found</Text>
			</View>
		);
	}

	const progress = campaign.spent / campaign.total;
	const percent = Math.round(progress * 100);

	// Header bar opacity — fades in as you scroll past the image
	const headerBgOpacity = scrollY.interpolate({
		inputRange: [IMAGE_HEIGHT - 120, IMAGE_HEIGHT - 60],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	return (
		<View style={styles.container}>
			{/* Floating header */}
			<Animated.View
				style={[styles.floatingHeader, { paddingTop: insets.top + 4 }]}
			>
				<Animated.View
					style={[
						StyleSheet.absoluteFill,
						{ backgroundColor: "#000000", opacity: headerBgOpacity },
					]}
				/>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<BackIcon />
				</Pressable>
				<Animated.Text
					style={[styles.headerTitle, { opacity: headerBgOpacity }]}
					numberOfLines={1}
				>
					{campaign.title}
				</Animated.Text>
				<View style={{ width: 40 }} />
			</Animated.View>

			{/* Scrollable content */}
			<Animated.ScrollView
				showsVerticalScrollIndicator={false}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: false },
				)}
				scrollEventThrottle={16}
			>
				{/* Hero image */}
				<View style={styles.heroContainer}>
					<Image
						source={{ uri: campaign.image }}
						style={[styles.heroImage, { width }]}
						contentFit="cover"
					/>
					<LinearGradient
						colors={["rgba(0,0,0,0.3)", "transparent", "#000000"]}
						locations={[0, 0.4, 1]}
						style={StyleSheet.absoluteFill}
					/>

					{/* Brand + status on image */}
					<View style={styles.heroBrandRow}>
						<View
							style={[
								styles.heroBrandLogo,
								{ backgroundColor: campaign.brandColor },
							]}
						>
							<Text style={styles.heroBrandLogoText}>
								{campaign.brandName[0]?.toUpperCase()}
							</Text>
						</View>
						<View style={styles.heroBrandInfo}>
							<Text style={styles.heroBrandName}>{campaign.brandName}</Text>
							<View style={styles.heroStatusRow}>
								<View style={styles.heroStatusDot} />
								<Text style={styles.heroStatusText}>{campaign.status}</Text>
							</View>
						</View>
					</View>

					{/* CPM pill on image */}
					<View style={styles.heroCpmPill}>
						<EyeIcon />
						<Text style={styles.heroCpmText}>{campaign.cpm} / 1k views</Text>
					</View>
				</View>

				{/* Content sheet — overlaps image with rounded top */}
				<View style={styles.sheet}>
					{/* Drag hint */}
					<View style={styles.sheetHandle} />

					{/* Title */}
					<Text style={styles.title}>{campaign.title}</Text>

					{/* Meta chips */}
					<View style={styles.metaRow}>
						{[campaign.type, campaign.contentType, ...campaign.platforms].map(
							(tag) => (
								<View key={tag} style={styles.metaChip}>
									<Text style={styles.metaChipText}>{tag}</Text>
								</View>
							),
						)}
					</View>

					{/* Stats row */}
					<View style={styles.statsRow}>
						<View style={styles.statCard}>
							<DollarIcon />
							<Text style={styles.statValue}>${campaign.total}</Text>
							<Text style={styles.statLabel}>Budget</Text>
						</View>
						<View style={styles.statDivider} />
						<View style={styles.statCard}>
							<EyeIcon />
							<Text style={styles.statValue}>{campaign.cpm}</Text>
							<Text style={styles.statLabel}>Per 1k Views</Text>
						</View>
						<View style={styles.statDivider} />
						<View style={styles.statCard}>
							<ClockIcon />
							<Text style={styles.statValue}>
								{campaign.deadline.split(",")[0]}
							</Text>
							<Text style={styles.statLabel}>Deadline</Text>
						</View>
					</View>

					{/* Budget progress */}
					<View style={styles.budgetSection}>
						<View style={styles.budgetHeader}>
							<Text style={styles.budgetLabel}>Budget Utilization</Text>
							<Text style={styles.budgetPercent}>{percent}%</Text>
						</View>
						<View style={styles.progressBarBg}>
							<LinearGradient
								colors={["#EC4899", "#DB2777"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								style={[styles.progressBarFill, { width: `${percent}%` }]}
							/>
						</View>
						<View style={styles.budgetAmounts}>
							<Text style={styles.budgetSpent}>${campaign.spent} spent</Text>
							<Text style={styles.budgetTotal}>
								${campaign.total - campaign.spent} remaining
							</Text>
						</View>
					</View>

					{/* Tabs */}
					<View style={styles.tabRow}>
						{DETAIL_TABS.map((tab) => {
							const isActive = activeTab === tab;
							return (
								<Pressable
									key={tab}
									onPress={() => setActiveTab(tab)}
									style={[styles.tabButton, isActive && styles.tabButtonActive]}
								>
									<Text
										style={[styles.tabText, isActive && styles.tabTextActive]}
									>
										{tab}
									</Text>
								</Pressable>
							);
						})}
					</View>

					<View style={styles.tabDivider} />

					{/* Tab content */}
					<View style={styles.tabContent}>
						{activeTab === "Overview" && (
							<>
								<Text style={styles.sectionTitle}>About this campaign</Text>
								<Text style={styles.descriptionText}>
									{campaign.description}
								</Text>

								<View style={styles.brandCard}>
									<View
										style={[
											styles.brandCardLogo,
											{ backgroundColor: campaign.brandColor },
										]}
									>
										<Text style={styles.brandCardLogoText}>
											{campaign.brandName[0]?.toUpperCase()}
										</Text>
									</View>
									<View style={styles.brandCardInfo}>
										<Text style={styles.brandCardName}>
											{campaign.brandName}
										</Text>
										<Text style={styles.brandCardSub}>Verified Brand</Text>
									</View>
									<CheckCircleIcon />
								</View>
							</>
						)}

						{activeTab === "Requirements" && (
							<>
								<Text style={styles.sectionTitle}>Content Guidelines</Text>
								<View style={styles.requirementsList}>
									{[
										"Video must be 15-60 seconds long",
										"Must feature the product prominently",
										"Original content only — no reposts",
										"Include brand mention in caption",
										"Post must remain live for 30 days",
									].map((req, i) => (
										<View key={req} style={styles.requirementItem}>
											<View style={styles.requirementNumber}>
												<Text style={styles.requirementNumberText}>
													{i + 1}
												</Text>
											</View>
											<Text style={styles.requirementText}>{req}</Text>
										</View>
									))}
								</View>
							</>
						)}

						{activeTab === "Submissions" && (
							<View style={styles.emptyState}>
								<Text style={styles.emptyStateText}>No submissions yet</Text>
								<Text style={styles.emptyStateSubtext}>
									Submit your first clip to this campaign
								</Text>
							</View>
						)}
					</View>

					{/* Spacer for bottom button */}
					<View style={{ height: 100 + insets.bottom }} />
				</View>
			</Animated.ScrollView>

			{/* Sticky submit button */}
			<View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
				<LinearGradient
					colors={["transparent", "rgba(0,0,0,0.9)", "#000000"]}
					locations={[0, 0.4, 1]}
					style={StyleSheet.absoluteFill}
					pointerEvents="none"
				/>
				<Pressable
					style={({ pressed }) => [
						styles.submitButton,
						pressed && styles.submitButtonPressed,
					]}
				>
					<LinearGradient
						colors={["#EC4899", "#DB2777"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={StyleSheet.absoluteFill}
					/>
					<Text style={styles.submitButtonText}>Submit a Clip</Text>
				</Pressable>
			</View>
		</View>
	);
}

// ── Styles ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},
	notFound: {
		flex: 1,
		backgroundColor: "#000000",
		alignItems: "center",
		justifyContent: "center",
	},
	notFoundText: {
		fontFamily: "Inter-Regular",
		fontSize: 16,
		color: "#6B7280",
	},

	// Floating header
	floatingHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingBottom: 12,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255,255,255,0.1)",
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		flex: 1,
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: "#FFFFFF",
		textAlign: "center",
	},

	// Hero image
	heroContainer: {
		height: IMAGE_HEIGHT,
		position: "relative",
	},
	heroImage: {
		height: IMAGE_HEIGHT,
	},
	heroBrandRow: {
		position: "absolute",
		bottom: 48,
		left: 20,
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	heroBrandLogo: {
		width: 40,
		height: 40,
		borderRadius: 11,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1.5,
		borderColor: "rgba(255,255,255,0.2)",
	},
	heroBrandLogoText: {
		fontFamily: "StackSans-Bold",
		fontSize: 16,
		color: "#FFFFFF",
	},
	heroBrandInfo: {
		gap: 1,
	},
	heroBrandName: {
		fontFamily: "Inter-SemiBold",
		fontSize: 14,
		color: "#FFFFFF",
	},
	heroStatusRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	heroStatusDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "#22C55E",
	},
	heroStatusText: {
		fontFamily: "Inter-Regular",
		fontSize: 12,
		color: "#A1A1AA",
	},
	heroCpmPill: {
		position: "absolute",
		bottom: 52,
		right: 20,
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
		backgroundColor: "rgba(255,255,255,0.1)",
		borderRadius: 20,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.08)",
	},
	heroCpmText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 12,
		color: "#FFFFFF",
	},

	// Content sheet
	sheet: {
		backgroundColor: "#000000",
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		marginTop: -28,
		paddingTop: 14,
		minHeight: 600,
	},
	sheetHandle: {
		width: 36,
		height: 4,
		borderRadius: 2,
		backgroundColor: "rgba(255,255,255,0.15)",
		alignSelf: "center",
		marginBottom: 20,
	},

	// Title
	title: {
		fontFamily: "StackSans-Bold",
		fontSize: 26,
		color: "#FFFFFF",
		paddingHorizontal: 20,
		letterSpacing: -0.3,
	},

	// Meta chips
	metaRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		paddingHorizontal: 20,
		marginTop: 16,
	},
	metaChip: {
		backgroundColor: "#111111",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderWidth: 1,
		borderColor: "#1F1F1F",
	},
	metaChipText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 12,
		color: "#9CA3AF",
	},

	// Stats row
	statsRow: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 20,
		marginTop: 24,
		backgroundColor: "#111111",
		borderRadius: 16,
		paddingVertical: 18,
		borderWidth: 1,
		borderColor: "#1F1F1F",
	},
	statCard: {
		flex: 1,
		alignItems: "center",
		gap: 6,
	},
	statDivider: {
		width: 1,
		height: 36,
		backgroundColor: "#1F1F1F",
	},
	statValue: {
		fontFamily: "StackSans-Bold",
		fontSize: 16,
		color: "#FFFFFF",
	},
	statLabel: {
		fontFamily: "Inter-Regular",
		fontSize: 11,
		color: "#6B7280",
	},

	// Budget
	budgetSection: {
		marginHorizontal: 20,
		marginTop: 24,
		backgroundColor: "#111111",
		borderRadius: 16,
		padding: 18,
		borderWidth: 1,
		borderColor: "#1F1F1F",
		gap: 10,
	},
	budgetHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	budgetLabel: {
		fontFamily: "Inter-SemiBold",
		fontSize: 13,
		color: "#9CA3AF",
	},
	budgetPercent: {
		fontFamily: "StackSans-Bold",
		fontSize: 14,
		color: "#EC4899",
	},
	progressBarBg: {
		height: 6,
		borderRadius: 3,
		backgroundColor: "#1F1F1F",
		overflow: "hidden",
	},
	progressBarFill: {
		height: 6,
		borderRadius: 3,
	},
	budgetAmounts: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	budgetSpent: {
		fontFamily: "Inter-Regular",
		fontSize: 12,
		color: "#EC4899",
	},
	budgetTotal: {
		fontFamily: "Inter-Regular",
		fontSize: 12,
		color: "#6B7280",
	},

	// Tabs
	tabRow: {
		flexDirection: "row",
		gap: 0,
		paddingHorizontal: 20,
		marginTop: 28,
	},
	tabButton: {
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	tabButtonActive: {
		borderBottomWidth: 2,
		borderBottomColor: "#EC4899",
	},
	tabText: {
		fontFamily: "Inter-Regular",
		fontSize: 14,
		color: "#6B7280",
	},
	tabTextActive: {
		fontFamily: "Inter-SemiBold",
		color: "#FFFFFF",
	},
	tabDivider: {
		height: 1,
		backgroundColor: "#1F1F1F",
		marginHorizontal: 20,
	},

	// Tab content
	tabContent: {
		paddingHorizontal: 20,
		paddingTop: 24,
	},
	sectionTitle: {
		fontFamily: "Inter-SemiBold",
		fontSize: 15,
		color: "#D1D5DB",
		marginBottom: 10,
	},
	descriptionText: {
		fontFamily: "Inter-Regular",
		fontSize: 14,
		color: "#9CA3AF",
		lineHeight: 24,
	},

	// Brand card
	brandCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		backgroundColor: "#111111",
		borderRadius: 14,
		padding: 14,
		borderWidth: 1,
		borderColor: "#1F1F1F",
		marginTop: 24,
	},
	brandCardLogo: {
		width: 42,
		height: 42,
		borderRadius: 11,
		alignItems: "center",
		justifyContent: "center",
	},
	brandCardLogoText: {
		fontFamily: "StackSans-Bold",
		fontSize: 17,
		color: "#FFFFFF",
	},
	brandCardInfo: {
		flex: 1,
		gap: 1,
	},
	brandCardName: {
		fontFamily: "Inter-SemiBold",
		fontSize: 14,
		color: "#FFFFFF",
	},
	brandCardSub: {
		fontFamily: "Inter-Regular",
		fontSize: 12,
		color: "#6B7280",
	},

	// Requirements
	requirementsList: {
		gap: 14,
	},
	requirementItem: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
	},
	requirementNumber: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: "rgba(236,72,153,0.12)",
		alignItems: "center",
		justifyContent: "center",
	},
	requirementNumberText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 11,
		color: "#EC4899",
	},
	requirementText: {
		fontFamily: "Inter-Regular",
		fontSize: 14,
		color: "#D1D5DB",
		lineHeight: 22,
		flex: 1,
		paddingTop: 1,
	},

	// Empty state
	emptyState: {
		alignItems: "center",
		paddingVertical: 48,
		gap: 8,
	},
	emptyStateText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: "#6B7280",
	},
	emptyStateSubtext: {
		fontFamily: "Inter-Regular",
		fontSize: 14,
		color: "#4B5563",
	},

	// Bottom bar
	bottomBar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		paddingTop: 24,
		paddingHorizontal: 20,
	},
	submitButton: {
		borderRadius: 14,
		paddingVertical: 17,
		alignItems: "center",
		overflow: "hidden",
	},
	submitButtonPressed: {
		opacity: 0.85,
	},
	submitButtonText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: "#FFFFFF",
	},
});
