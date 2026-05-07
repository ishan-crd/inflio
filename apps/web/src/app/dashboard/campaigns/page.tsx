"use client";

import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import { ArrowIcon, PlatformIcon, VerifiedIcon } from "@/components/icons";
import { ACCENT_MAP } from "@/data/campaigns";
import { useSession } from "@/lib/auth-client";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

// ─── Helpers ────────────────────────────────────────────────────────────────

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
	return Math.max(
		0,
		Math.ceil(
			(new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
		),
	);
}

function initials(s: string) {
	return s
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

const CREATOR_DOT_GRADIENTS: [string, string][] = [
	["#f472b6", "#a855f7"],
	["#60a5fa", "#22d3ee"],
	["#fb923c", "#facc15"],
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function DashboardCampaigns() {
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
	const updateCampaign = useMutation(api.campaigns.update);

	const [filter, setFilter] = useState<
		"all" | "active" | "paused" | "completed"
	>("all");
	const [selectedCampaignId, setSelectedCampaignId] =
		useState<Id<"campaigns"> | null>(null);

	const allCampaigns = campaigns ?? [];
	const filtered =
		filter === "all"
			? allCampaigns
			: allCampaigns.filter((c) => c.status === filter);
	const selectedCampaign = allCampaigns.find(
		(c) => c._id === selectedCampaignId,
	);

	const counts = {
		all: allCampaigns.length,
		active: allCampaigns.filter((c) => c.status === "active").length,
		paused: allCampaigns.filter((c) => c.status === "paused").length,
		completed: allCampaigns.filter((c) => c.status === "completed").length,
	};

	// If a campaign is selected, show detail view
	if (selectedCampaign && brandProfile) {
		return (
			<CampaignDetail
				campaign={selectedCampaign}
				brand={brandProfile}
				onBack={() => setSelectedCampaignId(null)}
			/>
		);
	}

	return (
		<div>
			<div className="db-page-header">
				<div>
					<h1 className="db-page-title">Campaigns</h1>
					<p className="db-page-sub">Manage all your campaigns in one place</p>
				</div>
				<Link
					href="/campaigns/create"
					className="btn btn-primary"
					style={{ textDecoration: "none", fontSize: 13 }}
				>
					+ New campaign
				</Link>
			</div>

			{/* Filter pills */}
			<div className="db-filters" style={{ marginBottom: 24 }}>
				{(["all", "active", "paused", "completed"] as const).map((f) => (
					<button
						key={f}
						onClick={() => setFilter(f)}
						className={`db-filter-pill${filter === f ? " active" : ""}`}
					>
						{f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
						<span className="db-filter-count">{counts[f]}</span>
					</button>
				))}
			</div>

			{/* Campaigns grid — marketplace style cards */}
			{filtered.length === 0 ? (
				<div className="db-empty">
					<div className="db-empty-icon">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--color-ink-3)"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<path d="M3 9h18M9 21V9" />
						</svg>
					</div>
					<div className="db-empty-title">No campaigns found</div>
					<div className="db-empty-desc">
						Create your first campaign to get started
					</div>
					<Link
						href="/campaigns/create"
						className="btn btn-primary"
						style={{ textDecoration: "none", marginTop: 16, fontSize: 13 }}
					>
						+ Create Campaign
					</Link>
				</div>
			) : (
				<div
					className="card-grid"
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
						gap: 20,
					}}
				>
					{filtered.map((c) => (
						<DashboardCampaignCard
							key={c._id}
							campaign={c}
							brandName={brandProfile?.name ?? ""}
							brandHandle={`@${brandProfile?.handle ?? ""}`}
							brandColors={brandProfile?.logoColors ?? ["#d4d4d4", "#1a1a1a"]}
							onClick={() => setSelectedCampaignId(c._id)}
						/>
					))}
				</div>
			)}
		</div>
	);
}

// ─── Campaign Card (marketplace-style) ──────────────────────────────────────

