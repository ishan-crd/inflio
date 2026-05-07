"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	ArrowIcon,
	BellIcon,
	CheckIcon,
	ChevIcon,
	GridIcon,
	PinIcon,
	PlatformIcon,
	RowsIcon,
	SearchIcon,
	SlidersIcon,
	SortIcon,
	TrendIcon,
	VerifiedIcon,
} from "@/components/icons";
import { Nav as SharedNav } from "@/components/nav";
import {
	C_CATEGORIES,
	C_ENGAGEMENT,
	C_PLATFORMS,
	C_SORTS,
	CREATORS,
	type Creator,
	fmtFollowers,
	fmtViews,
	initials,
} from "@/data/creators";

/* ─────────────────────────────────────────────
   CNav
───────────────────────────────────────────── */
// Nav is now shared via @/components/nav

/* ─────────────────────────────────────────────
   CHero
───────────────────────────────────────────── */
function CHero({
	search,
	onSearch,
}: {
	search: string;
	onSearch: (v: string) => void;
}) {
	return (
		<section className="creators-hero">
			<div className="shell">
				{/* Eyebrow */}
				<div className="eyebrow">
					<span className="eyebrow-dot">
						<span className="eyebrow-pulse" />
					</span>
					12,400 verified creators · 47 niches · 9 cities
				</div>

				{/* Headline */}
				<h1>
					Find the creator your brand{" "}
					<span className="accent">actually fits.</span>
				</h1>

				{/* Subtitle */}
				<p>
					Every creator is verified, rated, and ready to collaborate. Filter by
					niche, tier, engagement, and platform — then reach out in one click.
				</p>

				{/* Search bar */}
				<div className="searchbar">
					<SearchIcon />
					<input
						type="text"
						placeholder="Search by name, niche, or handle…"
						value={search}
						onChange={(e) => onSearch(e.target.value)}
					/>
					<span className="kbd">⌘K</span>
				</div>

				{/* Tier stats */}
				<div className="tier-stats">
					{[
						{ num: "12,400+", label: "verified creators" },
						{ num: "8.4%", label: "avg engagement" },
						{ num: "2,100+", label: "available now" },
						{ num: "₹620", label: "/1k top rate" },
					].map((s) => (
						<div key={s.label}>
							<div className="stat-num">{s.num}</div>
							<div className="stat-label">{s.label}</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────────
   CDropdown — generic dropdown with click-outside
───────────────────────────────────────────── */
function CDropdown({
	label,
	labelKey,
	children,
}: {
	label: string;
	labelKey?: string;
	children: (close: () => void) => React.ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function onDown(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", onDown);
		return () => document.removeEventListener("mousedown", onDown);
	}, []);

	const close = useCallback(() => setOpen(false), []);

	return (
		<div className="dropdown" ref={ref}>
			<button className="dropdown-trigger" onClick={() => setOpen((o) => !o)}>
				{labelKey && <span className="label-key">{labelKey}:</span>}
				{label}
				<ChevIcon
					style={{
						transform: open ? "rotate(180deg)" : "rotate(0deg)",
						transition: "transform 0.2s ease",
					}}
				/>
			</button>
			{open && <div className="dropdown-menu">{children(close)}</div>}
		</div>
	);
}

/* ─────────────────────────────────────────────
   FollowerRange — dual-thumb slider 0 – 2.2 M
───────────────────────────────────────────── */
const F_MAX = 2_200_000;

function fmtRange(n: number) {
	if (n >= 1_000_000)
		return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
	if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
	return String(n);
}

function FollowerRange({
	value,
	onChange,
}: {
	value: [number, number];
	onChange: (v: [number, number]) => void;
}) {
	const trackRef = useRef<HTMLDivElement>(null);

	function pct(v: number) {
		return (v / F_MAX) * 100;
	}

	function fromPct(p: number): number {
		return Math.round((p / 100) * F_MAX);
	}

	function startDrag(thumb: "lo" | "hi") {
		function onMove(e: MouseEvent) {
			if (!trackRef.current) return;
			const rect = trackRef.current.getBoundingClientRect();
			const raw = ((e.clientX - rect.left) / rect.width) * 100;
			const clamped = Math.max(0, Math.min(100, raw));
			const v = fromPct(clamped);
			if (thumb === "lo") {
				onChange([Math.min(v, value[1] - 10_000), value[1]]);
			} else {
				onChange([value[0], Math.max(v, value[0] + 10_000)]);
			}
		}
		function onUp() {
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseup", onUp);
		}
		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseup", onUp);
	}

	const loP = pct(value[0]);
	const hiP = pct(value[1]);

	return (
		<div className="range-popover">
			<h4>Followers</h4>
			<p>Drag to set your range</p>
			<div className="range-vals">
				<span>from</span>
				<span>
					{fmtRange(value[0])} – {fmtRange(value[1])}
				</span>
			</div>
			<div className="range-track" ref={trackRef}>
				<div
					className="range-fill"
					style={{ left: `${loP}%`, width: `${hiP - loP}%` }}
				/>
				<div
					className="range-thumb"
					style={{ left: `${loP}%` }}
					onMouseDown={() => startDrag("lo")}
				/>
				<div
					className="range-thumb"
					style={{ left: `${hiP}%` }}
					onMouseDown={() => startDrag("hi")}
				/>
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────
   CFilterBar
───────────────────────────────────────────── */
function CFilterBar({
	platform,
	setPlatform,
	category,
	setCategory,
	followers,
	setFollowers,
	engagement,
	setEngagement,
	sort,
	setSort,
	view,
	setView,
	total,
	filtered,
}: {
	platform: string;
	setPlatform: (v: string) => void;
	category: string;
	setCategory: (v: string) => void;
	followers: [number, number];
	setFollowers: (v: [number, number]) => void;
	engagement: string;
	setEngagement: (v: string) => void;
	sort: string;
	setSort: (v: string) => void;
	view: "grid" | "list";
	setView: (v: "grid" | "list") => void;
	total: number;
	filtered: number;
}) {
	return (
		<div className="filter-bar">
			<div className="shell">
				{/* Row 1: platform chips + right controls */}
				<div className="filter-row">
					{/* Platform chips */}
					<div className="chip-group">
						{C_PLATFORMS.map((p) => (
							<button
								key={p}
								className={`chip${platform === p ? " active" : ""}`}
								onClick={() => setPlatform(p)}
							>
								{p !== "All" && (
									<span
										style={{ display: "inline-grid", placeItems: "center" }}
									>
										<PlatformIcon name={p} />
									</span>
								)}
								{p}
							</button>
						))}
					</div>

					{/* Right controls */}
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						{/* Niche */}
						<CDropdown
							labelKey="Niche"
							label={category === "All" ? "Any" : category}
						>
							{(close) => (
								<>
									{C_CATEGORIES.map((c) => (
										<button
											key={c}
											className={`dropdown-item${category === c ? " active" : ""}`}
											onClick={() => {
												setCategory(c);
												close();
											}}
										>
											{c}
											<CheckIcon className="check" />
										</button>
									))}
								</>
							)}
						</CDropdown>

						{/* Followers range */}
						<CDropdown
							labelKey="Followers"
							label={
								followers[0] === 0 && followers[1] === F_MAX
									? "Any"
									: `${fmtRange(followers[0])} – ${fmtRange(followers[1])}`
							}
						>
							{() => (
								<FollowerRange value={followers} onChange={setFollowers} />
							)}
						</CDropdown>

						{/* Engagement */}
						<CDropdown
							labelKey="Eng."
							label={engagement === "All" ? "Any" : engagement}
						>
							{(close) => (
								<>
									{C_ENGAGEMENT.map((e) => (
										<button
											key={e}
											className={`dropdown-item${engagement === e ? " active" : ""}`}
											onClick={() => {
												setEngagement(e);
												close();
											}}
										>
											{e === "All" ? "Any" : e}
											<CheckIcon className="check" />
										</button>
									))}
								</>
							)}
						</CDropdown>

						{/* Sort */}
						<CDropdown label={sort}>
							{(close) => (
								<>
									{C_SORTS.map((s) => (
										<button
											key={s}
											className={`dropdown-item${sort === s ? " active" : ""}`}
											onClick={() => {
												setSort(s);
												close();
											}}
										>
											<span
												style={{
													display: "flex",
													alignItems: "center",
													gap: 6,
												}}
											>
												<SortIcon />
												{s}
											</span>
											<CheckIcon className="check" />
										</button>
									))}
								</>
							)}
						</CDropdown>

						{/* Sliders icon (visual, no-op) */}
						<button
							className="dropdown-trigger"
							style={{ gap: 6 }}
							onClick={() => {}}
							aria-label="More filters"
						>
							<SlidersIcon />
							Filters
						</button>

						{/* Grid / List toggle */}
						<div className="view-toggle">
							<button
								className={view === "grid" ? "active" : ""}
								onClick={() => setView("grid")}
								aria-label="Grid view"
							>
								<GridIcon />
							</button>
							<button
								className={view === "list" ? "active" : ""}
								onClick={() => setView("list")}
								aria-label="List view"
							>
								<RowsIcon />
							</button>
						</div>
					</div>
				</div>

				{/* Results meta */}
				<div
					className="results-meta"
					style={{ marginTop: 14, marginBottom: 0 }}
				>
					<p className="count">
						Showing <strong>{filtered}</strong> of {total} creators
					</p>
				</div>
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────
   Spark — SVG sparkline
───────────────────────────────────────────── */
function Spark({ data }: { data: number[] }) {
	const W = 56;
	const H = 18;
	const min = Math.min(...data);
	const max = Math.max(...data);
	const range = max - min || 1;
	const step = W / (data.length - 1);

	const points = data
		.map((v, i) => `${i * step},${H - ((v - min) / range) * H}`)
		.join(" ");

	return (
		<svg
			className="cc-spark"
			viewBox={`0 0 ${W} ${H}`}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<polyline
				className="cc-spark"
				points={points}
				fill="none"
				stroke="var(--color-accent-strong)"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

/* ─────────────────────────────────────────────
   CreatorCard
───────────────────────────────────────────── */
function CreatorCard({ c }: { c: Creator }) {
	const [from, to] = c.avatarColor;
	const glow = `radial-gradient(ellipse at top left, ${from}22, transparent 60%)`;

	return (
		<div
			className="creator-card"
			style={{ "--cc-glow": glow } as React.CSSProperties}
		>
			{/* Trending flag */}
			{c.trending && (
				<div className="trending-flag">
					<TrendIcon />
					Trending
				</div>
			)}

			{/* Top: avatar + name block */}
			<div className="cc-top">
				{/* Avatar */}
				<div
					className="cc-avatar"
					style={{
						background: `linear-gradient(135deg, ${from}, ${to})`,
						color: to,
					}}
				>
					{/* contrasting text color heuristic */}
					<span
						style={{
							color: "rgba(255,255,255,0.9)",
							mixBlendMode: "overlay",
							position: "absolute",
						}}
						aria-hidden
					/>
					{initials(c.name)}

					{/* Platform badge */}
					<div className="cc-platform-badge">
						<PlatformIcon name={c.primaryPlatform} />
					</div>
				</div>

				{/* Name block */}
				<div className="cc-name-block">
					<div className="cc-name">
						{c.name}
						{c.verified && (
							<span className="verified">
								<VerifiedIcon />
							</span>
						)}
					</div>
					<div className="cc-handle">{c.handle}</div>
					<div className="cc-loc">
						<PinIcon />
						{c.location}
						<span
							className={`cc-tier-pill${c.trending ? " trending" : ""}`}
							style={{ marginLeft: 6 }}
						>
							{c.tier}
						</span>
					</div>
				</div>
			</div>

			{/* Bio */}
			<p className="cc-bio">{c.bio}</p>

			{/* Stats grid */}
			<div className="cc-stats">
				<div className="cc-stat">
					<div className="cc-stat-label">Followers</div>
					<div className="cc-stat-value">
						{fmtFollowers(c.followers)}
						<span className="delta">+{(c.engagement * 0.3).toFixed(1)}%</span>
					</div>
				</div>
				<div className="cc-stat">
					<div className="cc-stat-label">Monthly views</div>
					<div className="cc-stat-value">
						{fmtViews(c.monthlyViews)}
						<span className="delta">+{(c.engagement * 0.2).toFixed(1)}%</span>
					</div>
				</div>
			</div>

			{/* Engagement bar */}
			<div className="cc-engagement-row">
				<span className="cc-engagement-label">Eng.</span>
				<div className="cc-engagement-bar">
					<div
						className="cc-engagement-fill"
						style={{ width: `${Math.min((c.engagement / 15) * 100, 100)}%` }}
					/>
				</div>
				<span className="cc-engagement-num">{c.engagement.toFixed(1)}%</span>
			</div>

			{/* Tags */}
			<div className="cc-tags">
				{c.tags.map((t) => (
					<span key={t} className="cc-tag">
						{t}
					</span>
				))}
			</div>

			{/* Footer */}
			<div className="cc-foot">
				<div className="cc-platforms-cluster">
					{Object.entries(c.platforms).map(([name, count]) => (
						<span
							key={name}
							style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
						>
							<span className="pi">
								<PlatformIcon name={name} />
							</span>
							{count}
						</span>
					))}
					<span>· {c.completedDeals} deals</span>
				</div>

				{/* CTA arrow */}
				<div className="cc-cta">
					<ArrowIcon />
				</div>
			</div>

			{/* Sparkline (absolute, top-right area near bio) */}
			<Spark data={c.spark} />
		</div>
	);
}

/* ─────────────────────────────────────────────
   CreatorList — table view
───────────────────────────────────────────── */
function CreatorList({ creators }: { creators: Creator[] }) {
	return (
		<div className="creator-list">
			{/* Header */}
			<div className="cl-header">
				<span>Creator</span>
				<span>Platform</span>
				<span>Followers</span>
				<span>Views / mo</span>
				<span>Engagement</span>
				<span />
			</div>

			{/* Rows */}
			{creators.map((c) => {
				const [from, to] = c.avatarColor;
				return (
					<Link
						href={`/creator/${c.id}`}
						key={c.id}
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<div className="cl-row">
							{/* Creator cell */}
							<div className="cl-creator-cell">
								<div
									className="cl-avatar-sm"
									style={{
										background: `linear-gradient(135deg, ${from}, ${to})`,
									}}
								>
									{initials(c.name)}
								</div>
								<div>
									<div className="cl-name-sm">
										{c.name}
										{c.verified && (
											<span className="verified">
												<VerifiedIcon />
											</span>
										)}
									</div>
									<div className="cl-handle-sm">{c.handle}</div>
								</div>
							</div>

							{/* Platform */}
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 6,
									color: "var(--color-ink-1)",
									fontSize: 13,
								}}
							>
								<PlatformIcon name={c.primaryPlatform} />
								{c.primaryPlatform}
							</div>

							{/* Followers */}
							<div className="cl-num">
								{fmtFollowers(c.followers)}
								<span className="unit">followers</span>
							</div>

							{/* Monthly views */}
							<div className="cl-num">
								{fmtViews(c.monthlyViews)}
								<span className="unit">/mo</span>
							</div>

							{/* Engagement */}
							<div className="cl-engagement-cell">
								<div className="bar">
									<div
										className="fill"
										style={{
											width: `${Math.min((c.engagement / 15) * 100, 100)}%`,
										}}
									/>
								</div>
								<span
									style={{
										fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
										fontSize: 13,
										color: "var(--color-ink-0)",
									}}
								>
									{c.engagement.toFixed(1)}%
								</span>
							</div>

							{/* Arrow */}
							<ArrowIcon className="cl-arrow" />
						</div>
					</Link>
				);
			})}
		</div>
	);
}

/* ─────────────────────────────────────────────
   CreatorsApp — main page component
───────────────────────────────────────────── */
export default function CreatorsPage() {
	const [search, setSearch] = useState("");
	const [platform, setPlatform] = useState("All");
	const [category, setCategory] = useState("All");
	const [followers, setFollowers] = useState<[number, number]>([0, F_MAX]);
	const [engagement, setEngagement] = useState("All");
	const [sort, setSort] = useState(C_SORTS[0]);
	const [view, setView] = useState<"grid" | "list">("grid");

	const filtered = useMemo(() => {
		let list = [...CREATORS];

		// Platform filter
		if (platform !== "All") {
			list = list.filter((c) => Object.keys(c.platforms).includes(platform));
		}

		// Category filter
		if (category !== "All") {
			list = list.filter((c) => c.category === category);
		}

		// Followers range
		list = list.filter(
			(c) => c.followers >= followers[0] && c.followers <= followers[1],
		);

		// Engagement filter
		if (engagement !== "All") {
			const threshold = parseFloat(engagement.replace("%+", ""));
			list = list.filter((c) => c.engagement >= threshold);
		}

		// Search
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter(
				(c) =>
					c.name.toLowerCase().includes(q) ||
					c.handle.toLowerCase().includes(q) ||
					c.category.toLowerCase().includes(q) ||
					c.bio.toLowerCase().includes(q) ||
					c.tags.some((t) => t.toLowerCase().includes(q)),
			);
		}

		// Sort
		switch (sort) {
			case "Most followers":
				list.sort((a, b) => b.followers - a.followers);
				break;
			case "Highest engagement":
				list.sort((a, b) => b.engagement - a.engagement);
				break;
			case "Most monthly views":
				list.sort((a, b) => b.monthlyViews - a.monthlyViews);
				break;
			case "Newest":
				list.sort((a, b) => b.id - a.id);
				break;
			case "Trending":
			default:
				list.sort((a, b) => Number(b.trending) - Number(a.trending));
				break;
		}

		return list;
	}, [platform, category, followers, engagement, search, sort]);

	return (
		<div className="app">
			<div className="ambient" />
			<div className="grain" />

			<SharedNav />

			<CHero search={search} onSearch={setSearch} />

			<CFilterBar
				platform={platform}
				setPlatform={setPlatform}
				category={category}
				setCategory={setCategory}
				followers={followers}
				setFollowers={setFollowers}
				engagement={engagement}
				setEngagement={setEngagement}
				sort={sort}
				setSort={setSort}
				view={view}
				setView={setView}
				total={CREATORS.length}
				filtered={filtered.length}
			/>

			{/* Content */}
			<div className="shell" style={{ paddingBottom: 80 }}>
				{filtered.length === 0 ? (
					<div
						style={{
							textAlign: "center",
							padding: "80px 0",
							color: "var(--color-ink-2)",
							fontSize: 15,
						}}
					>
						No creators match your filters.{" "}
						<button
							style={{
								color: "var(--color-accent-strong)",
								background: "none",
								border: "none",
								cursor: "pointer",
								fontSize: 15,
							}}
							onClick={() => {
								setPlatform("All");
								setCategory("All");
								setFollowers([0, F_MAX]);
								setEngagement("All");
								setSearch("");
							}}
						>
							Clear all filters
						</button>
					</div>
				) : view === "grid" ? (
					<div className="creator-grid">
						{filtered.map((c) => (
							<Link
								key={c.id}
								href={`/creator/${c.id}`}
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<CreatorCard key={c.id} c={c} />
							</Link>
						))}
					</div>
				) : (
					<CreatorList creators={filtered} />
				)}
			</div>
		</div>
	);
}
