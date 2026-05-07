"use client";

import { usePathname } from "next/navigation";
import { createContext, useEffect, useState } from "react";

const ADMIN_EMAIL = "admin@inflio.com";
const ADMIN_PASSWORD = "ishan@admin";
const STORAGE_KEY = "inflio_admin_auth";

const AdminAuthContext = createContext<{
	authenticated: boolean;
	logout: () => void;
}>({
	authenticated: false,
	logout: () => {},
});

const adminStyles = `
	.admin-root { min-height:100vh; background:#09090b; font-family:'Inter',-apple-system,sans-serif }
	.admin-input { width:100%; padding:12px 14px; background:#09090b; border:1px solid #27272a; border-radius:10px; font-size:14px; color:#fafafa; outline:none; transition:border-color .15s; box-sizing:border-box }
	.admin-input:focus { border-color:#d9f99d }
	.admin-input-pw { padding-right:44px }
	.admin-submit { width:100%; padding:12px 0; background:#d9f99d; color:#09090b; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:opacity .15s }
	.admin-submit:hover { opacity:0.9 }
	.admin-logout { padding:6px 14px; border-radius:8px; border:1px solid #27272a; background:transparent; color:#a1a1aa; font-size:13px; font-weight:500; cursor:pointer; transition:all .15s }
	.admin-logout:hover { border-color:#f87171; color:#f87171 }
	.admin-label { display:block; font-size:13px; font-weight:500; color:#a1a1aa; margin-bottom:8px }
	@keyframes spin { to { transform:rotate(360deg) } }
`;

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [authenticated, setAuthenticated] = useState(false);
	const [checking, setChecking] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (stored === "true") setAuthenticated(true);
		setChecking(false);
	}, []);

	function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
			sessionStorage.setItem(STORAGE_KEY, "true");
			setAuthenticated(true);
		} else {
			setError("Invalid credentials");
		}
	}

	function logout() {
		sessionStorage.removeItem(STORAGE_KEY);
		setAuthenticated(false);
	}

	if (checking) {
		return (
			<div
				className="admin-root"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<style>{adminStyles}</style>
				<div
					style={{
						width: 20,
						height: 20,
						border: "2px solid #333",
						borderTopColor: "#d9f99d",
						borderRadius: "50%",
						animation: "spin 0.8s linear infinite",
					}}
				/>
			</div>
		);
	}

	if (!authenticated) {
		return (
			<div
				className="admin-root"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<style>{adminStyles}</style>
				<div style={{ width: "100%", maxWidth: 400, padding: "0 24px" }}>
					<div style={{ textAlign: "center", marginBottom: 40 }}>
						<div
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 10,
								marginBottom: 12,
							}}
						>
							<div
								style={{
									width: 10,
									height: 10,
									borderRadius: "50%",
									background: "#d9f99d",
								}}
							/>
							<span
								style={{
									fontSize: 24,
									fontWeight: 700,
									color: "#fafafa",
									letterSpacing: -0.5,
								}}
							>
								inflio
							</span>
						</div>
						<p
							style={{
								fontSize: 14,
								color: "#71717a",
								margin: 0,
								letterSpacing: 0.5,
								textTransform: "uppercase",
								fontWeight: 600,
							}}
						>
							Admin Portal
						</p>
					</div>

					<form
						onSubmit={handleLogin}
						style={{
							background: "#111113",
							border: "1px solid #1e1e22",
							borderRadius: 16,
							padding: 32,
						}}
					>
						<h2
							style={{
								fontSize: 20,
								fontWeight: 600,
								color: "#fafafa",
								margin: "0 0 4px",
							}}
						>
							Sign in
						</h2>
						<p style={{ fontSize: 14, color: "#71717a", margin: "0 0 28px" }}>
							Enter your admin credentials to continue
						</p>

						{error && (
							<div
								style={{
									background: "rgba(239,68,68,0.08)",
									border: "1px solid rgba(239,68,68,0.2)",
									borderRadius: 10,
									padding: "10px 14px",
									marginBottom: 20,
									fontSize: 13,
									color: "#f87171",
								}}
							>
								{error}
							</div>
						)}

						<div style={{ marginBottom: 18 }}>
							<label className="admin-label" htmlFor="admin-email">
								Email
							</label>
							<input
								id="admin-email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="admin@inflio.com"
								required
								className="admin-input"
							/>
						</div>

						<div style={{ marginBottom: 28 }}>
							<label className="admin-label" htmlFor="admin-password">
								Password
							</label>
							<div style={{ position: "relative" }}>
								<input
									id="admin-password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter password"
									required
									className="admin-input admin-input-pw"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									style={{
										position: "absolute",
										right: 12,
										top: "50%",
										transform: "translateY(-50%)",
										background: "none",
										border: "none",
										color: "#71717a",
										cursor: "pointer",
										fontSize: 12,
										padding: 0,
									}}
								>
									{showPassword ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						<button type="submit" className="admin-submit">
							Sign in
						</button>
					</form>

					<p
						style={{
							textAlign: "center",
							fontSize: 12,
							color: "#52525b",
							marginTop: 24,
						}}
					>
						Protected area. Authorized personnel only.
					</p>
				</div>
			</div>
		);
	}

	const navItems = [{ href: "/admin/verifications", label: "Verifications" }];

	return (
		<AdminAuthContext.Provider value={{ authenticated, logout }}>
			<style>{adminStyles}</style>
			<div className="admin-root">
				<header
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "0 24px",
						height: 56,
						borderBottom: "1px solid #1e1e22",
						background: "#111113",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: 24 }}>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<div
								style={{
									width: 8,
									height: 8,
									borderRadius: "50%",
									background: "#d9f99d",
								}}
							/>
							<span
								style={{
									fontSize: 16,
									fontWeight: 700,
									color: "#fafafa",
									letterSpacing: -0.3,
								}}
							>
								inflio
							</span>
							<span
								style={{
									fontSize: 11,
									fontWeight: 600,
									color: "#09090b",
									background: "#d9f99d",
									padding: "2px 8px",
									borderRadius: 4,
									textTransform: "uppercase",
									letterSpacing: 0.5,
								}}
							>
								Admin
							</span>
						</div>
						<nav style={{ display: "flex", gap: 4 }}>
							{navItems.map((item) => {
								const active = pathname === item.href;
								return (
									<a
										key={item.href}
										href={item.href}
										style={{
											padding: "6px 14px",
											borderRadius: 8,
											fontSize: 13,
											fontWeight: 500,
											color: active ? "#d9f99d" : "#a1a1aa",
											background: active
												? "rgba(217,249,157,0.08)"
												: "transparent",
											textDecoration: "none",
										}}
									>
										{item.label}
									</a>
								);
							})}
						</nav>
					</div>
					<button type="button" className="admin-logout" onClick={logout}>
						Logout
					</button>
				</header>

				<main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
					{children}
				</main>
			</div>
		</AdminAuthContext.Provider>
	);
}