function DashboardCampaignCard({
	campaign: c,
	brandName,
	brandHandle,
	brandColors,
	onClick,
}: {
	campaign: any;
	brandName: string;
	brandHandle: string;
	brandColors: string[];
	onClick: () => void;
}) {
	const accent = ACCENT_MAP[c.color] ?? ACCENT_MAP["lime"];
	const spotsUsedPct = ((c.totalSpots - c.spotsLeft) / c.totalSpots) * 100;

	const cardStyle = {
		"--card-glow": `radial-gradient(circle at top left, ${accent.from}, transparent 60%)`,
		"--rate-from": accent.from,
		"--rate-to": accent.to,
		"--rate-glow": accent.chip,
		cursor: "pointer",
	} as React.CSSProperties;

	return (
		<div className="card" style={cardStyle} onClick={onClick}>
			{/* Status indicator */}
			<div
				style={{
					position: "absolute",
					top: 14,
					right: 14,
					padding: "3px 8px",
					borderRadius: 6,
					fontSize: 10,
					fontWeight: 600,
					textTransform: "uppercase",
					letterSpacing: "0.04em",
					background:
						c.status === "active"
							? "rgba(74,222,128,0.12)"
							: c.status === "paused"
								? "rgba(251,191,36,0.12)"
								: "rgba(148,163,184,0.12)",
					color:
						c.status === "active"
							? "#4ade80"
							: c.status === "paused"
								? "#fbbf24"
								: "#94a3b8",
					zIndex: 2,
				}}
			>
				{c.status}
			</div>

			<div className="card-top">
				<div className="card-head">
					<div className="brand-cluster">
						<div
							className="brand-mark"
							style={{ background: brandColors[0], color: brandColors[1] }}
						>
							{initials(brandName)}
						</div>
						<div>
							<div className="brand-name">
								{brandName}
								<span className="verified">
									<VerifiedIcon />
								</span>
							</div>
							<div className="brand-handle">{brandHandle}</div>
						</div>
					</div>
					<div className="platform-pill">
						<PlatformIcon name={c.platform} />
						{c.platform}
					</div>
				</div>

				<h3 className="card-title">{c.title}</h3>
				<p className="card-brief">{c.brief}</p>

				<div className="tag-row">
					{c.tags.map((tag: string) => (
						<span key={tag} className="tag">
							#{tag}
						</span>
					))}
				</div>
			</div>

			<div className="card-bottom">
				<div className="card-rate">
					<div className="rate-label">CPM rate</div>
					<div className="rate-amount">
						<span className="currency">{c.currency}</span>
						{c.rate}
						<span className="per">per {c.perViews} views</span>
					</div>
					<div className="rate-meta">
						{c.minViews && (
							<span>
								Min. <span className="mono">{c.minViews}</span> views
							</span>
						)}
						<span>
							Budget{" "}
							<span className="mono">{formatMoney(c.budget, c.currency)}</span>
						</span>
						<span>
							Ends <span className="mono">{c.deadline}</span>
						</span>
					</div>
				</div>

				<div className="card-foot">
					<div className="spots-cluster">
						<div className="spots-bar">
							<div
								className="spots-fill"
								style={{ width: `${spotsUsedPct}%` }}
							/>
						</div>
						<span>
							<strong style={{ color: "var(--color-ink-0)", fontWeight: 500 }}>
								{c.spotsLeft}
							</strong>{" "}
							spots left
						</span>
					</div>

					<div className="creators-stack">
						<div className="creator-dots">
							{CREATOR_DOT_GRADIENTS.map(([from, to], i) => (
								<div
									key={i}
									className="creator-dot"
									style={
										{ "--cd-from": from, "--cd-to": to } as React.CSSProperties
									}
								/>
							))}
							{c.creatorsJoined > 3 && (
								<div className="creator-dot more">+{c.creatorsJoined - 3}</div>
							)}
						</div>
						<span>{c.creatorsJoined} joined</span>
					</div>
				</div>
			</div>

			<div className="card-cta">
				<ArrowIcon />
			</div>
		</div>
	);
}

// ─── Campaign Detail View ───────────────────────────────────────────────────

