"use client";

import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowIcon, IGIcon, PlatformIcon, TTIcon, VerifiedIcon, YTIcon } from "@/components/icons";
import { ACCENT_MAP } from "@/data/constants";
import { useSession } from "@/lib/auth-client";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

const CATEGORIES = [
	"Tech", "Fashion", "Beauty", "Food & Bev", "Finance", "Fitness",
	"Lifestyle", "Gaming", "Travel", "Music", "Education", "Other",
];
const CONTENT_TAGS = [
	"Reels", "Shorts", "UGC", "Unboxing", "Review", "Tutorial",
	"Lifestyle", "GRWM", "Vlog", "Story", "Collab", "Other",
];
const PLATFORMS = [
	{ id: "Instagram", label: "Instagram", Icon: IGIcon },
	{ id: "YouTube", label: "YouTube", Icon: YTIcon },
	{ id: "X", label: "X (Twitter)", Icon: TTIcon },
];
const CURRENCIES = ["₹", "$", "€"];
const COLORS = ["lime", "cyan", "violet", "amber", "rose"] as const;
type ColorKey = (typeof COLORS)[number];
const COLOR_DOT: Record<string, string> = {
	lime: "linear-gradient(135deg, #bef264, #22c55e)",
	cyan: "linear-gradient(135deg, #22d3ee, #0ea5e9)",
	violet: "linear-gradient(135deg, #a78bfa, #8b5cf6)",
	amber: "linear-gradient(135deg, #fbbf24, #f59e0b)",
	rose: "linear-gradient(135deg, #fb7185, #e11d48)",
};

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

// ─── Toast ──────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
	useEffect(() => {
		const t = setTimeout(onDone, 3000);
		return () => clearTimeout(t);
	}, [onDone]);

	return (
		<div
			style={{
				position: "fixed",
				bottom: 32,
				left: "50%",
				transform: "translateX(-50%)",
				padding: "12px 24px",
				borderRadius: 12,
				background: "rgba(22,22,26,0.95)",
				border: "1px solid rgba(74,222,128,0.25)",
				backdropFilter: "blur(20px)",
				WebkitBackdropFilter: "blur(20px)",
				boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
				zIndex: 9999,
				display: "flex",
				alignItems: "center",
				gap: 10,
				animation: "toast-in 0.3s ease",
			}}
		>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<circle cx="8" cy="8" r="8" fill="rgba(74,222,128,0.15)" />
				<path d="M5 8.5L7 10.5L11 6" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
			<span style={{ fontSize: 13, color: "var(--color-ink-0)", fontWeight: 500 }}>
				{message}
			</span>
		</div>
	);
}

// ─── Confirm Dialog ─────────────────────────────────────────────────────────

