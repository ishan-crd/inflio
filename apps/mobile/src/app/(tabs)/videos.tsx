import { Image } from "expo-image";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle, Path, Polygon } from "react-native-svg";

const MOCK_VIDEOS = [
	{ id: "1", random: 1 },
	{ id: "2", random: 2 },
	{ id: "3", random: 3 },
	{ id: "4", random: 4 },
	{ id: "5", random: 5 },
	{ id: "6", random: 6 },
];

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

type VideoItem = { id: string; random: number };

function VideoCard({ item }: { item: VideoItem }) {
	return (
		<View style={styles.card}>
			<View style={styles.thumbnailContainer}>
				<Image
					source={{
						uri: `https://picsum.photos/200/300?random=${item.random}`,
					}}
					style={styles.thumbnail}
					contentFit="cover"
				/>
				<PlayButton />
			</View>
			<View style={styles.cardContent}>
				<Text style={styles.usernameRow}>
					<Text style={styles.username}>@ishanxib</Text>
					<Text style={styles.separator}> · </Text>
					<Text style={styles.timeAgo}>3d</Text>
				</Text>
				<Text style={styles.description} numberOfLines={1}>
					EPICBET - Exclusive Football
				</Text>
				<View style={styles.statsRow}>
					<EyeIcon />
					<Text style={styles.statText}>122.0k</Text>
					<View style={{ width: 12 }} />
					<HeartIcon />
					<Text style={styles.statText}>12.0k</Text>
				</View>
			</View>
		</View>
	);
}

export default function VideosScreen() {
	const insets = useSafeAreaInsets();

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<Text style={styles.heading}>Viral Videos</Text>
			<FlatList
				data={MOCK_VIDEOS}
				keyExtractor={(item) => item.id}
				numColumns={2}
				columnWrapperStyle={styles.columnWrapper}
				contentContainerStyle={{
					paddingHorizontal: 20,
					paddingBottom: insets.bottom + 100,
				}}
				renderItem={({ item }) => <VideoCard item={item} />}
				showsVerticalScrollIndicator={false}
			/>
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
	thumbnail: {
		height: 200,
		width: "100%",
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