function CampaignDetail({
	campaign: c,
	brand,
	onBack,
}: {
	campaign: any;
	brand: any;
	onBack: () => void;
}) {
	const accent = ACCENT_MAP[c.color] ?? ACCENT_MAP["lime"];
	const days = daysUntil(c.deadline);
	const fillPct =
		c.totalSpots > 0 ? Math.round((c.creatorsJoined / c.totalSpots) * 100) : 0;
	const updateCampaign = useMutation(api.campaigns.update);

	const [detailTab, setDetailTab] = useState<
		"overview" | "applications" | "submissions"
	>("overview");

	const detailTabs = [
		{ key: "overview" as const, label: "Overview" },
		{ key: "applications" as const, label: "Applications" },
		{ key: "submissions" as const, label: "Submissions" },
	];

	async function toggleStatus() {
		const newStatus = c.status === "active" ? "paused" : "active";
		await updateCampaign({ id: c._id, status: newStatus });
	}

	return (
		<div>
			{/* Back button */}
			<button onClick={onBack} className="db-back-btn">
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="10 12 6 8 10 4" />
				</svg>
				Back to campaigns
			</button>

			{/* Campaign header */}
			<div
				className="db-detail-header"
				style={{ "--accent": accent.chip } as React.CSSProperties}
			>
				<div className="db-detail-header-left">
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 12,
							marginBottom: 8,
						}}
					>
						<div
							style={{
								width: 40,
								height: 40,
								borderRadius: 10,
								background: `linear-gradient(135deg, ${accent.chip}, rgba(0,0,0,0.3))`,
								flexShrink: 0,
							}}
						/>
						<div>
							<h1 className="db-page-title" style={{ marginBottom: 0 }}>
								{c.title}
							</h1>
						</div>
					</div>
					<p
						style={{
							fontSize: 13,
							color: "var(--color-ink-2)",
							margin: "4px 0 0",
							maxWidth: 600,
						}}
					>
						{c.brief}
					</p>
				</div>
				<div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
					<button
						onClick={toggleStatus}
						className="db-btn-outline"
						style={{ padding: "8px 16px" }}
					>
						{c.status === "active" ? "Pause" : "Resume"}
					</button>
					<span
						className={`db-status-badge ${c.status}`}
						style={{ padding: "6px 12px", fontSize: 12 }}
					>
						{c.status}
					</span>
				</div>
			</div>

			{/* Stat cards */}
			<div className="db-stat-grid" style={{ marginTop: 24 }}>
				<div className="db-stat-card">
					<div className="db-stat-label" style={{ marginBottom: 8 }}>
						Budget
					</div>
					<div className="db-stat-value" style={{ fontSize: 22 }}>
						{formatMoney(c.budget, c.currency)}
					</div>
				</div>
				<div className="db-stat-card">
					<div className="db-stat-label" style={{ marginBottom: 8 }}>
						CPM Rate
					</div>
					<div className="db-stat-value" style={{ fontSize: 22 }}>
						{c.currency}
						{c.rate}
						<span
							style={{
								fontSize: 12,
								color: "var(--color-ink-3)",
								fontWeight: 400,
							}}
						>
							/{c.perViews} views
						</span>
					</div>
				</div>
				<div className="db-stat-card">
					<div className="db-stat-label" style={{ marginBottom: 8 }}>
						Creators
					</div>
					<div className="db-stat-value" style={{ fontSize: 22 }}>
						{c.creatorsJoined}
						<span
							style={{
								fontSize: 12,
								color: "var(--color-ink-3)",
								fontWeight: 400,
							}}
						>
							/{c.totalSpots} spots
						</span>
					</div>
					<div className="db-progress" style={{ marginTop: 10 }}>
						<div
							className="db-progress-fill"
							style={{ width: `${fillPct}%`, background: accent.chip }}
						/>
					</div>
				</div>
				<div className="db-stat-card">
					<div className="db-stat-label" style={{ marginBottom: 8 }}>
						Deadline
					</div>
					<div
						className="db-stat-value"
						style={{
							fontSize: 22,
							color: days <= 3 ? "#fb7185" : "var(--color-ink-0)",
						}}
					>
						{days}
						<span
							style={{
								fontSize: 12,
								color: "var(--color-ink-3)",
								fontWeight: 400,
							}}
						>
							{" "}
							days left
						</span>
					</div>
					<div
						style={{ fontSize: 11, color: "var(--color-ink-3)", marginTop: 4 }}
					>
						{c.deadline}
					</div>
				</div>
			</div>

			{/* Detail tabs */}
			<div className="db-detail-tabs">
				{detailTabs.map((t) => (
					<button
						key={t.key}
						onClick={() => setDetailTab(t.key)}
						className={`db-detail-tab${detailTab === t.key ? " active" : ""}`}
					>
						{t.label}
					</button>
				))}
			</div>

			{/* Tab content */}
			{detailTab === "overview" && (
				<CampaignOverview campaign={c} accent={accent} brand={brand} />
			)}
			{detailTab === "applications" && <CampaignApplications campaign={c} />}
			{detailTab === "submissions" && <CampaignSubmissions campaign={c} />}
		</div>
	);
}

