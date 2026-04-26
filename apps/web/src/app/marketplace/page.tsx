"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	ArrowIcon,
	BellIcon,
	CheckIcon,
	ChevIcon,
	IGIcon,
	PlatformIcon,
	SearchIcon,
	SlidersIcon,
	SortIcon,
	TrendIcon,
	TTIcon,
	VerifiedIcon,
	YTIcon,
} from "@/components/icons";
import {
	ACCENT_MAP,
	BRAND_COLORS,
	CAMPAIGNS,
	CATEGORIES,
	type Campaign,
	PLATFORMS,
	SORTS,
} from "@/data/campaigns";

// ─── helpers ───────────────────────────────────────────────────────────────
const initials = (s: string) =>
	s
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

const CREATOR_DOT_GRADIENTS: [string, string][] = [
	["#f472b6", "#a855f7"],
	["#60a5fa", "#22d3ee"],
	["#fb923c", "#facc15"],
];

// ─── Dropdown ──────────────────────────────────────────────────────────────
interface DropdownProps {
	trigger: (open: boolean) => React.ReactNode;
	children: (close: () => void) => React.ReactNode;
}

function Dropdown({ trigger, children }: DropdownProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		function handler(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [open]);

	const close = useCallback(() => setOpen(false), []);

	return (
		<div className="dropdown" ref={ref}>
			<button className="dropdown-trigger" onClick={() => setOpen((o) => !o)}>
				{trigger(open)}
			</button>
			{open && <div className="dropdown-menu">{children(close)}</div>}
		</div>
	);
}

// ─── PayoutRange ───────────────────────────────────────────────────────────
const RANGE_MIN = 100;
const RANGE_MAX = 600;

interface PayoutRangeProps {
	value: [number, number];
	onChange: (v: [number, number]) => void;
}

