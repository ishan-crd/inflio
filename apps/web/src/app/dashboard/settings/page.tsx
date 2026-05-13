"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { api } from "../../../../convex/_generated/api";

function initials(s: string) {
	return s
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

export default function DashboardSettings() {
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
	const router = useRouter();

	const isBrand = !!brandProfile;

	return (
		<div>
			<div className="db-page-header">
				<div>
					<h1 className="db-page-title">Settings</h1>
					<p className="db-page-sub">
						{isBrand
							? "Manage your brand profile and account settings"
							: "Manage your creator profile and account settings"}
					</p>
				</div>
			</div>

			{/* Profile section */}
			<div className="db-card">
				<div className="db-card-title" style={{ marginBottom: 20 }}>
					{isBrand ? "Brand profile" : "Creator profile"}
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 20,
						marginBottom: 24,
					}}
				>
					{isBrand ? (
						<div
							style={{
								width: 64,
								height: 64,
								borderRadius: 16,
								background:
									brandProfile?.logoColors?.[0] ||
									"linear-gradient(135deg, var(--color-accent-strong), #65a30d)",
								color: brandProfile?.logoColors?.[1] || "#fff",
								display: "grid",
								placeItems: "center",
								fontSize: 22,
								fontWeight: 700,
							}}
						>
							{initials(brandProfile?.name || "B")}
						</div>
					) : (
						<div
							style={{
								width: 64,
								height: 64,
								borderRadius: 16,
								background: `linear-gradient(135deg, ${creatorProfile?.avatarColor?.[0] || "#bef264"}, ${creatorProfile?.avatarColor?.[1] || "#a3e635"})`,
								color: "#0a0a0c",
								display: "grid",
								placeItems: "center",
								fontSize: 22,
								fontWeight: 700,
							}}
						>
							{initials(creatorProfile?.name || "C")}
						</div>
					)}
					<div>
						<div style={{ fontSize: 18, fontWeight: 600 }}>
							{isBrand ? brandProfile?.name : creatorProfile?.name}
						</div>
						<div
							style={{
								fontSize: 13,
								color: "var(--color-ink-2)",
								marginTop: 2,
							}}
						>
							@{isBrand ? brandProfile?.handle : creatorProfile?.handle}
						</div>
						<div
							style={{
								fontSize: 12,
								color: "var(--color-ink-3)",
								marginTop: 4,
							}}
						>
							{isBrand ? brandProfile?.category : creatorProfile?.category}
						</div>
					</div>
				</div>

				<div className="db-settings-grid">
					{isBrand ? (
						<>
							<div className="db-settings-field">
								<label className="db-settings-label">Brand name</label>
								<input
									type="text"
									className="db-settings-input"
									defaultValue={brandProfile?.name}
									readOnly
								/>
							</div>
							<div className="db-settings-field">
								<label className="db-settings-label">Handle</label>
								<input
									type="text"
									className="db-settings-input"
									defaultValue={`@${brandProfile?.handle}`}
									readOnly
								/>
							</div>
							<div className="db-settings-field">
								<label className="db-settings-label">Category</label>
								<input
									type="text"
									className="db-settings-input"
									defaultValue={brandProfile?.category}
									readOnly
								/>
							</div>
							<div className="db-settings-field">
								<label className="db-settings-label">Website</label>
								<input
									type="text"
									className="db-settings-input"
									defaultValue={brandProfile?.website || "—"}
									readOnly
								/>
							</div>
						</>
					) : (
						<>
							<div className="db-settings-field">
								<label className="db-settings-label">Name</label>
								<input
									type="text"
									className="db-settings-input"
									defaultValue={creatorProfile?.name}
									readOnly
								/>
							</div>
							<div className="db-settings-field">
								<label className="db-settings-label">Handle</label>
								<input
									type="text"
									className="db-settings-input"
									defaultValue={`@${creatorProfile?.handle}`}
									readOnly
								/>
							</div>
							<div className="db-settings-field">
								<label className="db-settings-label">Category</label>
								<input
									type="text"
									className="db-settings-input"
									defaultValue={creatorProfile?.category}
									readOnly
								/>
							</div>
							<div className="db-settings-field">
								<label className="db-settings-label">Location</label>
								<input
									type="text"
									className="db-settings-input"
									defaultValue={creatorProfile?.location || "—"}
									readOnly
								/>
							</div>
							<div className="db-settings-field">
								<label className="db-settings-label">Tier</label>
								<input
									type="text"
									className="db-settings-input"
									defaultValue={creatorProfile?.tier}
									readOnly
								/>
							</div>
							<div className="db-settings-field">
								<label className="db-settings-label">Primary platform</label>
								<input
									type="text"
									className="db-settings-input"
									defaultValue={creatorProfile?.primaryPlatform}
									readOnly
								/>
							</div>
						</>
					)}
				</div>

				<div
					style={{ marginTop: 8, fontSize: 12, color: "var(--color-ink-3)" }}
				>
					Contact support to update your profile details
				</div>
			</div>

			{/* Account section */}
			<div className="db-card" style={{ marginTop: 20 }}>
				<div className="db-card-title" style={{ marginBottom: 20 }}>
					Account
				</div>
				<div className="db-settings-grid">
					<div className="db-settings-field">
						<label className="db-settings-label">Email</label>
						<input
							type="text"
							className="db-settings-input"
							defaultValue={session?.user?.email || ""}
							readOnly
						/>
					</div>
					<div className="db-settings-field">
						<label className="db-settings-label">Name</label>
						<input
							type="text"
							className="db-settings-input"
							defaultValue={session?.user?.name || ""}
							readOnly
						/>
					</div>
				</div>
			</div>

			{/* Danger zone */}
			<div
				className="db-card"
				style={{ marginTop: 20, borderColor: "rgba(251,113,133,0.15)" }}
			>
				<div
					className="db-card-title"
					style={{ marginBottom: 12, color: "#fb7185" }}
				>
					Danger zone
				</div>
				<p
					style={{
						fontSize: 13,
						color: "var(--color-ink-2)",
						marginBottom: 16,
					}}
				>
					Signing out will end your current session.
				</p>
				<button
					onClick={() =>
						signOut({ fetchOptions: { onSuccess: () => router.push("/") } })
					}
					style={{
						padding: "10px 20px",
						borderRadius: 10,
						background: "rgba(251,113,133,0.1)",
						border: "1px solid rgba(251,113,133,0.25)",
						color: "#fb7185",
						fontSize: 13,
						fontWeight: 500,
						cursor: "pointer",
					}}
				>
					Sign out
				</button>
			</div>
		</div>
	);
}
