import { useMutation } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useAuth } from "~/providers/auth";
import { api } from "../../convex/_generated/api";

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

function TrashIcon() {
	return (
		<Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
			<Path
				d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M10 11v6M14 11v6"
				stroke="#ef4444"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

export default function SettingsScreen() {
	const { user, signOut } = useAuth();
	const disableCreator = useMutation(api.creators.disableAccount);
	const disableBrand = useMutation(api.brands.disableAccount);
	const [deleting, setDeleting] = useState(false);

	async function handleLogout() {
		await signOut();
		router.replace("/login");
	}

	function handleDeleteAccount() {
		Alert.alert(
			"Delete Account",
			"Are you sure you want to delete your account? Your profile will be deactivated and you will be logged out. This action can only be reversed by contacting support.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						if (!user?.id) return;
						setDeleting(true);
						try {
							await disableCreator({ userId: user.id });
							await disableBrand({ userId: user.id });
							await signOut();
							router.replace("/login");
						} catch {
							setDeleting(false);
							Alert.alert("Error", "Failed to delete account. Please try again.");
						}
					},
				},
			],
		);
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
						styles.menuBtn,
						pressed && { opacity: 0.85 },
					]}
					onPress={handleLogout}
				>
					<LogOutIcon />
					<Text style={styles.logoutText}>Log out</Text>
				</Pressable>

				<Pressable
					style={({ pressed }) => [
						styles.menuBtn,
						styles.deleteBtn,
						pressed && { opacity: 0.85 },
						deleting && { opacity: 0.5 },
					]}
					onPress={handleDeleteAccount}
					disabled={deleting}
				>
					<TrashIcon />
					<Text style={styles.deleteText}>
						{deleting ? "Deleting..." : "Delete account"}
					</Text>
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
		backgroundColor: "#0f0f12",
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
		gap: 12,
	},
	menuBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		backgroundColor: "#0f0f12",
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "#2A2A2E",
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	deleteBtn: {
		borderColor: "rgba(239,68,68,0.2)",
	},
	logoutText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: "#fb7185",
	},
	deleteText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: "#ef4444",
	},
});
