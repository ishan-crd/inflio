"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { api } from "../../../convex/_generated/api";

function initials(s: string) {
	return s
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data: session, isPending: sessionPending } = useSession();
	const userId = session?.user?.id;
	const brandProfile = useQuery(
		api.brands.getByUserId,
		userId ? { userId } : "skip",
	);
	const creatorProfile = useQuery(
		api.creators.getByUserId,
		userId ? { userId } : "skip",
	);
	const campaigns = useQuery(
		api.campaigns.listByBrand,
		brandProfile?._id ? { brandId: brandProfile._id } : "skip",
	);
	const isBrand = !!brandProfile;
	const isCreator = !!creatorProfile;
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState(false);

	if (sessionPending) {
		return (
			<div
				className="db-loading"
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 24,
					padding: 80,
				}}
			>
				<div
					style={{
						position: "fixed",
						left: 0,
						top: 0,
						width: 240,
						height: "100vh",
						padding: "24px 16px",
						background: "rgba(255,255,255,0.02)",
						borderRight: "1px solid rgba(255,255,255,0.06)",
					}}
				>
					<div
						style={{
							width: 80,
							height: 20,
							borderRadius: 8,
							marginBottom: 40,
							background: "rgba(255,255,255,0.06)",
						}}
					/>
					{[120, 100, 110, 90].map((w, i) => (
						<div
							key={i}
							style={{
								width: w,
								height: 14,
								borderRadius: 6,
								marginBottom: 20,
								background: "rgba(255,255,255,0.06)",
							}}
						/>
					))}
				</div>
				<div
					style={{
						marginLeft: 240,
						width: "calc(100% - 240px)",
						padding: "24px 32px",
					}}
				>
					<div
						style={{
							width: "100%",
							height: 48,
							borderRadius: 12,
							marginBottom: 32,
							background: "rgba(255,255,255,0.04)",
						}}
					/>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gap: 20,
							marginBottom: 32,
						}}
					>
						{[1, 2, 3].map((_, i) => (
							<div
								key={i}
								style={{
									height: 100,
									borderRadius: 16,
									background: "rgba(255,255,255,0.04)",
								}}
							/>
						))}
					</div>
					<div
						style={{
							width: "100%",
							height: 300,
							borderRadius: 16,
							background: "rgba(255,255,255,0.03)",
						}}
					/>
				</div>
			</div>
		);
	}

	if (!session?.user) {
		return (
			<div className="db-loading" style={{ textAlign: "center" }}>
				<h2
					style={{
						fontFamily: '"Geist", sans-serif',
						fontSize: 22,
						fontWeight: 600,
						letterSpacing: "-0.025em",
						marginBottom: 8,
					}}
				>
					Join inflio first
				</h2>
				<p
					style={{
						color: "var(--color-ink-2)",
						marginBottom: 20,
						fontSize: 14,
					}}
				>
					Sign in or create an account to access your dashboard.
				</p>
				<Link
					href="/login"
					className="btn btn-primary"
					style={{ textDecoration: "none" }}
				>
					Sign in
				</Link>
			</div>
		);
	}

	// Convex useQuery returns undefined while loading, null when not found
	const brandLoading = brandProfile === undefined;
	const creatorLoading = creatorProfile === undefined;

	if (brandLoading || creatorLoading) {
		return (
			<div
				className="db-loading"
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 24,
					padding: 80,
				}}
			>
				<div
					style={{
						position: "fixed",
						left: 0,
						top: 0,
						width: 240,
						height: "100vh",
						padding: "24px 16px",
						background: "rgba(255,255,255,0.02)",
						borderRight: "1px solid rgba(255,255,255,0.06)",
					}}
				>
					<div
						style={{
							width: 80,
							height: 20,
							borderRadius: 8,
							marginBottom: 40,
							background: "rgba(255,255,255,0.06)",
						}}
					/>
					{[120, 100, 110, 90].map((w, i) => (
						<div
							key={i}
							style={{
								width: w,
								height: 14,
								borderRadius: 6,
								marginBottom: 20,
								background: "rgba(255,255,255,0.06)",
							}}
						/>
					))}
				</div>
				<div
					style={{
						marginLeft: 240,
						width: "calc(100% - 240px)",
						padding: "24px 32px",
					}}
				>
					<div
						style={{
							width: "100%",
							height: 48,
							borderRadius: 12,
							marginBottom: 32,
							background: "rgba(255,255,255,0.04)",
						}}
					/>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gap: 20,
							marginBottom: 32,
						}}
					>
						{[1, 2, 3].map((_, i) => (
							<div
								key={i}
								style={{
									height: 100,
									borderRadius: 16,
									background: "rgba(255,255,255,0.04)",
								}}
							/>
						))}
					</div>
					<div
						style={{
							width: "100%",
							height: 300,
							borderRadius: 16,
							background: "rgba(255,255,255,0.03)",
						}}
					/>
				</div>
			</div>
		);
	}

	// Both queries resolved but no profile found
	if (!brandProfile && !creatorProfile) {
		return (
			<div className="db-loading" style={{ textAlign: "center" }}>
				<h2
					style={{
						fontFamily: '"Geist", sans-serif',
						fontSize: 22,
						fontWeight: 600,
						letterSpacing: "-0.025em",
						marginBottom: 8,
					}}
				>
					Complete your onboarding
				</h2>
				<p
					style={{
						color: "var(--color-ink-2)",
						marginBottom: 20,
						fontSize: 14,
					}}
				>
					Set up your profile to access the dashboard.
				</p>
				<Link
					href="/onboarding"
					className="btn btn-primary"
					style={{ textDecoration: "none" }}
				>
					Get started
				</Link>
			</div>
		);
	}

	const navItems = isBrand
		? [
				{ href: "/dashboard", label: "Home", icon: "home" },
				{ href: "/dashboard/campaigns", label: "Campaigns", icon: "campaigns" },
				{
					href: "/dashboard/submissions",
					label: "Submissions",
					icon: "submissions",
				},
				{ href: "/dashboard/analytics", label: "Analytics", icon: "analytics" },
			]
		: [
				{ href: "/dashboard", label: "Home", icon: "home" },
				{
					href: "/dashboard/applications",
					label: "Applications",
					icon: "campaigns",
				},
				{
					href: "/dashboard/submissions",
					label: "Submissions",
					icon: "submissions",
				},
				{ href: "/dashboard/analytics", label: "Analytics", icon: "analytics" },
			];

	const bottomItems = [
		{ href: "/dashboard/settings", label: "Settings", icon: "settings" },
	];

	const isActive = (href: string) => {
		if (href === "/dashboard") return pathname === "/dashboard";
		return pathname.startsWith(href);
	};

	return (
		<div className={`db-layout${collapsed ? " db-collapsed" : ""}`}>
			{/* Sidebar */}
			<aside className="db-sidebar">
				<div className="db-sidebar-top">
					{/* Logo */}
					<Link
						href="/"
						className="db-logo"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<div className="logo-dot" />
						{!collapsed && <span>inflio</span>}
					</Link>

					{/* Nav items */}
					<nav className="db-nav">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`db-nav-item${isActive(item.href) ? " active" : ""}`}
							>
								<NavIcon name={item.icon} />
								{!collapsed && <span>{item.label}</span>}
							</Link>
						))}
					</nav>
				</div>

				<div className="db-sidebar-bottom">
					{bottomItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`db-nav-item${isActive(item.href) ? " active" : ""}`}
						>
							<NavIcon name={item.icon} />
							{!collapsed && <span>{item.label}</span>}
						</Link>
					))}

					<button
						className="db-nav-item"
						onClick={() => setCollapsed(!collapsed)}
					>
						<NavIcon name={collapsed ? "expand" : "collapse"} />
						{!collapsed && <span>Collapse</span>}
					</button>

					{/* Profile card */}
					<div className="db-brand-card">
						{isBrand ? (
							<>
								<div
									className="db-brand-avatar"
									style={{
										background:
											brandProfile.logoColors?.[0] ||
											"linear-gradient(135deg, var(--color-accent-strong), #65a30d)",
										color: brandProfile.logoColors?.[1] || "#fff",
									}}
								>
									{initials(brandProfile.name)}
								</div>
								{!collapsed && (
									<div className="db-brand-info">
										<div className="db-brand-name">{brandProfile.name}</div>
										<div className="db-brand-meta">
											{campaigns?.length ?? 0} Campaign
											{(campaigns?.length ?? 0) !== 1 ? "s" : ""}
										</div>
									</div>
								)}
							</>
						) : isCreator ? (
							<>
								<div
									className="db-brand-avatar"
									style={{
										background: `linear-gradient(135deg, ${creatorProfile.avatarColor?.[0] || "#bef264"}, ${creatorProfile.avatarColor?.[1] || "#a3e635"})`,
										color: "#0a0a0c",
									}}
								>
									{initials(creatorProfile.name)}
								</div>
								{!collapsed && (
									<div className="db-brand-info">
										<div className="db-brand-name">{creatorProfile.name}</div>
										<div className="db-brand-meta">
											@{creatorProfile.handle}
										</div>
									</div>
								)}
							</>
						) : null}
					</div>
				</div>
			</aside>

			{/* Main area */}
			<div className="db-main">
				{/* Top bar */}
				<header className="db-topbar">
					<div className="db-search">
						<svg
							width="14"
							height="14"
							viewBox="0 0 16 16"
							fill="none"
							stroke="var(--color-ink-3)"
							strokeWidth="1.5"
							strokeLinecap="round"
						>
							<circle cx="7" cy="7" r="5" />
							<path d="M14 14l-3.5-3.5" />
						</svg>
						<input
							type="text"
							placeholder="Search campaigns..."
							className="db-search-input"
						/>
					</div>

					<div className="db-topbar-right">
						<button className="db-topbar-btn" aria-label="Notifications">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
								<path d="M13.73 21a2 2 0 01-3.46 0" />
							</svg>
						</button>

						<TopbarProfileDropdown
							name={session.user.name || ""}
							image={session.user.image}
						/>
					</div>
				</header>

				{/* Page content */}
				<div className="db-content">{children}</div>
			</div>
		</div>
	);
}

