"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { api } from "../../../../convex/_generated/api";

const COLORS: Record<string, string> = {
	lime: "#bef264",
	cyan: "#67e8f9",
	violet: "#c084fc",
	orange: "#fb923c",
	rose: "#fb7185",
	blue: "#60a5fa",
};

export default function DashboardApplications() {
	const { data: session } = useSession();
	const userId = session?.user?.id;
	const applications = useQuery(
		api.applications.listByUser,
		userId ? { userId } : "skip",
	);
	const [filter, setFilter] = useState<
		"all" | "pending" | "approved" | "rejected"
	>("all");

	const allApps = applications ?? [];
	const filtered =
		filter === "all" ? allApps : allApps.filter((a) => a.status === filter);

	const counts = {
		all: allApps.length,
		pending: allApps.filter((a) => a.status === "pending").length,
		approved: allApps.filter((a) => a.status === "approved").length,
		rejected: allApps.filter((a) => a.status === "rejected").length,
	};

	return (
		<div>
			<div className="db-page-header">
				<div>
					<h1 className="db-page-title">Applications</h1>
					<p className="db-page-sub">Track all your campaign applications</p>
				</div>
				<Link
					href="/marketplace"
					className="btn btn-primary"
					style={{ textDecoration: "none", fontSize: 13 }}
				>
					Browse campaigns
				</Link>
			</div>

			{/* Filter pills */}
			<div className="db-filters" style={{ marginBottom: 24 }}>
				{(["all", "pending", "approved", "rejected"] as const).map((f) => (
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

			{filtered.length === 0 ? (
				<div className="db-card">
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
						<div className="db-empty-title">
							{filter === "all"
								? "No applications yet"
								: `No ${filter} applications`}
						</div>
						<div className="db-empty-desc">
							{filter === "all"
								? "Apply to campaigns on the marketplace to get started"
								: "Try a different filter to see your applications"}
						</div>
						{filter === "all" && (
							<Link
								href="/marketplace"
								className="btn btn-primary"
								style={{ textDecoration: "none", marginTop: 16, fontSize: 13 }}
							>
								Browse campaigns
							</Link>
						)}
					</div>
				</div>
			) : (
				<div className="db-card">
					<div className="db-table-wrap">
						<table className="db-table">
							<thead>
								<tr>
									<th>Campaign</th>
									<th>Brand</th>
									<th>Platform</th>
									<th>Rate</th>
									<th>Deadline</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((a) => (
									<tr key={a._id}>
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
														background:
															COLORS[a.campaignColor || "lime"] || "#bef264",
													}}
												/>
												<span style={{ fontWeight: 500 }}>
													{a.campaignTitle}
												</span>
											</div>
										</td>
										<td>{a.campaignBrand}</td>
										<td>{a.platform}</td>
										<td>
											{a.campaignCurrency || "₹"}
											{a.campaignRate || 0}
											<span
												style={{ fontSize: 11, color: "var(--color-ink-3)" }}
											>
												/{a.campaignPerViews || "1K"} views
											</span>
										</td>
										<td style={{ fontSize: 12, color: "var(--color-ink-2)" }}>
											{a.campaignDeadline || "—"}
										</td>
										<td>
											<span className={`db-status-badge ${a.status}`}>
												{a.status}
											</span>
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
