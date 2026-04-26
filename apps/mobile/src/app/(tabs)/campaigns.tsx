import { Image } from "expo-image";
import { useRouter } from "expo-router";
import type React from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { InflioLogo } from "~/components/inflio-logo";

const BADGE_COLORS = {
	REEL: "#22C55E",
	LOGO: "#22C55E",
} as const;

const CAMPAIGNS = [
	{
		id: "1",
		title: "Philips Razor Promotion",
		spent: 230,
		total: 850,
		type: "REEL" as const,
		deadline: "Oct 24, 2023",
		image: "https://picsum.photos/seed/philips/400/200",
	},
	{
		id: "2",
		title: "Nike Summer Collection",
		spent: 500,
		total: 1200,
		type: "REEL" as const,
		deadline: "Nov 15, 2023",
		image: "https://picsum.photos/seed/nike/400/200",
	},
	{
		id: "3",
		title: "Apple Music Campaign",
		spent: 180,
		total: 600,
		type: "LOGO" as const,
		deadline: "Dec 01, 2023",
		image: "https://picsum.photos/seed/apple/400/200",
	},
	{
		id: "4",
		title: "Samsung Galaxy Launch",
		spent: 400,
		total: 1000,
		type: "REEL" as const,
		deadline: "Jan 10, 2024",
		image: "https://picsum.photos/seed/samsung/400/200",
	},
];

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

function SearchIcon() {
	return (
		<Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
			<Circle
				cx={11}
				cy={11}
				r={8}
				stroke="#6B7280"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Line
				x1={21}
				y1={21}
				x2={16.65}
				y2={16.65}
				stroke="#6B7280"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function CampaignCard({
	campaign,
	onDetails,
}: {
	campaign: (typeof CAMPAIGNS)[number];
	onDetails: () => void;
}) {
	const progress = campaign.spent / campaign.total;

	return (
		<View style={styles.card}>
			<View style={styles.thumbnailContainer}>
				<Image
					source={{ uri: campaign.image }}
					style={styles.thumbnail}
					contentFit="cover"
				/>
				<View
					style={[
						styles.typeBadge,
						{ backgroundColor: BADGE_COLORS[campaign.type] },
					]}
				>
					<Text style={styles.typeBadgeText}>{campaign.type}</Text>
				</View>
			</View>

			<View style={styles.cardContent}>
				<Text style={styles.cardTitle}>{campaign.title}</Text>

				<Text style={styles.sectionLabel}>BUDGET UTILIZATION</Text>
				<View style={styles.budgetRow}>
					<Text style={styles.budgetSpent}>${campaign.spent}</Text>
					<Text style={styles.budgetTotal}> of ${campaign.total} paid</Text>
				</View>
				<View style={styles.progressBarBg}>
					<View
						style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
					/>
				</View>

				<Text style={styles.sectionLabel}>DEADLINE</Text>
				<View style={styles.deadlineRow}>
					<Text style={styles.deadlineText}>{campaign.deadline}</Text>
					<TouchableOpacity style={styles.detailsButton} onPress={onDetails}>
						<Text style={styles.detailsButtonText}>Details</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

export default function CampaignsScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeArea} edges={["top"]}>
				<View style={styles.header}>
					<InflioLogo height={20} />
					<TouchableOpacity>
						<BellIcon />
					</TouchableOpacity>
				</View>

				<View style={styles.headingRow}>
					<Text style={styles.heading}>Campaigns</Text>
				</View>

				<View style={styles.searchContainer}>
					<TextInput
						style={styles.searchInput}
						placeholder="Find campaigns"
						placeholderTextColor="#6B7280"
					/>
					<View style={styles.searchIconContainer}>
						<SearchIcon />
					</View>
				</View>

				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={{
						paddingBottom: insets.bottom + 100,
						paddingHorizontal: 16,
					}}
					showsVerticalScrollIndicator={false}
				>
					{CAMPAIGNS.map((campaign) => (
						<CampaignCard
							key={campaign.id}
							campaign={campaign}
							onDetails={() => router.push(`/campaign/${campaign.id}`)}
						/>
					))}
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
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	headingRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		marginTop: 8,
	},
	heading: {
		fontSize: 28.5,
		fontFamily: "StackSansHeadline-Medium",
		color: "#F5E8E8",
	},
	searchContainer: {
		paddingHorizontal: 16,
		marginTop: 16,
		marginBottom: 16,
	},
	searchInput: {
		backgroundColor: "#1A1A1A",
		borderWidth: 1,
		borderColor: "#2A2A2A",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		color: "#FFFFFF",
		fontFamily: "Inter-Regular",
		fontSize: 14,
		paddingRight: 44,
	},
	searchIconContainer: {
		position: "absolute",
		right: 28,
		top: 0,
		bottom: 0,
		justifyContent: "center",
	},
	scrollView: {
		flex: 1,
	},
	card: {
		backgroundColor: "#1A1A1A",
		borderRadius: 16,
		overflow: "hidden",
		marginBottom: 16,
	},
	thumbnailContainer: {
		position: "relative",
	},
	thumbnail: {
		width: "100%",
		height: 200,
	},
	typeBadge: {
		position: "absolute",
		top: 12,
		left: 12,
		borderRadius: 6,
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	typeBadgeText: {
		color: "#FFFFFF",
		fontSize: 11,
		fontFamily: "Inter-SemiBold",
	},
	cardContent: {
		padding: 16,
	},
	cardTitle: {
		fontSize: 18,
		fontFamily: "StackSans-Bold",
		color: "#FFFFFF",
	},
	sectionLabel: {
		fontSize: 10,
		fontFamily: "Inter-SemiBold",
		color: "#6B7280",
		letterSpacing: 1,
		marginTop: 12,
	},
	budgetRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 4,
	},
	budgetSpent: {
		fontSize: 13,
		fontFamily: "Inter-Regular",
		color: "#3B82F6",
	},
	budgetTotal: {
		fontSize: 13,
		fontFamily: "Inter-Regular",
		color: "#6B7280",
	},
	progressBarBg: {
		height: 4,
		borderRadius: 2,
		backgroundColor: "#2A2A2A",
		marginTop: 8,
	},
	progressBarFill: {
		height: 4,
		borderRadius: 2,
		backgroundColor: "#3B82F6",
	},
	deadlineRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 4,
	},
	deadlineText: {
		fontSize: 14,
		fontFamily: "Inter-SemiBold",
		color: "#FFFFFF",
	},
	detailsButton: {
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.15)",
		borderRadius: 20,
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	detailsButtonText: {
		fontSize: 13,
		fontFamily: "Inter-SemiBold",
		color: "#FFFFFF",
	},
});
