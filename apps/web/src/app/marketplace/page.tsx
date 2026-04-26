"use client";

import Image from "next/image";
import { useState } from "react";

// ── Data ─────────────────────────────────────────────────────────────

const FILTERS = ["All", "Reels", "Logo", "Story", "Photo"] as const;
type Filter = (typeof FILTERS)[number];

const CAMPAIGNS = [
	{
		id: "1",
		title: "Philips Razor Promotion",
		brand: "Philips",
		brandColor: "#0B3D91",
		image: "https://picsum.photos/seed/philips/600/340",
		type: "Reels",
		cpm: "$2.50",
		budget: 850,
		spent: 230,
		deadline: "Oct 24, 2023",
		platforms: ["YouTube", "Instagram"],
		description:
			"Create an engaging short-form video showcasing the Philips OneBlade razor.",
	},
	{
		id: "2",
		title: "Nike Summer Collection",
		brand: "Nike",
		brandColor: "#111111",
		image: "https://picsum.photos/seed/nike/600/340",
		type: "Reels",
		cpm: "$3.00",
		budget: 1200,
		spent: 500,
		deadline: "Nov 15, 2023",
		platforms: ["YouTube", "Instagram"],
		description:
			"Showcase the new Nike Summer '24 collection in your unique style.",
	},
	{
		id: "3",
		title: "Apple Music Campaign",
		brand: "Apple",
		brandColor: "#FB5C74",
		image: "https://picsum.photos/seed/apple/600/340",
		type: "Logo",
		cpm: "$1.80",
		budget: 600,
		spent: 180,
		deadline: "Dec 01, 2023",
		platforms: ["Instagram"],
		description:
			"Create content that highlights your music discovery experience.",
	},
	{
		id: "4",
		title: "Samsung Galaxy Launch",
		brand: "Samsung",
		brandColor: "#1428A0",
		image: "https://picsum.photos/seed/samsung/600/340",
		type: "Reels",
		cpm: "$2.80",
		budget: 1000,
		spent: 400,
		deadline: "Jan 10, 2024",
		platforms: ["YouTube"],
		description:
			"Unbox and showcase the Samsung Galaxy S24 Ultra. Highlight camera capabilities.",
	},
	{
		id: "5",
		title: "Spotify Wrapped Collab",
		brand: "Spotify",
		brandColor: "#1DB954",
		image: "https://picsum.photos/seed/spotify/600/340",
		type: "Story",
		cpm: "$2.00",
		budget: 750,
		spent: 320,
		deadline: "Dec 20, 2023",
		platforms: ["Instagram"],
		description:
			"Share your Spotify Wrapped experience with a creative story format.",
	},
	{
		id: "6",
		title: "Adidas Originals Drop",
		brand: "Adidas",
		brandColor: "#000000",
		image: "https://picsum.photos/seed/adidas/600/340",
		type: "Reels",
		cpm: "$3.50",
		budget: 2000,
		spent: 800,
		deadline: "Feb 01, 2024",
		platforms: ["YouTube", "Instagram"],
		description:
			"Feature the new Adidas Originals collection in a lifestyle reel.",
	},
];

const TRENDING_CREATORS = [
	{ name: "emma.creates", avatar: 1, followers: "122k", campaigns: 8 },
	{ name: "jake.films", avatar: 2, followers: "89k", campaigns: 12 },
	{ name: "sophia.visuals", avatar: 3, followers: "45k", campaigns: 5 },
	{ name: "marcus.edit", avatar: 4, followers: "210k", campaigns: 15 },
];

// ── Components ───────────────────────────────────────────────────────

function SearchBar({
	value,
	onChange,
}: {
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<div className="relative">
			<svg
				className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
			</svg>
			<input
				type="text"
				placeholder="Search campaigns, brands..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-xl border border-border bg-bg-card py-3 pl-11 pr-4 text-sm text-text placeholder-text-tertiary outline-none transition-colors focus:border-accent/40"
			/>
		</div>
	);
}