// ─── Campaign Overview ──────────────────────────────────────────────────────

function CampaignOverview({
	campaign: c,
	accent,
	brand,
}: {
	campaign: any;
	accent: any;
	brand: any;
}) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 340px",
				gap: 20,
				marginTop: 4,
			}}
		>
			{/* Main */}
			<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
				{/* Brief */}
				<div className="db-card">
					<div className="db-card-title" style={{ marginBottom: 12 }}>
						Campaign brief
					</div>
					{c.longBrief?.length > 0 ? (
						<ul
							style={{
								margin: 0,
								paddingLeft: 18,
								display: "flex",
								flexDirection: "column",
								gap: 8,
							}}
						>
							{c.longBrief.map((line: string, i: number) => (
								<li
									key={i}
									style={{
										fontSize: 13,
										color: "var(--color-ink-1)",
										lineHeight: 1.6,
									}}
								>
									{line}
								</li>
							))}
						</ul>
					) : (
						<p
							style={{
								fontSize: 13,
								color: "var(--color-ink-1)",
								lineHeight: 1.6,
								margin: 0,
							}}
						>
							{c.brief}
						</p>
					)}
				</div>

				{/* Performance overview */}
				<div className="db-card">
					<div className="db-card-title" style={{ marginBottom: 16 }}>
						Performance
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(4, 1fr)",
							gap: 16,
						}}
					>
						{[
							{ label: "Total views", value: "0", color: "#60a5fa" },
							{ label: "Avg. engagement", value: "0%", color: "#4ade80" },
							{ label: "Submissions", value: "0", color: "#c084fc" },
							{ label: "Spent", value: `${c.currency}0`, color: "#fbbf24" },
						].map((s) => (
							<div
								key={s.label}
								style={{
									textAlign: "center",
									padding: "16px 8px",
									background: "rgba(255,255,255,0.02)",
									borderRadius: 12,
									border: "1px solid var(--color-line)",
								}}
							>
								<div
									style={{
										fontSize: 22,
										fontWeight: 700,
										color: s.color,
										letterSpacing: "-0.02em",
									}}
								>
									{s.value}
								</div>
								<div
									style={{
										fontSize: 11,
										color: "var(--color-ink-3)",
										marginTop: 4,
									}}
								>
									{s.label}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Tags & Category */}
				<div className="db-card">
					<div className="db-card-title" style={{ marginBottom: 12 }}>
						Details
					</div>
					<div
						style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
					>
						<div>
							<div
								style={{
									fontSize: 11,
									color: "var(--color-ink-3)",
									marginBottom: 6,
									textTransform: "uppercase",
									letterSpacing: "0.04em",
								}}
							>
								Platform
							</div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 8,
									fontSize: 13,
									fontWeight: 500,
								}}
							>
								<PlatformIcon name={c.platform} />
								{c.platform}
							</div>
						</div>
						<div>
							<div
								style={{
									fontSize: 11,
									color: "var(--color-ink-3)",
									marginBottom: 6,
									textTransform: "uppercase",
									letterSpacing: "0.04em",
								}}
							>
								Category
							</div>
							<div style={{ fontSize: 13, fontWeight: 500 }}>{c.category}</div>
						</div>
						{c.minViews && (
							<div>
								<div
									style={{
										fontSize: 11,
										color: "var(--color-ink-3)",
										marginBottom: 6,
										textTransform: "uppercase",
										letterSpacing: "0.04em",
									}}
								>
									Min. views
								</div>
								<div style={{ fontSize: 13, fontWeight: 500 }}>
									{c.minViews}
								</div>
							</div>
						)}
						{c.bonus?.amount && (
							<div>
								<div
									style={{
										fontSize: 11,
										color: "var(--color-ink-3)",
										marginBottom: 6,
										textTransform: "uppercase",
										letterSpacing: "0.04em",
									}}
								>
									Bonus
								</div>
								<div style={{ fontSize: 13, fontWeight: 500 }}>
									{c.currency}
									{c.bonus.amount} for {c.bonus.threshold}+ views
								</div>
							</div>
						)}
					</div>
					{c.tags?.length > 0 && (
						<div style={{ marginTop: 16 }}>
							<div
								style={{
									fontSize: 11,
									color: "var(--color-ink-3)",
									marginBottom: 8,
									textTransform: "uppercase",
									letterSpacing: "0.04em",
								}}
							>
								Tags
							</div>
							<div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
								{c.tags.map((tag: string) => (
									<span key={tag} className="db-tag">
										{tag}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Sidebar */}
			<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
				{/* Quick stats */}
				<div className="db-card">
					<div className="db-card-title" style={{ marginBottom: 14 }}>
						Campaign health
					</div>
					<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
						<div>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									fontSize: 12,
									marginBottom: 6,
								}}
							>
								<span style={{ color: "var(--color-ink-2)" }}>Fill rate</span>
								<span style={{ fontWeight: 600 }}>
									{c.totalSpots > 0
										? Math.round((c.creatorsJoined / c.totalSpots) * 100)
										: 0}
									%
								</span>
							</div>
							<div className="db-progress">
								<div
									className="db-progress-fill"
									style={{
										width: `${c.totalSpots > 0 ? (c.creatorsJoined / c.totalSpots) * 100 : 0}%`,
										background: accent.chip,
									}}
								/>
							</div>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								fontSize: 12,
							}}
						>
							<span style={{ color: "var(--color-ink-2)" }}>Budget used</span>
							<span style={{ fontWeight: 600 }}>0%</span>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								fontSize: 12,
							}}
						>
							<span style={{ color: "var(--color-ink-2)" }}>Applications</span>
							<span style={{ fontWeight: 600 }}>0</span>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								fontSize: 12,
							}}
						>
							<span style={{ color: "var(--color-ink-2)" }}>Submissions</span>
							<span style={{ fontWeight: 600 }}>0</span>
						</div>
					</div>
				</div>

				{/* Activity log placeholder */}
				<div className="db-card">
					<div className="db-card-title" style={{ marginBottom: 14 }}>
						Activity
					</div>
					<div
						style={{
							fontSize: 12,
							color: "var(--color-ink-3)",
							textAlign: "center",
							padding: "24px 0",
						}}
					>
						No activity yet
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── Campaign Applications ──────────────────────────────────────────────────