function ConfirmDialog({
	title,
	message,
	confirmLabel,
	onConfirm,
	onCancel,
	saving,
	danger,
}: {
	title: string;
	message: string;
	confirmLabel: string;
	onConfirm: () => void;
	onCancel: () => void;
	saving: boolean;
	danger?: boolean;
}) {
	const overlayRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={overlayRef}
			onClick={(e) => { if (e.target === overlayRef.current) onCancel(); }}
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(0,0,0,0.6)",
				backdropFilter: "blur(4px)",
				WebkitBackdropFilter: "blur(4px)",
				zIndex: 9998,
				display: "grid",
				placeItems: "center",
				animation: "toast-in 0.15s ease",
			}}
		>
			<div
				style={{
					background: "rgba(22,22,26,0.98)",
					border: "1px solid var(--color-line)",
					borderRadius: 16,
					padding: 28,
					width: 420,
					maxWidth: "90vw",
					boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
				}}
			>
				<h3 style={{
					fontFamily: "'Geist', sans-serif",
					fontSize: 17,
					fontWeight: 600,
					letterSpacing: "-0.02em",
					margin: "0 0 8px",
				}}>
					{title}
				</h3>
				<p style={{
					fontSize: 13,
					color: "var(--color-ink-2)",
					lineHeight: 1.6,
					margin: "0 0 24px",
				}}>
					{message}
				</p>
				<div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
					<button
						onClick={onCancel}
						disabled={saving}
						className="db-btn-outline"
						style={{ flex: "none", padding: "9px 20px" }}
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						disabled={saving}
						style={{
							fontSize: 13,
							fontWeight: 500,
							padding: "9px 20px",
							borderRadius: 8,
							border: "none",
							cursor: saving ? "default" : "pointer",
							opacity: saving ? 0.6 : 1,
							transition: "all 0.15s",
							background: danger ? "rgba(251,113,133,0.15)" : "rgba(190,242,100,0.12)",
							color: danger ? "#fb7185" : "#bef264",
							boxShadow: danger
								? "0 0 0 1px rgba(251,113,133,0.3)"
								: "0 0 0 1px rgba(190,242,100,0.3)",
						}}
					>
						{saving ? "Saving..." : confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}

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
		"all" | "active" | "completed"
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
				{(["all", "active", "completed"] as const).map((f) => (
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
							: "rgba(148,163,184,0.12)",
					color:
						c.status === "active"
							? "#4ade80"
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

interface EditFormData {
	title: string;
	brief: string;
	longBriefRaw: string;
	category: string;
	platform: string;
	tags: string[];
	color: string;
	budget: string;
	rate: string;
	currency: string;
	perViews: string;
	minViews: string;
	totalSpots: string;
	deadline: string;
	bonusThreshold: string;
	bonusAmount: string;
}

function campaignToForm(c: any): EditFormData {
	return {
		title: c.title ?? "",
		brief: c.brief ?? "",
		longBriefRaw: (c.longBrief ?? []).join("\n"),
		category: c.category ?? "",
		platform: c.platform ?? "",
		tags: c.tags ?? [],
		color: c.color ?? "lime",
		budget: String(c.budget ?? ""),
		rate: String(c.rate ?? ""),
		currency: c.currency ?? "₹",
		perViews: c.perViews ?? "1k",
		minViews: c.minViews ?? "",
		totalSpots: String(c.totalSpots ?? ""),
		deadline: c.deadline ?? "",
		bonusThreshold: c.bonus?.threshold === "—" ? "" : (c.bonus?.threshold ?? ""),
		bonusAmount: c.bonus?.amount === "—" ? "" : (c.bonus?.amount ?? ""),
	};
}

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
	const [editing, setEditing] = useState(false);
	const [editData, setEditData] = useState<EditFormData>(() => campaignToForm(c));
	const [showConfirm, setShowConfirm] = useState(false);
	const [saving, setSaving] = useState(false);
	const [toast, setToast] = useState("");

	const detailTabs = [
		{ key: "overview" as const, label: "Overview" },
		{ key: "applications" as const, label: "Applications" },
		{ key: "submissions" as const, label: "Submissions" },
	];

	const [showPauseConfirm, setShowPauseConfirm] = useState(false);
	const [pauseSaving, setPauseSaving] = useState(false);

	async function doToggleSubmissions() {
		setPauseSaving(true);
		try {
			await updateCampaign({ id: c._id, submissionsPaused: !c.submissionsPaused });
			setShowPauseConfirm(false);
			setToast(c.submissionsPaused ? "Submissions resumed" : "Submissions paused");
		} finally {
			setPauseSaving(false);
		}
	}

	function startEdit() {
		setEditData(campaignToForm(c));
		setEditing(true);
	}

	function cancelEdit() {
		setEditing(false);
		setShowConfirm(false);
	}

	function patchEdit(p: Partial<EditFormData>) {
		setEditData((d) => ({ ...d, ...p }));
	}

	async function saveEdit() {
		setSaving(true);
		try {
			const daysLeft = Math.max(
				0,
				Math.ceil((new Date(editData.deadline).getTime() - Date.now()) / 86400000),
			);
			const spots = parseInt(editData.totalSpots) || 0;
			await updateCampaign({
				id: c._id,
				title: editData.title,
				brief: editData.brief,
				longBrief: editData.longBriefRaw.split("\n").map((l) => l.trim()).filter(Boolean),
				category: editData.category,
				platform: editData.platform,
				tags: editData.tags,
				color: editData.color,
				budget: editData.budget,
				rate: parseFloat(editData.rate) || 0,
				currency: editData.currency,
				perViews: editData.perViews,
				minViews: editData.minViews,
				totalSpots: spots,
				spotsLeft: Math.max(0, spots - c.creatorsJoined),
				deadline: editData.deadline,
				daysLeft,
				bonus: {
					threshold: editData.bonusThreshold || "—",
					amount: editData.bonusAmount || "—",
				},
			});
			setEditing(false);
			setShowConfirm(false);
			setToast("Campaign updated successfully");
		} catch (err) {
			console.error("Failed to update campaign:", err);
		} finally {
			setSaving(false);
		}
	}

	const clearToast = useCallback(() => setToast(""), []);

	if (editing) {
		return (
			<>
				<CampaignEditForm
					data={editData}
					onChange={patchEdit}
					onSave={() => setShowConfirm(true)}
					onCancel={cancelEdit}
				/>
				{showConfirm && (
					<ConfirmDialog
						title="Save changes?"
						message="This will update the campaign immediately. Creators will see the updated details in the marketplace."
						confirmLabel="Save changes"
						onConfirm={saveEdit}
						onCancel={() => setShowConfirm(false)}
						saving={saving}
					/>
				)}
			</>
		);
	}

	return (
		<div>
			{toast && <Toast message={toast} onDone={clearToast} />}
			{showPauseConfirm && (
				<ConfirmDialog
					title={c.submissionsPaused ? "Resume submissions?" : "Pause submissions?"}
					message={
						c.submissionsPaused
							? "Creators will be able to submit content for this campaign again."
							: "Creators won't be able to submit new content for this campaign until you resume."
					}
					confirmLabel={c.submissionsPaused ? "Resume" : "Pause Submissions"}
					onConfirm={doToggleSubmissions}
					onCancel={() => setShowPauseConfirm(false)}
					saving={pauseSaving}
					danger={!c.submissionsPaused}
				/>
			)}

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
				<div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
					<button
						onClick={startEdit}
						className="db-btn-outline"
						style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
					>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
							<path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
						</svg>
						Edit Campaign
					</button>
					<button
						onClick={() => setShowPauseConfirm(true)}
						style={{
							padding: "8px 16px",
							borderRadius: 8,
							fontSize: 12,
							fontWeight: 500,
							whiteSpace: "nowrap",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: 6,
							transition: "all 0.15s",
							background: c.submissionsPaused ? "rgba(74,222,128,0.06)" : "rgba(251,113,133,0.06)",
							border: `1px solid ${c.submissionsPaused ? "rgba(74,222,128,0.25)" : "rgba(251,113,133,0.25)"}`,
							color: c.submissionsPaused ? "#4ade80" : "#fb7185",
						}}
					>
						{c.submissionsPaused ? "Resume Submissions" : "Pause Submissions"}
					</button>
					<span
						className={`db-status-badge ${c.status}`}
						style={{ padding: "6px 12px", fontSize: 12, whiteSpace: "nowrap" }}
					>
						{c.submissionsPaused ? "submissions paused" : c.status}
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

// ─── Edit Form ──────────────────────────────────────────────────────────────

const fieldLabel: React.CSSProperties = {
	fontFamily: "'JetBrains Mono', monospace",
	fontSize: 10.5,
	fontWeight: 500,
	textTransform: "uppercase",
	letterSpacing: "0.04em",
	color: "var(--color-ink-3)",
	marginBottom: 8,
};

const fieldInput: React.CSSProperties = {
	width: "100%",
	padding: "10px 14px",
	borderRadius: 10,
	border: "1px solid var(--color-line-2)",
	background: "rgba(255,255,255,0.03)",
	color: "var(--color-ink-0)",
	fontSize: 13,
	fontFamily: "'Inter', sans-serif",
	outline: "none",
	transition: "border-color 0.15s",
};

const fieldTextarea: React.CSSProperties = {
	...fieldInput,
	resize: "vertical",
	minHeight: 100,
	lineHeight: 1.6,
};

function CampaignEditForm({
	data,
	onChange,
	onSave,
	onCancel,
}: {
	data: EditFormData;
	onChange: (p: Partial<EditFormData>) => void;
	onSave: () => void;
	onCancel: () => void;
}) {
	const canSave = !!data.title.trim() && !!data.brief.trim() && !!data.category && !!data.platform && !!data.budget.trim() && !!data.rate.trim() && !!data.totalSpots.trim() && !!data.deadline;

	return (
		<div>
			{/* Header */}
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
				<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
					<button onClick={onCancel} className="db-back-btn" style={{ margin: 0 }}>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="10 12 6 8 10 4" />
						</svg>
						Cancel
					</button>
					<h1 className="db-page-title" style={{ margin: 0 }}>Edit Campaign</h1>
				</div>
				<div style={{ display: "flex", gap: 10 }}>
					<button onClick={onCancel} className="db-btn-outline" style={{ padding: "9px 20px" }}>
						Discard
					</button>
					<button
						onClick={onSave}
						disabled={!canSave}
						style={{
							fontSize: 13,
							fontWeight: 500,
							padding: "9px 20px",
							borderRadius: 8,
							border: "none",
							cursor: canSave ? "pointer" : "default",
							opacity: canSave ? 1 : 0.4,
							transition: "all 0.15s",
							background: "rgba(190,242,100,0.12)",
							color: "#bef264",
							boxShadow: "0 0 0 1px rgba(190,242,100,0.3)",
						}}
					>
						Save Changes
					</button>
				</div>
			</div>

			<div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
				{/* Left column — main fields */}
				<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
					{/* Basics */}
					<div className="db-card">
						<div className="db-card-title" style={{ marginBottom: 20 }}>Basics</div>

						<div style={{ marginBottom: 18 }}>
							<div style={fieldLabel}>Campaign title</div>
							<input
								type="text"
								value={data.title}
								onChange={(e) => onChange({ title: e.target.value })}
								placeholder="e.g. Summer Launch — Reels Campaign"
								style={fieldInput}
								onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(190,242,100,0.4)")}
								onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-line-2)")}
							/>
						</div>

						<div style={{ marginBottom: 18 }}>
							<div style={fieldLabel}>Short brief</div>
							<input
								type="text"
								value={data.brief}
								onChange={(e) => onChange({ brief: e.target.value })}
								placeholder="One-line description of the campaign"
								style={fieldInput}
								maxLength={120}
								onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(190,242,100,0.4)")}
								onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-line-2)")}
							/>
							<div style={{ fontSize: 11, color: "var(--color-ink-3)", marginTop: 4, textAlign: "right" }}>
								{data.brief.length}/120
							</div>
						</div>

						<div style={{ marginBottom: 18 }}>
							<div style={fieldLabel}>Detailed brief</div>
							<textarea
								value={data.longBriefRaw}
								onChange={(e) => onChange({ longBriefRaw: e.target.value })}
								placeholder="One instruction per line..."
								style={fieldTextarea}
								onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(190,242,100,0.4)")}
								onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-line-2)")}
							/>
							<div style={{ fontSize: 11, color: "var(--color-ink-3)", marginTop: 4 }}>
								One instruction per line
							</div>
						</div>

						<div>
							<div style={fieldLabel}>Category</div>
							<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
								{CATEGORIES.map((cat) => (
									<button
										key={cat}
										onClick={() => onChange({ category: cat })}
										style={{
											padding: "7px 14px",
											borderRadius: 8,
											fontSize: 12,
											fontWeight: 500,
											border: "1px solid",
											borderColor: data.category === cat ? "rgba(190,242,100,0.4)" : "var(--color-line-2)",
											background: data.category === cat ? "rgba(190,242,100,0.08)" : "rgba(255,255,255,0.03)",
											color: data.category === cat ? "#bef264" : "var(--color-ink-1)",
											cursor: "pointer",
											transition: "all 0.15s",
										}}
									>
										{cat}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Platform & Tags */}
					<div className="db-card">
						<div className="db-card-title" style={{ marginBottom: 20 }}>Platform & Tags</div>

						<div style={{ marginBottom: 18 }}>
							<div style={fieldLabel}>Platform</div>
							<div style={{ display: "flex", gap: 10 }}>
								{PLATFORMS.map((p) => (
									<button
										key={p.id}
										onClick={() => onChange({ platform: p.id })}
										style={{
											flex: 1,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											gap: 8,
											padding: "12px 16px",
											borderRadius: 10,
											fontSize: 13,
											fontWeight: 500,
											border: "1px solid",
											borderColor: data.platform === p.id ? "rgba(190,242,100,0.4)" : "var(--color-line-2)",
											background: data.platform === p.id ? "rgba(190,242,100,0.08)" : "rgba(255,255,255,0.03)",
											color: data.platform === p.id ? "#bef264" : "var(--color-ink-1)",
											cursor: "pointer",
											transition: "all 0.15s",
										}}
									>
										<p.Icon />
										{p.label}
									</button>
								))}
							</div>
						</div>

						<div style={{ marginBottom: 18 }}>
							<div style={fieldLabel}>Content tags</div>
							<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
								{CONTENT_TAGS.map((tag) => {
									const selected = data.tags.includes(tag);
									return (
										<button
											key={tag}
											onClick={() => onChange({
												tags: selected
													? data.tags.filter((t) => t !== tag)
													: [...data.tags, tag],
											})}
											style={{
												padding: "6px 12px",
												borderRadius: 8,
												fontSize: 12,
												fontWeight: 500,
												border: "1px solid",
												borderColor: selected ? "rgba(190,242,100,0.4)" : "var(--color-line-2)",
												background: selected ? "rgba(190,242,100,0.08)" : "rgba(255,255,255,0.03)",
												color: selected ? "#bef264" : "var(--color-ink-1)",
												cursor: "pointer",
												transition: "all 0.15s",
											}}
										>
											{tag}
										</button>
									);
								})}
							</div>
						</div>

						<div>
							<div style={fieldLabel}>Accent color</div>
							<div style={{ display: "flex", gap: 10 }}>
								{COLORS.map((clr) => (
									<button
										key={clr}
										onClick={() => onChange({ color: clr })}
										style={{
											width: 36,
											height: 36,
											borderRadius: 10,
											background: COLOR_DOT[clr],
											border: "2px solid",
											borderColor: data.color === clr ? "#fff" : "transparent",
											cursor: "pointer",
											transition: "border-color 0.15s",
											outline: data.color === clr ? "2px solid rgba(255,255,255,0.2)" : "none",
											outlineOffset: 2,
										}}
									/>
								))}
							</div>
						</div>
					</div>

					{/* Budget & Payout */}
					<div className="db-card">
						<div className="db-card-title" style={{ marginBottom: 20 }}>Budget & Payout</div>

						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
							<div>
								<div style={fieldLabel}>Budget</div>
								<div style={{ display: "flex", gap: 0 }}>
									<select
										value={data.currency}
										onChange={(e) => onChange({ currency: e.target.value })}
										style={{
											...fieldInput,
											width: 56,
											borderRadius: "10px 0 0 10px",
											borderRight: "none",
											padding: "10px 8px",
											textAlign: "center",
											appearance: "none",
											background: "rgba(255,255,255,0.06)",
										}}
									>
										{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
									</select>
									<input
										type="text"
										value={data.budget}
										onChange={(e) => onChange({ budget: e.target.value })}
										placeholder="50,000"
										style={{ ...fieldInput, borderRadius: "0 10px 10px 0" }}
										onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(190,242,100,0.4)")}
										onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-line-2)")}
									/>
								</div>
							</div>
							<div>
								<div style={fieldLabel}>CPM rate</div>
								<input
									type="text"
									value={data.rate}
									onChange={(e) => onChange({ rate: e.target.value })}
									placeholder="200"
									style={fieldInput}
									onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(190,242,100,0.4)")}
									onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-line-2)")}
								/>
							</div>
						</div>

						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
							<div>
								<div style={fieldLabel}>Per views</div>
								<div style={{ display: "flex", gap: 8 }}>
									{["1k", "10k", "100k"].map((v) => (
										<button
											key={v}
											onClick={() => onChange({ perViews: v })}
											style={{
												flex: 1,
												padding: "8px",
												borderRadius: 8,
												fontSize: 12,
												fontWeight: 500,
												border: "1px solid",
												borderColor: data.perViews === v ? "rgba(190,242,100,0.4)" : "var(--color-line-2)",
												background: data.perViews === v ? "rgba(190,242,100,0.08)" : "rgba(255,255,255,0.03)",
												color: data.perViews === v ? "#bef264" : "var(--color-ink-1)",
												cursor: "pointer",
												transition: "all 0.15s",
											}}
										>
											{v}
										</button>
									))}
								</div>
							</div>
							<div>
								<div style={fieldLabel}>Min views</div>
								<input
									type="text"
									value={data.minViews}
									onChange={(e) => onChange({ minViews: e.target.value })}
									placeholder="e.g. 10k"
									style={fieldInput}
									onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(190,242,100,0.4)")}
									onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-line-2)")}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Right column — timeline & bonus */}
				<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
					{/* Timeline */}
					<div className="db-card">
						<div className="db-card-title" style={{ marginBottom: 20 }}>Timeline & Spots</div>

						<div style={{ marginBottom: 18 }}>
							<div style={fieldLabel}>Total spots</div>
							<input
								type="text"
								value={data.totalSpots}
								onChange={(e) => onChange({ totalSpots: e.target.value })}
								placeholder="e.g. 25"
								style={fieldInput}
								onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(190,242,100,0.4)")}
								onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-line-2)")}
							/>
						</div>

						<div>
							<div style={fieldLabel}>Deadline</div>
							<input
								type="date"
								value={data.deadline}
								onChange={(e) => onChange({ deadline: e.target.value })}
								style={{
									...fieldInput,
									colorScheme: "dark",
								}}
								onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(190,242,100,0.4)")}
								onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-line-2)")}
							/>
						</div>
					</div>

					{/* Bonus */}
					<div className="db-card">
						<div className="db-card-title" style={{ marginBottom: 20 }}>
							Bonus
							<span style={{ fontSize: 11, color: "var(--color-ink-3)", fontWeight: 400, marginLeft: 8 }}>Optional</span>
						</div>

						<div style={{ marginBottom: 18 }}>
							<div style={fieldLabel}>Views threshold</div>
							<input
								type="text"
								value={data.bonusThreshold}
								onChange={(e) => onChange({ bonusThreshold: e.target.value })}
								placeholder="e.g. 100k"
								style={fieldInput}
								onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(190,242,100,0.4)")}
								onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-line-2)")}
							/>
						</div>

						<div>
							<div style={fieldLabel}>Bonus amount</div>
							<input
								type="text"
								value={data.bonusAmount}
								onChange={(e) => onChange({ bonusAmount: e.target.value })}
								placeholder="e.g. 5,000"
								style={fieldInput}
								onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(190,242,100,0.4)")}
								onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-line-2)")}
							/>
						</div>
					</div>

				</div>
			</div>
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
							<div style={{ fontSize: 13, fontWeight: 500, color: c.bonus?.amount && c.bonus.amount !== "—" ? "var(--color-ink-0)" : "var(--color-ink-3)" }}>
								{c.bonus?.amount && c.bonus.amount !== "—"
									? `${c.currency}${c.bonus.amount} for ${c.bonus.threshold}+ views`
									: "None"}
							</div>
						</div>
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
