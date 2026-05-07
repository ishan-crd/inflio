"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
	ArrowIcon,
	BackIcon,
	BrandIcon,
	CheckIcon,
	CreatorIcon,
	GoogleG,
	IGIcon,
	TTIcon,
	VerifiedIcon,
	YTIcon,
} from "@/components/icons";
import { signIn, signUp } from "@/lib/auth-client";

// ---------- AuthAside ----------

function AuthAside({ role }: { role: "creator" | "brand" }) {
	const isCreator = role === "creator";

	const quote = isCreator ? (
		<>
			The platform where your <em>audience becomes your income</em>
		</>
	) : (
		<>
			Find creators who turn <em>views into real results</em>
		</>
	);

	const stats = [
		{ num: "12,400+", label: "Verified creators" },
		{ num: "237", label: "Live campaigns" },
		{ num: "₹2.4 Cr", label: "Paid this month" },
	];

	const features = isCreator
		? [
				{ text: "Get paid per view — no flat fees, no lowballs" },
				{ text: "Pick campaigns that match your niche" },
				{ text: "Track earnings in real-time" },
				{ text: "Keep full creative control" },
			]
		: [
				{ text: "Access 12,000+ verified creators" },
				{ text: "Pay only for real, verified views" },
				{ text: "Campaign analytics in real-time" },
				{ text: "Average 6-hour creator response time" },
			];

	const testimonial = isCreator
		? {
				quote:
					"I made ₹1.8L in my first month on Inflio. The CPM model means I actually get rewarded when my content performs.",
				name: "Aanya Verma",
				handle: "@aanya.shoots",
				stat: "₹4.2L earned",
				colors: ["#fde68a", "#7c2d12"] as [string, string],
			}
		: {
				quote:
					"We ran our cold brew launch entirely through Inflio. 22 creators, 4.8M views, sold out in 3 days. Best ROI we've ever seen.",
				name: "Kavi Coffee Co.",
				handle: "@kavicoffee",
				stat: "4.8M views",
				colors: ["#fed7aa", "#431407"] as [string, string],
			};

	return (
		<aside className="auth-aside">
			{/* Logo */}
			<div>
				<Link
					href="/"
					className="logo"
					style={{
						display: "inline-flex",
						textDecoration: "none",
						color: "inherit",
					}}
				>
					<div className="logo-dot" />
					inflio
				</Link>
			</div>

			{/* Main content — centered */}
			<div className="auth-aside-content">
				<p className="auth-aside-quote">{quote}</p>

				{/* Feature list */}
				<div className="auth-aside-features">
					{features.map((f, i) => (
						<div key={i} className="auth-aside-feature">
							<div className="auth-aside-check">
								<CheckIcon />
							</div>
							<span>{f.text}</span>
						</div>
					))}
				</div>

				{/* Stats */}
				<div className="auth-aside-stats">
					{stats.map((s) => (
						<div className="auth-aside-stat" key={s.label}>
							<div className="num">{s.num}</div>
							<div className="label">{s.label}</div>
						</div>
					))}
				</div>

				{/* Testimonial */}
				<div className="auth-aside-testimonial">
					<p className="auth-aside-testimonial-text">
						&ldquo;{testimonial.quote}&rdquo;
					</p>
					<div className="auth-aside-testimonial-author">
						<div
							className="auth-aside-testimonial-avatar"
							style={{
								background: `linear-gradient(135deg, ${testimonial.colors[0]}, ${testimonial.colors[1]})`,
								color: testimonial.colors[1],
							}}
						>
							{testimonial.name
								.split(/\s+/)
								.slice(0, 2)
								.map((w) => w[0])
								.join("")
								.toUpperCase()}
						</div>
						<div>
							<div className="auth-aside-testimonial-name">
								{testimonial.name}
							</div>
							<div className="auth-aside-testimonial-handle">
								{testimonial.handle} &middot; {testimonial.stat}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Trust bar */}
			<div className="auth-aside-trust">
				<span>256-bit encryption</span>
				<span className="auth-aside-trust-dot" />
				<span>GDPR compliant</span>
				<span className="auth-aside-trust-dot" />
				<span>No spam, ever</span>
			</div>
		</aside>
	);
}

