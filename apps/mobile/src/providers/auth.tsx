import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { authClient } from "~/utils/auth-client";

interface User {
	id: string;
	name: string;
	email: string;
	image?: string;
}

interface AuthContextValue {
	user: User | null;
	loading: boolean;
	signInWithGoogle: () => Promise<{ error?: string }>;
	sendOtp: (email: string) => Promise<{ error?: string }>;
	verifyOtp: (
		email: string,
		otp: string,
	) => Promise<{ error?: string; user?: User }>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
	user: null,
	loading: true,
	signInWithGoogle: async () => ({ error: "Not initialized" }),
	sendOtp: async () => ({ error: "Not initialized" }),
	verifyOtp: async () => ({ error: "Not initialized" }),
	signOut: async () => {},
});

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const { data: session, isPending } = authClient.useSession();

	const user: User | null = session?.user
		? {
				id: session.user.id,
				name: session.user.name,
				email: session.user.email,
				image: session.user.image ?? undefined,
			}
		: null;

	const signInWithGoogle = useCallback(async () => {
		try {
			const result = await authClient.signIn.social({
				provider: "google",
				callbackURL: "/",
			});
			if (result?.error) {
				return {
					error:
						result.error.message || "Google sign in failed. Please try again.",
				};
			}
			return {};
		} catch {
			return { error: "Google sign in failed. Please try again." };
		}
	}, []);

	const sendOtp = useCallback(async (email: string) => {
		try {
			const result = await authClient.emailOtp.sendVerificationOtp({
				email,
				type: "sign-in",
			});
			if (result?.error) {
				return {
					error:
						result.error.message || "Failed to send OTP. Please try again.",
				};
			}
			return {};
		} catch {
			return { error: "Network error. Please try again." };
		}
	}, []);

	const verifyOtp = useCallback(async (email: string, otp: string) => {
		try {
			const result = await authClient.signIn.emailOtp({
				email,
				otp,
			});
			if (result?.error) {
				return {
					error: result.error.message || "Invalid OTP. Please try again.",
				};
			}
			const u = result?.data?.user;
			return {
				user: u
					? {
							id: u.id,
							name: u.name,
							email: u.email,
							image: u.image ?? undefined,
						}
					: undefined,
			};
		} catch {
			return { error: "Network error. Please try again." };
		}
	}, []);

	const signOut = useCallback(async () => {
		try {
			await authClient.signOut();
		} catch {
			// ignore
		}
	}, []);

	const value = useMemo(
		() => ({
			user,
			loading: isPending,
			signInWithGoogle,
			sendOtp,
			verifyOtp,
			signOut,
		}),
		[user, isPending, signInWithGoogle, sendOtp, verifyOtp, signOut],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
