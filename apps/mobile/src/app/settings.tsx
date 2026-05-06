import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useAuth } from "~/providers/auth";

function BackArrow() {
	return (
		<Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
			<Path
				d="M19 12H5M12 5l-7 7 7 7"
				stroke="#FFFFFF"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function LogOutIcon() {
	return (
		<Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
			<Path
				d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
				stroke="#fb7185"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

export default function SettingsScreen() {
	const { signOut } = useAuth();

	async function handleLogout() {
		await signOut();
		router.replace("/login");
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backBtn}>
					<BackArrow />
				</Pressable>
				<Text style={styles.headerTitle}>Settings</Text>
				<View style={{ width: 40 }} />
			</View>

			<View style={styles.content}>
				<Pressable
					style={({ pressed }) => [
						styles.logoutBtn,
						pressed && { opacity: 0.85 },
					]}
					onPress={handleLogout}
				>
					<LogOutIcon />
					<Text style={styles.logoutText}>Log out</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0a0a0c",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	backBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#1A1A1E",
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontFamily: "StackSans-SemiBold",
		fontSize: 18,
		color: "#FFFFFF",
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 24,
	},
	logoutBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		backgroundColor: "#1A1A1E",
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "#2A2A2E",
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	logoutText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: "#fb7185",
	},
});
