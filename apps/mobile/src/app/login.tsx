import { useConvex } from "convex/react";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useAuth } from "~/providers/auth";
import { api } from "../../convex/_generated/api";

WebBrowser.maybeCompleteAuthSession();

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function AppleIcon() {
	return (
		<Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
			<Path
				d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
				fill="#FFFFFF"
			/>
		</Svg>
	);
}

function GoogleIcon() {
	return (
		<Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
			<Path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
				fill="#4285F4"
			/>
			<Path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#34A853"
			/>
			<Path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 4.93l3.66-2.84z"
				fill="#FBBC05"
			/>
			<Path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#EA4335"
			/>
		</Svg>
	);
}

// ---------------------------------------------------------------------------
// Login Screen
// ---------------------------------------------------------------------------

export default function LoginScreen() {
	const { signInWithGoogle, sendOtp } = useAuth();
	const convex = useConvex();
	const insets = useSafeAreaInsets();
	const socialSignInRef = useRef(false);

	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingGoogle, setLoadingGoogle] = useState(false);

	// Pre-warm browser for OAuth
	useEffect(() => {
		if (Platform.OS === "android") {
			WebBrowser.warmUpAsync();
			return () => {
				WebBrowser.coolDownAsync();
			};
		}
	}, []);

	async function handleGetOtp() {
		if (!email.trim()) return;
		const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
		if (!valid) {
			setError("Please enter a valid email address.");
			return;
		}
		setError("");
		setLoading(true);

		try {
			const result = await sendOtp(email.trim());
			if (result?.error) {
				setError(result.error);
			} else {
				router.push({
					pathname: "/verify-otp",
					params: { email: email.trim() },
				});
			}
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	async function handleGoogle() {
		if (socialSignInRef.current) return;
		socialSignInRef.current = true;
		setError("");
		setLoadingGoogle(true);
		try {
			const result = await signInWithGoogle();
			if (result?.error) {
				setError(result.error);
				return;
			}
			// Navigate based on whether user has a profile
			if (result?.user?.id) {
				try {
					const profile = await convex.query(api.creators.getByUserId, {
						userId: result.user.id,
					});
					if (profile) {
						router.replace("/(tabs)");
						return;
					}
				} catch {
					// No profile — go to onboarding
				}
			}
			router.replace("/onboarding");
		} catch {
			setError("Google sign in failed. Please try again.");
		} finally {
			setLoadingGoogle(false);
			socialSignInRef.current = false;
		}
	}

	async function handleApple() {
		// Apple sign-in stub — will be implemented with expo-apple-authentication
		setError("Apple sign in coming soon.");
	}

	return (
		<View style={styles.container}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						paddingTop: insets.top,
						paddingBottom: insets.bottom + 16,
					}}
					keyboardShouldPersistTaps="handled"
				>
					{/* Image placeholder — replace with gif/image later */}
					<View style={styles.imageSection}>
						<View style={styles.imagePlaceholder}>
							{/* This is where the gif/image will go */}
							{/* Use: <Image source={require('../../assets/welcome.gif')} style={styles.heroImage} /> */}
							<View style={styles.placeholderDots}>
								{[0, 1, 2, 3, 4].map((i) => (
									<View
										key={`dot-${i}`}
										style={[
											styles.placeholderDot,
											{ opacity: 0.15 + i * 0.15 },
										]}
									/>
								))}
							</View>
						</View>
					</View>

					{/* Text */}
					<View style={styles.textSection}>
						<Text style={styles.heading}>Welcome</Text>
						<Text style={styles.subheading}>Your journey starts from here</Text>
					</View>

					{/* Email + OTP */}
					<View style={styles.formSection}>
						{error ? <Text style={styles.errorText}>{error}</Text> : null}

						<View style={styles.inputWrap}>
							<TextInput
								style={styles.emailInput}
								placeholder="Enter your email"
								placeholderTextColor="#6B7280"
								value={email}
								onChangeText={(t) => {
									setEmail(t);
									if (error) setError("");
								}}
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
								editable={!loading}
							/>
						</View>

						<Pressable
							style={({ pressed }) => [
								styles.otpBtn,
								(!email.trim() || loading) && styles.btnDisabled,
								pressed && email.trim() && !loading && { opacity: 0.85 },
							]}
							onPress={handleGetOtp}
							disabled={!email.trim() || loading}
						>
							{loading ? (
								<ActivityIndicator color="#0a0a0c" size="small" />
							) : (
								<Text style={styles.otpBtnText}>Get OTP</Text>
							)}
						</Pressable>
					</View>

					{/* Social buttons */}
					<View style={styles.socialSection}>
						<Pressable
							style={({ pressed }) => [
								styles.appleBtn,
								loadingGoogle && { opacity: 0.6 },
								pressed && !loadingGoogle && { opacity: 0.85 },
							]}
							onPress={handleGoogle}
							disabled={loadingGoogle}
						>
							{loadingGoogle ? (
								<ActivityIndicator color="#000000" size="small" />
							) : (
								<>
									<GoogleIcon />
									<Text style={styles.appleBtnText}>Continue with Google</Text>
								</>
							)}
						</Pressable>

						<Pressable
							style={({ pressed }) => [
								styles.googleBtn,
								pressed && { opacity: 0.85 },
							]}
							onPress={handleApple}
						>
							<AppleIcon />
							<Text style={styles.googleBtnText}>Continue with Apple</Text>
						</Pressable>
					</View>

					{/* Terms */}
					<View style={styles.termsSection}>
						<Text style={styles.termsText}>
							By pressing on "Continue with..." you agree{"\n"}to our{" "}
							<Text style={styles.termsLink}>Terms of Service</Text> and{" "}
							<Text style={styles.termsLink}>Privacy Policy</Text>
						</Text>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},
	imageSection: {
		alignItems: "center",
		paddingTop: 20,
		paddingBottom: 10,
	},
	imagePlaceholder: {
		width: 280,
		height: 280,
		alignItems: "center",
		justifyContent: "center",
	},
	placeholderDots: {
		flexDirection: "row",
		gap: 8,
	},
	placeholderDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#d9f99d",
	},
	textSection: {
		alignItems: "center",
		paddingHorizontal: 24,
		marginBottom: 32,
	},
	heading: {
		fontFamily: "StackSansHeadline-Medium",
		fontSize: 36,
		color: "#FFFFFF",
		marginBottom: 8,
	},
	subheading: {
		fontFamily: "Inter-Regular",
		fontSize: 16,
		color: "#9CA3AF",
	},
	formSection: {
		paddingHorizontal: 24,
		gap: 12,
		marginBottom: 20,
	},
	errorText: {
		fontFamily: "Inter-Regular",
		fontSize: 13,
		color: "#fb7185",
		textAlign: "center",
	},
	inputWrap: {
		width: "100%",
	},
	emailInput: {
		backgroundColor: "#0f0f12",
		borderWidth: 1,
		borderColor: "#2A2A2E",
		borderRadius: 14,
		paddingHorizontal: 18,
		height: 52,
		fontSize: 16,
		fontFamily: "Inter-Regular",
		color: "#FFFFFF",
	},
	otpBtn: {
		height: 52,
		backgroundColor: "#d9f99d",
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
	},
	otpBtnText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: "#0a0a0c",
	},
	btnDisabled: {
		opacity: 0.4,
	},
	socialSection: {
		paddingHorizontal: 24,
		gap: 12,
		marginBottom: 24,
	},
	appleBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		height: 52,
		backgroundColor: "#FFFFFF",
		borderRadius: 14,
	},
	appleBtnText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: "#000000",
	},
	googleBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		height: 52,
		backgroundColor: "#0f0f12",
		borderRadius: 14,
	},
	googleBtnText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: "#FFFFFF",
	},
	termsSection: {
		paddingHorizontal: 24,
		alignItems: "center",
	},
	termsText: {
		fontFamily: "Inter-Regular",
		fontSize: 12,
		color: "#6B7280",
		textAlign: "center",
		lineHeight: 18,
	},
	termsLink: {
		textDecorationLine: "underline",
		color: "#9CA3AF",
	},
});
