"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";

export default function VerificationsPage() {
	const allVerifications = useQuery(api.verifications.listAll) ?? [];
	const verifyMutation = useMutation(api.verifications.verify);
	const rejectMutation = useMutation(api.verifications.reject);
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [filter, setFilter] = useState<"all" | "pending" | "verified">("all");

	const filtered = filter === "all"
		? allVerifications
		: allVerifications.filter((v) => v.status === filter);

	const pendingCount = allVerifications.filter((v) => v.status === "pending").length;
	const verifiedCount = allVerifications.filter((v) => v.status === "verified").length;

	async function handleVerify(code: string) {
		setActionLoading(code);
		try {
			await verifyMutation({ code });
		} finally {
			setActionLoading(null);
		}
	}

	async function handleReject(code: string) {
		setActionLoading(code);
		try {
			await rejectMutation({ code });
		} finally {
			setActionLoading(null);
		}
	}

	return (
		<div>
			<div className="db-page-header">
				<h1 className="db-page-title">Verifications</h1>
				<div style={{ display: "flex", gap: 8 }}>
					<span style={{
						fontSize: 12,
						padding: "4px 10px",
						borderRadius: 8,
						background: "rgba(251,191,36,0.12)",
						color: "#fbbf24",
						fontWeight: 600,
					}}>
						{pendingCount} pending
					</span>
					<span style={{
						fontSize: 12,
						padding: "4px 10px",
						borderRadius: 8,
						background: "rgba(74,222,128,0.12)",
						color: "#4ade80",
						fontWeight: 600,
					}}>
						{verifiedCount} verified
					</span>
				</div>
			</div>

			{/* Filter tabs */}
			<div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
				{(["all", "pending", "verified"] as const).map((f) => (
					<button
						key={f}
						onClick={() => setFilter(f)}
						style={{
							padding: "6px 16px",
							borderRadius: 8,
							border: "1px solid",
							borderColor: filter === f ? "var(--color-accent-strong)" : "var(--color-border)",
							background: filter === f ? "rgba(190,242,100,0.08)" : "transparent",
							color: filter === f ? "var(--color-accent-strong)" : "var(--color-ink-2)",
							fontSize: 13,
							fontWeight: 500,
							cursor: "pointer",
							textTransform: "capitalize",
						}}
					>
						{f}
					</button>
				))}
			</div>

			{filtered.length === 0 ? (
				<div className="db-card" style={{ textAlign: "center", padding: 40 }}>
					<p style={{ color: "var(--color-ink-3)", fontSize: 14 }}>
						No {filter !== "all" ? filter : ""} verifications found.
					</p>
				</div>
			) : (
				<div className="db-card">
					<div className="db-table-wrap">
						<table className="db-table">
							<thead>
								<tr>
									<th>Platform</th>
									<th>Handle</th>
									<th>Code</th>
									<th>User ID</th>
									<th>Date</th>
									<th>Status</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((v) => (
									<tr key={v._id}>
										<td>
											<span style={{
												textTransform: "capitalize",
												fontWeight: 500,
											}}>
												{v.platform}
											</span>
										</td>
										<td>@{v.handle}</td>
										<td>
											<code style={{
												background: "var(--color-surface-2)",
												padding: "2px 8px",
												borderRadius: 6,
												fontSize: 13,
												fontFamily: "monospace",
												letterSpacing: 2,
											}}>
												{v.code}
											</code>
										</td>
										<td>
											<span style={{
												fontSize: 12,
												color: "var(--color-ink-3)",
												maxWidth: 120,
												overflow: "hidden",
												textOverflow: "ellipsis",
												display: "inline-block",
											}}>
												{v.userId}
											</span>
										</td>
										<td style={{ fontSize: 12, color: "var(--color-ink-3)" }}>
											{new Date(v.createdAt).toLocaleDateString()}
										</td>
										<td>
											<span className={`db-status-badge ${v.status === "verified" ? "active" : ""}`} style={
												v.status === "pending"
													? { background: "rgba(251,191,36,0.12)", color: "#fbbf24" }
													: undefined
											}>
												{v.status}
											</span>
										</td>
										<td>
											{v.status === "pending" ? (
												<div style={{ display: "flex", gap: 6 }}>
													<button
														onClick={() => handleVerify(v.code)}
														disabled={actionLoading === v.code}
														style={{
															padding: "4px 12px",
															borderRadius: 6,
															border: "none",
															background: "#4ade80",
															color: "#000",
															fontSize: 12,
															fontWeight: 600,
															cursor: "pointer",
															opacity: actionLoading === v.code ? 0.5 : 1,
														}}
													>
														Approve
													</button>
													<button
														onClick={() => handleReject(v.code)}
														disabled={actionLoading === v.code}
														style={{
															padding: "4px 12px",
															borderRadius: 6,
															border: "1px solid var(--color-border)",
															background: "transparent",
															color: "#fb7185",
															fontSize: 12,
															fontWeight: 600,
															cursor: "pointer",
															opacity: actionLoading === v.code ? 0.5 : 1,
														}}
													>
														Reject
													</button>
												</div>
											) : (
												<span style={{ fontSize: 12, color: "var(--color-ink-3)" }}>—</span>
											)}
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
