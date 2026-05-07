"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
	const { data: session } = useSession();
	const userId = session?.user?.id;
	const brandProfile = useQuery(
		api.brands.getByUserId,
		userId ? { userId } : "skip",
	);
	const campaigns = useQuery(
		api.campaigns.listByBrand,
		brandProfile?._id ? { brandId: brandProfile._id } : "skip",
	);
	const pathname = usePathname();
	const router = useRouter();
	const [collapsed, setCollapsed] = useState(false);

	if (!session?.user) {
		return (
			<div className="db-loading">
				<div className="db-loading-spinner" />
				Loading...
			</div>
		);
	}

	if (!brandProfile) {
		return (
			<div className="db-loading">
				<p style={{ color: "var(--color-ink-2)", marginBottom: 16 }}>
					Complete your brand onboarding to access the dashboard.
				</p>
				<Link
					href="/onboarding?role=brand"
					className="btn btn-primary"
					style={{ textDecoration: "none" }}
				>
					Complete Onboarding
				</Link>
			</div>
		);
	}

	const navItems = [
		{ href: "/dashboard", label: "Home", icon: "home" },
		{ href: "/dashboard/campaigns", label: "Campaigns", icon: "campaigns" },
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

					{/* Brand card */}
					<div className="db-brand-card">
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

						<button
							className="db-topbar-avatar"
							onClick={() => router.push("/profile")}
						>
							{session.user.image ? (
								<img src={session.user.image} alt="" />
							) : (
								<span>{initials(session.user.name || "U")}</span>
							)}
						</button>
					</div>
				</header>

				{/* Page content */}
				<div className="db-content">{children}</div>
			</div>
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
