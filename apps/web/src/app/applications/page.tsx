"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowIcon, BackIcon, PlatformIcon } from "@/components/icons";
import { Nav as SharedNav } from "@/components/nav";
import { ACCENT_MAP } from "@/data/constants";
import { useSession } from "@/lib/auth-client";
import { api } from "../../../convex/_generated/api";

// ─── Status badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
	const map: Record<string, { bg: string; color: string; label: string }> = {
		pending: {
			bg: "rgba(251,191,36,0.12)",
			color: "#fbbf24",
			label: "Pending",
		},
		approved: {
			bg: "rgba(74,222,128,0.12)",
			color: "#4ade80",
			label: "Approved",
		},
		rejected: {
			bg: "rgba(248,113,113,0.12)",
			color: "#f87171",
			label: "Rejected",
		},
		submitted: {
			bg: "rgba(96,165,250,0.12)",
			color: "#60a5fa",
			label: "Submitted",
		},
		live: { bg: "rgba(74,222,128,0.12)", color: "#4ade80", label: "Live" },
		revision: {
			bg: "rgba(251,191,36,0.12)",
			color: "#fbbf24",
			label: "Revision",
		},
	};
	const s = map[status] ?? map.pending;
	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 6,
				padding: "4px 10px",
				borderRadius: 20,
				fontSize: 11.5,
				fontWeight: 600,
				background: s.bg,
				color: s.color,
			}}
		>
			<span
				style={{
					width: 6,
					height: 6,
					borderRadius: "50%",
					background: s.color,
				}}
			/>
			{s.label}
		</span>
	);
}

// ─── Application card ───────────────────────────────────────────────────────