function CampaignApplications({ campaign }: { campaign: any }) {
	const updateStatus = useMutation(api.applications.updateStatus);
	const [statusFilter, setStatusFilter] = useState<
		"all" | "pending" | "approved" | "rejected"
	>("all");

	return (
		<div style={{ marginTop: 4 }}>
			{/* Filter pills */}
			<div className="db-filters" style={{ marginBottom: 20 }}>
				{(["all", "pending", "approved", "rejected"] as const).map((f) => (
					<button
						key={f}
						onClick={() => setStatusFilter(f)}
						className={`db-filter-pill${statusFilter === f ? " active" : ""}`}
					>
						{f.charAt(0).toUpperCase() + f.slice(1)}
					</button>
				))}
			</div>

			<div className="db-card">
				<div className="db-empty">
					<div className="db-empty-icon">
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--color-ink-3)"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
						</svg>
					</div>
					<div className="db-empty-title">No applications yet</div>
					<div className="db-empty-desc">
						When creators apply to this campaign, you&apos;ll be able to review
						their pitch, profile, and approve or reject them here.
					</div>
				</div>
			</div>

			{/* What applications look like */}
			<div className="db-card" style={{ marginTop: 16 }}>
				<div className="db-card-title" style={{ marginBottom: 16 }}>
					What you&apos;ll see per application
				</div>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						gap: 12,
					}}
				>
					{[
						{
							label: "Creator profile",
							desc: "Name, handle, platform, follower count",
						},
						{
							label: "Pitch & samples",
							desc: "Their pitch message and example content URLs",
						},
						{
							label: "Actions",
							desc: "Approve, reject, or message the creator",
						},
					].map((item) => (
						<div
							key={item.label}
							style={{
								padding: "16px",
								background: "rgba(255,255,255,0.02)",
								border: "1px solid var(--color-line)",
								borderRadius: 12,
							}}
						>
							<div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
								{item.label}
							</div>
							<div
								style={{
									fontSize: 12,
									color: "var(--color-ink-3)",
									lineHeight: 1.5,
								}}
							>
								{item.desc}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// ─── Campaign Submissions ───────────────────────────────────────────────────

function CampaignSubmissions({ campaign }: { campaign: any }) {
	const [statusFilter, setStatusFilter] = useState<
		"all" | "pending" | "approved" | "rejected"
	>("all");

	return (
		<div style={{ marginTop: 4 }}>
			{/* Stat row */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: 14,
					marginBottom: 20,
				}}
			>
				{[
					{ label: "Total submissions", value: "0" },
					{ label: "Total views", value: "0" },
					{ label: "Total engagement", value: "0" },
					{ label: "Earnings paid", value: `${campaign.currency}0` },
				].map((s) => (
					<div
						key={s.label}
						className="db-stat-card"
						style={{ padding: "14px 16px" }}
					>
						<div
							style={{
								fontSize: 11,
								color: "var(--color-ink-3)",
								marginBottom: 6,
								textTransform: "uppercase",
								letterSpacing: "0.04em",
							}}
						>
							{s.label}
						</div>
						<div style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</div>
					</div>
				))}
			</div>

			{/* Filter pills */}
			<div className="db-filters" style={{ marginBottom: 20 }}>
				{(["all", "pending", "approved", "rejected"] as const).map((f) => (
					<button
						key={f}
						onClick={() => setStatusFilter(f)}
						className={`db-filter-pill${statusFilter === f ? " active" : ""}`}
					>
						{f.charAt(0).toUpperCase() + f.slice(1)}
					</button>
				))}
			</div>

			<div className="db-card">
				<div className="db-empty">
					<div className="db-empty-icon">
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--color-ink-3)"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polygon points="23 7 16 12 23 17 23 7" />
							<rect x="1" y="5" width="15" height="14" rx="2" />
						</svg>
					</div>
					<div className="db-empty-title">No submissions yet</div>
					<div className="db-empty-desc">
						When approved creators post content for this campaign, their
						submissions with performance metrics will appear here.
					</div>
				</div>
			</div>

			{/* Submission preview cards */}
			<div className="db-card" style={{ marginTop: 16 }}>
				<div className="db-card-title" style={{ marginBottom: 16 }}>
					What submissions include
				</div>
				<div className="db-feature-grid">
					{[
						{
							title: "Content link",
							desc: "Direct link to the reel, short, or post on the platform",
							icon: (
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#60a5fa"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
									<path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
								</svg>
							),
						},
						{
							title: "Live analytics",
							desc: "Views, likes, comments, shares — tracked in real-time",
							icon: (
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#4ade80"
									strokeWidth="1.5"
									strokeLinecap="round"
								>
									<line x1="18" y1="20" x2="18" y2="10" />
									<line x1="12" y1="20" x2="12" y2="4" />
									<line x1="6" y1="20" x2="6" y2="14" />
								</svg>
							),
						},
						{
							title: "CPM earnings",
							desc: "Automatically calculated based on views and your CPM rate",
							icon: (
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#fbbf24"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="12" y1="1" x2="12" y2="23" />
									<path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
								</svg>
							),
						},
						{
							title: "Approval flow",
							desc: "Review and approve each submission before releasing payment",
							icon: (
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#c084fc"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							),
						},
					].map((f) => (
						<div key={f.title} className="db-feature-item">
							<div className="db-feature-icon">{f.icon}</div>
							<div className="db-feature-title">{f.title}</div>
							<div className="db-feature-desc">{f.desc}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
