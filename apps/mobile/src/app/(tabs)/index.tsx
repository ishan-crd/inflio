import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle, Line, Path, Polygon, Rect } from "react-native-svg";
import { InflioLogo } from "~/components/inflio-logo";

// ── Mock dashboard data ──────────────────────────────────────────────

const RECENT_VIDEOS = [
	{
		id: "1",
		thumbnail: "https://picsum.photos/400/600?random=10",
		title: "Summer Collection Launch",
		views: "122.0k",
		likes: "12.0k",
		timeAgo: "2h ago",
	},
	{
		id: "2",
		thumbnail: "https://picsum.photos/400/600?random=11",
		title: "Fitness App Promo",
		views: "89.3k",
		likes: "7.2k",
		timeAgo: "5h ago",
	},
	{
		id: "3",
		thumbnail: "https://picsum.photos/400/600?random=12",
		title: "Brand Identity Redesign",
		views: "45.1k",
		likes: "3.8k",
		timeAgo: "1d ago",
	},
	{
		id: "4",
		thumbnail: "https://picsum.photos/400/600?random=13",
		title: "Restaurant Logo Refresh",
		views: "210.5k",
		likes: "18.4k",
		timeAgo: "1d ago",
	},
];

const ACTIVE_CAMPAIGNS = [
	{
		id: "1",
		title: "Philips Razor Promotion",
		brand: "Philips",
		brandColor: "#0B3D91",
		spent: 230,
		total: 850,
		deadline: "Oct 24",
		image: "https://picsum.photos/seed/philips/400/200",
	},
	{
		id: "2",
		title: "Nike Summer Collection",
		brand: "Nike",
		brandColor: "#111111",
		spent: 500,
		total: 1200,
		deadline: "Nov 15",
		image: "https://picsum.photos/seed/nike/400/200",
	},
	{
		id: "3",
		title: "Apple Music Campaign",
		brand: "Apple",
		brandColor: "#FB5C74",
		spent: 180,
		total: 600,
		deadline: "Dec 01",
		image: "https://picsum.photos/seed/apple/400/200",
	},
];

const WEEKLY_EARNINGS = [
	{ day: "Mon", amount: 45 },
	{ day: "Tue", amount: 72 },
	{ day: "Wed", amount: 58 },
	{ day: "Thu", amount: 110 },
	{ day: "Fri", amount: 89 },
	{ day: "Sat", amount: 134 },
	{ day: "Sun", amount: 96 },
];

// ── Icons ────────────────────────────────────────────────────────────

function BellIcon() {
	return (
		<Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
			<Path
				d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z"
				stroke="white"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M13.73 21a2 2 0 0 1-3.46 0"
				stroke="white"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function PlayButton() {
	return (
		<View style={styles.playButtonContainer}>
			<Svg width={32} height={32} viewBox="0 0 36 36">
				<Circle cx={18} cy={18} r={18} fill="rgba(0,0,0,0.5)" />
				<Polygon points="14,11 14,25 26,18" fill="white" />
			</Svg>
		</View>
	);
}

function EyeIcon({
	size = 12,
	color = "#6B7280",
}: {
	size?: number;
	color?: string;
}) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<Path
				d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
				stroke={color}
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2} />
		</Svg>
	);
}