function ApplicationCard({ app }: { app: any }) {
	const accent = ACCENT_MAP[app.campaignColor ?? "lime"] ?? ACCENT_MAP.lime;

	return (
		<div className="app-card">
			<div
				className="app-card-accent"
				style={{
					background: `linear-gradient(135deg, ${accent.chip}, ${accent.text})`,
				}}
			/>
			<div className="app-card-body">
				<div className="app-card-header">
					<div style={{ flex: 1, minWidth: 0 }}>
						<Link
							href={`/campaign/${app.campaignId}`}
							className="app-card-title"
						>
							{app.campaignTitle}
						</Link>
						<div className="app-card-brand">{app.campaignBrand}</div>
					</div>
					<StatusBadge status={app.status} />
				</div>

				<div className="app-card-chips">
					<div className="app-chip">
						<PlatformIcon
							name={app.platform}
							style={{ width: 14, height: 14 }}
						/>
						<span>{app.platform}</span>
					</div>
					<div className="app-chip">
						<span style={{ color: "var(--color-ink-3)" }}>Handle</span>
						<span style={{ fontWeight: 500 }}>{app.platformHandle}</span>
					</div>
					<div className="app-chip">
						<span style={{ color: "var(--color-ink-3)" }}>Followers</span>
						<span style={{ fontWeight: 500 }}>{app.platformFollowers}</span>
					</div>
					{app.campaignRate != null && (
						<div className="app-chip">
							<span style={{ color: "var(--color-ink-3)" }}>CPM</span>
							<span style={{ fontWeight: 500 }}>
								{app.campaignCurrency}
								{app.campaignRate}/{app.campaignPerViews}
							</span>
						</div>
					)}
					{app.campaignDeadline && (
						<div className="app-chip">
							<span style={{ color: "var(--color-ink-3)" }}>Deadline</span>
							<span style={{ fontWeight: 500 }}>{app.campaignDeadline}</span>
						</div>
					)}
					{app.campaignCategory && (
						<div className="app-chip">
							<span style={{ color: "var(--color-ink-3)" }}>Category</span>
							<span style={{ fontWeight: 500 }}>{app.campaignCategory}</span>
						</div>
					)}
				</div>

				<div className="app-card-section">
					<div className="app-card-section-label">Your Pitch</div>
					<p className="app-card-pitch">{app.pitch}</p>
				</div>

				{app.exampleUrl && (
					<div className="app-card-section">
						<div className="app-card-section-label">Example Post</div>
						<a
							href={app.exampleUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="app-card-link"
						>
							{app.exampleUrl}
						</a>
					</div>
				)}

				<div className="app-card-footer">
					<span style={{ fontSize: 11.5, color: "var(--color-ink-3)" }}>
						Applied{" "}
						{new Date(app._creationTime).toLocaleDateString("en-IN", {
							day: "numeric",
							month: "short",
							year: "numeric",
						})}
					</span>
					<Link href={`/campaign/${app.campaignId}`} className="app-card-view">
						View Campaign
						<ArrowIcon style={{ width: 12, height: 12 }} />
					</Link>
				</div>
			</div>
		</div>
	);
}

// ─── Submission card (for approved campaigns where content was submitted) ───

function SubmissionCard({ app }: { app: any }) {
	const accent = ACCENT_MAP[app.campaignColor ?? "lime"] ?? ACCENT_MAP.lime;

	return (
		<div className="app-card">
			<div
				className="app-card-accent"
				style={{
					background: `linear-gradient(135deg, ${accent.chip}, ${accent.text})`,
				}}
			/>
			<div className="app-card-body">
				<div className="app-card-header">
					<div style={{ flex: 1, minWidth: 0 }}>
						<Link
							href={`/campaign/${app.campaignId}`}
							className="app-card-title"
						>
							{app.campaignTitle}
						</Link>
						<div className="app-card-brand">{app.campaignBrand}</div>
					</div>
					<StatusBadge status="approved" />
				</div>

				<div className="app-card-chips">
					<div className="app-chip">
						<PlatformIcon
							name={app.platform}
							style={{ width: 14, height: 14 }}
						/>
						<span>{app.platform}</span>
					</div>
					<div className="app-chip">
						<span style={{ color: "var(--color-ink-3)" }}>Handle</span>
						<span style={{ fontWeight: 500 }}>{app.platformHandle}</span>
					</div>
					{app.campaignRate != null && (
						<div className="app-chip">
							<span style={{ color: "var(--color-ink-3)" }}>CPM</span>
							<span style={{ fontWeight: 500 }}>
								{app.campaignCurrency}
								{app.campaignRate}/{app.campaignPerViews}
							</span>
						</div>
					)}
					{app.campaignDeadline && (
						<div className="app-chip">
							<span style={{ color: "var(--color-ink-3)" }}>Deadline</span>
							<span style={{ fontWeight: 500 }}>{app.campaignDeadline}</span>
						</div>
					)}
				</div>

				<div className="app-card-section">
					<div className="app-card-section-label">Submission Status</div>
					<p
						className="app-card-pitch"
						style={{ fontSize: 13, color: "var(--color-ink-2)" }}
					>
						Your application has been approved. Submit your content before the
						deadline.
					</p>
				</div>

				<div className="app-card-footer">
					<span style={{ fontSize: 11.5, color: "var(--color-ink-3)" }}>
						Approved{" "}
						{new Date(app._creationTime).toLocaleDateString("en-IN", {
							day: "numeric",
							month: "short",
							year: "numeric",
						})}
					</span>
					<Link href={`/campaign/${app.campaignId}`} className="app-card-view">
						View Campaign
						<ArrowIcon style={{ width: 12, height: 12 }} />
					</Link>
				</div>
			</div>
		</div>
	);
}

// ─── Empty states ───────────────────────────────────────────────────────────

function EmptyApplications() {
	return (
		<div className="app-empty">
			<div className="app-empty-icon">
				<svg
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
					<polyline points="14 2 14 8 20 8" />
					<line x1="12" y1="18" x2="12" y2="12" />
					<line x1="9" y1="15" x2="15" y2="15" />
				</svg>
			</div>
			<h3
				style={{
					fontFamily: "'Geist', sans-serif",
					fontSize: 18,
					fontWeight: 600,
					margin: "0 0 8px",
				}}
			>
				No applications yet
			</h3>
			<p
				style={{
					fontSize: 13.5,
					color: "var(--color-ink-2)",
					margin: "0 0 24px",
					maxWidth: 360,
				}}
			>
				Browse campaigns and apply to start earning. Your applications will show
				up here.
			</p>
			<Link
				href="/marketplace"
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: 8,
					padding: "10px 20px",
					borderRadius: 10,
					background: "var(--color-accent)",
					color: "#0a0a0c",
					fontSize: 13,
					fontWeight: 600,
					textDecoration: "none",
				}}
			>
				Browse Campaigns
				<ArrowIcon style={{ width: 14, height: 14 }} />
			</Link>
		</div>
	);
}

function EmptySubmissions() {
	return (
		<div className="app-empty">
			<div className="app-empty-icon">
				<svg
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="17 8 12 3 7 8" />
					<line x1="12" y1="3" x2="12" y2="15" />
				</svg>
			</div>
			<h3
				style={{
					fontFamily: "'Geist', sans-serif",
					fontSize: 18,
					fontWeight: 600,
					margin: "0 0 8px",
				}}
			>
				No submissions yet
			</h3>
			<p
				style={{
					fontSize: 13.5,
					color: "var(--color-ink-2)",
					margin: "0 0 24px",
					maxWidth: 360,
				}}
			>
				Once your applications are approved, you can submit your content here.
			</p>
		</div>
	);
}

// ─── Inner page (uses useSearchParams) ──────────────────────────────────────

