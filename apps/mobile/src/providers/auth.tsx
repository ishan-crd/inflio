import * as SecureStore from "expo-secure-store";
import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

const AUTH_BASE_URL = "https://inflio-web.vercel.app";

interface User {
	id: string;
	name: string;
	email: string;
	image?: string;
}

interface AuthContextValue {
	user: User | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<{ error?: string }>;
	signUp: (
		email: string,
		password: string,
		name: string,
	) => Promise<{ error?: string }>;
	signInWithGoogle: () => Promise<{ error?: string }>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
	user: null,
	loading: true,
	signIn: async () => ({ error: "Not initialized" }),
	signUp: async () => ({ error: "Not initialized" }),
	signInWithGoogle: async () => ({ error: "Not initialized" }),
	signOut: async () => {},
});

export function useAuth() {
	return useContext(AuthContext);
}

async function storeToken(token: string) {
	await SecureStore.setItemAsync("auth_token", token);
}

async function getToken() {
	return await SecureStore.getItemAsync("auth_token");
}

async function clearToken() {
	await SecureStore.deleteItemAsync("auth_token");
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchSession = useCallback(async () => {
		try {
			const token = await getToken();
			if (!token) {
				setUser(null);
				setLoading(false);
				return;
			}

			const res = await fetch(`${AUTH_BASE_URL}/api/auth/get-session`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Cookie: `better-auth.session_token=${token}`,
				},
			});

			if (res.ok) {
				const data = await res.json();
				if (data?.user) {
					setUser(data.user);
				} else {
					setUser(null);
					await clearToken();
				}
			} else {
				setUser(null);
				await clearToken();
			}
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSession();
	}, [fetchSession]);

	const signIn = useCallback(
		async (email: string, password: string) => {
			try {
				const res = await fetch(`${AUTH_BASE_URL}/api/auth/sign-in/email`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				});

				const data = await res.json();

				if (!res.ok || data.error) {
					const msg =
						data.error?.message || data.message || "Invalid email or password.";
					return { error: msg };
				}

				if (data.token) {
					await storeToken(data.token);
				} else if (data.session?.token) {
					await storeToken(data.session.token);
				}

				if (data.user) {
					setUser(data.user);
				} else {
					await fetchSession();
				}

				return {};
			} catch {
				return { error: "Network error. Please try again." };
			}
		},
		[fetchSession],
	);

	const signUp = useCallback(
		async (email: string, password: string, name: string) => {
			try {
				const res = await fetch(`${AUTH_BASE_URL}/api/auth/sign-up/email`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password, name }),
				});

				const data = await res.json();

				if (!res.ok || data.error) {
					const msg =
						data.error?.message || data.message || "Failed to create account.";
					if (
						msg.toLowerCase().includes("already") ||
						msg.toLowerCase().includes("exists")
					) {
						return {
							error: "An account with this email already exists.",
						};
					}
					return { error: msg };
				}

				if (data.token) {
					await storeToken(data.token);
				} else if (data.session?.token) {
					await storeToken(data.session.token);
				}

				if (data.user) {
					setUser(data.user);
				} else {
					await fetchSession();
				}

				return {};
			} catch {
				return { error: "Network error. Please try again." };
			}
		},
		[fetchSession],
	);

	const signInWithGoogle = useCallback(async () => {
		try {
			// Open Google OAuth in web browser
			const redirectUrl = `${AUTH_BASE_URL}/api/auth/sign-in/social`;
			const result = await fetch(redirectUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					provider: "google",
					callbackURL: "/api/auth/callback/google",
				}),
			});
			const data = await result.json();
			if (data.url) {
				// Open the OAuth URL in a browser
				const { default: WebBrowser } = await import("expo-web-browser");
				const authResult = await WebBrowser.openAuthSessionAsync(
					data.url,
					`${AUTH_BASE_URL}/api/auth/callback/google`,
				);
				if (authResult.type === "success" && authResult.url) {
					// Extract token from callback URL
					const url = new URL(authResult.url);
					const token = url.searchParams.get("token");
					if (token) {
						await storeToken(token);
						await fetchSession();
						return {};
					}
				}
				return { error: "Google sign in was cancelled." };
			}
			return { error: "Failed to start Google sign in." };
		} catch {
			return { error: "Google sign in failed. Please try again." };
		}
	}, [fetchSession]);

	const signOut = useCallback(async () => {
		try {
			const token = await getToken();
			if (token) {
				await fetch(`${AUTH_BASE_URL}/api/auth/sign-out`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						Cookie: `better-auth.session_token=${token}`,
					},
				});
			}
		} catch {
			// ignore
		} finally {
			await clearToken();
			setUser(null);
		}
	}, []);

	const value = useMemo(
		() => ({ user, loading, signIn, signUp, signInWithGoogle, signOut }),
		[user, loading, signIn, signUp, signInWithGoogle, signOut],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