function PayoutRange({ value, onChange }: PayoutRangeProps) {
	const trackRef = useRef<HTMLDivElement>(null);
	const dragging = useRef<"lo" | "hi" | null>(null);

	const pct = (v: number) => ((v - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * 100;

	const clamp = (v: number) => Math.max(RANGE_MIN, Math.min(RANGE_MAX, v));

	const posToVal = useCallback((clientX: number) => {
		const rect = trackRef.current?.getBoundingClientRect();
		if (!rect) return RANGE_MIN;
		const ratio = (clientX - rect.left) / rect.width;
		return clamp(Math.round(RANGE_MIN + ratio * (RANGE_MAX - RANGE_MIN)));
	}, []);

	useEffect(() => {
		function onMove(e: MouseEvent) {
			if (!dragging.current) return;
			const v = posToVal(e.clientX);
			if (dragging.current === "lo") {
				onChange([Math.min(v, value[1] - 20), value[1]]);
			} else {
				onChange([value[0], Math.max(v, value[0] + 20)]);
			}
		}
		function onUp() {
			dragging.current = null;
		}
		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseup", onUp);
		return () => {
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseup", onUp);
		};
	}, [value, onChange, posToVal]);

	const loLabel = value[0] === RANGE_MIN ? `₹${value[0]}` : `₹${value[0]}`;
	const hiLabel = value[1] === RANGE_MAX ? `₹${value[1]}+` : `₹${value[1]}`;

	return (
		<div className="range-popover">
			<h4>Payout range</h4>
			<p>Per 1,000 views in ₹</p>
			<div className="range-vals">
				<span>{loLabel}</span>
				<span>{hiLabel}</span>
			</div>
			<div className="range-track" ref={trackRef}>
				<div
					className="range-fill"
					style={{
						left: `${pct(value[0])}%`,
						width: `${pct(value[1]) - pct(value[0])}%`,
					}}
				/>
				<div
					className="range-thumb"
					style={{ left: `${pct(value[0])}%` }}
					onMouseDown={() => (dragging.current = "lo")}
				/>
				<div
					className="range-thumb"
					style={{ left: `${pct(value[1])}%` }}
					onMouseDown={() => (dragging.current = "hi")}
				/>
			</div>
		</div>
	);
}

// ─── FilterBar ─────────────────────────────────────────────────────────────
interface FilterBarProps {
	platform: string;
	setPlatform: (p: string) => void;
	category: string;
	setCategory: (c: string) => void;
	payoutRange: [number, number];
	setPayoutRange: (r: [number, number]) => void;
	sort: string;
	setSort: (s: string) => void;
}

function FilterBar({
	platform,
	setPlatform,
	category,
	setCategory,
	payoutRange,
	setPayoutRange,
	sort,
	setSort,
}: FilterBarProps) {
	const platformIcon = (name: string) => {
		if (name === "All") return null;
		return <PlatformIcon name={name} />;
	};

	const payoutLabel =
		payoutRange[0] === RANGE_MIN && payoutRange[1] === RANGE_MAX
			? "Payout"
			: `₹${payoutRange[0]}–₹${payoutRange[1]}${payoutRange[1] === RANGE_MAX ? "+" : ""}`;

	return (
		<div className="filter-bar">
			<div className="shell">
				<div className="filter-row">
					{/* Platform chips */}
					<div className="chip-group">
						{PLATFORMS.map((p) => (
							<button
								key={p}
								className={`chip${platform === p ? " active" : ""}`}
								onClick={() => setPlatform(p)}
							>
								{platformIcon(p)}
								{p}
							</button>
						))}
					</div>

					{/* Right controls */}
					<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
						{/* Category dropdown */}
						<Dropdown
							trigger={(open) => (
								<>
									<span className="label-key">Category</span>
									{category !== "All" && (
										<span style={{ color: "var(--color-ink-0)" }}>
											{category}
										</span>
									)}
									<ChevIcon
										style={{
											transform: open ? "rotate(180deg)" : "none",
											transition: "transform 0.18s ease",
										}}
									/>
								</>
							)}
						>
							{(close) => (
								<>
									{CATEGORIES.map((c) => (
										<button
											key={c}
											className={`dropdown-item${category === c ? " active" : ""}`}
											onClick={() => {
												setCategory(c);
												close();
											}}
										>
											{c}
											<span className="check">
												{category === c && <CheckIcon />}
											</span>
										</button>
									))}
								</>
							)}
						</Dropdown>

						{/* Payout range dropdown */}
						<Dropdown
							trigger={(open) => (
								<>
									<SlidersIcon />
									<span>{payoutLabel}</span>
									<ChevIcon
										style={{
											transform: open ? "rotate(180deg)" : "none",
											transition: "transform 0.18s ease",
										}}
									/>
								</>
							)}
						>
							{() => (
								<PayoutRange value={payoutRange} onChange={setPayoutRange} />
							)}
						</Dropdown>

						{/* Sort dropdown */}
						<Dropdown
							trigger={(open) => (
								<>
									<SortIcon />
									<span>{sort}</span>
									<ChevIcon
										style={{
											transform: open ? "rotate(180deg)" : "none",
											transition: "transform 0.18s ease",
										}}
									/>
								</>
							)}
						>
							{(close) => (
								<>
									{SORTS.map((s) => (
										<button
											key={s}
											className={`dropdown-item${sort === s ? " active" : ""}`}
											onClick={() => {
												setSort(s);
												close();
											}}
										>
											{s}
											<span className="check">
												{sort === s && <CheckIcon />}
											</span>
										</button>
									))}
								</>
							)}
						</Dropdown>
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── CampaignCard ──────────────────────────────────────────────────────────
function CampaignCard({ c }: { c: Campaign }) {
	const accent = ACCENT_MAP[c.color] ?? ACCENT_MAP["lime"];
	const brandColors = BRAND_COLORS[c.brand] ?? ["#d4d4d4", "#1a1a1a"];
	const spotsUsedPct = ((c.totalSpots - c.spotsLeft) / c.totalSpots) * 100;

	const cardStyle = {
		"--card-glow": `radial-gradient(circle at top left, ${accent.from}, transparent 60%)`,
		"--rate-from": accent.from,
		"--rate-to": accent.to,
		"--rate-glow": accent.chip,
	} as React.CSSProperties;

	const brandMarkStyle = {
		background: brandColors[1],
		color: brandColors[0],
	} as React.CSSProperties;

	return (
		<div className="card" style={cardStyle}>
			{c.trending && (
				<div className="trending-flag">
					<TrendIcon />
					Trending
				</div>
			)}

			{/* Head */}
			<div className="card-head">
				<div className="brand-cluster">
					<div className="brand-mark" style={brandMarkStyle}>
						{initials(c.brand)}
					</div>
					<div>
						<div className="brand-name">
							{c.brand}
							<span className="verified">
								<VerifiedIcon />
							</span>
						</div>
						<div className="brand-handle">{c.brandHandle}</div>
					</div>
				</div>
				<div className="platform-pill">
					<PlatformIcon name={c.platform} />
					{c.platform}
				</div>
			</div>

			{/* Title & brief */}
			<h3 className="card-title">{c.title}</h3>
			<p className="card-brief">{c.brief}</p>

			{/* Tags */}
			<div className="tag-row">
				{c.tags.map((tag) => (
					<span key={tag} className="tag">
						#{tag}
					</span>
				))}
			</div>

			{/* Rate band */}
			<div className="card-rate">
				<div className="rate-label">CPM rate</div>
				<div className="rate-amount">
					<span className="currency">{c.currency}</span>
					{c.rate}
					<span className="per">per {c.perViews} views</span>
				</div>
				<div className="rate-meta">
					<span>
						Min. <span className="mono">{c.minViews}</span> views
					</span>
					<span>
						Budget <span className="mono">₹{c.budget}</span>
					</span>
					<span>
						Ends <span className="mono">{c.deadline}</span>
					</span>
				</div>
			</div>

			{/* Footer */}
			<div className="card-foot">
				<div className="spots-cluster">
					<div className="spots-bar">
						<div className="spots-fill" style={{ width: `${spotsUsedPct}%` }} />
					</div>
					<span>
						<strong style={{ color: "var(--color-ink-0)", fontWeight: 500 }}>
							{c.spotsLeft}
						</strong>{" "}
						spots left
					</span>
				</div>

				<div className="creators-stack">
					<div className="creator-dots">
						{CREATOR_DOT_GRADIENTS.map(([from, to], i) => (
							<div
								key={i}
								className="creator-dot"
								style={
									{
										"--cd-from": from,
										"--cd-to": to,
									} as React.CSSProperties
								}
							/>
						))}
						{c.creatorsJoined > 3 && (
							<div className="creator-dot more">+{c.creatorsJoined - 3}</div>
						)}
					</div>
					<span>{c.creatorsJoined} joined</span>
				</div>
			</div>

			{/* Hover CTA */}
			<div className="card-cta">
				<ArrowIcon />
			</div>
		</div>
	);
}

// ─── Nav ───────────────────────────────────────────────────────────────────
function Nav() {
	return (
		<nav className="nav">
			<div className="shell">
				<div className="nav-inner">
					{/* Logo */}
					<Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
						<div className="logo">
							<div className="logo-dot" />
							inflio
						</div>
					</Link>

					{/* Links */}
					<div className="nav-links">
						<Link href="/marketplace" className="active">
							Marketplace
						</Link>
						<Link href="/campaigns">My campaigns</Link>
						<Link href="/earnings">Earnings</Link>
						<Link href="/insights">Insights</Link>
						<Link href="/help">Help</Link>
					</div>

					{/* Right actions */}
					<div className="nav-cta">
						<button className="btn btn-ghost" aria-label="Notifications">
							<BellIcon />
						</button>
						<Link href="/brands" className="btn btn-primary">
							For brands
						</Link>
						<div className="avatar">RA</div>
					</div>
				</div>
			</div>
		</nav>
	);
}

// ─── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
	return (
		<section className="hero">
			<div className="shell">
				{/* Eyebrow */}
				<div className="eyebrow">
					<div className="eyebrow-dot">
						<div className="eyebrow-pulse" />
					</div>
					237 live campaigns — updated every hour
				</div>

				{/* Headline */}
				<h1>
					Campaigns that{" "}
					<span className="accent">pay you per thousand views.</span>
				</h1>

				{/* Subtitle */}
				<p>
					Browse brand deals, apply in seconds, and earn automatically as your
					content gets views. No negotiations, no invoices.
				</p>

				{/* Search bar */}
				<div className="searchbar">
					<SearchIcon />
					<input
						type="text"
						placeholder="Search campaigns, brands, categories…"
					/>
					<span className="kbd">⌘K</span>
				</div>

				{/* Hero stats */}
				<div className="hero-stats">
					<div>
						<div className="stat-num">
							237 <span className="unit">live</span>
						</div>
						<div className="stat-label">Active campaigns</div>
					</div>
					<div>
						<div className="stat-num">
							₹520 <span className="unit">/1k</span>
						</div>
						<div className="stat-label">Highest CPM today</div>
					</div>
					<div>
						<div className="stat-num">
							48 <span className="unit">hrs</span>
						</div>
						<div className="stat-label">Avg. approval time</div>
					</div>
					<div>
						<div className="stat-num">
							12,400<span className="unit">+</span>
						</div>
						<div className="stat-label">Creators on platform</div>
					</div>
				</div>
			</div>
		</section>
	);
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function MarketplacePage() {
	const [platform, setPlatform] = useState("All");
	const [category, setCategory] = useState("All");
	const [payoutRange, setPayoutRange] = useState<[number, number]>([
		RANGE_MIN,
		RANGE_MAX,
	]);
	const [sort, setSort] = useState(SORTS[0]);

	const filtered = useMemo(() => {
		let list = [...CAMPAIGNS];

		if (platform !== "All") {
			list = list.filter((c) => c.platform === platform);
		}
		if (category !== "All") {
			list = list.filter((c) => c.category === category);
		}
		list = list.filter(
			(c) => c.rate >= payoutRange[0] && c.rate <= payoutRange[1],
		);

		if (sort === "Trending") {
			list.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
		} else if (sort === "Highest paying") {
			list.sort((a, b) => b.rate - a.rate);
		} else if (sort === "Newest") {
			list.sort((a, b) => a.id - b.id);
		} else if (sort === "Ending soon") {
			// sort by deadline string lexicographically (May < Jun)
			list.sort((a, b) => a.deadline.localeCompare(b.deadline));
		}

		return list;
	}, [platform, category, payoutRange, sort]);

	return (
		<div className="app">
			<div className="ambient" />
			<div className="grain" />

			<Nav />
			<Hero />

			<FilterBar
				platform={platform}
				setPlatform={setPlatform}
				category={category}
				setCategory={setCategory}
				payoutRange={payoutRange}
				setPayoutRange={setPayoutRange}
				sort={sort}
				setSort={setSort}
			/>

			{/* Campaign grid */}
			<div className="shell">
				{/* Results meta */}
				<div className="results-meta">
					<p className="count">
						<strong>{filtered.length}</strong>{" "}
						{filtered.length === 1 ? "campaign" : "campaigns"} found
					</p>
				</div>

				<div className="grid">
					{filtered.map((c) => (
						<CampaignCard key={c.id} c={c} />
					))}
				</div>

				{filtered.length === 0 && (
					<div
						style={{
							textAlign: "center",
							padding: "80px 0",
							color: "var(--color-ink-2)",
						}}
					>
						<p style={{ fontSize: "15px" }}>No campaigns match your filters.</p>
						<button
							className="btn btn-glass"
							style={{ marginTop: "16px" }}
							onClick={() => {
								setPlatform("All");
								setCategory("All");
								setPayoutRange([RANGE_MIN, RANGE_MAX]);
								setSort(SORTS[0]);
							}}
						>
							Clear filters
						</button>
					</div>
				)}

				{/* CTA band */}
				<div className="cta-band">
					<div>
						<h3>Ready to monetise your content?</h3>
						<p>
							Join 12,400+ creators already earning with inflio. Apply to
							campaigns in seconds and get paid automatically per thousand
							views.
						</p>
					</div>
					<div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
						<Link href="/signup" className="btn btn-primary">
							Start earning <ArrowIcon />
						</Link>
						<Link href="/how-it-works" className="btn btn-glass">
							How it works
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