// ─── Profile Dropdown ────────────────────────────────────────────────────────

function TopbarProfileDropdown({
	name,
	image,
}: {
	name: string;
	image?: string | null;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const router = useRouter();

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	return (
		<div ref={ref} style={{ position: "relative" }}>
			<button
				className="db-topbar-avatar"
				onClick={() => setOpen((o) => !o)}
			>
				{image ? (
					<img src={image} alt="" />
				) : (
					<span>{initials(name || "U")}</span>
				)}
			</button>

			{open && (
				<div
					style={{
						position: "absolute",
						top: "calc(100% + 8px)",
						right: 0,
						minWidth: 180,
						background: "rgba(22, 22, 26, 0.95)",
						border: "1px solid var(--color-line)",
						borderRadius: 12,
						padding: "6px",
						backdropFilter: "blur(20px)",
						WebkitBackdropFilter: "blur(20px)",
						boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
						zIndex: 100,
					}}
				>
					<button
						onClick={() => {
							setOpen(false);
							router.push("/profile");
						}}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							width: "100%",
							padding: "10px 14px",
							background: "none",
							border: "none",
							borderRadius: 8,
							color: "var(--color-ink-1)",
							fontFamily: '"Inter", sans-serif',
							fontSize: 13,
							cursor: "pointer",
							transition: "background 0.15s",
						}}
						onMouseEnter={(e) =>
							(e.currentTarget.style.background = "rgba(255,255,255,0.06)")
						}
						onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="8" cy="5.5" r="2.5" />
							<path d="M3 14c0-2.5 2.2-4 5-4s5 1.5 5 4" />
						</svg>
						View profile
					</button>
					<button
						onClick={() => {
							setOpen(false);
							router.push("/dashboard/settings");
						}}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							width: "100%",
							padding: "10px 14px",
							background: "none",
							border: "none",
							borderRadius: 8,
							color: "var(--color-ink-1)",
							fontFamily: '"Inter", sans-serif',
							fontSize: 13,
							cursor: "pointer",
							transition: "background 0.15s",
						}}
						onMouseEnter={(e) =>
							(e.currentTarget.style.background = "rgba(255,255,255,0.06)")
						}
						onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="8" cy="8" r="2" />
							<path d="M13.4 10.2a1.1 1.1 0 00.2 1.2l.04.04a1.34 1.34 0 11-1.9 1.9l-.03-.04a1.1 1.1 0 00-1.2-.2 1.1 1.1 0 00-.67 1.01v.1a1.34 1.34 0 01-2.68 0v-.06a1.1 1.1 0 00-.72-1.01 1.1 1.1 0 00-1.2.2l-.04.04a1.34 1.34 0 11-1.9-1.9l.04-.04a1.1 1.1 0 00.2-1.2 1.1 1.1 0 00-1-.67h-.12a1.34 1.34 0 010-2.68h.06a1.1 1.1 0 001.01-.72 1.1 1.1 0 00-.2-1.2l-.04-.04a1.34 1.34 0 111.9-1.9l.04.04a1.1 1.1 0 001.2.2h.05a1.1 1.1 0 00.67-1.01v-.1a1.34 1.34 0 012.68 0v.06a1.1 1.1 0 00.67 1.01 1.1 1.1 0 001.2-.2l.04-.04a1.34 1.34 0 111.9 1.9l-.04.04a1.1 1.1 0 00-.2 1.2v.05a1.1 1.1 0 001.01.67h.1a1.34 1.34 0 010 2.68h-.06a1.1 1.1 0 00-1.01.67z" />
						</svg>
						Settings
					</button>
					<div
						style={{
							height: 1,
							background: "var(--color-line)",
							margin: "4px 0",
						}}
					/>
					<button
						onClick={() => {
							setOpen(false);
							signOut({
								fetchOptions: {
									onSuccess: () => router.push("/"),
								},
							});
						}}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							width: "100%",
							padding: "10px 14px",
							background: "none",
							border: "none",
							borderRadius: 8,
							color: "#fb7185",
							fontFamily: '"Inter", sans-serif',
							fontSize: 13,
							cursor: "pointer",
							transition: "background 0.15s",
						}}
						onMouseEnter={(e) =>
							(e.currentTarget.style.background = "rgba(251,113,133,0.08)")
						}
						onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M6 2H4a2 2 0 00-2 2v8a2 2 0 002 2h2M10.5 12L14 8l-3.5-4M14 8H6" />
						</svg>
						Log out
					</button>
				</div>
			)}
		</div>
	);
}

