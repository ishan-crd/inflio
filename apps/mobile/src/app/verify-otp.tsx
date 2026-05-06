import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

// import { useAuth } from "~/providers/auth";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

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

export default function VerifyOtpScreen() {
	const params = useLocalSearchParams<{ email?: string }>();
	const email = params.email || "";
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
	const hiddenInputRef = useRef<TextInput>(null);

	// Resend countdown
	useEffect(() => {
		if (resendTimer <= 0) return;
		const t = setInterval(() => setResendTimer((v) => v - 1), 1000);
		return () => clearInterval(t);
	}, [resendTimer]);

	async function handleVerify(otpOverride?: string) {
		const code = otpOverride ?? otp;
		if (code.length < OTP_LENGTH) return;
		setError("");
		setLoading(true);

		// TODO: Wire to real OTP verification. For now, accept any 6-digit code.
		// Route to onboarding for new users (always for now).
		router.replace("/onboarding");
	}

	function handleResend() {
		if (resendTimer > 0) return;
		setResendTimer(RESEND_COOLDOWN);
		// TODO: Call actual OTP resend API
	}

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				{/* Header */}
				<View style={styles.header}>
					<Pressable onPress={() => router.back()} style={styles.backBtn}>
						<BackArrow />
					</Pressable>
				</View>

				<View style={styles.content}>
					<Text style={styles.heading}>Verify your email</Text>
					<Text style={styles.subheading}>
						We sent a code to {email}. Enter it below.
					</Text>

					{/* OTP Input */}
					<Pressable
						onPress={() => hiddenInputRef.current?.focus()}
						style={styles.otpRow}
					>
						<TextInput
							ref={hiddenInputRef}
							value={otp}
							onChangeText={(t) => {
								const val = t.replace(/\D/g, "").slice(0, OTP_LENGTH);
								setOtp(val);
								if (error) setError("");
								if (val.length === OTP_LENGTH) {
									handleVerify(val);
								}
							}}
							keyboardType="number-pad"
							textContentType="oneTimeCode"
							autoComplete="sms-otp"
							autoFocus
							maxLength={OTP_LENGTH}
							editable={!loading}
							caretHidden
							selectionColor="transparent"
							style={styles.hiddenInput}
						/>
						{Array.from({ length: OTP_LENGTH }).map((_, i) => {
							const digit = otp[i] ?? "";
							const isCurrent = i === otp.length;
							const hasError = !!error && otp.length === OTP_LENGTH;
							return (
								<View
									key={`otp-${i}`}
									style={[
										styles.otpBox,
										isCurrent && styles.otpBoxFocused,
										hasError && styles.otpBoxError,
									]}
								>
									<Text
										style={[
											styles.otpDigit,
											!digit && styles.otpDigitPlaceholder,
										]}
									>
										{digit || "0"}
									</Text>
								</View>
							);
						})}
					</Pressable>

					{/* Error */}
					{error ? <Text style={styles.errorText}>{error}</Text> : null}

					{/* Resend */}
					<View style={styles.resendRow}>
						<Text style={styles.resendLabel}>Didn't get a code?</Text>
						{resendTimer > 0 ? (
							<Text style={styles.resendTimer}>{resendTimer}s</Text>
						) : (
							<Pressable onPress={handleResend}>
								<Text style={styles.resendLink}>Resend Code</Text>
							</Pressable>
						)}
					</View>

					{/* Submit */}
					<Pressable
						style={({ pressed }) => [
							styles.submitBtn,
							(loading || otp.length < OTP_LENGTH) && styles.btnDisabled,
							pressed &&
								!loading &&
								otp.length === OTP_LENGTH && { opacity: 0.85 },
						]}
						onPress={() => handleVerify()}
						disabled={loading || otp.length < OTP_LENGTH}
					>
						{loading ? (
							<ActivityIndicator color="#0a0a0c" size="small" />
						) : (
							<Text style={styles.submitBtnText}>Verify</Text>
						)}
					</Pressable>

					{/* Go back */}
					<Pressable
						onPress={() => router.back()}
						disabled={loading}
						style={({ pressed }) => [
							styles.goBackBtn,
							pressed && { opacity: 0.85 },
						]}
					>
						<Text style={styles.goBackText}>Use a different email</Text>
					</Pressable>
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
	header: {
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
	content: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 20,
	},
	heading: {
		fontFamily: "StackSansHeadline-Medium",
		fontSize: 28,
		color: "#FFFFFF",
		marginBottom: 10,
	},
	subheading: {
		fontFamily: "Inter-Regular",
		fontSize: 15,
		color: "#9CA3AF",
		lineHeight: 22,
		marginBottom: 32,
	},
	otpRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 8,
		marginBottom: 12,
	},
	hiddenInput: {
		position: "absolute",
		zIndex: 1,
		height: 56,
		width: "100%",
		color: "transparent",
		backgroundColor: "transparent",
		fontSize: 1,
	},
	otpBox: {
		flex: 1,
		height: 56,
		borderWidth: 1.5,
		borderColor: "#2A2A2E",
		borderRadius: 12,
		backgroundColor: "#1A1A1E",
		alignItems: "center",
		justifyContent: "center",
	},
	otpBoxFocused: {
		borderColor: "#d9f99d",
	},
	otpBoxError: {
		borderColor: "#fb7185",
		backgroundColor: "rgba(251,113,133,0.05)",
	},
	otpDigit: {
		fontFamily: "Inter-SemiBold",
		fontSize: 22,
		color: "#FFFFFF",
	},
	otpDigitPlaceholder: {
		color: "#3f3f46",
	},
	errorText: {
		fontFamily: "Inter-Regular",
		fontSize: 13,
		color: "#fb7185",
		marginBottom: 4,
	},
	resendRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginBottom: 28,
		marginTop: 4,
	},
	resendLabel: {
		fontFamily: "Inter-Regular",
		fontSize: 14,
		color: "#9CA3AF",
	},
	resendTimer: {
		fontFamily: "Inter-SemiBold",
		fontSize: 14,
		color: "#6B7280",
	},
	resendLink: {
		fontFamily: "Inter-SemiBold",
		fontSize: 14,
		color: "#d9f99d",
	},
	submitBtn: {
		height: 52,
		backgroundColor: "#d9f99d",
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 12,
	},
	submitBtnText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: "#0a0a0c",
	},
	btnDisabled: {
		opacity: 0.4,
	},
	goBackBtn: {
		height: 52,
		backgroundColor: "#1A1A1E",
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "#2A2A2E",
		alignItems: "center",
		justifyContent: "center",
	},
	goBackText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 14,
		color: "#9CA3AF",
	},
});
