"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { CAMPAIGNS } from "@/data/campaigns";

// ── Types ────────────────────────────────────────────────────────────

const TABS = ["Overview", "Requirements", "Submissions"] as const;
type Tab = (typeof TABS)[number];

// ── Page ─────────────────────────────────────────────────────────────

export default function CampaignDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const campaign = CAMPAIGNS.find((c) => c.id === id);
	const [activeTab, setActiveTab] = useState<Tab>("Overview");

	if (!campaign) {
		notFound();
	}

	const progress = Math.round((campaign.spent / campaign.budget) * 100);

	return (
		<main className="min-h-screen">
			{/* Hero */}
			<div className="relative h-72 overflow-hidden sm:h-80 md:h-96">
				<Image
					src={campaign.image}
					alt={campaign.title}
					fill
					className="object-cover"
					sizes="100vw"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/30" />

				{/* Back + Breadcrumb */}
				<div className="absolute left-0 right-0 top-0 z-10">
					<div className="mx-auto flex max-w-5xl items-center gap-3 px-6 pt-6">
						<Link
							href="/marketplace"
							className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Back</title>
								<path d="M19 12H5M5 12l7 7M5 12l7-7" />
							</svg>
						</Link>
						<div className="flex items-center gap-2 text-sm text-white/60">
							<Link
								href="/marketplace"
								className="transition-colors hover:text-white/90"
							>
								Marketplace
							</Link>
							<span>/</span>
							<span className="text-white/90">{campaign.brand}</span>
						</div>
					</div>
				</div>

				{/* Brand + Status overlay at bottom of hero */}
				<div className="absolute bottom-0 left-0 right-0">
					<div className="mx-auto max-w-5xl px-6 pb-8">
						<div className="flex items-end justify-between">
							<div className="flex items-center gap-4">
								<div
									className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 text-lg font-bold text-white shadow-lg"
									style={{ backgroundColor: campaign.brandColor }}
								>
									{campaign.brand[0]}
								</div>
								<div>
									<div className="flex items-center gap-2.5">
										<h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
											{campaign.title}
										</h1>
									</div>
									<div className="mt-1.5 flex items-center gap-3">
										<span className="text-sm font-medium text-white/70">
											{campaign.brand}
										</span>
										<span className="flex items-center gap-1.5">
											<span className="h-1.5 w-1.5 rounded-full bg-success" />
											<span className="text-xs font-medium text-success">
												{campaign.status}
											</span>
										</span>
									</div>
								</div>
							</div>
							<div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-sm sm:flex">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									className="text-white/60"
								>
									<title>Views</title>
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
									<circle cx="12" cy="12" r="3" />
								</svg>
								<span className="text-sm font-semibold text-white">
									{campaign.cpm}
								</span>
								<span className="text-xs text-white/50">/ 1k views</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="mx-auto max-w-5xl px-6 pb-16">
				{/* Meta chips */}
				<div className="mt-6 flex flex-wrap gap-2">
					{[
						campaign.type.toUpperCase(),
						campaign.contentType,
						...campaign.platforms,
					].map((tag) => (
						<span
							key={tag}
							className="rounded-lg border border-border-secondary bg-bg-secondary px-3 py-1.5 text-xs font-medium text-text-secondary"
						>
							{tag}
						</span>
					))}
				</div>

				<div className="mt-8 flex flex-col gap-8 lg:flex-row">
					{/* Left — main content */}
					<div className="flex-1">
						{/* Stats row */}
						<div className="grid grid-cols-3 gap-4">
							<div className="rounded-2xl border border-border bg-bg-card p-5">
								<div className="flex items-center gap-2 text-text-tertiary">
									<svg
										width="15"
										height="15"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Budget</title>
										<path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
									</svg>
									<span className="text-xs font-medium">Budget</span>
								</div>
								<p className="mt-2 text-xl font-bold text-text">
									${campaign.budget.toLocaleString()}
								</p>
							</div>
							<div className="rounded-2xl border border-border bg-bg-card p-5">
								<div className="flex items-center gap-2 text-text-tertiary">
									<svg
										width="15"
										height="15"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<title>CPM</title>
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
										<circle cx="12" cy="12" r="3" />
									</svg>
									<span className="text-xs font-medium">Per 1k Views</span>
								</div>
								<p className="mt-2 text-xl font-bold text-text">
									{campaign.cpm}
								</p>
							</div>
							<div className="rounded-2xl border border-border bg-bg-card p-5">
								<div className="flex items-center gap-2 text-text-tertiary">
									<svg
										width="15"
										height="15"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Deadline</title>
										<path d="M12 6v6l4 2" />
										<circle cx="12" cy="12" r="10" />
									</svg>
									<span className="text-xs font-medium">Deadline</span>
								</div>
								<p className="mt-2 text-xl font-bold text-text">
									{campaign.deadline.split(",")[0]}
								</p>
							</div>
						</div>

						{/* Budget progress */}
						<div className="mt-6 rounded-2xl border border-border bg-bg-card p-6">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-text-secondary">
									Budget Utilization
								</span>
								<span className="text-sm font-bold text-accent">
									{progress}%
								</span>
							</div>
							<div className="mt-3 h-2 overflow-hidden rounded-full bg-border-secondary">
								<div
									className="h-full rounded-full bg-gradient-to-r from-accent to-accent-dark transition-all"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<div className="mt-2.5 flex justify-between text-xs">
								<span className="text-accent">
									${campaign.spent.toLocaleString()} spent
								</span>
								<span className="text-text-tertiary">
									${(campaign.budget - campaign.spent).toLocaleString()}{" "}
									remaining
								</span>
							</div>
						</div>

						{/* Tabs */}
						<div className="mt-8 border-b border-border-secondary">
							<div className="flex gap-0">
								{TABS.map((tab) => {
									const isActive = activeTab === tab;
									return (
										<button
											key={tab}
											type="button"
											onClick={() => setActiveTab(tab)}
											className={`relative px-5 py-3 text-sm font-medium transition-colors ${
												isActive
													? "text-text"
													: "text-text-tertiary hover:text-text-secondary"
											}`}
										>
											{tab}
											{isActive && (
												<span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent" />
											)}
										</button>
									);
								})}
							</div>
						</div>

						{/* Tab content */}
						<div className="mt-6">
							{activeTab === "Overview" && (
								<div className="space-y-6">
									<div>
										<h3 className="text-sm font-semibold text-text">
											About this campaign
										</h3>
										<p className="mt-3 text-sm leading-relaxed text-text-secondary">
											{campaign.description}
										</p>
									</div>

									{/* Brand card */}
									<div className="flex items-center gap-4 rounded-2xl border border-border bg-bg-card p-5">
										<div
											className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold text-white"
											style={{ backgroundColor: campaign.brandColor }}
										>
											{campaign.brand[0]}
										</div>
										<div className="flex-1">
											<p className="text-sm font-semibold text-text">
												{campaign.brand}
											</p>
											<p className="text-xs text-text-tertiary">
												Verified Brand
											</p>
										</div>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#22C55E"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<title>Verified</title>
											<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
											<path d="M22 4L12 14.01l-3-3" />
										</svg>
									</div>
								</div>
							)}

							{activeTab === "Requirements" && (
								<div>
									<h3 className="text-sm font-semibold text-text">
										Content Guidelines
									</h3>
									<div className="mt-4 space-y-3.5">
										{campaign.requirements.map((req, i) => (
											<div key={req} className="flex items-start gap-3.5">
												<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-semibold text-accent">
													{i + 1}
												</span>
												<p className="pt-0.5 text-sm leading-relaxed text-text-secondary">
													{req}
												</p>
											</div>
										))}
									</div>
								</div>
							)}

							{activeTab === "Submissions" && (
								<div className="flex flex-col items-center py-16">
									<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-secondary">
										<svg
											width="28"
											height="28"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="text-text-tertiary"
										>
											<title>No submissions</title>
											<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
											<polyline points="17 8 12 3 7 8" />
											<line x1="12" y1="3" x2="12" y2="15" />
										</svg>
									</div>
									<p className="mt-4 text-base font-semibold text-text-tertiary">
										No submissions yet
									</p>
									<p className="mt-1 text-sm text-text-tertiary">
										Submit your first clip to this campaign
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Right sidebar */}
					<aside className="w-full shrink-0 lg:w-80">
						{/* Submit CTA card */}
						<div className="overflow-hidden rounded-2xl border border-border bg-bg-card">
							<div className="bg-gradient-to-br from-accent/10 via-transparent to-accent-dark/5 p-6">
								<h3 className="text-base font-bold text-text">
									Ready to create?
								</h3>
								<p className="mt-1.5 text-sm text-text-secondary">
									Submit your content and start earning from this campaign.
								</p>
								<button
									type="button"
									className="mt-5 w-full rounded-xl bg-gradient-to-r from-accent to-accent-dark py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
								>
									Submit a Clip
								</button>
							</div>
							<div className="border-t border-border-secondary px-6 py-4">
								<div className="flex items-center justify-between text-xs">
									<span className="text-text-tertiary">Avg. payout</span>
									<span className="font-semibold text-text">
										{campaign.cpm}
									</span>
								</div>
								<div className="mt-2 flex items-center justify-between text-xs">
									<span className="text-text-tertiary">Content type</span>
									<span className="font-semibold text-text">
										{campaign.contentType}
									</span>
								</div>
								<div className="mt-2 flex items-center justify-between text-xs">
									<span className="text-text-tertiary">Deadline</span>
									<span className="font-semibold text-text">
										{campaign.deadline}
									</span>
								</div>
							</div>
						</div>

						{/* Platform distribution */}
						<div className="mt-5 rounded-2xl border border-border bg-bg-card p-5">
							<h4 className="text-sm font-semibold text-text">Platforms</h4>
							<div className="mt-4 space-y-3">
								{campaign.platforms.map((platform) => (
									<div
										key={platform}
										className="flex items-center gap-3 rounded-xl border border-border-secondary bg-bg-secondary p-3.5"
									>
										<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-card">
											{platform === "YouTube" ? (
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="#FF0000"
												>
													<title>YouTube</title>
													<path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.66 31.66 0 000 12a31.66 31.66 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.66 31.66 0 0024 12a31.66 31.66 0 00-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
												</svg>
											) : (
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
												>
													<title>Instagram</title>
													<defs>
														<linearGradient
															id="ig"
															x1="0%"
															y1="100%"
															x2="100%"
															y2="0%"
														>
															<stop offset="0%" stopColor="#FD5" />
															<stop offset="50%" stopColor="#FF543E" />
															<stop offset="100%" stopColor="#C837AB" />
														</linearGradient>
													</defs>
													<rect
														x="2"
														y="2"
														width="20"
														height="20"
														rx="5"
														stroke="url(#ig)"
														strokeWidth="2"
													/>
													<circle
														cx="12"
														cy="12"
														r="5"
														stroke="url(#ig)"
														strokeWidth="2"
													/>
													<circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig)" />
												</svg>
											)}
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-text">
												{platform}
											</p>
											<p className="text-xs text-text-tertiary">
												{platform === "YouTube"
													? "Shorts or standard"
													: "Reels, Stories, or Posts"}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Similar campaigns */}
						<div className="mt-5 rounded-2xl border border-border bg-bg-card p-5">
							<h4 className="text-sm font-semibold text-text">
								Similar Campaigns
							</h4>
							<div className="mt-4 space-y-3">
								{CAMPAIGNS.filter(
									(c) => c.id !== campaign.id && c.type === campaign.type,
								)
									.slice(0, 3)
									.map((c) => (
										<Link
											key={c.id}
											href={`/campaign/${c.id}`}
											className="group flex items-center gap-3 rounded-xl border border-border-secondary bg-bg-secondary p-3 transition-colors hover:border-accent/20"
										>
											<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
												<Image
													src={c.image}
													alt={c.title}
													fill
													className="object-cover"
													sizes="40px"
												/>
											</div>
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-medium text-text group-hover:text-accent transition-colors">
													{c.title}
												</p>
												<p className="text-xs text-text-tertiary">
													{c.brand} · {c.cpm}
												</p>
											</div>
										</Link>
									))}
							</div>
						</div>
					</aside>
				</div>
			</div>
		</main>
	);
}
