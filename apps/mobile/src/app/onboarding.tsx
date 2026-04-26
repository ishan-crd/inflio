import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.textContainer}>
					<Text style={styles.heading}>Welcome to Inflio</Text>
					<Text style={styles.subtitle}>
						Your all-in-one platform for creating content, sharing with your
						audience, and earning from brand collaborations. Let's get you set
						up.
					</Text>
				</View>
			</View>

			<View style={styles.footer}>
				<Pressable
					style={({ pressed }) => [
						styles.button,
						pressed && styles.buttonPressed,
					]}
					onPress={() => router.replace("/(tabs)")}
				>
					<Text style={styles.buttonText}>Continue</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
		paddingHorizontal: 24,
	},
	content: {
		flex: 1,
		justifyContent: "center",
	},
	textContainer: {
		gap: 16,
	},
	heading: {
		fontSize: 28,
		fontFamily: "StackSansHeadline-Medium",
		color: "#F5E8E8",
	},
	subtitle: {
		fontSize: 16,
		fontFamily: "Inter-Regular",
		color: "#9CA3AF",
		lineHeight: 24,
	},
	footer: {
		paddingBottom: 16,
	},
	button: {
		backgroundColor: "#EC4899",
		borderRadius: 14,
		paddingVertical: 16,
		alignItems: "center",
	},
	buttonPressed: {
		opacity: 0.85,
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontFamily: "Inter-SemiBold",
	},
});