// ─── Nav Icons ──────────────────────────────────────────────────────────────

function NavIcon({ name }: { name: string }) {
	const p = {
		width: 18,
		height: 18,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 1.5,
		strokeLinecap: "round" as const,
		strokeLinejoin: "round" as const,
	};
	switch (name) {
		case "home":
			return (
				<svg {...p}>
					<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
					<polyline points="9 22 9 12 15 12 15 22" />
				</svg>
			);
		case "marketplace":
			return (
				<svg {...p}>
					<rect x="2" y="7" width="20" height="14" rx="2" />
					<path d="M16 7V5a4 4 0 00-8 0v2" />
				</svg>
			);
		case "campaigns":
			return (
				<svg {...p}>
					<rect x="3" y="3" width="18" height="18" rx="2" />
					<path d="M3 9h18M9 21V9" />
				</svg>
			);
		case "submissions":
			return (
				<svg {...p}>
					<polygon points="23 7 16 12 23 17 23 7" />
					<rect x="1" y="5" width="15" height="14" rx="2" />
				</svg>
			);
		case "analytics":
			return (
				<svg {...p}>
					<line x1="18" y1="20" x2="18" y2="10" />
					<line x1="12" y1="20" x2="12" y2="4" />
					<line x1="6" y1="20" x2="6" y2="14" />
				</svg>
			);
		case "settings":
			return (
				<svg {...p}>
					<circle cx="12" cy="12" r="3" />
					<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
				</svg>
			);
		case "verify":
			return (
				<svg {...p}>
					<path d="M9 12l2 2 4-4" />
					<circle cx="12" cy="12" r="9" />
				</svg>
			);
		case "collapse":
			return (
				<svg {...p}>
					<polyline points="11 17 6 12 11 7" />
					<polyline points="18 17 13 12 18 7" />
				</svg>
			);
		case "expand":
			return (
				<svg {...p}>
					<polyline points="13 17 18 12 13 7" />
					<polyline points="6 17 11 12 6 7" />
				</svg>
			);
		default:
			return null;
	}
}