function HeartIcon({
	size = 12,
	color = "#6B7280",
}: {
	size?: number;
	color?: string;
}) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<Path
				d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
				stroke={color}
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function TrendUpIcon() {
	return (
		<Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
			<Path
				d="M23 6l-9.5 9.5-5-5L1 18"
				stroke="#22C55E"
				strokeWidth={2.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M17 6h6v6"
				stroke="#22C55E"
				strokeWidth={2.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function ArrowRightIcon() {
	return (
		<Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
			<Path
				d="M5 12h14M12 5l7 7-7 7"
				stroke="#9CA3AF"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function CalendarIcon() {
	return (
		<Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
			<Rect
				x={3}
				y={4}
				width={18}
				height={18}
				rx={2}
				stroke="#6B7280"
				strokeWidth={2}
			/>
			<Line
				x1={16}
				y1={2}
				x2={16}
				y2={6}
				stroke="#6B7280"
				strokeWidth={2}
				strokeLinecap="round"
			/>
			<Line
				x1={8}
				y1={2}
				x2={8}
				y2={6}
				stroke="#6B7280"
				strokeWidth={2}
				strokeLinecap="round"
			/>
			<Line x1={3} y1={10} x2={21} y2={10} stroke="#6B7280" strokeWidth={2} />
		</Svg>
	);
}

// ── Earnings Chart (simple bar chart) ────────────────────────────────

function EarningsChart() {
	const maxAmount = Math.max(...WEEKLY_EARNINGS.map((d) => d.amount));

	return (
		<View style={styles.earningsCard}>
			<View style={styles.earningsHeader}>
				<View>
					<Text style={styles.earningsSectionTitle}>This Week</Text>
					<Text style={styles.earningsTotal}>$604.00</Text>
				</View>
				<View style={styles.earningsBadge}>
					<TrendUpIcon />
					<Text style={styles.earningsBadgeText}>+18.2%</Text>
				</View>
			</View>
			<View style={styles.chartContainer}>
				{WEEKLY_EARNINGS.map((day) => {
					const height = (day.amount / maxAmount) * 80;
					const isHighest = day.amount === maxAmount;
					return (
						<View key={day.day} style={styles.chartBarWrapper}>
							<View style={styles.chartBarTrack}>
								<LinearGradient
									colors={
										isHighest
											? ["#EC4899", "#DB2777"]
											: ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.06)"]
									}
									style={[styles.chartBar, { height }]}
								/>
							</View>
							<Text
								style={[styles.chartLabel, isHighest && { color: "#EC4899" }]}
							>
								{day.day}
							</Text>
						</View>
					);
				})}
			</View>
		</View>
	);
}

// ── Video Card (horizontal) ──────────────────────────────────────────

function VideoCard({ video }: { video: (typeof RECENT_VIDEOS)[number] }) {
	return (
		<View style={styles.videoCard}>
			<View style={styles.videoThumbnailContainer}>
				<Image
					source={{ uri: video.thumbnail }}
					style={styles.videoThumbnail}
					contentFit="cover"
				/>
				<PlayButton />
				<View style={styles.videoTimeBadge}>
					<Text style={styles.videoTimeBadgeText}>{video.timeAgo}</Text>
				</View>
			</View>
			<Text style={styles.videoTitle} numberOfLines={1}>
				{video.title}
			</Text>
			<View style={styles.videoStatsRow}>
				<EyeIcon />
				<Text style={styles.videoStatText}>{video.views}</Text>
				<View style={{ width: 8 }} />
				<HeartIcon />
				<Text style={styles.videoStatText}>{video.likes}</Text>
			</View>
		</View>
	);
}

// ── Campaign Card ────────────────────────────────────────────────────

function CampaignCard({
	campaign,
	onPress,
}: {
	campaign: (typeof ACTIVE_CAMPAIGNS)[number];
	onPress: () => void;
}) {
	const progress = campaign.spent / campaign.total;
	const percent = Math.round(progress * 100);

	return (
		<Pressable onPress={onPress} style={styles.campaignCard}>
			<Image
				source={{ uri: campaign.image }}
				style={styles.campaignCardImage}
				contentFit="cover"
			/>
			<LinearGradient
				colors={["transparent", "rgba(0,0,0,0.85)", "#000000"]}
				locations={[0, 0.55, 1]}
				style={StyleSheet.absoluteFill}
			/>

			{/* Brand badge top-left */}
			<View style={styles.campaignBrandBadge}>
				<View
					style={[
						styles.campaignBrandDot,
						{ backgroundColor: campaign.brandColor },
					]}
				/>
				<Text style={styles.campaignBrandText}>{campaign.brand}</Text>
			</View>

			{/* Deadline badge top-right */}
			<View style={styles.campaignDeadlineBadge}>
				<CalendarIcon />
				<Text style={styles.campaignDeadlineText}>{campaign.deadline}</Text>
			</View>

			{/* Bottom content */}
			<View style={styles.campaignCardBottom}>
				<Text style={styles.campaignCardTitle} numberOfLines={1}>
					{campaign.title}
				</Text>
				<View style={styles.campaignBudgetRow}>
					<View style={styles.campaignProgressOuter}>
						<View
							style={[styles.campaignProgressInner, { width: `${percent}%` }]}
						/>
					</View>
					<Text style={styles.campaignBudgetText}>
						<Text style={styles.campaignBudgetSpent}>${campaign.spent}</Text>
						<Text style={styles.campaignBudgetTotal}> / ${campaign.total}</Text>
					</Text>
				</View>
			</View>
		</Pressable>
	);
}

// ── Section Header ───────────────────────────────────────────────────

function SectionHeader({
	title,
	onSeeAll,
}: {
	title: string;
	onSeeAll?: () => void;
}) {
	return (
		<View style={styles.sectionHeader}>
			<Text style={styles.sectionTitle}>{title}</Text>
			{onSeeAll && (
				<Pressable onPress={onSeeAll} style={styles.seeAllButton}>
					<Text style={styles.seeAllText}>See all</Text>
					<ArrowRightIcon />
				</Pressable>
			)}
		</View>
	);
}

// ── Dashboard Screen ─────────────────────────────────────────────────

export default function DashboardScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			{/* Header */}
			<View style={styles.header}>
				<View>
					<InflioLogo height={20} />
					<Text style={styles.greeting}>Welcome back, Creator</Text>
				</View>
				<Pressable style={styles.bellButton}>
					<BellIcon />
					<View style={styles.notifDot} />
				</Pressable>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
			>
				{/* Earnings Chart */}
				<View style={styles.sectionContainer}>
					<SectionHeader title="Earnings" />
					<EarningsChart />
				</View>

				{/* Recent Videos */}
				<View style={styles.sectionContainer}>
					<SectionHeader
						title="Recent Videos"
						onSeeAll={() => router.push("/(tabs)/videos")}
					/>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.videosScroll}
					>
						{RECENT_VIDEOS.map((video) => (
							<VideoCard key={video.id} video={video} />
						))}
					</ScrollView>
				</View>

				{/* Active Campaigns */}
				<View style={styles.sectionContainer}>
					<SectionHeader
						title="Active Campaigns"
						onSeeAll={() => router.push("/(tabs)/campaigns")}
					/>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.campaignsScroll}
					>
						{ACTIVE_CAMPAIGNS.map((campaign) => (
							<CampaignCard
								key={campaign.id}
								campaign={campaign}
								onPress={() => router.push(`/campaign/${campaign.id}`)}
							/>
						))}
					</ScrollView>
				</View>

				{/* Quick Actions */}
				<View style={styles.sectionContainer}>
					<SectionHeader title="Quick Actions" />
					<View style={styles.actionsRow}>
						<Pressable
							style={({ pressed }) => [
								styles.actionButton,
								pressed && { opacity: 0.8 },
							]}
						>
							<LinearGradient
								colors={["#EC4899", "#DB2777"]}
								style={StyleSheet.absoluteFill}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
							/>
							<Text style={styles.actionButtonText}>Submit a Clip</Text>
						</Pressable>
						<Pressable
							style={({ pressed }) => [
								styles.actionButtonOutline,
								pressed && { opacity: 0.8 },
							]}
						>
							<Text style={styles.actionButtonOutlineText}>
								Browse Campaigns
							</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

// ── Styles ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},

	// Header
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		paddingHorizontal: 20,
		paddingTop: 12,
		paddingBottom: 8,
	},
	greeting: {
		fontFamily: "Inter-Regular",
		fontSize: 13,
		color: "#6B7280",
		marginTop: 6,
	},
	bellButton: {
		width: 44,
		height: 44,
		borderRadius: 12,
		backgroundColor: "#1A1A1A",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "#2A2A2A",
	},
	notifDot: {
		position: "absolute",
		top: 10,
		right: 11,
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#EC4899",
		borderWidth: 1.5,
		borderColor: "#1A1A1A",
	},

	// Sections
	sectionContainer: {
		marginTop: 28,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 14,
	},
	sectionTitle: {
		fontFamily: "StackSans-Bold",
		fontSize: 18,
		color: "#F5E8E8",
	},
	seeAllButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	seeAllText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 13,
		color: "#9CA3AF",
	},

	// Earnings Card
	earningsCard: {
		marginHorizontal: 20,
		backgroundColor: "#1A1A1A",
		borderRadius: 16,
		padding: 18,
		borderWidth: 1,
		borderColor: "#2A2A2A",
	},
	earningsHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 20,
	},
	earningsSectionTitle: {
		fontFamily: "Inter-Regular",
		fontSize: 13,
		color: "#6B7280",
	},
	earningsTotal: {
		fontFamily: "StackSans-Bold",
		fontSize: 28,
		color: "#FFFFFF",
		marginTop: 2,
	},
	earningsBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		backgroundColor: "rgba(34,197,94,0.12)",
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	earningsBadgeText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 12,
		color: "#22C55E",
	},
	chartContainer: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "space-between",
		height: 100,
	},
	chartBarWrapper: {
		flex: 1,
		alignItems: "center",
		gap: 6,
	},
	chartBarTrack: {
		width: 24,
		height: 80,
		justifyContent: "flex-end",
		borderRadius: 6,
		overflow: "hidden",
	},
	chartBar: {
		width: 24,
		borderRadius: 6,
	},
	chartLabel: {
		fontFamily: "Inter-Regular",
		fontSize: 10,
		color: "#6B7280",
	},

	// Videos horizontal scroll
	videosScroll: {
		paddingLeft: 20,
		paddingRight: 8,
		gap: 12,
	},
	videoCard: {
		width: 150,
	},
	videoThumbnailContainer: {
		width: 150,
		height: 200,
		borderRadius: 14,
		overflow: "hidden",
		position: "relative",
	},
	videoThumbnail: {
		width: 150,
		height: 200,
	},
	playButtonContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
	},
	videoTimeBadge: {
		position: "absolute",
		top: 8,
		right: 8,
		backgroundColor: "rgba(0,0,0,0.6)",
		borderRadius: 6,
		paddingHorizontal: 7,
		paddingVertical: 3,
	},
	videoTimeBadgeText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 10,
		color: "#FFFFFF",
	},
	videoTitle: {
		fontFamily: "Inter-SemiBold",
		fontSize: 12,
		color: "#FFFFFF",
		marginTop: 8,
	},
	videoStatsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 3,
		marginTop: 4,
	},
	videoStatText: {
		fontFamily: "Inter-Regular",
		fontSize: 11,
		color: "#6B7280",
		marginLeft: 2,
	},

	// Campaign cards (horizontal scroll)
	campaignsScroll: {
		paddingLeft: 20,
		paddingRight: 8,
		gap: 12,
	},
	campaignCard: {
		width: 240,
		height: 180,
		borderRadius: 16,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.06)",
	},
	campaignCardImage: {
		...StyleSheet.absoluteFillObject,
		width: 240,
		height: 180,
	},
	campaignBrandBadge: {
		position: "absolute",
		top: 10,
		left: 10,
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
		backgroundColor: "rgba(0,0,0,0.55)",
		borderRadius: 8,
		paddingHorizontal: 9,
		paddingVertical: 4,
	},
	campaignBrandDot: {
		width: 7,
		height: 7,
		borderRadius: 3.5,
	},
	campaignBrandText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 11,
		color: "#FFFFFF",
	},
	campaignDeadlineBadge: {
		position: "absolute",
		top: 10,
		right: 10,
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		backgroundColor: "rgba(0,0,0,0.55)",
		borderRadius: 8,
		paddingHorizontal: 9,
		paddingVertical: 4,
	},
	campaignDeadlineText: {
		fontFamily: "Inter-Regular",
		fontSize: 11,
		color: "#9CA3AF",
	},
	campaignCardBottom: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		paddingHorizontal: 14,
		paddingBottom: 14,
		gap: 8,
	},
	campaignCardTitle: {
		fontFamily: "StackSans-Bold",
		fontSize: 15,
		color: "#FFFFFF",
	},
	campaignBudgetRow: {
		gap: 6,
	},
	campaignProgressOuter: {
		height: 3,
		borderRadius: 1.5,
		backgroundColor: "rgba(255,255,255,0.12)",
	},
	campaignProgressInner: {
		height: 3,
		borderRadius: 1.5,
		backgroundColor: "#EC4899",
	},
	campaignBudgetText: {
		fontSize: 11,
		fontFamily: "Inter-Regular",
	},
	campaignBudgetSpent: {
		color: "#EC4899",
		fontFamily: "Inter-SemiBold",
	},
	campaignBudgetTotal: {
		color: "#6B7280",
	},

	// Quick Actions
	actionsRow: {
		flexDirection: "row",
		gap: 10,
		paddingHorizontal: 20,
	},
	actionButton: {
		flex: 1,
		borderRadius: 14,
		paddingVertical: 16,
		alignItems: "center",
		overflow: "hidden",
	},
	actionButtonText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 14,
		color: "#FFFFFF",
	},
	actionButtonOutline: {
		flex: 1,
		borderRadius: 14,
		paddingVertical: 16,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.15)",
	},
	actionButtonOutlineText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 14,
		color: "#FFFFFF",
	},
});
