"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";

const styles = `
	.av-filter { padding:7px 18px; border-radius:8px; border:1px solid #27272a; background:transparent; color:#71717a; font-size:13px; font-weight:500; cursor:pointer; text-transform:capitalize; transition:all .15s }
	.av-filter.active { border-color:#d9f99d; background:rgba(217,249,157,0.08); color:#d9f99d }
	.av-row { border-bottom:1px solid #1e1e22; transition:background .1s }
	.av-row:hover { background:rgba(255,255,255,0.02) }
	.av-approve { padding:6px 14px; border-radius:8px; border:none; background:#4ade80; color:#000; font-size:12px; font-weight:600; cursor:pointer; transition:opacity .15s }
	.av-approve:hover { opacity:0.85 }
	.av-approve:disabled { opacity:0.5 }
	.av-reject { padding:6px 14px; border-radius:8px; border:1px solid #27272a; background:transparent; color:#f87171; font-size:12px; font-weight:600; cursor:pointer; transition:opacity .15s }
	.av-reject:hover { opacity:0.85 }
	.av-reject:disabled { opacity:0.5 }
`;

export default function AdminVerificationsPage() {
	const allVerifications = useQuery(api.verifications.listAll) ?? [];
	const verifyMutation = useMutation(api.verifications.verify);
	const rejectMutation = useMutation(api.verifications.reject);
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [filter, setFilter] = useState<"all" | "pending" | "verified">("all");

	const filtered =
		filter === "all"
			? allVerifications
			: allVerifications.filter((v) => v.status === filter);

	const pendingCount = allVerifications.filter(
		(v) => v.status === "pending",
	).length;
	const verifiedCount = allVerifications.filter(
		(v) => v.status === "verified",
	).length;

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
			<style>{styles}</style>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 24,
				}}
			>
				<div>
					<h1
						style={{
							fontSize: 22,
							fontWeight: 700,
							color: "#fafafa",
							margin: "0 0 4px",
						}}
					>
						Instagram Verifications
					</h1>
					<p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
						Review and approve creator verification requests
					</p>
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<span
						style={{
							fontSize: 12,
							padding: "5px 12px",
							borderRadius: 8,
							background: "rgba(251,191,36,0.1)",
							color: "#fbbf24",
							fontWeight: 600,
							border: "1px solid rgba(251,191,36,0.2)",
						}}
					>
						{pendingCount} pending
					</span>
					<span
						style={{
							fontSize: 12,
							padding: "5px 12px",
							borderRadius: 8,
							background: "rgba(74,222,128,0.1)",
							color: "#4ade80",
							fontWeight: 600,
							border: "1px solid rgba(74,222,128,0.2)",
						}}
					>
						{verifiedCount} verified
					</span>
				</div>
			</div>

			<div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
				{(["all", "pending", "verified"] as const).map((f) => (
					<button
						key={f}
						type="button"
						onClick={() => setFilter(f)}
						className={`av-filter${filter === f ? " active" : ""}`}
					>
						{f}
					</button>
				))}
			</div>

			{filtered.length === 0 ? (
				<div
					style={{
						background: "#111113",
						border: "1px solid #1e1e22",
						borderRadius: 14,
						padding: 60,
						textAlign: "center",
					}}
				>
					<div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>
						{filter === "pending" ? "..." : filter === "verified" ? "ok" : "--"}
					</div>
					<p style={{ color: "#71717a", fontSize: 14, margin: 0 }}>
						No {filter !== "all" ? filter : ""} verifications found
					</p>
				</div>
			) : (
				<div
					style={{
						background: "#111113",
						border: "1px solid #1e1e22",
						borderRadius: 14,
						overflow: "hidden",
					}}
				>
					<table
						style={{
							width: "100%",
							borderCollapse: "collapse",
							fontSize: 14,
							color: "#d4d4d8",
						}}
					>
						<thead>
							<tr style={{ borderBottom: "1px solid #1e1e22" }}>
								{[
									"Platform",
									"Handle",
									"Code",
									"User ID",
									"Date",
									"Status",
									"Actions",
								].map((h) => (
									<th
										key={h}
										style={{
											padding: "12px 16px",
											textAlign: "left",
											fontSize: 12,
											fontWeight: 600,
											color: "#71717a",
											textTransform: "uppercase",
											letterSpacing: 0.5,
										}}
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{filtered.map((v) => (
								<tr key={v._id} className="av-row">
									<td
										style={{
											padding: "14px 16px",
											fontWeight: 500,
											textTransform: "capitalize",
										}}
									>
										{v.platform}
									</td>
									<td style={{ padding: "14px 16px", color: "#d9f99d" }}>
										@{v.handle}
									</td>
									<td style={{ padding: "14px 16px" }}>
										<code
											style={{
												background: "#09090b",
												padding: "3px 10px",
												borderRadius: 6,
												fontSize: 13,
												fontFamily: "monospace",
												letterSpacing: 3,
												border: "1px solid #27272a",
											}}
										>
											{v.code}
										</code>
									</td>
									<td style={{ padding: "14px 16px" }}>
										<span
											style={{
												fontSize: 12,
												color: "#52525b",
												maxWidth: 140,
												overflow: "hidden",
												textOverflow: "ellipsis",
												display: "inline-block",
												whiteSpace: "nowrap",
											}}
										>
											{v.userId}
										</span>
									</td>
									<td
										style={{
											padding: "14px 16px",
											fontSize: 13,
											color: "#71717a",
										}}
									>
										{new Date(v.createdAt).toLocaleDateString()}
									</td>
									<td style={{ padding: "14px 16px" }}>
										{v.status === "pending" ? (
											<span
												style={{
													fontSize: 12,
													fontWeight: 600,
													padding: "4px 10px",
													borderRadius: 6,
													background: "rgba(251,191,36,0.1)",
													color: "#fbbf24",
													border: "1px solid rgba(251,191,36,0.2)",
												}}
											>
												Pending
											</span>
										) : (
											<span
												style={{
													fontSize: 12,
													fontWeight: 600,
													padding: "4px 10px",
													borderRadius: 6,
													background: "rgba(74,222,128,0.1)",
													color: "#4ade80",
													border: "1px solid rgba(74,222,128,0.2)",
												}}
											>
												Verified
											</span>
										)}
									</td>
									<td style={{ padding: "14px 16px" }}>
										{v.status === "pending" ? (
											<div style={{ display: "flex", gap: 6 }}>
												<button
													type="button"
													className="av-approve"
													onClick={() => handleVerify(v.code)}
													disabled={actionLoading === v.code}
												>
													Approve
												</button>
												<button
													type="button"
													className="av-reject"
													onClick={() => handleReject(v.code)}
													disabled={actionLoading === v.code}
												>
													Reject
												</button>
											</div>
										) : (
											<span style={{ fontSize: 12, color: "#3f3f46" }}>--</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
