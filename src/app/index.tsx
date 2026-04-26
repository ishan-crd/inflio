import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InflioLogo } from "~/components/inflio-logo";

export default function LandingScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.logoContainer}>
					<InflioLogo height={36} />
					<Text style={styles.tagline}>Create. Share. Earn.</Text>
				</View>
			</View>

			<View style={styles.footer}>
				<Pressable
					style={({ pressed }) => [
						styles.button,
						pressed && styles.buttonPressed,
					]}
					onPress={() => router.push("/login")}
				>
					<Text style={styles.buttonText}>Get Started</Text>
				</Pressable>

				<Text style={styles.loginPrompt}>
					Already have an account?{" "}
					<Text style={styles.loginLink} onPress={() => router.push("/login")}>
						Log in
					</Text>
				</Text>
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
		alignItems: "center",
	},
	logoContainer: {
		alignItems: "center",
		gap: 12,
	},
	tagline: {
		fontSize: 16,
		fontFamily: "Inter-Regular",
		color: "#9CA3AF",
	},
	footer: {
		paddingBottom: 16,
		gap: 20,
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
	loginPrompt: {
		textAlign: "center",
		fontSize: 14,
		fontFamily: "Inter-Regular",
		color: "#9CA3AF",
	},
	loginLink: {
		color: "#EC4899",
		fontFamily: "Inter-SemiBold",
	},
});