function ApplicationsInner() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialTab =
		searchParams.get("tab") === "applications" ? "applications" : "submissions";
	const [activeTab, setActiveTab] = useState<"applications" | "submissions">(
		initialTab,
	);

	const { data: session, isPending } = useSession();
	const applications = useQuery(
		api.applications.listByUser,
		session?.user ? { userId: session.user.id } : "skip",
	);

	const allApps = applications ?? [];
	const pending = allApps.filter((a) => a.status === "pending");
	const approved = allApps.filter((a) => a.status === "approved");
	const rejected = allApps.filter((a) => a.status === "rejected");

	if (!isPending && !session?.user) {
		router.push("/login?mode=signin");
		return null;
	}

	return (
		<>
			<div className="ambient" />
			<div className="grain" />
			<SharedNav />

			<main className="app-page">
				{/* Header */}
				<div className="app-page-header">
					<div>
						<Link href="/marketplace" className="app-back">
							<BackIcon style={{ width: 16, height: 16 }} />
							Back to campaigns
						</Link>
						<h1 className="app-page-title">
							{activeTab === "applications"
								? "My Applications"
								: "My Submissions"}
						</h1>
						<p className="app-page-sub">
							{activeTab === "applications"
								? "Track the status of all your campaign applications."
								: "View and manage your approved campaign submissions."}
						</p>
					</div>
					{allApps.length > 0 && activeTab === "applications" && (
						<div className="app-page-stats">
							<div className="app-stat">
								<div className="app-stat-num">{allApps.length}</div>
								<div className="app-stat-label">Total</div>
							</div>
							<div className="app-stat">
								<div className="app-stat-num" style={{ color: "#fbbf24" }}>
									{pending.length}
								</div>
								<div className="app-stat-label">Pending</div>
							</div>
							<div className="app-stat">
								<div className="app-stat-num" style={{ color: "#4ade80" }}>
									{approved.length}
								</div>
								<div className="app-stat-label">Approved</div>
							</div>
							<div className="app-stat">
								<div className="app-stat-num" style={{ color: "#f87171" }}>
									{rejected.length}
								</div>
								<div className="app-stat-label">Rejected</div>
							</div>
						</div>
					)}
				</div>

				{/* Tab bar */}
				<div className="app-tabs">
					<button
						className={`app-tab${activeTab === "applications" ? " active" : ""}`}
						onClick={() => setActiveTab("applications")}
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
							<polyline points="14 2 14 8 20 8" />
						</svg>
						Applications
						{allApps.length > 0 && (
							<span className="app-tab-count">{allApps.length}</span>
						)}
					</button>
					<button
						className={`app-tab${activeTab === "submissions" ? " active" : ""}`}
						onClick={() => setActiveTab("submissions")}
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="17 8 12 3 7 8" />
							<line x1="12" y1="3" x2="12" y2="15" />
						</svg>
						Submissions
						{approved.length > 0 && (
							<span className="app-tab-count">{approved.length}</span>
						)}
					</button>
				</div>

				{/* Content */}
				{applications === undefined ? (
					<div className="app-grid">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								style={{
									background: "rgba(255,255,255,0.03)",
									borderRadius: 16,
									padding: 20,
									border: "1px solid rgba(255,255,255,0.06)",
								}}
							>
								<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
									<div style={{ width: "55%", height: 18, borderRadius: 8, background: "rgba(255,255,255,0.06)" }} />
									<div style={{ width: 64, height: 22, borderRadius: 12, background: "rgba(255,255,255,0.06)" }} />
								</div>
								<div style={{ width: "100%", height: 12, borderRadius: 6, marginBottom: 6, background: "rgba(255,255,255,0.06)" }} />
								<div style={{ width: "70%", height: 12, borderRadius: 6, marginBottom: 16, background: "rgba(255,255,255,0.06)" }} />
								<div style={{ display: "flex", gap: 12 }}>
									<div style={{ width: 80, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
									<div style={{ width: 60, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
								</div>
							</div>
						))}
					</div>
				) : activeTab === "applications" ? (
					allApps.length === 0 ? (
						<EmptyApplications />
					) : (
						<div className="app-grid">
							{allApps
								.sort((a, b) => b._creationTime - a._creationTime)
								.map((app) => (
									<ApplicationCard key={app._id} app={app} />
								))}
						</div>
					)
				) : approved.length === 0 ? (
					<EmptySubmissions />
				) : (
					<div className="app-grid">
						{approved
							.sort((a, b) => b._creationTime - a._creationTime)
							.map((app) => (
								<SubmissionCard key={app._id} app={app} />
							))}
					</div>
				)}
			</main>
		</>
	);
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ApplicationsPage() {
	return (
		<Suspense>
			<ApplicationsInner />
		</Suspense>
	);
}