function FilterBar({
	active,
	onSelect,
}: {
	active: Filter;
	onSelect: (f: Filter) => void;
}) {
	return (
		<div className="flex gap-2">
			{FILTERS.map((f) => (
				<button
					key={f}
					type="button"
					onClick={() => onSelect(f)}
					className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
						active === f
							? "bg-accent text-white"
							: "bg-bg-card text-text-secondary border border-border hover:text-text"
					}`}
				>
					{f}
				</button>
			))}
		</div>
	);
}

function CampaignCard({ campaign }: { campaign: (typeof CAMPAIGNS)[number] }) {
	const progress = Math.round((campaign.spent / campaign.budget) * 100);

	return (
		<div className="group overflow-hidden rounded-2xl border border-border bg-bg-card transition-all hover:border-border/80 hover:shadow-[0_0_40px_rgba(236,72,153,0.04)]">
			{/* Image */}
			<div className="relative aspect-[16/9] overflow-hidden">
				<Image
					src={campaign.image}
					alt={campaign.title}
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-105"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

				{/* Badges on image */}
				<div className="absolute left-3 top-3 flex gap-2">
					<span className="rounded-lg bg-success/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
						{campaign.type.toUpperCase()}
					</span>
				</div>
				<div className="absolute right-3 top-3 rounded-lg bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
					{campaign.cpm} / 1k views
				</div>

				{/* Brand on image bottom */}
				<div className="absolute bottom-3 left-3 flex items-center gap-2">
					<div
						className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 text-xs font-bold text-white"
						style={{ backgroundColor: campaign.brandColor }}
					>
						{campaign.brand[0]}
					</div>
					<span className="text-sm font-medium text-white">
						{campaign.brand}
					</span>
				</div>
			</div>

			{/* Content */}
			<div className="p-5">
				<h3 className="text-[15px] font-semibold text-text group-hover:text-accent transition-colors">
					{campaign.title}
				</h3>
				<p className="mt-1.5 text-sm leading-relaxed text-text-secondary line-clamp-2">
					{campaign.description}
				</p>

				{/* Platforms */}
				<div className="mt-4 flex gap-2">
					{campaign.platforms.map((p) => (
						<span
							key={p}
							className="rounded-md bg-bg-secondary px-2.5 py-1 text-[11px] font-medium text-text-secondary border border-border-secondary"
						>
							{p}
						</span>
					))}
				</div>

				{/* Budget progress */}
				<div className="mt-4">
					<div className="flex items-center justify-between text-xs">
						<span className="text-text-secondary">Budget</span>
						<span>
							<span className="font-semibold text-accent">
								${campaign.spent}
							</span>
							<span className="text-text-tertiary"> / ${campaign.budget}</span>
						</span>
					</div>
					<div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border-secondary">
						<div
							className="h-full rounded-full bg-gradient-to-r from-accent to-accent-dark transition-all"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>

				{/* Footer */}
				<div className="mt-4 flex items-center justify-between">
					<div className="flex items-center gap-1.5 text-xs text-text-tertiary">
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="3" y="4" width="18" height="18" rx="2" />
							<line x1="16" y1="2" x2="16" y2="6" />
							<line x1="8" y1="2" x2="8" y2="6" />
							<line x1="3" y1="10" x2="21" y2="10" />
						</svg>
						{campaign.deadline}
					</div>
					<button
						type="button"
						className="rounded-lg bg-bg-secondary px-4 py-2 text-xs font-semibold text-text border border-border transition-colors hover:border-accent/40 hover:text-accent"
					>
						View Details
					</button>
				</div>
			</div>
		</div>
	);
}

function CreatorCard({
	creator,
}: {
	creator: (typeof TRENDING_CREATORS)[number];
}) {
	return (
		<div className="flex items-center gap-3 rounded-xl border border-border bg-bg-card p-4 transition-colors hover:border-accent/20">
			<div className="h-11 w-11 shrink-0 rounded-full bg-bg-secondary border border-border-secondary" />
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-semibold text-text">
					@{creator.name}
				</p>
				<p className="text-xs text-text-tertiary">
					{creator.followers} followers
				</p>
			</div>
			<span className="rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
				{creator.campaigns} campaigns
			</span>
		</div>
	);
}

// ── Page ─────────────────────────────────────────────────────────────

export default function MarketplacePage() {
	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] = useState<Filter>("All");

	const filtered = CAMPAIGNS.filter((c) => {
		const matchesSearch =
			!search ||
			c.title.toLowerCase().includes(search.toLowerCase()) ||
			c.brand.toLowerCase().includes(search.toLowerCase());
		const matchesFilter = activeFilter === "All" || c.type === activeFilter;
		return matchesSearch && matchesFilter;
	});

	return (
		<main className="mx-auto max-w-7xl px-6 py-8">
			{/* Hero */}
			<section className="mb-10">
				<h1 className="text-3xl font-bold tracking-tight text-text">
					Marketplace
				</h1>
				<p className="mt-2 text-text-secondary">
					Discover campaigns from top brands and start earning
				</p>
			</section>

			<div className="flex flex-col gap-8 lg:flex-row">
				{/* Main content */}
				<div className="flex-1">
					{/* Search + Filters */}
					<div className="mb-6 space-y-4">
						<SearchBar value={search} onChange={setSearch} />
						<FilterBar active={activeFilter} onSelect={setActiveFilter} />
					</div>

					{/* Campaign grid */}
					<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{filtered.map((campaign) => (
							<CampaignCard key={campaign.id} campaign={campaign} />
						))}
					</div>

					{filtered.length === 0 && (
						<div className="py-20 text-center">
							<p className="text-lg font-medium text-text-tertiary">
								No campaigns found
							</p>
							<p className="mt-1 text-sm text-text-tertiary">
								Try adjusting your search or filters
							</p>
						</div>
					)}
				</div>

				{/* Sidebar */}
				<aside className="w-full shrink-0 lg:w-72">
					{/* Stats overview */}
					<div className="mb-6 rounded-2xl border border-border bg-bg-card p-5">
						<h3 className="text-sm font-semibold text-text">Your Stats</h3>
						<div className="mt-4 grid grid-cols-2 gap-4">
							<div>
								<p className="text-2xl font-bold text-text">568.5k</p>
								<p className="text-xs text-text-tertiary">Total Views</p>
							</div>
							<div>
								<p className="text-2xl font-bold text-text">$1,240</p>
								<p className="text-xs text-text-tertiary">Earnings</p>
							</div>
							<div>
								<p className="text-2xl font-bold text-text">49.1k</p>
								<p className="text-xs text-text-tertiary">Total Likes</p>
							</div>
							<div>
								<p className="text-2xl font-bold text-accent">4</p>
								<p className="text-xs text-text-tertiary">Active</p>
							</div>
						</div>
					</div>

					{/* Trending Creators */}
					<div className="rounded-2xl border border-border bg-bg-card p-5">
						<h3 className="text-sm font-semibold text-text">
							Trending Creators
						</h3>
						<div className="mt-4 space-y-3">
							{TRENDING_CREATORS.map((creator) => (
								<CreatorCard key={creator.name} creator={creator} />
							))}
						</div>
					</div>
				</aside>
			</div>
		</main>
	);
}
