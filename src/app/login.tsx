import { router } from "expo-router";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InflioLogo } from "~/components/inflio-logo";

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = () => {
		router.replace("/(tabs)");
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={styles.keyboardView}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<View style={styles.header}>
					<InflioLogo height={28} />
				</View>

				<View style={styles.formContainer}>
					<Text style={styles.heading}>Welcome back</Text>

					<View style={styles.inputGroup}>
						<TextInput
							style={styles.input}
							placeholder="Email address"
							placeholderTextColor="#6B7280"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
						/>

						<TextInput
							style={styles.input}
							placeholder="Password"
							placeholderTextColor="#6B7280"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
						/>
					</View>

					<Pressable
						style={({ pressed }) => [
							styles.button,
							pressed && styles.buttonPressed,
						]}
						onPress={handleLogin}
					>
						<Text style={styles.buttonText}>Log in</Text>
					</Pressable>
				</View>

				<View style={styles.footer}>
					<Text style={styles.signupPrompt}>
						Don't have an account?{" "}
						<Text style={styles.signupLink}>Sign up</Text>
					</Text>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},
	keyboardView: {
		flex: 1,
		paddingHorizontal: 24,
	},
	header: {
		paddingTop: 32,
		alignItems: "center",
	},
	formContainer: {
		flex: 1,
		justifyContent: "center",
		gap: 28,
	},
	heading: {
		fontSize: 28,
		fontFamily: "StackSansHeadline-Medium",
		color: "#F5E8E8",
	},
	inputGroup: {
		gap: 14,
	},
	input: {
		backgroundColor: "#1A1A1A",
		borderWidth: 1,
		borderColor: "#2A2A2A",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		fontFamily: "Inter-Regular",
		color: "#FFFFFF",
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
	footer: {
		paddingBottom: 16,
		alignItems: "center",
	},
	signupPrompt: {
		fontSize: 14,
		fontFamily: "Inter-Regular",
		color: "#9CA3AF",
	},
	signupLink: {
		color: "#EC4899",
		fontFamily: "Inter-SemiBold",
	},
});
