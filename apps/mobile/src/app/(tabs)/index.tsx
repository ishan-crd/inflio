import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { type DimensionValue, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { api } from "../../../convex/_generated/api";
import { InflioLogo } from "~/components/inflio-logo";
import { useAuth } from "~/providers/auth";

function Skel({ w, h, r = 8, mb = 0 }: { w: DimensionValue; h: number; r?: number; mb?: number }) {
	return <View style={{ width: w, height: h, borderRadius: r, marginBottom: mb, backgroundColor: "rgba(255,255,255,0.06)" }} />;
}

// Dashboard data is fetched from Convex where available

// Active campaigns are now fetched from Convex

// Applications are now fetched from Convex

const WEEKLY_EARNINGS = [
	{ day: "Mon", amount: 0 },
	{ day: "Tue", amount: 0 },
	{ day: "Wed", amount: 0 },
	{ day: "Thu", amount: 0 },
	{ day: "Fri", amount: 0 },
	{ day: "Sat", amount: 0 },
	{ day: "Sun", amount: 0 },
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

// ── Application Card ─────────────────────────────────────────────────

const STATUS_CONFIG = {
	pending: { label: "Pending", color: "#FBBF24", bg: "rgba(251,191,36,0.12)" },
	accepted: { label: "Accepted", color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
	rejected: { label: "Rejected", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
} as const;

function ApplicationCard({
	app,
}: {
	app: {
		_id: string;
		campaignTitle: string;
		campaignBrand: string;
		status: string;
		platform: string;
		_creationTime: number;
	};
}) {
	const statusKey = app.status as keyof typeof STATUS_CONFIG;
	const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
	const appliedDate = new Date(app._creationTime).toLocaleDateString("en-IN", {
		month: "short",
		day: "numeric",
	});
	return (
		<View style={styles.appCard}>
			<View style={styles.appCardTop}>
				<View style={{ flex: 1 }}>
					<Text style={styles.appBrand}>{app.campaignBrand}</Text>
					<Text style={styles.appTitle} numberOfLines={1}>
						{app.campaignTitle}
					</Text>
				</View>
				<View style={[styles.appStatusBadge, { backgroundColor: status.bg }]}>
					<Text style={[styles.appStatusText, { color: status.color }]}>
						{status.label}
					</Text>
				</View>
			</View>
			<View style={styles.appCardBottom}>
				<Text style={styles.appMeta}>{app.platform}</Text>
				<View style={styles.appDotSep} />
				<Text style={styles.appMeta}>Applied {appliedDate}</Text>
			</View>
		</View>
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
					<Text style={styles.earningsTotal}>₹0.00</Text>
				</View>
				<View style={styles.earningsBadge}>
					<TrendUpIcon />
					<Text style={styles.earningsBadgeText}>—</Text>
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

// ── Campaign Card ────────────────────────────────────────────────────

function DashboardCampaignCard({
	campaign,
	onPress,
}: {
	campaign: {
		_id: string;
		brand: string;
		brandLogoColors: string[];
		title: string;
		deadline: string;
		spotsLeft: number;
		totalSpots: number;
		platform: string;
		currency: string;
		rate: number;
	};
	onPress: () => void;
}) {
	const spotsUsed = campaign.totalSpots - campaign.spotsLeft;
	const percent = Math.round((spotsUsed / campaign.totalSpots) * 100);

	return (
		<Pressable onPress={onPress} style={styles.campaignCard}>
			<LinearGradient
				colors={[campaign.brandLogoColors[0] || "#1a2e05", "#000000"]}
				locations={[0, 0.7]}
				style={StyleSheet.absoluteFill}
			/>

			{/* Brand badge top-left */}
			<View style={styles.campaignBrandBadge}>
				<View
					style={[
						styles.campaignBrandDot,
						{ backgroundColor: campaign.brandLogoColors[1] || "#bef264" },
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
						<Text style={styles.campaignBudgetSpent}>
							{spotsUsed} spots filled
						</Text>
						<Text style={styles.campaignBudgetTotal}>
							{" "}
							/ {campaign.totalSpots}
						</Text>
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
	const { user } = useAuth();
	const applications = useQuery(
		api.applications.listByUser,
		user?.id ? { userId: user.id } : "skip",
	);
	const campaigns = useQuery(api.campaigns.listActiveWithBrands);

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			{/* Header */}
			<View style={styles.header}>
				<InflioLogo height={45} />
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

				{/* Recent Videos - shown when submissions exist */}

				{/* My Applications */}
				{applications === undefined && (
					<View style={styles.sectionContainer}>
						<SectionHeader title="My Applications" />
						<View style={styles.appList}>
							{[0, 1].map((i) => (
								<Skel key={i} w="100%" h={72} r={14} />
							))}
						</View>
					</View>
				)}
				{applications && applications.length > 0 && (
					<View style={styles.sectionContainer}>
						<SectionHeader title="My Applications" onSeeAll={() => {}} />
						<View style={styles.appList}>
							{applications.slice(0, 4).map((app) => (
								<ApplicationCard key={app._id} app={app} />
							))}
						</View>
					</View>
				)}

				{/* Active Campaigns */}
				{campaigns === undefined && (
					<View style={styles.sectionContainer}>
						<SectionHeader title="Active Campaigns" />
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.campaignsScroll}
						>
							{[0, 1].map((i) => (
								<Skel key={i} w={240} h={180} r={16} />
							))}
						</ScrollView>
					</View>
				)}
				{campaigns && campaigns.length > 0 && (
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
							{campaigns.slice(0, 5).map((campaign) => (
								<DashboardCampaignCard
									key={campaign._id}
									campaign={campaign}
									onPress={() => router.push(`/campaign/${campaign._id}`)}
								/>
							))}
						</ScrollView>
					</View>
				)}

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
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 12,
		paddingBottom: 8,
	},
	bellButton: {
		width: 44,
		height: 44,
		borderRadius: 12,
		backgroundColor: "#0f0f12",
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
		backgroundColor: "#0f0f12",
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

	// Applications
	appList: {
		paddingHorizontal: 20,
		gap: 10,
	},
	appCard: {
		backgroundColor: "#0f0f12",
		borderRadius: 14,
		padding: 14,
		borderWidth: 1,
		borderColor: "#2A2A2A",
		gap: 10,
	},
	appCardTop: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		gap: 12,
	},
	appBrand: {
		fontFamily: "Inter-Regular",
		fontSize: 11,
		color: "#6B7280",
	},
	appTitle: {
		fontFamily: "Inter-SemiBold",
		fontSize: 14,
		color: "#FFFFFF",
		marginTop: 2,
	},
	appStatusBadge: {
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	appStatusText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 11,
	},
	appCardBottom: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	appMeta: {
		fontFamily: "Inter-Regular",
		fontSize: 11,
		color: "#6B7280",
	},
	appDotSep: {
		width: 3,
		height: 3,
		borderRadius: 1.5,
		backgroundColor: "#4B5563",
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
