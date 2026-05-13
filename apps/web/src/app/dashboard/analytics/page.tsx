"use client";

import { useQuery } from "convex/react";
import { useSession } from "@/lib/auth-client";
import { api } from "../../../../convex/_generated/api";

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

const COLORS: Record<string, string> = {
	lime: "#bef264",
	cyan: "#67e8f9",
	violet: "#c084fc",
	orange: "#fb923c",
	rose: "#fb7185",
	blue: "#60a5fa",
};

export default function DashboardAnalytics() {
	const { data: session } = useSession();
	const userId = session?.user?.id;
	const brandProfile = useQuery(
		api.brands.getByUserId,
		userId ? { userId } : "skip",
	);
	const creatorProfile = useQuery(
		api.creators.getByUserId,
		userId ? { userId } : "skip",
	);

	if (brandProfile) return <BrandAnalytics userId={userId!} />;
	if (creatorProfile)
		return (
			<CreatorAnalytics userId={userId!} creatorProfile={creatorProfile} />
		);
	return null;
}

// ─── Brand Analytics ─────────────────────────────────────────────────────────

function BrandAnalytics({ userId }: { userId: string }) {
	const brandProfile = useQuery(api.brands.getByUserId, { userId });
	const campaigns = useQuery(
		api.campaigns.listByBrand,
		brandProfile?._id ? { brandId: brandProfile._id } : "skip",
	);

	const allCampaigns = campaigns ?? [];
	const currency = allCampaigns[0]?.currency ?? "₹";
	const totalBudget = allCampaigns.reduce(
		(sum, c) => sum + Number(c.budget?.replace(/[^0-9]/g, "") || 0),
		0,
	);
	const avgRate =
		allCampaigns.length > 0
			? Math.round(
					allCampaigns.reduce((s, c) => s + c.rate, 0) / allCampaigns.length,
				)
			: 0;

	const topStats = [
		{ label: "Total spend", value: formatMoney(totalBudget, currency) },
		{ label: "Total views", value: "0" },
		{ label: "Avg. CPM", value: avgRate ? `${currency}${avgRate}` : "—" },
		{ label: "Total engagements", value: "0" },
		{ label: "Conversion rate", value: "0%" },
		{ label: "ROI", value: "—" },
	];

	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	return (
		<div>
			<div className="db-page-header">
				<div>
					<h1 className="db-page-title">Analytics</h1>
					<p className="db-page-sub">
						Performance metrics across all your campaigns
					</p>
				</div>
			</div>

			<div className="db-stat-grid-6">
				{topStats.map((s) => (
					<div key={s.label} className="db-stat-card">
						<div className="db-stat-label" style={{ marginBottom: 8 }}>
							{s.label}
						</div>
						<div className="db-stat-value">{s.value}</div>
					</div>
				))}
			</div>

			<div className="db-row-2" style={{ marginTop: 20 }}>
				<div className="db-card">
					<div className="db-card-title">Views over time</div>
					<div className="db-card-sub">
						Monthly aggregate views across campaigns
					</div>
					<div className="db-bar-chart">
						{months.map((m) => (
							<div key={m} className="db-bar-col">
								<div
									className="db-bar"
									style={{ height: 4, background: "rgba(190,242,100,0.15)" }}
								/>
								<span className="db-bar-label">{m}</span>
							</div>
						))}
					</div>
					<div
						style={{
							textAlign: "center",
							padding: "20px 0 0",
							fontSize: 12,
							color: "var(--color-ink-3)",
						}}
					>
						Data populates as creators submit content
					</div>
				</div>

				<div className="db-card">
					<div className="db-card-title">Engagement breakdown</div>
					<div className="db-card-sub">
						Aggregate reactions across submissions
					</div>
					<div className="db-engagement-grid">
						{[
							{ label: "Views", value: "0", color: "#60a5fa" },
							{ label: "Likes", value: "0", color: "#fb7185" },
							{ label: "Comments", value: "0", color: "#4ade80" },
							{ label: "Shares", value: "0", color: "#fbbf24" },
						].map((e) => (
							<div key={e.label} className="db-engagement-item">
								<div className="db-engagement-num" style={{ color: e.color }}>
									{e.value}
								</div>
								<div className="db-engagement-label">{e.label}</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="db-card" style={{ marginTop: 20 }}>
				<div className="db-card-title" style={{ marginBottom: 20 }}>
					Campaign performance
				</div>
				{allCampaigns.length === 0 ? (
					<div className="db-empty" style={{ padding: "40px 0" }}>
						<div className="db-empty-title">No campaign data</div>
						<div className="db-empty-desc">
							Create a campaign to start tracking performance
						</div>
					</div>
				) : (
					<div className="db-table-wrap">
						<table className="db-table">
							<thead>
								<tr>
									<th>Campaign</th>
									<th>Status</th>
									<th>Budget</th>
									<th>Spent</th>
									<th>Creators</th>
									<th>Views</th>
									<th>Engagement</th>
									<th>CPM</th>
									<th>Fill rate</th>
								</tr>
							</thead>
							<tbody>
								{allCampaigns.map((c) => {
									const fillPct =
										c.totalSpots > 0
											? Math.round((c.creatorsJoined / c.totalSpots) * 100)
											: 0;
									return (
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
											<td>
												<span className={`db-status-badge ${c.status}`}>
													{c.status}
												</span>
											</td>
											<td>{formatMoney(c.budget, c.currency)}</td>
											<td>{c.currency}0</td>
											<td>
												{c.creatorsJoined}/{c.totalSpots}
											</td>
											<td>0</td>
											<td>0</td>
											<td>
												{c.currency}
												{c.rate}
											</td>
											<td>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: 8,
													}}
												>
													<div className="db-progress" style={{ width: 60 }}>
														<div
															className="db-progress-fill"
															style={{
																width: `${fillPct}%`,
																background: COLORS[c.color] || "#bef264",
															}}
														/>
													</div>
													<span
														style={{
															fontSize: 11,
															color: "var(--color-ink-2)",
														}}
													>
														{fillPct}%
													</span>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}

// ─── Creator Analytics ───────────────────────────────────────────────────────

function CreatorAnalytics({
	userId,
	creatorProfile,
}: {
	userId: string;
	creatorProfile: any;
}) {
	const submissions = useQuery(api.submissions.listByUser, { userId });
	const applications = useQuery(api.applications.listByUser, { userId });

	const allSubs = submissions ?? [];
	const allApps = applications ?? [];
	const currency = creatorProfile.currency || "₹";

	const totalViews = allSubs.reduce((sum, s) => sum + (s.views || 0), 0);
	const totalLikes = allSubs.reduce((sum, s) => sum + (s.likes || 0), 0);
	const totalComments = allSubs.reduce((sum, s) => sum + (s.comments || 0), 0);
	const totalShares = allSubs.reduce((sum, s) => sum + (s.shares || 0), 0);
	const totalEarnings = allSubs.reduce((sum, s) => sum + (s.earnings || 0), 0);
	const approvalRate =
		allApps.length > 0
			? Math.round(
					(allApps.filter((a) => a.status === "approved").length /
						allApps.length) *
						100,
				)
			: 0;

	const topStats = [
		{
			label: "Total views",
			value: totalViews > 0 ? totalViews.toLocaleString() : "0",
		},
		{ label: "Total earned", value: formatMoney(totalEarnings, currency) },
		{ label: "Submissions", value: String(allSubs.length) },
		{ label: "Applications", value: String(allApps.length) },
		{ label: "Approval rate", value: `${approvalRate}%` },
		{
			label: "Avg. engagement",
			value:
				totalViews > 0
					? `${(((totalLikes + totalComments + totalShares) / totalViews) * 100).toFixed(1)}%`
					: "—",
		},
	];

	return (
		<div>
			<div className="db-page-header">
				<div>
					<h1 className="db-page-title">Analytics</h1>
					<p className="db-page-sub">Your performance metrics and earnings</p>
				</div>
			</div>

			<div className="db-stat-grid-6">
				{topStats.map((s) => (
					<div key={s.label} className="db-stat-card">
						<div className="db-stat-label" style={{ marginBottom: 8 }}>
							{s.label}
						</div>
						<div className="db-stat-value">{s.value}</div>
					</div>
				))}
			</div>

			<div className="db-row-2" style={{ marginTop: 20 }}>
				<div className="db-card">
					<div className="db-card-title">Engagement breakdown</div>
					<div className="db-card-sub">
						Your total engagement across all submissions
					</div>
					<div className="db-engagement-grid">
						{[
							{
								label: "Views",
								value: totalViews.toLocaleString(),
								color: "#60a5fa",
							},
							{
								label: "Likes",
								value: totalLikes.toLocaleString(),
								color: "#fb7185",
							},
							{
								label: "Comments",
								value: totalComments.toLocaleString(),
								color: "#4ade80",
							},
							{
								label: "Shares",
								value: totalShares.toLocaleString(),
								color: "#fbbf24",
							},
						].map((e) => (
							<div key={e.label} className="db-engagement-item">
								<div className="db-engagement-num" style={{ color: e.color }}>
									{e.value}
								</div>
								<div className="db-engagement-label">{e.label}</div>
							</div>
						))}
					</div>
				</div>

				<div className="db-card">
					<div className="db-card-title">Connected platforms</div>
					<div className="db-card-sub">Your linked accounts</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 12,
							marginTop: 16,
						}}
					>
						{creatorProfile.platforms?.map((p: any) => (
							<div
								key={p.name}
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									padding: "12px 14px",
									background: "rgba(255,255,255,0.02)",
									borderRadius: 10,
									border: "1px solid var(--color-line)",
								}}
							>
								<div>
									<div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
									<div style={{ fontSize: 12, color: "var(--color-ink-3)" }}>
										{p.handle}
									</div>
								</div>
								<div style={{ textAlign: "right" }}>
									<div style={{ fontSize: 13, fontWeight: 600 }}>
										{p.followers}
									</div>
									<div
										style={{
											fontSize: 11,
											color: p.growth?.startsWith("+")
												? "#4ade80"
												: "var(--color-ink-3)",
										}}
									>
										{p.growth}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{allSubs.length === 0 && (
				<div className="db-card" style={{ marginTop: 20 }}>
					<div className="db-empty" style={{ padding: "40px 0" }}>
						<div className="db-empty-icon">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="var(--color-ink-3)"
								strokeWidth="1.5"
								strokeLinecap="round"
							>
								<line x1="18" y1="20" x2="18" y2="10" />
								<line x1="12" y1="20" x2="12" y2="4" />
								<line x1="6" y1="20" x2="6" y2="14" />
							</svg>
						</div>
						<div className="db-empty-title">No performance data yet</div>
						<div className="db-empty-desc">
							Submit content for campaigns to start seeing your analytics here
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
