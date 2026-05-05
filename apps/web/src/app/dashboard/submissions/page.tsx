"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function DashboardSubmissions() {
	const { data: session } = useSession();
	const userId = session?.user?.id;
	const brandProfile = useQuery(api.brands.getByUserId, userId ? { userId } : "skip");
	const campaigns = useQuery(api.campaigns.listByBrand, brandProfile?._id ? { brandId: brandProfile._id } : "skip");
	const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
	const [selectedCampaign, setSelectedCampaign] = useState("all");

	const allCampaigns = campaigns ?? [];

	const stats = [
		{ label: "Total submissions", value: "0", color: "var(--color-accent-strong)", bg: "rgba(190,242,100,0.1)" },
		{ label: "Pending review", value: "0", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
		{ label: "Approved", value: "0", color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
		{ label: "Total views", value: "0", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
		{ label: "Total earnings paid", value: "₹0", color: "#f472b6", bg: "rgba(244,114,182,0.1)" },
	];

	return (
		<div>
			<div className="db-page-header">
				<div>
					<h1 className="db-page-title">Submissions</h1>
					<p className="db-page-sub">Review content submitted by creators for your campaigns</p>
				</div>
			</div>

			{/* Stat cards */}
			<div className="db-stat-grid-5">
				{stats.map((s) => (
					<div key={s.label} className="db-stat-card">
						<div className="db-stat-label" style={{ marginBottom: 10 }}>{s.label}</div>
						<div className="db-stat-value" style={{ color: s.color }}>{s.value}</div>
					</div>
				))}
			</div>

			{/* Filters */}
			<div className="db-toolbar">
				<div className="db-filters">
					{(["all", "pending", "approved", "rejected"] as const).map((f) => (
						<button
							key={f}
							onClick={() => setFilter(f)}
							className={`db-filter-pill${filter === f ? " active" : ""}`}
						>
							{f.charAt(0).toUpperCase() + f.slice(1)}
						</button>
					))}
				</div>

				<select
					value={selectedCampaign}
					onChange={(e) => setSelectedCampaign(e.target.value)}
					className="db-select"
				>
					<option value="all">All campaigns</option>
					{allCampaigns.map((c) => (
						<option key={c._id} value={c._id}>{c.title}</option>
					))}
				</select>
			</div>

			{/* Submissions table / empty state */}
			<div className="db-card">
				<div className="db-empty">
					<div className="db-empty-icon">
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
							<polygon points="23 7 16 12 23 17 23 7"/>
							<rect x="1" y="5" width="15" height="14" rx="2"/>
						</svg>
					</div>
					<div className="db-empty-title">No submissions yet</div>
					<div className="db-empty-desc">
						When creators post content for your campaigns, their submissions and performance analytics will appear here for review.
					</div>
				</div>
			</div>

			{/* What to expect section */}
			<div className="db-card" style={{ marginTop: 20 }}>
				<div className="db-card-title" style={{ marginBottom: 16 }}>What you&apos;ll see here</div>
				<div className="db-feature-grid">
					{[
						{
							title: "Content preview",
							desc: "View reels, shorts, and posts submitted by creators with direct links",
							icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
						},
						{
							title: "Performance metrics",
							desc: "Views, likes, comments, shares — updated automatically",
							icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
						},
						{
							title: "Approve or reject",
							desc: "Review each submission and approve for payout or request changes",
							icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
						},
						{
							title: "Earnings tracking",
							desc: "CPM-based earnings calculated and tracked per submission",
							icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
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
