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

function daysUntil(dateStr: string): number {
	return Math.max(
		0,
		Math.ceil(
			(new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
		),
	);
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
	const totalSpots = allCampaigns.reduce(
		(sum, c) => sum + (c.totalSpots || 0),
		0,
	);
	const filledSpots = allCampaigns.reduce(
		(sum, c) => sum + (c.creatorsJoined || 0),
		0,
	);
	const avgRate =
		allCampaigns.length > 0
			? Math.round(
					allCampaigns.reduce((s, c) => s + c.rate, 0) / allCampaigns.length,
				)
			: 0;

	const topStats = [
		{
			label: "Total spend",
			value: formatMoney(totalBudget, currency),
			change: null,
		},
		{ label: "Total views", value: "0", change: null },
		{
			label: "Avg. CPM",
			value: avgRate ? `${currency}${avgRate}` : "—",
			change: null,
		},
		{ label: "Total engagements", value: "0", change: null },
		{ label: "Conversion rate", value: "0%", change: null },
		{ label: "ROI", value: "—", change: null },
	];

	// Platform breakdown
	const platformCounts: Record<string, number> = {};
	allCampaigns.forEach((c) => {
		platformCounts[c.platform] = (platformCounts[c.platform] || 0) + 1;
	});

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

			{/* KPI cards */}
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

			{/* Charts row */}
			<div className="db-row-2" style={{ marginTop: 20 }}>
				{/* Views trend */}
				<div className="db-card">
					<div className="db-card-title">Views over time</div>
					<div className="db-card-sub">
						Monthly aggregate views across campaigns
					</div>
					<div className="db-bar-chart">
						{months.map((m, i) => (
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

				{/* Engagement breakdown */}
				<div className="db-card">
					<div className="db-card-title">Engagement breakdown</div>
					<div className="db-card-sub">
						Aggregate reactions across submissions
					</div>
					<div className="db-engagement-grid">
						{[
							{ label: "Views", value: "0", icon: "👁", color: "#60a5fa" },
							{ label: "Likes", value: "0", icon: "❤️", color: "#fb7185" },
							{ label: "Comments", value: "0", icon: "💬", color: "#4ade80" },
							{ label: "Shares", value: "0", icon: "🔗", color: "#fbbf24" },
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

			{/* Campaign performance table */}
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

			{/* Creator leaderboard placeholder */}
			<div className="db-card" style={{ marginTop: 20 }}>
				<div className="db-card-title" style={{ marginBottom: 6 }}>
					Top performing creators
				</div>
				<div className="db-card-sub">
					Ranked by views generated for your campaigns
				</div>
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
							strokeLinejoin="round"
						>
							<path d="M12 15l-2 5l9-11h-5l2-5l-9 11h5z" />
						</svg>
					</div>
					<div className="db-empty-title">No creator data yet</div>
					<div className="db-empty-desc">
						Creator rankings will appear once submissions start coming in
					</div>
				</div>
			</div>
		</div>
	);
}
