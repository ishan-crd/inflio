"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { api } from "../../../convex/_generated/api";

function formatMoney(value: string | number, currency = "₹") {
	const num =
		typeof value === "string" ? value.replace(/[^0-9]/g, "") : String(value);
	if (!num) return `${currency}0`;
	if (currency === "₹") {
		const last3 = num.slice(-3);
		const rest = num.slice(0, -3);
		if (!rest) return `${currency}${last3}`;
		return `${currency}${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}`;
	}
	return `${currency}${num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function daysUntil(dateStr: string): number {
	const diff = new Date(dateStr).getTime() - Date.now();
	return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const COLORS: Record<string, string> = {
	lime: "#bef264",
	cyan: "#67e8f9",
	violet: "#c084fc",
	orange: "#fb923c",
	rose: "#fb7185",
	blue: "#60a5fa",
};

export default function DashboardHome() {
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

	const allCampaigns = campaigns ?? [];
	const activeCampaigns = allCampaigns.filter((c) => c.status === "active");
	const totalBudget = allCampaigns.reduce(
		(sum, c) => sum + Number(c.budget?.replace(/[^0-9]/g, "") || 0),
		0,
	);
	const totalSpots = allCampaigns.reduce(
		(sum, c) => sum + (c.totalSpots || 0),
		0,
	);
	const filledSpots = allCampaigns.reduce(
		(sum, c) => sum + (c.creatorsJoined || 0),
		0,
	);
	const currency = allCampaigns[0]?.currency ?? "₹";

	const stats = [
		{
			label: "Total campaigns",
			value: String(allCampaigns.length),
			icon: (
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="var(--color-accent-strong)"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<rect x="3" y="3" width="18" height="18" rx="2" />
					<path d="M3 9h18M9 21V9" />
				</svg>
			),
			iconBg: "rgba(190,242,100,0.12)",
		},
		{
			label: "Total views received",
			value: "0",
			icon: (
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#f472b6"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
					<circle cx="12" cy="12" r="3" />
				</svg>
			),
			iconBg: "rgba(244,114,182,0.12)",
		},
		{
			label: "Total spent",
			value: formatMoney(totalBudget, currency),
			icon: (
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#fb923c"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<rect x="1" y="4" width="22" height="16" rx="2" />
					<line x1="1" y1="10" x2="23" y2="10" />
				</svg>
			),
			iconBg: "rgba(251,146,60,0.12)",
		},
		{
			label: "Submissions received",
			value: "0",
			icon: (
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#60a5fa"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polygon points="23 7 16 12 23 17 23 7" />
					<rect x="1" y="5" width="15" height="14" rx="2" />
				</svg>
			),
			iconBg: "rgba(96,165,250,0.12)",
		},
	];

	// Platform distribution
	const platformCounts: Record<string, number> = {};
	allCampaigns.forEach((c) => {
		platformCounts[c.platform] = (platformCounts[c.platform] || 0) + 1;
	});
	const platforms = [
		{ name: "Instagram", icon: "ig", color: "#e040fb" },
		{ name: "YouTube", icon: "yt", color: "#ff1744" },
		{ name: "TikTok", icon: "tt", color: "#00e5ff" },
		{ name: "Twitter / X", icon: "x", color: "#94a3b8" },
	];

	// Views distribution (donut segments)
	const segments = [
		{ label: "Approved", color: "#4ade80", pct: 0 },
		{ label: "Pending", color: "#fbbf24", pct: 0 },
		{ label: "Rejected", color: "#fb7185", pct: 0 },
	];

	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	return (
		<div>
			{/* Page header */}
			<div className="db-page-header">
				<h1 className="db-page-title">Home</h1>
				<Link
					href="/campaigns/create"
					className="btn btn-primary"
					style={{ textDecoration: "none", fontSize: 13 }}
				>
					+ New campaign
				</Link>
			</div>

			{/* Stat cards */}
			<div className="db-stat-grid">
				{stats.map((s) => (
					<div key={s.label} className="db-stat-card">
						<div className="db-stat-header">
							<div className="db-stat-icon" style={{ background: s.iconBg }}>
								{s.icon}
							</div>
							<span className="db-stat-label">{s.label}</span>
						</div>
						<div className="db-stat-value">{s.value}</div>
					</div>
				))}
			</div>

			{/* Views distribution + Platform distribution */}
			<div className="db-row-2">
				{/* Donut chart */}
				<div className="db-card">
					<div className="db-card-title">Views distribution</div>
					<div className="db-legend">
						{segments.map((s) => (
							<div key={s.label} className="db-legend-item">
								<div
									className="db-legend-dot"
									style={{ background: s.color }}
								/>
								<span>{s.label}</span>
							</div>
						))}
					</div>
					<div className="db-donut-wrap">
						<svg viewBox="0 0 200 200" className="db-donut">
							{/* Background ring */}
							<circle
								cx="100"
								cy="100"
								r="70"
								fill="none"
								stroke="rgba(255,255,255,0.06)"
								strokeWidth="32"
							/>
							{allCampaigns.length === 0 ? (
								<>
									{/* Empty state segments */}
									<circle
										cx="100"
										cy="100"
										r="70"
										fill="none"
										stroke="#4ade80"
										strokeWidth="32"
										strokeDasharray="165 275"
										strokeDashoffset="0"
										opacity="0.3"
										strokeLinecap="round"
									/>
									<circle
										cx="100"
										cy="100"
										r="70"
										fill="none"
										stroke="#fb7185"
										strokeWidth="32"
										strokeDasharray="110 330"
										strokeDashoffset="-165"
										opacity="0.3"
										strokeLinecap="round"
									/>
									<circle
										cx="100"
										cy="100"
										r="70"
										fill="none"
										stroke="#fbbf24"
										strokeWidth="32"
										strokeDasharray="110 330"
										strokeDashoffset="-275"
										opacity="0.3"
										strokeLinecap="round"
									/>
								</>
							) : null}
						</svg>
						<div className="db-donut-center">
							<div className="db-donut-num">0</div>
							<div className="db-donut-label">Total</div>
						</div>
					</div>
				</div>

				{/* Platform distribution */}
				<div className="db-card">
					<div className="db-card-title">Platform distribution</div>
					<div className="db-card-sub">Views by platform this campaign</div>
					<div className="db-platform-list">
						{platforms.map((p) => {
							const count = platformCounts[p.name] || 0;
							const pct =
								allCampaigns.length > 0
									? Math.round((count / allCampaigns.length) * 100)
									: 0;
							return (
								<div key={p.name} className="db-platform-row">
									<div className="db-platform-info">
										<PlatformIcon name={p.icon} />
										<span>{p.name}</span>
									</div>
									<span className="db-platform-pct">{pct}%</span>
									<div className="db-platform-bar">
										<div
											className="db-platform-bar-fill"
											style={{ width: `${pct}%`, background: p.color }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* 5-Month view trend */}
			<div className="db-card" style={{ marginTop: 20 }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						marginBottom: 24,
					}}
				>
					<div>
						<div className="db-card-title">5-Month view trend</div>
						<div className="db-card-sub">
							Monthly view volume with growth indicators
						</div>
					</div>
					<div className="db-legend">
						<div className="db-legend-item">
							<div
								className="db-legend-dot"
								style={{ background: "#4ade80" }}
							/>
							<span>This campaign</span>
						</div>
						<div className="db-legend-item">
							<div
								className="db-legend-dot"
								style={{ background: "#fbbf24" }}
							/>
							<span>Peer campaign</span>
						</div>
					</div>
				</div>

				{allCampaigns.length === 0 ? (
					<div className="db-empty-chart">
						<div className="db-empty-icon">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="var(--color-ink-3)"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="12" cy="12" r="10" />
								<line x1="12" y1="8" x2="12" y2="12" />
								<line x1="12" y1="16" x2="12.01" y2="16" />
							</svg>
						</div>
						<div className="db-empty-title">No data found</div>
						<div className="db-empty-desc">
							Create a campaign to start tracking.
						</div>
					</div>
				) : (
					<div className="db-empty-chart">
						<div className="db-empty-title">
							Data will appear as creators submit content
						</div>
					</div>
				)}
			</div>

			{/* Weekly breakdown */}
			<div className="db-card" style={{ marginTop: 20 }}>
				<div className="db-weekly-grid">
					{days.map((d) => (
						<div key={d} className="db-weekly-cell">
							<div className="db-weekly-day">{d}</div>
							<div className="db-weekly-num">0</div>
							<div className="db-weekly-baseline">Baseline</div>
						</div>
					))}
				</div>
			</div>

			{/* Recent campaigns */}
			{activeCampaigns.length > 0 && (
				<div className="db-card" style={{ marginTop: 20 }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 16,
						}}
					>
						<div className="db-card-title">Active campaigns</div>
						<Link
							href="/dashboard/campaigns"
							style={{
								fontSize: 12,
								color: "var(--color-accent-strong)",
								textDecoration: "none",
							}}
						>
							View all
						</Link>
					</div>
					<div className="db-table-wrap">
						<table className="db-table">
							<thead>
								<tr>
									<th>Campaign</th>
									<th>Platform</th>
									<th>Budget</th>
									<th>Creators</th>
									<th>Deadline</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{activeCampaigns.slice(0, 5).map((c) => (
									<tr key={c._id}>
										<td>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: 10,
												}}
											>
												<div
													style={{
														width: 8,
														height: 8,
														borderRadius: "50%",
														background: COLORS[c.color] || "#bef264",
													}}
												/>
												<span style={{ fontWeight: 500 }}>{c.title}</span>
											</div>
										</td>
										<td>{c.platform}</td>
										<td>{formatMoney(c.budget, c.currency)}</td>
										<td>
											{c.creatorsJoined}/{c.totalSpots}
										</td>
										<td
											style={{
												color:
													daysUntil(c.deadline) <= 3 ? "#fb7185" : "inherit",
											}}
										>
											{daysUntil(c.deadline)}d left
										</td>
										<td>
											<span className="db-status-badge active">Active</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}

function PlatformIcon({ name }: { name: string }) {
	if (name === "ig")
		return (
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
				<rect
					x="2"
					y="2"
					width="20"
					height="20"
					rx="5"
					stroke="#e040fb"
					strokeWidth="1.5"
				/>
				<circle cx="12" cy="12" r="5" stroke="#e040fb" strokeWidth="1.5" />
				<circle cx="17.5" cy="6.5" r="1.5" fill="#e040fb" />
			</svg>
		);
	if (name === "yt")
		return (
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
				<rect
					x="2"
					y="4"
					width="20"
					height="16"
					rx="4"
					stroke="#ff1744"
					strokeWidth="1.5"
				/>
				<polygon points="10,8 16,12 10,16" fill="#ff1744" />
			</svg>
		);
	if (name === "tt")
		return (
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="#00e5ff"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M9 12a4 4 0 104 4V4c1.5 2 4 3 6 3" />
			</svg>
		);
	if (name === "x")
		return (
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="#94a3b8"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M4 4l16 16M20 4L4 20" />
			</svg>
		);
	return null;
}