// ---------- AuthPanel ----------

function AuthPanel() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const mode = (searchParams.get("mode") ?? "signin") as "signin" | "signup";
	const role = (searchParams.get("role") ?? "creator") as "creator" | "brand";

	const isSignup = mode === "signup";
	const isCreator = role === "creator";

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	function switchMode(newMode: "signin" | "signup") {
		setError("");
		const params = new URLSearchParams();
		params.set("mode", newMode);
		if (newMode === "signup") params.set("role", role);
		router.push(`/login?${params.toString()}`);
	}

	function switchRole(newRole: "creator" | "brand") {
		setError("");
		const params = new URLSearchParams();
		params.set("mode", "signup");
		params.set("role", newRole);
		router.push(`/login?${params.toString()}`);
	}

	function handleGoogle() {
		signIn.social({
			provider: "google",
			callbackURL: isSignup ? `/auth/callback?role=${role}` : "/auth/callback",
		});
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			if (isSignup) {
				// Create account with email/password via BetterAuth
				const result = await signUp.email({
					email,
					password,
					name,
				});

				if (result.error) {
					if (
						result.error.message?.toLowerCase().includes("already") ||
						result.error.message?.toLowerCase().includes("exists") ||
						result.error.code === "USER_ALREADY_EXISTS"
					) {
						setError(
							"An account with this email already exists. Please sign in instead.",
						);
					} else {
						setError(
							result.error.message ||
								"Failed to create account. Please try again.",
						);
					}
					setLoading(false);
					return;
				}

				// Account created — go to onboarding
				router.push(`/onboarding?role=${role}`);
			} else {
				// Sign in with email/password via BetterAuth
				const result = await signIn.email({
					email,
					password,
				});

				if (result.error) {
					if (
						result.error.message?.toLowerCase().includes("credential") ||
						result.error.message?.toLowerCase().includes("invalid") ||
						result.error.message?.toLowerCase().includes("password") ||
						result.error.message?.toLowerCase().includes("not found")
					) {
						setError("Invalid email or password. Please try again.");
					} else {
						setError(
							result.error.message || "Failed to sign in. Please try again.",
						);
					}
					setLoading(false);
					return;
				}

				// Signed in — go to callback to check profile
				router.push("/auth/callback");
			}
		} catch (err) {
			setError("Something went wrong. Please try again.");
			setLoading(false);
		}
	}

	const nameLabelMap = {
		creator: "Your name",
		brand: "Brand name",
	};

	const namePlaceholderMap = {
		creator: "Aisha Sharma",
		brand: "ZestBrew Co.",
	};

	return (
		<div className="auth-panel">
			<div className="auth-card">
				{/* Logo — mobile only (aside is hidden on mobile) */}
				<Link
					href="/"
					className="logo auth-card-logo-mobile"
					style={{
						textDecoration: "none",
						color: "inherit",
					}}
				>
					<div className="logo-dot" />
					inflio
				</Link>

				{/* Auth tabs */}
				<div className="auth-tabs">
					<button
						className={`auth-tab${!isSignup ? " active" : ""}`}
						onClick={() => switchMode("signin")}
						type="button"
					>
						Sign in
					</button>
					<button
						className={`auth-tab${isSignup ? " active" : ""}`}
						onClick={() => switchMode("signup")}
						type="button"
					>
						Create account
					</button>
				</div>

				{/* Heading */}
				<h1>{isSignup ? "Join Inflio" : "Welcome back"}</h1>
				<p className="sub">
					{isSignup
						? "Start earning or growing your brand today."
						: "Sign in to continue to your dashboard."}
				</p>

				{/* Role toggle — signup only */}
				{isSignup && (
					<div className="role-toggle">
						<button
							type="button"
							className={`role-card${isCreator ? " active" : ""}`}
							onClick={() => switchRole("creator")}
						>
							<div className="ic">
								<CreatorIcon />
							</div>
							<div className="role-title">Creator</div>
							<div className="role-desc">Monetise your audience</div>
						</button>
						<button
							type="button"
							className={`role-card${!isCreator ? " active" : ""}`}
							onClick={() => switchRole("brand")}
						>
							<div className="ic">
								<BrandIcon />
							</div>
							<div className="role-title">Brand</div>
							<div className="role-desc">Run creator campaigns</div>
						</button>
					</div>
				)}

				{/* Google button */}
				<button className="btn-google" type="button" onClick={handleGoogle}>
					<GoogleG />
					Continue with Google
				</button>

				{/* Divider */}
				<div className="divider">or with email</div>

				{/* Error message */}
				{error && (
					<div
						style={{
							padding: "10px 14px",
							borderRadius: 10,
							background: "rgba(251,113,133,0.08)",
							border: "1px solid rgba(251,113,133,0.2)",
							color: "#fb7185",
							fontSize: 13,
							lineHeight: 1.5,
							marginBottom: 16,
						}}
					>
						{error}
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit}>
					{/* Name field — signup only */}
					{isSignup && (
						<div className="field">
							<label className="field-label" htmlFor="auth-name">
								{nameLabelMap[role]}
							</label>
							<input
								id="auth-name"
								type="text"
								className="field-input"
								placeholder={namePlaceholderMap[role]}
								autoComplete="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
					)}

					{/* Email */}
					<div className="field">
						<label className="field-label" htmlFor="auth-email">
							Email
						</label>
						<input
							id="auth-email"
							type="email"
							className="field-input"
							placeholder="you@example.com"
							autoComplete="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					{/* Password */}
					<div className="field">
						<label className="field-label" htmlFor="auth-password">
							Password
						</label>
						<input
							id="auth-password"
							type="password"
							className="field-input"
							placeholder={
								isSignup ? "Create a password" : "Enter your password"
							}
							autoComplete={isSignup ? "new-password" : "current-password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					{/* Checkbox (signup) or forgot password (signin) */}
					{isSignup ? (
						<div className="checkbox-row">
							<input id="auth-terms" type="checkbox" required />
							<label htmlFor="auth-terms">
								I agree to the <Link href="/terms">Terms of Service</Link> and{" "}
								<Link href="/privacy">Privacy Policy</Link>
							</label>
						</div>
					) : (
						<div style={{ margin: "16px 0 20px", textAlign: "right" }}>
							<Link
								href="/forgot-password"
								style={{
									fontSize: 12.5,
									color: "var(--color-ink-2)",
									textDecoration: "none",
								}}
							>
								Forgot password?
							</Link>
						</div>
					)}

					{/* Submit */}
					<button type="submit" className="btn-submit" disabled={loading}>
						{loading ? (
							<>{isSignup ? "Creating account..." : "Signing in..."}</>
						) : isSignup ? (
							<>
								Create account
								<ArrowIcon />
							</>
						) : (
							<>
								Sign in
								<ArrowIcon />
							</>
						)}
					</button>
				</form>

				{/* Footer link to switch mode */}
				<p className="auth-foot">
					{isSignup ? (
						<>
							Already have an account?{" "}
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									switchMode("signin");
								}}
							>
								Sign in
							</a>
						</>
					) : (
						<>
							Don&apos;t have an account?{" "}
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									switchMode("signup");
								}}
							>
								Create one
							</a>
						</>
					)}
				</p>
			</div>
		</div>
	);
}

// ---------- Inner (needs Suspense for useSearchParams) ----------

function LoginInner() {
	const searchParams = useSearchParams();
	const role = (searchParams.get("role") ?? "creator") as "creator" | "brand";

	return (
		<>
			<div className="ambient" />
			<div className="grain" />
			<div className="auth-page">
				<AuthAside role={role} />
				<AuthPanel />
			</div>
		</>
	);
}

// ---------- Page ----------

export default function LoginPage() {
	return (
		<Suspense>
			<LoginInner />
		</Suspense>
	);
}
