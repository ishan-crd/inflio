import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { type DimensionValue, FlatList, StyleSheet, Text, View } from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle, Path, Polygon } from "react-native-svg";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "~/providers/auth";

function Skel({ w, h, r = 8, mb = 0 }: { w: DimensionValue; h: number; r?: number; mb?: number }) {
	return <View style={{ width: w, height: h, borderRadius: r, marginBottom: mb, backgroundColor: "rgba(255,255,255,0.06)" }} />;
}

function PlayButton() {
	return (
		<View style={styles.playButtonContainer}>
			<Svg width={36} height={36} viewBox="0 0 36 36">
				<Circle cx={18} cy={18} r={18} fill="rgba(0,0,0,0.5)" />
				<Polygon points="14,11 14,25 26,18" fill="white" />
			</Svg>
		</View>
	);
}

function EyeIcon() {
	return (
		<Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
			<Path
				d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
				stroke="#6B7280"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Circle cx={12} cy={12} r={3} stroke="#6B7280" strokeWidth={2} />
		</Svg>
	);
}

function HeartIcon() {
	return (
		<Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
			<Path
				d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
				stroke="#6B7280"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function fmtNumber(n: number | undefined): string {
	if (!n) return "0";
	if (n >= 1000000) return `${(n / 1000000).toFixed(1)}m`;
	if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
	return String(n);
}

type Submission = {
	_id: string;
	contentUrl: string;
	contentType: string;
	views?: number;
	likes?: number;
	userName: string;
	submittedAt: string;
	platform: string;
};

function VideoCard({ item }: { item: Submission }) {
	const timeAgo = (() => {
		const diff = Date.now() - new Date(item.submittedAt).getTime();
		const days = Math.floor(diff / 86400000);
		if (days > 0) return `${days}d`;
		const hours = Math.floor(diff / 3600000);
		if (hours > 0) return `${hours}h`;
		return "now";
	})();

	return (
		<View style={styles.card}>
			<View style={styles.thumbnailContainer}>
				<View style={styles.thumbnailPlaceholder}>
					<Text style={styles.thumbnailPlatform}>{item.platform}</Text>
				</View>
				<PlayButton />
			</View>
			<View style={styles.cardContent}>
				<Text style={styles.usernameRow}>
					<Text style={styles.username}>{item.userName}</Text>
					<Text style={styles.separator}> · </Text>
					<Text style={styles.timeAgo}>{timeAgo}</Text>
				</Text>
				<Text style={styles.description} numberOfLines={1}>
					{item.contentType} on {item.platform}
				</Text>
				<View style={styles.statsRow}>
					<EyeIcon />
					<Text style={styles.statText}>{fmtNumber(item.views)}</Text>
					<View style={{ width: 12 }} />
					<HeartIcon />
					<Text style={styles.statText}>{fmtNumber(item.likes)}</Text>
				</View>
			</View>
		</View>
	);
}

export default function VideosScreen() {
	const insets = useSafeAreaInsets();
	const { user } = useAuth();
	const submissions = useQuery(
		api.submissions.listByUser,
		user?.id ? { userId: user.id } : "skip",
	);

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<Text style={styles.heading}>Viral Videos</Text>
			{submissions === undefined ? (
				<View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
					<View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
						<View style={{ flex: 1 }}><Skel w="100%" h={200} r={12} mb={8} /><Skel w="80%" h={12} r={4} mb={4} /><Skel w="60%" h={10} r={4} /></View>
						<View style={{ flex: 1 }}><Skel w="100%" h={200} r={12} mb={8} /><Skel w="80%" h={12} r={4} mb={4} /><Skel w="60%" h={10} r={4} /></View>
					</View>
					<View style={{ flexDirection: "row", gap: 12 }}>
						<View style={{ flex: 1 }}><Skel w="100%" h={200} r={12} mb={8} /><Skel w="80%" h={12} r={4} mb={4} /><Skel w="60%" h={10} r={4} /></View>
						<View style={{ flex: 1 }}><Skel w="100%" h={200} r={12} mb={8} /><Skel w="80%" h={12} r={4} mb={4} /><Skel w="60%" h={10} r={4} /></View>
					</View>
				</View>
			) : submissions.length === 0 ? (
				<View style={styles.emptyState}>
					<Text style={styles.emptyTitle}>No videos yet</Text>
					<Text style={styles.emptySubtitle}>
						Submit content to campaigns and your videos will appear here.
					</Text>
				</View>
			) : (
				<FlatList
					data={submissions}
					keyExtractor={(item) => item._id}
					numColumns={2}
					columnWrapperStyle={styles.columnWrapper}
					contentContainerStyle={{
						paddingHorizontal: 20,
						paddingBottom: insets.bottom + 100,
					}}
					renderItem={({ item }) => <VideoCard item={item} />}
					showsVerticalScrollIndicator={false}
				/>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},
	heading: {
		fontFamily: "StackSansHeadline-Medium",
		fontSize: 28.5,
		color: "#F5E8E8",
		paddingHorizontal: 20,
		marginTop: 8,
		marginBottom: 16,
	},
	emptyState: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 40,
	},
	emptyTitle: {
		fontFamily: "Inter-SemiBold",
		fontSize: 18,
		color: "#FFFFFF",
	},
	emptySubtitle: {
		fontFamily: "Inter-Regular",
		fontSize: 14,
		color: "#6B7280",
		textAlign: "center",
		marginTop: 8,
	},
	columnWrapper: {
		gap: 12,
	},
	card: {
		flex: 1,
		marginBottom: 16,
	},
	thumbnailContainer: {
		borderRadius: 12,
		height: 200,
		width: "100%",
		overflow: "hidden",
		position: "relative",
	},
	thumbnailPlaceholder: {
		height: 200,
		width: "100%",
		backgroundColor: "#0f0f12",
		alignItems: "center",
		justifyContent: "center",
	},
	thumbnailPlatform: {
		fontFamily: "Inter-SemiBold",
		fontSize: 12,
		color: "#6B7280",
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
	cardContent: {
		padding: 8,
	},
	usernameRow: {
		marginBottom: 2,
	},
	username: {
		fontFamily: "Inter-SemiBold",
		fontSize: 12,
		color: "#FFFFFF",
	},
	separator: {
		fontFamily: "Inter-Regular",
		fontSize: 12,
		color: "#6B7280",
	},
	timeAgo: {
		fontFamily: "Inter-Regular",
		fontSize: 12,
		color: "#6B7280",
	},
	description: {
		fontFamily: "Inter-Regular",
		fontSize: 12,
		color: "#9CA3AF",
		marginBottom: 4,
	},
	statsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	statText: {
		fontFamily: "Inter-Regular",
		fontSize: 11,
		color: "#6B7280",
		marginLeft: 4,
	},
});
