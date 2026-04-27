"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { SVGProps } from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
	ArrowIcon,
	BackIcon,
	BellIcon,
	CheckBigIcon,
	CheckIcon,
	IGIcon,
	PlatformIcon,
	PlusIcon,
	TrendIcon,
	TTIcon,
	VerifiedIcon,
	YTIcon,
} from "@/components/icons";
import { CAMPAIGNS, ACCENT_MAP, BRAND_COLORS } from "@/data/campaigns";

// ─── Types ──────────────────────────────────────────────────────────────────
type P = SVGProps<SVGSVGElement>;

// ─── Local icons ────────────────────────────────────────────────────────────
function HeartIcon(p: P) {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M8 13.5s-5-3-5-7a3 3 0 015-2.2A3 3 0 0113 6.5c0 4-5 7-5 7z" />
		</svg>
	);
}

function ShareIcon(p: P) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<circle cx="4" cy="8" r="1.6" />
			<circle cx="12" cy="4" r="1.6" />
			<circle cx="12" cy="12" r="1.6" />
			<path d="M5.5 7.2L10.5 4.8M5.5 8.8L10.5 11.2" />
		</svg>
	);
}

function FlagIcon(p: P) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M3 2v12" />
			<path d="M3 3h9l-2 3 2 3H3" />
		</svg>
	);
}

function PlayIcon(p: P) {
	return (
		<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" {...p}>
			<path d="M5 3.5v9l8-4.5z" />
		</svg>
	);
}

function ClockIcon(p: P) {
	return (
		<svg
			width="13"
			height="13"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			{...p}
		>
			<circle cx="8" cy="8" r="6" />
			<path d="M8 4.5V8l2.5 1.5" />
		</svg>
	);
}

function SparkIcon(p: P) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.5 3.5l2 2M10.5 10.5l2 2M3.5 12.5l2-2M10.5 5.5l2-2" />
		</svg>
	);
}

function FileIcon(p: P) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M9 2H4v12h8V5z" />
			<path d="M9 2v3h3" />
		</svg>
	);
}

function CloseIcon(p: P) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			{...p}
		>
			<path d="M3 3l8 8M11 3l-8 8" />
		</svg>
	);
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const initials = (s: string) =>
	s
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

const fmt = (n: number) => n.toLocaleString("en-IN");

// ─── Campaign detail types & data ───────────────────────────────────────────
interface CampaignDetail {
	brandFollowers: string;
	brandRating: string;
	brandPaidOut: string;
	brandResponseTime: string;
	brandBio: string;
	titleAccent: string;
	longBrief: string[];
	daysLeft: number;
	bonus: { threshold: string; amount: string };
}

const CAMPAIGN_DETAILS: Record<number, CampaignDetail> = {
	1: {
		brandFollowers: "412k",
		brandRating: "4.9",
		brandPaidOut: "₹38L",
		brandResponseTime: "~6h",
		brandBio:
			"Lumen Audio designs premium personal audio in Bengaluru. Backed by Sequoia, shipping to 22 countries. We prefer creators with quiet, considered visual sensibilities.",
		titleAccent: "Lumen Pro 2 earbuds",
		longBrief: [
			"We're rolling out the Lumen Pro 2 — our most refined earbuds yet — and we want creators to capture how they slide into a real day. Not a spec read-out, not a feature dump. A moment.",
			"Show the ANC kicking in on a noisy commute, the 12-hour battery getting you through a long studio session, or that first second when the spatial audio lands. Keep it grounded, keep it human.",
			"Tone is quiet-confident. Think soft natural light, ambient room sound, no shouting. We'll send a unit (yours to keep) within 48 hours of approval.",
		],
		daysLeft: 22,
		bonus: { threshold: "100k views", amount: "+₹40 / 1k" },
	},
	2: {
		brandFollowers: "186k",
		brandRating: "4.7",
		brandPaidOut: "₹12L",
		brandResponseTime: "~4h",
		brandBio:
			"Kavi Coffee Co. sources single-origin beans from Coorg and Chikmagalur. We roast slow, ship fast, and believe great coffee content should feel as unhurried as a pour-over.",
		titleAccent: "cold brew launch",
		longBrief: [
			"We're launching our first cold brew bottle and want creators to weave it into their morning routine. Not a product review — a mood.",
			"Show the bottle in your real kitchen, your real morning. Condensation on glass, steam from a mug, quiet ambient sound. We want viewers to feel the ritual, not hear a sales pitch.",
			"Keep it under 60 seconds. Vertical. Natural light only. We'll ship a case of 12 bottles within 24 hours of approval.",
		],
		daysLeft: 28,
		bonus: { threshold: "50k views", amount: "+₹30 / 1k" },
	},
	3: {
		brandFollowers: "94k",
		brandRating: "4.8",
		brandPaidOut: "₹52L",
		brandResponseTime: "~8h",
		brandBio:
			"Northform is a Mumbai-based design studio crafting slow fashion for the modern Indian wardrobe. Every collection is limited-run, locally made, and meant to last a decade.",
		titleAccent: "SS26 collection",
		longBrief: [
			"We're opening our Mumbai studio doors for the SS26 collection and want creators to capture the behind-the-scenes energy — pattern-cutting, fabric draping, fittings.",
			"Tone is cinematic and unhurried. Think natural studio light, close-ups of hands and fabric, ambient workshop sounds. No talking heads, no voiceover unless it's absolutely minimal.",
			"Shorts format, 30–90 seconds. We'll arrange studio access windows over two weekends in May.",
		],
		daysLeft: 36,
		bonus: { threshold: "80k views", amount: "+₹60 / 1k" },
	},
	4: {
		brandFollowers: "320k",
		brandRating: "4.6",
		brandPaidOut: "₹28L",
		brandResponseTime: "~5h",
		brandBio:
			"Glide Mobility builds electric micro-mobility for Indian cities. The G3 is our third-gen e-scooter — 80km range, swappable battery, designed in Pune.",
		titleAccent: "Glide G3 e-scooter",
		longBrief: [
			"The G3 is our most refined scooter yet and we want first-ride POV content that captures the feeling of gliding through your city.",
			"Mount your phone or GoPro, hit record, and ride. We want the wind, the traffic sounds, the lane changes. Hook viewers in under 2 seconds — start mid-ride, not at your front door.",
			"End with a strong CTA to our test-ride events happening in 8 cities. We'll provide the event link and UTM. Scooter delivered to your door within 72 hours of approval.",
		],
		daysLeft: 34,
		bonus: { threshold: "120k views", amount: "+₹50 / 1k" },
	},
	5: {
		brandFollowers: "528k",
		brandRating: "4.9",
		brandPaidOut: "₹18L",
		brandResponseTime: "~3h",
		brandBio:
			"Petal & Press makes clean, dermat-backed skincare that actually works. No greenwashing, no miracle claims. Just good ingredients and honest skin.",
		titleAccent: "clean-skin serum",
		longBrief: [
			"Our Hydra Veil serum is launching and we want creators to feature it in an authentic get-ready-with-me clip.",
			"No filters, no heavy editing, no studio lighting. Show your real skin, your real routine. Apply the serum, let viewers see the texture and finish. Talk about how it feels, not what it does — we'll handle the science.",
			"Keep it 30–60 seconds. The serum should appear naturally in your routine, not as a standalone product demo.",
		],
		daysLeft: 25,
		bonus: { threshold: "60k views", amount: "+₹35 / 1k" },
	},
	6: {
		brandFollowers: "640k",
		brandRating: "4.5",
		brandPaidOut: "₹72L",
		brandResponseTime: "~12h",
		brandBio:
			"Forge Finance is a SEBI-registered investment platform making mutual funds accessible to first-time investors. We believe financial literacy content should be calm, clear, and jargon-free.",
		titleAccent: "SIP explainer",
		longBrief: [
			"We want 60-second educational shorts that explain why most people's SIPs underperform — and what to do about it.",
			"We'll provide a script outline and data points. You bring the delivery: calm voiceover, clean on-screen captions, minimal visual clutter. Think 3Blue1Brown energy, not finance bro.",
			"Must include our standard disclaimer footer. We'll supply the exact text. No specific fund recommendations — keep it educational.",
		],
		daysLeft: 44,
		bonus: { threshold: "75k views", amount: "+₹80 / 1k" },
	},
	7: {
		brandFollowers: "156k",
		brandRating: "4.8",
		brandPaidOut: "₹8L",
		brandResponseTime: "~4h",
		brandBio:
			"Halfmoon Kitchen makes small-batch Japanese-inspired pantry staples in Goa. Our miso paste is fermented for 12 months and used by 40+ restaurants across India.",
		titleAccent: "miso paste",
		longBrief: [
			"One recipe, one minute, one pan. That's the format. Feature our white miso paste as the star ingredient.",
			"Show the cooking process start to finish — the sizzle, the stir, the final plated hero shot with the Halfmoon jar visible in frame. No long intros, no ingredient lists on screen.",
			"We're open to any cuisine — don't feel limited to Japanese. Surprise us. Ship 3 jars within 48 hours of approval.",
		],
		daysLeft: 20,
		bonus: { threshold: "40k views", amount: "+₹25 / 1k" },
	},
	8: {
		brandFollowers: "210k",
		brandRating: "4.7",
		brandPaidOut: "₹44L",
		brandResponseTime: "~10h",
		brandBio:
			"Atlas Outdoors builds technical gear tested in the Himalayas. Every jacket, pack, and layer is field-tested by our team before it ships. We sponsor 12 trail runners and 4 expedition teams.",
		titleAccent: "Atlas X1 jacket",
		longBrief: [
			"We want real field-test footage of the Atlas X1 jacket in Himalayan conditions. Not a studio lookbook — actual trails, actual weather.",
			"Capture the jacket in rain, wind, or snow if possible. Show layering, show venting, show the DWR finish repelling water. Include weather details (temp, altitude, conditions) as on-screen text.",
			"Bonus payout for snow conditions. We'll ship the jacket in your size within 48 hours. You keep it regardless of views.",
		],
		daysLeft: 52,
		bonus: { threshold: "90k views", amount: "+₹70 / 1k" },
	},
	9: {
		brandFollowers: "72k",
		brandRating: "4.9",
		brandPaidOut: "₹4L",
		brandResponseTime: "~2h",
		brandBio:
			"Soko Stationery makes tactile, minimal notebooks and desk tools in Jaipur. Every cover is hand-pressed, every page is 100gsm acid-free. For people who still write by hand.",
		titleAccent: "Soko Daily notebook",
		longBrief: [
			"We want cozy desk-setup ASMR content featuring the new Soko Daily notebook line.",
			"Think page-flipping sounds, pen scratching, the soft thud of a book on wood. Show the textured cover, the lay-flat binding, the ink-friendly paper. No voiceover — let the sounds do the talking.",
			"Ambient lighting, warm tones, slow pacing. We'll ship 3 notebooks (dot grid, lined, blank) within 24 hours.",
		],
		daysLeft: 18,
		bonus: { threshold: "30k views", amount: "+₹20 / 1k" },
	},
};

function getCampaign(id: number) {
	const base = CAMPAIGNS.find((c) => c.id === id) ?? CAMPAIGNS[0];
	const detail = CAMPAIGN_DETAILS[id] ?? CAMPAIGN_DETAILS[1];
	return { ...base, ...detail };
}

type MergedCampaign = ReturnType<typeof getCampaign>;

const CampaignContext = createContext<MergedCampaign>(getCampaign(1));

function useCampaign() {
	return useContext(CampaignContext);
}

const SIMILAR = [
	{
		id: 4,
		brand: "Glide Mobility",
		brandHandle: "@rideglide",
		title: "First-ride POV for the Glide G3 e-scooter",
		platform: "TikTok",
		rate: 310,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "25k",
		deadline: "May 30",
		color: "lime",
	},
	{
		id: 8,
		brand: "Atlas Outdoors",
		brandHandle: "@atlas.outdoors",
		title: "Trail-test the Atlas X1 jacket in the Himalayas",
		platform: "YouTube",
		rate: 480,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "20k",
		deadline: "Jun 18",
		color: "sky",
	},
	{
		id: 3,
		brand: "Northform",
		brandHandle: "@northform.studio",
		title: "Studio-tour shorts for the SS26 collection",
		platform: "YouTube",
		rate: 420,
		currency: "\u20B9",
		perViews: "1k",
		minViews: "20k",
		deadline: "Jun 02",
		color: "violet",
	},
];

const CREATOR_DOTS: [string, string, string][] = [
	["#f472b6", "#a855f7", "RA"],
	["#60a5fa", "#22d3ee", "MK"],
	["#fb923c", "#facc15", "SV"],
	["#a7f3d0", "#34d399", "DH"],
];

const ACTIVITY = [
	{
		who: "Riya A.",
		what: "applied",
		time: "2m",
		from: "#f472b6",
		to: "#a855f7",
		initials: "RA",
	},
	{
		who: "Mehul K.",
		what: "got approved",
		time: "14m",
		from: "#60a5fa",
		to: "#22d3ee",
		initials: "MK",
	},
	{
		who: "Sana V.",
		what: "submitted draft",
		time: "1h",
		from: "#fb923c",
		to: "#facc15",
		initials: "SV",
	},
	{
		who: "Dev H.",
		what: "hit 50k views",
		time: "3h",
		from: "#a7f3d0",
		to: "#34d399",
		initials: "DH",
	},
];

const FAQS = [
	{
		q: "When and how do I get paid?",
		a: "Payouts are calculated daily based on verified views from the platform\u2019s analytics API, and settled to your bank or UPI on the 1st and 15th of every month. You\u2019ll see a live earnings ticker in your inflio wallet.",
	},
	{
		q: "What counts as a verified view?",
		a: "Any view on the public post that the platform reports through its official API. Looped views, repeat sessions from the same account in a 24-hour window, and ad-attributed views don\u2019t count toward CPM payouts.",
	},
	{
		q: "Can I post on multiple platforms?",
		a: "This campaign is Instagram-first. You can crosspost to Reels, TikTok, and YouTube Shorts \u2014 each platform earns separately at the published CPM. The reel must stay live for at least 30 days.",
	},
	{
		q: "Do I need to send drafts for approval?",
		a: "Optional. You can submit a draft to the brand\u2019s review queue (avg. response 6 hours) for early feedback, or post directly. Either way, the post must include the disclosed #ad and #lumenpro2 tags.",
	},
	{
		q: "What if my reel doesn\u2019t hit the minimum 10k views?",
		a: "No penalty \u2014 you simply don\u2019t earn from this campaign. There\u2019s no clawback, no fee, and your standing on inflio isn\u2019t affected.",
	},
];

const PLATFORM_OPTS = [
	{ name: "Instagram", handle: "@riya.makes", followers: "84.2k" },
	{ name: "YouTube", handle: "Riya Makes", followers: "12.4k" },
	{ name: "TikTok", handle: "@riyamakes", followers: "31.9k" },
];

const DELIVERABLES = [
	{
		ok: true,
		title: "30\u201360 second reel",
		desc: "Vertical 9:16 format. No hard cuts in the first 3 seconds.",
	},
	{
		ok: true,
		title: "Natural lighting preferred",
		desc: "Soft daylight or warm indoor. No ring light look.",
	},
	{
		ok: true,
		title: "Show ANC or battery moment",
		desc: "At least one scene that highlights active noise cancelling or the 12-hour battery.",
	},
	{
		ok: true,
		title: "Include #ad and #lumenpro2",
		desc: "Disclosed sponsorship tags required by platform guidelines.",
	},
	{
		ok: false,
		title: "No competitor products in frame",
		desc: "Avoid showing AirPods, Sony, Bose, or other audio brands.",
	},
	{
		ok: false,
		title: "No spec read-outs or feature dumps",
		desc: "Don\u2019t list specs on screen. Keep it experiential.",
	},
];

const TIMELINE_STEPS = [
	{
		step: 1,
		title: "Apply",
		desc: "Submit your pitch and preferred platform. Avg. review time is 6 hours.",
	},
	{
		step: 2,
		title: "Get approved",
		desc: "Receive confirmation and a Lumen Pro 2 unit shipped within 48h.",
	},
	{
		step: 3,
		title: "Film & post",
		desc: "Create your reel and publish it with the required tags.",
	},
	{
		step: 4,
		title: "Earn per view",
		desc: "Payouts calculated daily. Settled to your wallet on the 1st and 15th.",
	},
];

const EXAMPLES = [
	{
		handle: "@anvi.creates",
		views: "142k views",
		from: "#f472b6",
		to: "#a855f7",
	},
	{
		handle: "@rohan.daily",
		views: "89k views",
		from: "#60a5fa",
		to: "#22d3ee",
	},
	{
		handle: "@priya.lens",
		views: "210k views",
		from: "#fb923c",
		to: "#facc15",
	},
];

const TAB_NAMES = [
	"Brief",
	"Deliverables (6)",
	"Timeline",
	"Earnings calc",
	"Past winners (3)",
	"FAQ (5)",
];

// ─── Nav ────────────────────────────────────────────────────────────────────
function Nav() {
	return (
		<nav className="nav">
			<div className="shell">
				<div className="nav-inner">
					<Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
						<div className="logo">
							<div className="logo-dot" />
							inflio
						</div>
					</Link>
					<div className="nav-links">
						<Link href="/marketplace" className="active">
							Marketplace
						</Link>
						<Link href="/campaigns">My campaigns</Link>
						<Link href="/earnings">Earnings</Link>
						<Link href="/insights">Insights</Link>
						<Link href="/help">Help</Link>
					</div>
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

// ─── Breadcrumb ─────────────────────────────────────────────────────────────
function Crumb() {
	const CAMPAIGN = useCampaign();
	const [saved, setSaved] = useState(false);

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "20px 0 12px",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-ink-2)" }}>
				<Link
					href="/marketplace"
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 6,
						color: "var(--color-ink-1)",
						textDecoration: "none",
						transition: "color 0.15s",
					}}
				>
					<BackIcon />
					Marketplace
				</Link>
				<span style={{ opacity: 0.4 }}>/</span>
				<span>{CAMPAIGN.category}</span>
				<span style={{ opacity: 0.4 }}>/</span>
				<span style={{ color: "var(--color-ink-1)" }}>{CAMPAIGN.brand}</span>
			</div>
			<div style={{ display: "flex", alignItems: "center", gap: 4 }}>
				<button
					onClick={() => setSaved((s) => !s)}
					style={{
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
						width: 34,
						height: 34,
						borderRadius: 8,
						border: "1px solid var(--color-line)",
						background: saved ? "rgba(251,113,133,0.12)" : "transparent",
						color: saved ? "#fb7185" : "var(--color-ink-2)",
						transition: "all 0.15s",
					}}
					aria-label="Save"
				>
					<HeartIcon style={saved ? { fill: "#fb7185", stroke: "#fb7185" } : undefined} />
				</button>
				<button
					style={{
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
						width: 34,
						height: 34,
						borderRadius: 8,
						border: "1px solid var(--color-line)",
						background: "transparent",
						color: "var(--color-ink-2)",
					}}
					aria-label="Share"
				>
					<ShareIcon />
				</button>
				<button
					style={{
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
						width: 34,
						height: 34,
						borderRadius: 8,
						border: "1px solid var(--color-line)",
						background: "transparent",
						color: "var(--color-ink-2)",
					}}
					aria-label="Report"
				>
					<FlagIcon />
				</button>
			</div>
		</div>
	);
}

// ─── CampaignHero ───────────────────────────────────────────────────────────
function CampaignHero({ onApply }: { onApply: () => void }) {
	const CAMPAIGN = useCampaign();
	const accent = ACCENT_MAP[CAMPAIGN.color] ?? ACCENT_MAP["lime"];
	const brandColors = BRAND_COLORS[CAMPAIGN.brand] ?? ["#d4d4d4", "#1a1a1a"];
	const spotsUsedPct = ((CAMPAIGN.totalSpots - CAMPAIGN.spotsLeft) / CAMPAIGN.totalSpots) * 100;

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1.55fr 1fr",
				gap: 32,
				marginBottom: 40,
			}}
		>
			{/* Left: Info */}
			<div>
				{CAMPAIGN.trending && (
					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 6,
							fontSize: 11,
							fontWeight: 600,
							textTransform: "uppercase",
							letterSpacing: "0.06em",
							color: accent.chip,
							background: accent.from,
							borderRadius: 6,
							padding: "5px 10px",
							marginBottom: 16,
						}}
					>
						<TrendIcon />
						Trending
					</div>
				)}

				{/* Brand cluster */}
				<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
					<div
						style={{
							width: 40,
							height: 40,
							borderRadius: 10,
							background: brandColors[1],
							color: brandColors[0],
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 13,
							fontWeight: 700,
							flexShrink: 0,
						}}
					>
						{initials(CAMPAIGN.brand)}
					</div>
					<div>
						<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
							<span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink-0)" }}>
								{CAMPAIGN.brand}
							</span>
							<VerifiedIcon style={{ color: accent.chip }} />
						</div>
						<div style={{ fontSize: 12, color: "var(--color-ink-2)" }}>{CAMPAIGN.brandHandle}</div>
					</div>
					<div
						style={{
							marginLeft: "auto",
							display: "inline-flex",
							alignItems: "center",
							gap: 5,
							fontSize: 11.5,
							color: "var(--color-ink-1)",
							background: "var(--color-glass)",
							border: "1px solid var(--color-line)",
							borderRadius: 20,
							padding: "5px 10px",
						}}
					>
						<PlatformIcon name={CAMPAIGN.platform} />
						{CAMPAIGN.platform}
					</div>
				</div>

				{/* Title */}
				<h1
					style={{
						fontFamily: "'Geist', 'Inter', system-ui, sans-serif",
						fontSize: 34,
						fontWeight: 700,
						letterSpacing: "-0.025em",
						lineHeight: 1.15,
						margin: "0 0 14px",
					}}
				>
					{CAMPAIGN.title}{" "}
					<em
						style={{
							fontStyle: "normal",
							background: `linear-gradient(135deg, ${accent.chip}, ${accent.text})`,
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
						}}
					>
						{CAMPAIGN.titleAccent}
					</em>
				</h1>

				{/* Subtitle / brief */}
				<p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--color-ink-1)", margin: "0 0 18px", maxWidth: 560 }}>
					{CAMPAIGN.brief}
				</p>

				{/* Tags */}
				<div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 22 }}>
					{CAMPAIGN.tags.map((tag) => (
						<span
							key={tag}
							style={{
								fontSize: 11.5,
								color: "var(--color-ink-2)",
								background: "var(--color-glass)",
								border: "1px solid var(--color-line)",
								borderRadius: 6,
								padding: "4px 10px",
							}}
						>
							#{tag}
						</span>
					))}
				</div>

				{/* Facts grid */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(4, 1fr)",
						gap: 12,
					}}
				>
					{[
						{ label: "Min. views", value: CAMPAIGN.minViews },
						{ label: "Budget", value: `\u20B9${CAMPAIGN.budget}` },
						{ label: "Deadline", value: CAMPAIGN.deadline },
						{ label: "Category", value: CAMPAIGN.category },
					].map((f) => (
						<div
							key={f.label}
							style={{
								background: "var(--color-glass)",
								border: "1px solid var(--color-line)",
								borderRadius: 10,
								padding: "12px 14px",
							}}
						>
							<div style={{ fontSize: 11, color: "var(--color-ink-3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
								{f.label}
							</div>
							<div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-ink-0)" }} className="mono">
								{f.value}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Right: Payout card */}
			<div
				style={{
					background: `linear-gradient(160deg, ${accent.from}, var(--color-bg-2) 60%)`,
					border: "1px solid var(--color-line-2)",
					borderRadius: 16,
					padding: 28,
					display: "flex",
					flexDirection: "column",
					gap: 20,
				}}
			>
				{/* Eyebrow */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 6,
						fontSize: 11,
						fontWeight: 600,
						textTransform: "uppercase",
						letterSpacing: "0.06em",
						color: accent.chip,
					}}
				>
					<SparkIcon style={{ color: accent.chip }} />
					Live CPM rate
				</div>

				{/* Big rate */}
				<div>
					<div
						style={{
							fontFamily: "'Geist', system-ui, sans-serif",
							fontSize: 48,
							fontWeight: 800,
							letterSpacing: "-0.03em",
							lineHeight: 1,
							color: "var(--color-ink-0)",
						}}
					>
						<span style={{ fontSize: 28, fontWeight: 600, opacity: 0.7 }}>{CAMPAIGN.currency}</span>
						{CAMPAIGN.rate}
					</div>
					<div style={{ fontSize: 13, color: "var(--color-ink-2)", marginTop: 4 }}>
						per {CAMPAIGN.perViews} views
					</div>
				</div>

				{/* Bonus helper */}
				<div
					style={{
						fontSize: 12.5,
						color: "var(--color-ink-1)",
						background: "rgba(255,255,255,0.04)",
						border: "1px solid var(--color-line)",
						borderRadius: 8,
						padding: "10px 12px",
						display: "flex",
						alignItems: "center",
						gap: 8,
					}}
				>
					<TrendIcon style={{ color: accent.chip, flexShrink: 0 }} />
					<span>
						Bonus above {CAMPAIGN.bonus.threshold}:{" "}
						<strong style={{ color: accent.chip }}>{CAMPAIGN.bonus.amount}</strong>
					</span>
				</div>

				{/* Creator dots */}
				<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
					<div style={{ display: "flex" }}>
						{CREATOR_DOTS.map(([from, to, ini], i) => (
							<div
								key={i}
								style={{
									width: 28,
									height: 28,
									borderRadius: "50%",
									background: `linear-gradient(135deg, ${from}, ${to})`,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 9,
									fontWeight: 700,
									color: "#fff",
									border: "2px solid var(--color-bg-2)",
									marginLeft: i > 0 ? -8 : 0,
								}}
							>
								{ini}
							</div>
						))}
						{CAMPAIGN.creatorsJoined > CREATOR_DOTS.length && (
							<div
								style={{
									width: 28,
									height: 28,
									borderRadius: "50%",
									background: "var(--color-glass)",
									border: "2px solid var(--color-bg-2)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 9,
									fontWeight: 600,
									color: "var(--color-ink-2)",
									marginLeft: -8,
								}}
							>
								+{CAMPAIGN.creatorsJoined - CREATOR_DOTS.length}
							</div>
						)}
					</div>
					<span style={{ fontSize: 12, color: "var(--color-ink-2)" }}>
						{CAMPAIGN.creatorsJoined} creators joined
					</span>
				</div>

				{/* Spots progress */}
				<div>
					<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
						<span style={{ color: "var(--color-ink-2)" }}>
							<strong style={{ color: "var(--color-ink-0)", fontWeight: 500 }}>{CAMPAIGN.spotsLeft}</strong> spots left
						</span>
						<span style={{ color: "var(--color-ink-3)" }}>
							{CAMPAIGN.totalSpots - CAMPAIGN.spotsLeft}/{CAMPAIGN.totalSpots}
						</span>
					</div>
					<div
						style={{
							height: 6,
							borderRadius: 3,
							background: "rgba(255,255,255,0.06)",
							overflow: "hidden",
						}}
					>
						<div
							style={{
								height: "100%",
								width: `${spotsUsedPct}%`,
								borderRadius: 3,
								background: `linear-gradient(90deg, ${accent.chip}, ${accent.text})`,
								transition: "width 0.4s ease",
							}}
						/>
					</div>
				</div>

				{/* CTA */}
				<button
					onClick={onApply}
					style={{
						width: "100%",
						padding: "14px 0",
						borderRadius: 10,
						border: "none",
						background: `linear-gradient(135deg, ${accent.chip}, ${accent.text})`,
						color: "#0a0a0c",
						fontSize: 14,
						fontWeight: 700,
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 8,
						transition: "opacity 0.15s",
					}}
				>
					Apply now
					<ArrowIcon style={{ stroke: "#0a0a0c" }} />
				</button>

				{/* Fine print */}
				<p style={{ fontSize: 11, color: "var(--color-ink-3)", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
					{CAMPAIGN.daysLeft} days left &middot; Free to apply &middot; No exclusivity
				</p>
			</div>
		</div>
	);
}

// ─── Tabs ───────────────────────────────────────────────────────────────────
function Tabs({
	active,
	onChange,
}: {
	active: number;
	onChange: (i: number) => void;
}) {
	const CAMPAIGN = useCampaign();
	const accent = ACCENT_MAP[CAMPAIGN.color] ?? ACCENT_MAP["lime"];

	return (
		<div
			style={{
				position: "sticky",
				top: 68,
				zIndex: 40,
				backdropFilter: "blur(16px)",
				WebkitBackdropFilter: "blur(16px)",
				background: "linear-gradient(180deg, rgba(10,10,12,0.9), rgba(10,10,12,0.7))",
				borderBottom: "1px solid var(--color-line)",
				marginBottom: 32,
			}}
		>
			<div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
				{TAB_NAMES.map((name, i) => (
					<button
						key={name}
						onClick={() => onChange(i)}
						style={{
							padding: "14px 20px",
							fontSize: 13,
							fontWeight: active === i ? 600 : 400,
							color: active === i ? "var(--color-ink-0)" : "var(--color-ink-2)",
							background: "none",
							border: "none",
							borderBottom: active === i ? `2px solid ${accent.chip}` : "2px solid transparent",
							cursor: "pointer",
							whiteSpace: "nowrap",
							transition: "color 0.15s",
						}}
					>
						{name}
					</button>
				))}
			</div>
		</div>
	);
}

// ─── BriefBlock ─────────────────────────────────────────────────────────────
function BriefBlock() {
	const CAMPAIGN = useCampaign();
	const accent = ACCENT_MAP[CAMPAIGN.color] ?? ACCENT_MAP["lime"];

	return (
		<div style={{ marginBottom: 48 }}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 8,
					fontSize: 11,
					fontWeight: 600,
					textTransform: "uppercase",
					letterSpacing: "0.06em",
					color: accent.chip,
					marginBottom: 12,
				}}
			>
				<FileIcon style={{ color: accent.chip }} />
				Campaign brief
			</div>
			<h2
				style={{
					fontFamily: "'Geist', system-ui, sans-serif",
					fontSize: 22,
					fontWeight: 700,
					letterSpacing: "-0.02em",
					margin: "0 0 18px",
				}}
			>
				What we&apos;re looking for
			</h2>
			{CAMPAIGN.longBrief.map((p, i) => (
				<p
					key={i}
					style={{
						fontSize: 14,
						lineHeight: 1.7,
						color: "var(--color-ink-1)",
						margin: "0 0 14px",
						maxWidth: 640,
					}}
				>
					{p}
				</p>
			))}

			{/* Bonus callout */}
			<div
				style={{
					marginTop: 20,
					background: accent.from,
					border: `1px solid ${accent.chip}33`,
					borderRadius: 10,
					padding: "14px 18px",
					display: "flex",
					alignItems: "center",
					gap: 10,
					maxWidth: 640,
				}}
			>
				<TrendIcon style={{ color: accent.chip, flexShrink: 0 }} />
				<span style={{ fontSize: 13, color: "var(--color-ink-0)" }}>
					<strong>Bonus:</strong> Cross {CAMPAIGN.bonus.threshold} and earn{" "}
					<strong style={{ color: accent.chip }}>{CAMPAIGN.bonus.amount}</strong> on every additional thousand.
				</span>
			</div>
		</div>
	);
}

// ─── DeliverablesBlock ──────────────────────────────────────────────────────
function DeliverablesBlock() {
	return (
		<div style={{ marginBottom: 48 }}>
			<h2
				style={{
					fontFamily: "'Geist', system-ui, sans-serif",
					fontSize: 22,
					fontWeight: 700,
					letterSpacing: "-0.02em",
					margin: "0 0 18px",
				}}
			>
				Deliverables checklist
			</h2>
			<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
				{DELIVERABLES.map((d, i) => (
					<div
						key={i}
						style={{
							display: "flex",
							alignItems: "flex-start",
							gap: 12,
							padding: "12px 16px",
							borderRadius: 10,
							background: "var(--color-glass)",
							border: "1px solid var(--color-line)",
						}}
					>
						<div
							style={{
								width: 22,
								height: 22,
								borderRadius: 6,
								background: d.ok ? "rgba(190,242,100,0.15)" : "rgba(251,113,133,0.12)",
								color: d.ok ? "#bef264" : "#fb7185",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
								marginTop: 1,
							}}
						>
							{d.ok ? <CheckIcon style={{ width: 11, height: 11 }} /> : <CloseIcon style={{ width: 10, height: 10 }} />}
						</div>
						<div>
							<div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--color-ink-0)", marginBottom: 2 }}>
								{d.title}
							</div>
							<div style={{ fontSize: 12.5, color: "var(--color-ink-2)", lineHeight: 1.5 }}>{d.desc}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// ─── TimelineBlock ──────────────────────────────────────────────────────────
function TimelineBlock() {
	const CAMPAIGN = useCampaign();
	const accent = ACCENT_MAP[CAMPAIGN.color] ?? ACCENT_MAP["lime"];

	return (
		<div style={{ marginBottom: 48 }}>
			<h2
				style={{
					fontFamily: "'Geist', system-ui, sans-serif",
					fontSize: 22,
					fontWeight: 700,
					letterSpacing: "-0.02em",
					margin: "0 0 18px",
				}}
			>
				How it works
			</h2>
			<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
				{TIMELINE_STEPS.map((s) => (
					<div
						key={s.step}
						style={{
							background: "var(--color-glass)",
							border: "1px solid var(--color-line)",
							borderRadius: 12,
							padding: "18px 16px",
						}}
					>
						<div
							style={{
								width: 28,
								height: 28,
								borderRadius: 8,
								background: accent.from,
								color: accent.chip,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 12,
								fontWeight: 700,
								marginBottom: 10,
							}}
						>
							{s.step}
						</div>
						<div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink-0)", marginBottom: 4 }}>
							{s.title}
						</div>
						<div style={{ fontSize: 12.5, color: "var(--color-ink-2)", lineHeight: 1.5 }}>{s.desc}</div>
					</div>
				))}
			</div>
		</div>
	);
}

// ─── EarningsCalc ───────────────────────────────────────────────────────────
function EarningsCalc() {
	const CAMPAIGN = useCampaign();
	const accent = ACCENT_MAP[CAMPAIGN.color] ?? ACCENT_MAP["lime"];
	const trackRef = useRef<HTMLDivElement>(null);
	const dragging = useRef(false);
	const [views, setViews] = useState(50000);

	const MIN_VIEWS = 10000;
	const MAX_VIEWS = 500000;

	const pct = ((views - MIN_VIEWS) / (MAX_VIEWS - MIN_VIEWS)) * 100;

	const posToVal = useCallback(
		(clientX: number) => {
			const rect = trackRef.current?.getBoundingClientRect();
			if (!rect) return MIN_VIEWS;
			const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
			const step = 1000;
			return Math.round((MIN_VIEWS + ratio * (MAX_VIEWS - MIN_VIEWS)) / step) * step;
		},
		[],
	);

	useEffect(() => {
		function onMove(e: MouseEvent) {
			if (!dragging.current) return;
			setViews(posToVal(e.clientX));
		}
		function onUp() {
			dragging.current = false;
		}
		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseup", onUp);
		return () => {
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseup", onUp);
		};
	}, [posToVal]);

	const basePay = (views / 1000) * CAMPAIGN.rate;
	const bonusViews = Math.max(0, views - 100000);
	const bonusPay = (bonusViews / 1000) * 40;
	const total = basePay + bonusPay;

	return (
		<div style={{ marginBottom: 48 }}>
			<h2
				style={{
					fontFamily: "'Geist', system-ui, sans-serif",
					fontSize: 22,
					fontWeight: 700,
					letterSpacing: "-0.02em",
					margin: "0 0 18px",
				}}
			>
				Earnings calculator
			</h2>
			<div
				style={{
					background: "var(--color-glass)",
					border: "1px solid var(--color-line)",
					borderRadius: 14,
					padding: "24px 28px",
				}}
			>
				{/* Views label */}
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
					<span style={{ fontSize: 13, color: "var(--color-ink-2)" }}>Projected views</span>
					<span style={{ fontSize: 22, fontWeight: 700, color: "var(--color-ink-0)" }} className="mono">
						{fmt(views)}
					</span>
				</div>

				{/* Slider track */}
				<div
					ref={trackRef}
					style={{
						position: "relative",
						height: 6,
						borderRadius: 3,
						background: "rgba(255,255,255,0.06)",
						cursor: "pointer",
						marginBottom: 8,
					}}
					onMouseDown={(e) => {
						dragging.current = true;
						setViews(posToVal(e.clientX));
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							height: "100%",
							width: `${pct}%`,
							borderRadius: 3,
							background: `linear-gradient(90deg, ${accent.chip}, ${accent.text})`,
						}}
					/>
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: `${pct}%`,
							transform: "translate(-50%, -50%)",
							width: 18,
							height: 18,
							borderRadius: "50%",
							background: accent.chip,
							border: "3px solid var(--color-bg-2)",
							boxShadow: `0 0 12px ${accent.chip}66`,
							cursor: "grab",
						}}
						onMouseDown={(e) => {
							e.stopPropagation();
							dragging.current = true;
						}}
					/>
				</div>
				<div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-ink-3)" }}>
					<span>10k</span>
					<span>500k</span>
				</div>

				{/* Breakdown */}
				<div
					style={{
						marginTop: 20,
						borderTop: "1px solid var(--color-line)",
						paddingTop: 16,
						display: "flex",
						flexDirection: "column",
						gap: 8,
					}}
				>
					<div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
						<span style={{ color: "var(--color-ink-2)" }}>
							Base CPM ({fmt(views)} views x {CAMPAIGN.currency}{CAMPAIGN.rate})
						</span>
						<span style={{ color: "var(--color-ink-0)", fontWeight: 500 }} className="mono">
							{CAMPAIGN.currency}{fmt(Math.round(basePay))}
						</span>
					</div>
					{bonusPay > 0 && (
						<div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
							<span style={{ color: "var(--color-ink-2)" }}>
								Bonus ({fmt(bonusViews)} views above 100k)
							</span>
							<span style={{ color: accent.chip, fontWeight: 500 }} className="mono">
								+{CAMPAIGN.currency}{fmt(Math.round(bonusPay))}
							</span>
						</div>
					)}
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							fontSize: 16,
							fontWeight: 700,
							paddingTop: 10,
							borderTop: "1px solid var(--color-line)",
						}}
					>
						<span style={{ color: "var(--color-ink-0)" }}>Total earnings</span>
						<span style={{ color: accent.chip }} className="mono">
							{CAMPAIGN.currency}{fmt(Math.round(total))}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── ExamplesBlock (Past winners) ───────────────────────────────────────────
function ExamplesBlock() {
	return (
		<div style={{ marginBottom: 48 }}>
			<h2
				style={{
					fontFamily: "'Geist', system-ui, sans-serif",
					fontSize: 22,
					fontWeight: 700,
					letterSpacing: "-0.02em",
					margin: "0 0 18px",
				}}
			>
				Past winners
			</h2>
			<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
				{EXAMPLES.map((ex, i) => (
					<div
						key={i}
						style={{
							position: "relative",
							height: 200,
							borderRadius: 14,
							background: `linear-gradient(160deg, ${ex.from}22, ${ex.to}22)`,
							border: "1px solid var(--color-line)",
							overflow: "hidden",
							display: "flex",
							flexDirection: "column",
							justifyContent: "flex-end",
							padding: 16,
						}}
					>
						{/* Play overlay */}
						<div
							style={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								width: 44,
								height: 44,
								borderRadius: "50%",
								background: "rgba(0,0,0,0.5)",
								backdropFilter: "blur(8px)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "#fff",
							}}
						>
							<PlayIcon />
						</div>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
							<span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--color-ink-0)" }}>
								{ex.handle}
							</span>
							<span style={{ fontSize: 11, color: "var(--color-ink-2)" }}>{ex.views}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// ─── FaqBlock ───────────────────────────────────────────────────────────────
function FaqBlock() {
	const CAMPAIGN = useCampaign();
	const [open, setOpen] = useState(0);
	const accent = ACCENT_MAP[CAMPAIGN.color] ?? ACCENT_MAP["lime"];

	return (
		<div style={{ marginBottom: 48 }}>
			<h2
				style={{
					fontFamily: "'Geist', system-ui, sans-serif",
					fontSize: 22,
					fontWeight: 700,
					letterSpacing: "-0.02em",
					margin: "0 0 18px",
				}}
			>
				Frequently asked questions
			</h2>
			<div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
				{FAQS.map((f, i) => {
					const isOpen = open === i;
					return (
						<div
							key={i}
							style={{
								background: isOpen ? "var(--color-glass)" : "transparent",
								border: `1px solid ${isOpen ? "var(--color-line-2)" : "var(--color-line)"}`,
								borderRadius: 10,
								overflow: "hidden",
								transition: "background 0.2s",
							}}
						>
							<button
								onClick={() => setOpen(isOpen ? -1 : i)}
								style={{
									width: "100%",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									padding: "14px 16px",
									fontSize: 13.5,
									fontWeight: isOpen ? 600 : 500,
									color: isOpen ? "var(--color-ink-0)" : "var(--color-ink-1)",
									background: "none",
									border: "none",
									cursor: "pointer",
									textAlign: "left",
								}}
							>
								{f.q}
								<PlusIcon
									style={{
										flexShrink: 0,
										color: isOpen ? accent.chip : "var(--color-ink-3)",
										transform: isOpen ? "rotate(45deg)" : "none",
										transition: "transform 0.2s",
									}}
								/>
							</button>
							{isOpen && (
								<div
									style={{
										padding: "0 16px 14px",
										fontSize: 13,
										lineHeight: 1.65,
										color: "var(--color-ink-2)",
									}}
								>
									{f.a}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

// ─── MatchCard (aside) ──────────────────────────────────────────────────────
function MatchCard() {
	const CAMPAIGN = useCampaign();
	const accent = ACCENT_MAP[CAMPAIGN.color] ?? ACCENT_MAP["lime"];
	const score = 92;
	const circumference = 2 * Math.PI * 42;
	const offset = circumference * (1 - score / 100);

	const bullets: { ok: boolean; text: string }[] = [
		{ ok: true, text: "Platform match \u2014 you\u2019re active on Instagram" },
		{ ok: true, text: "Category overlap \u2014 Tech is in your top 3" },
		{ ok: true, text: "Audience fit \u2014 18\u201334 demographic aligns" },
		{ ok: false, text: "Engagement rate \u2014 slightly below campaign avg." },
	];

	return (
		<div
			style={{
				background: "var(--color-glass)",
				border: "1px solid var(--color-line)",
				borderRadius: 14,
				padding: 22,
				marginBottom: 16,
			}}
		>
			<div
				style={{
					fontSize: 11,
					fontWeight: 600,
					textTransform: "uppercase",
					letterSpacing: "0.06em",
					color: "var(--color-ink-2)",
					marginBottom: 16,
				}}
			>
				Your match score
			</div>

			{/* Donut */}
			<div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
				<div style={{ position: "relative", width: 96, height: 96 }}>
					<svg width="96" height="96" viewBox="0 0 96 96">
						<circle
							cx="48"
							cy="48"
							r="42"
							fill="none"
							stroke="rgba(255,255,255,0.06)"
							strokeWidth="6"
						/>
						<circle
							cx="48"
							cy="48"
							r="42"
							fill="none"
							stroke={accent.chip}
							strokeWidth="6"
							strokeLinecap="round"
							strokeDasharray={circumference}
							strokeDashoffset={offset}
							transform="rotate(-90 48 48)"
							style={{ transition: "stroke-dashoffset 0.6s ease" }}
						/>
					</svg>
					<div
						style={{
							position: "absolute",
							inset: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
						}}
					>
						<span
							style={{
								fontSize: 24,
								fontWeight: 800,
								color: accent.chip,
								lineHeight: 1,
							}}
							className="mono"
						>
							{score}%
						</span>
					</div>
				</div>
			</div>

			{/* Bullets */}
			<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
				{bullets.map((b, i) => (
					<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, lineHeight: 1.5 }}>
						<div
							style={{
								width: 18,
								height: 18,
								borderRadius: 5,
								background: b.ok ? "rgba(190,242,100,0.12)" : "rgba(251,113,133,0.1)",
								color: b.ok ? "#bef264" : "#fb7185",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
								marginTop: 1,
							}}
						>
							{b.ok ? (
								<CheckIcon style={{ width: 10, height: 10 }} />
							) : (
								<CloseIcon style={{ width: 9, height: 9 }} />
							)}
						</div>
						<span style={{ color: "var(--color-ink-1)" }}>{b.text}</span>
					</div>
				))}
			</div>
		</div>
	);
}

// ─── ActivityCard (aside) ───────────────────────────────────────────────────
function ActivityCard() {
	return (
		<div
			style={{
				background: "var(--color-glass)",
				border: "1px solid var(--color-line)",
				borderRadius: 14,
				padding: 22,
				marginBottom: 16,
			}}
		>
			<div
				style={{
					fontSize: 11,
					fontWeight: 600,
					textTransform: "uppercase",
					letterSpacing: "0.06em",
					color: "var(--color-ink-2)",
					marginBottom: 14,
				}}
			>
				Recent activity
			</div>
			<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
				{ACTIVITY.map((a, i) => (
					<div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
						<div
							style={{
								width: 26,
								height: 26,
								borderRadius: "50%",
								background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 8,
								fontWeight: 700,
								color: "#fff",
								flexShrink: 0,
							}}
						>
							{a.initials}
						</div>
						<div style={{ flex: 1, minWidth: 0 }}>
							<span style={{ fontSize: 12.5, color: "var(--color-ink-0)", fontWeight: 500 }}>
								{a.who}
							</span>{" "}
							<span style={{ fontSize: 12.5, color: "var(--color-ink-2)" }}>{a.what}</span>
						</div>
						<span style={{ fontSize: 11, color: "var(--color-ink-3)", flexShrink: 0 }}>
							{a.time}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

// ─── AboutBrandCard (aside) ─────────────────────────────────────────────────
function AboutBrandCard() {
	const CAMPAIGN = useCampaign();
	const brandColors = BRAND_COLORS[CAMPAIGN.brand] ?? ["#d4d4d4", "#1a1a1a"];

	const stats = [
		{ label: "Followers", value: CAMPAIGN.brandFollowers },
		{ label: "Rating", value: CAMPAIGN.brandRating },
		{ label: "Paid out", value: CAMPAIGN.brandPaidOut },
		{ label: "Replies in", value: CAMPAIGN.brandResponseTime },
	];

	return (
		<div
			style={{
				background: "var(--color-glass)",
				border: "1px solid var(--color-line)",
				borderRadius: 14,
				padding: 22,
				marginBottom: 16,
			}}
		>
			<div
				style={{
					fontSize: 11,
					fontWeight: 600,
					textTransform: "uppercase",
					letterSpacing: "0.06em",
					color: "var(--color-ink-2)",
					marginBottom: 14,
				}}
			>
				About the brand
			</div>

			{/* Brand mark + name */}
			<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
				<div
					style={{
						width: 36,
						height: 36,
						borderRadius: 9,
						background: brandColors[1],
						color: brandColors[0],
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 12,
						fontWeight: 700,
						flexShrink: 0,
					}}
				>
					{initials(CAMPAIGN.brand)}
				</div>
				<div>
					<div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--color-ink-0)" }}>
						{CAMPAIGN.brand}
					</div>
					<div style={{ fontSize: 11.5, color: "var(--color-ink-2)" }}>{CAMPAIGN.brandHandle}</div>
				</div>
			</div>

			{/* Stats grid */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: 8,
					marginBottom: 14,
				}}
			>
				{stats.map((s) => (
					<div
						key={s.label}
						style={{
							background: "rgba(255,255,255,0.03)",
							border: "1px solid var(--color-line)",
							borderRadius: 8,
							padding: "8px 10px",
						}}
					>
						<div style={{ fontSize: 10, color: "var(--color-ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>
							{s.label}
						</div>
						<div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink-0)" }} className="mono">
							{s.value}
						</div>
					</div>
				))}
			</div>

			{/* Bio */}
			<p style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--color-ink-2)", margin: 0 }}>
				{CAMPAIGN.brandBio}
			</p>
		</div>
	);
}

// ─── SimilarSection ─────────────────────────────────────────────────────────
function SimilarSection() {
	return (
		<div style={{ marginTop: 48, marginBottom: 64 }}>
			<h2
				style={{
					fontFamily: "'Geist', system-ui, sans-serif",
					fontSize: 22,
					fontWeight: 700,
					letterSpacing: "-0.02em",
					margin: "0 0 18px",
				}}
			>
				Similar campaigns
			</h2>
			<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
				{SIMILAR.map((s) => {
					const ac = ACCENT_MAP[s.color] ?? ACCENT_MAP["lime"];
					const bc = BRAND_COLORS[s.brand] ?? ["#d4d4d4", "#1a1a1a"];
					return (
						<Link
							key={s.id}
							href={`/campaign/${s.id}`}
							style={{ textDecoration: "none", color: "inherit" }}
						>
							<div
								style={{
									background: `linear-gradient(160deg, ${ac.from}, var(--color-bg-2) 60%)`,
									border: "1px solid var(--color-line)",
									borderRadius: 14,
									padding: 20,
									transition: "border-color 0.15s",
									cursor: "pointer",
								}}
							>
								{/* Brand row */}
								<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
									<div
										style={{
											width: 32,
											height: 32,
											borderRadius: 8,
											background: bc[1],
											color: bc[0],
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontSize: 11,
											fontWeight: 700,
											flexShrink: 0,
										}}
									>
										{initials(s.brand)}
									</div>
									<div>
										<div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink-0)" }}>
											{s.brand}
										</div>
										<div style={{ fontSize: 11, color: "var(--color-ink-2)" }}>{s.brandHandle}</div>
									</div>
									<div
										style={{
											marginLeft: "auto",
											display: "inline-flex",
											alignItems: "center",
											gap: 4,
											fontSize: 10.5,
											color: "var(--color-ink-1)",
											background: "var(--color-glass)",
											border: "1px solid var(--color-line)",
											borderRadius: 16,
											padding: "3px 8px",
										}}
									>
										<PlatformIcon name={s.platform} />
										{s.platform}
									</div>
								</div>

								{/* Title */}
								<div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink-0)", marginBottom: 14, lineHeight: 1.4 }}>
									{s.title}
								</div>

								{/* Meta row */}
								<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--color-ink-2)" }}>
									<span>
										<strong style={{ color: ac.chip }} className="mono">
											{s.currency}{s.rate}
										</strong>{" "}
										/ {s.perViews} views
									</span>
									<span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
										<ClockIcon />
										{s.deadline}
									</span>
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}

// ─── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
	return (
		<footer
			style={{
				borderTop: "1px solid var(--color-line)",
				padding: "32px 0",
			}}
		>
			<div className="shell">
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						fontSize: 12.5,
						color: "var(--color-ink-3)",
					}}
				>
					<span>&copy; 2026 inflio. All rights reserved.</span>
					<div style={{ display: "flex", gap: 20 }}>
						<Link href="/terms" style={{ color: "inherit", textDecoration: "none" }}>
							Terms
						</Link>
						<Link href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>
							Privacy
						</Link>
						<Link href="/help" style={{ color: "inherit", textDecoration: "none" }}>
							Help
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

// ─── ApplyModal ─────────────────────────────────────────────────────────────
function ApplyModal({ onClose }: { onClose: () => void }) {
	const CAMPAIGN = useCampaign();
	const accent = ACCENT_MAP[CAMPAIGN.color] ?? ACCENT_MAP["lime"];
	const [step, setStep] = useState(0);
	const [selectedPlatform, setSelectedPlatform] = useState(0);
	const [pitch, setPitch] = useState("");
	const [exampleUrl, setExampleUrl] = useState("");
	const [checkGuidelines, setCheckGuidelines] = useState(false);
	const [checkDeadline, setCheckDeadline] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [onClose]);

	const canNext =
		step === 0
			? true
			: step === 1
				? pitch.length >= 20
				: step === 2
					? checkGuidelines && checkDeadline
					: false;

	function handleNext() {
		if (step < 2) {
			setStep(step + 1);
		} else {
			setSubmitted(true);
		}
	}

	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 100,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{/* Backdrop */}
			<div
				onClick={onClose}
				style={{
					position: "absolute",
					inset: 0,
					background: "rgba(0,0,0,0.65)",
					backdropFilter: "blur(6px)",
				}}
			/>

			{/* Modal */}
			<div
				style={{
					position: "relative",
					width: 480,
					maxHeight: "90vh",
					overflowY: "auto",
					background: "var(--color-bg-1)",
					border: "1px solid var(--color-line-2)",
					borderRadius: 16,
					padding: 32,
				}}
			>
				{/* Close */}
				<button
					onClick={onClose}
					style={{
						position: "absolute",
						top: 16,
						right: 16,
						width: 30,
						height: 30,
						borderRadius: 8,
						border: "1px solid var(--color-line)",
						background: "transparent",
						color: "var(--color-ink-2)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "pointer",
					}}
					aria-label="Close"
				>
					<CloseIcon />
				</button>

				{submitted ? (
					/* Success state */
					<div style={{ textAlign: "center", padding: "16px 0" }}>
						<div
							style={{
								width: 56,
								height: 56,
								borderRadius: "50%",
								background: accent.from,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								margin: "0 auto 16px",
							}}
						>
							<CheckBigIcon style={{ color: accent.chip }} />
						</div>
						<h3
							style={{
								fontFamily: "'Geist', system-ui, sans-serif",
								fontSize: 20,
								fontWeight: 700,
								margin: "0 0 8px",
							}}
						>
							Application sent!
						</h3>
						<p style={{ fontSize: 13.5, color: "var(--color-ink-2)", margin: "0 0 20px", lineHeight: 1.6 }}>
							You&apos;re #{CAMPAIGN.creatorsJoined + 1} in the queue. Avg. review time is {CAMPAIGN.brandResponseTime}.
						</p>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gap: 8,
								marginBottom: 20,
							}}
						>
							<div
								style={{
									background: "var(--color-glass)",
									border: "1px solid var(--color-line)",
									borderRadius: 8,
									padding: "10px 8px",
									textAlign: "center",
								}}
							>
								<div style={{ fontSize: 10, color: "var(--color-ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>
									Platform
								</div>
								<div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--color-ink-0)" }}>
									{PLATFORM_OPTS[selectedPlatform].name}
								</div>
							</div>
							<div
								style={{
									background: "var(--color-glass)",
									border: "1px solid var(--color-line)",
									borderRadius: 8,
									padding: "10px 8px",
									textAlign: "center",
								}}
							>
								<div style={{ fontSize: 10, color: "var(--color-ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>
									CPM rate
								</div>
								<div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--color-ink-0)" }}>
									{CAMPAIGN.currency}{CAMPAIGN.rate}/{CAMPAIGN.perViews}
								</div>
							</div>
							<div
								style={{
									background: "var(--color-glass)",
									border: "1px solid var(--color-line)",
									borderRadius: 8,
									padding: "10px 8px",
									textAlign: "center",
								}}
							>
								<div style={{ fontSize: 10, color: "var(--color-ink-3)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>
									Deadline
								</div>
								<div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--color-ink-0)" }}>
									{CAMPAIGN.deadline}
								</div>
							</div>
						</div>
						<button
							onClick={onClose}
							style={{
								width: "100%",
								padding: "12px 0",
								borderRadius: 10,
								border: "none",
								background: `linear-gradient(135deg, ${accent.chip}, ${accent.text})`,
								color: "#0a0a0c",
								fontSize: 13.5,
								fontWeight: 700,
								cursor: "pointer",
							}}
						>
							Done
						</button>
					</div>
				) : (
					/* Step-based form */
					<>
						{/* Header */}
						<div style={{ marginBottom: 24 }}>
							<div style={{ fontSize: 11, color: "var(--color-ink-3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
								Step {step + 1} of 3
							</div>
							<h3
								style={{
									fontFamily: "'Geist', system-ui, sans-serif",
									fontSize: 20,
									fontWeight: 700,
									margin: 0,
								}}
							>
								{step === 0
									? "Select your platform"
									: step === 1
										? "Write your pitch"
										: "Confirm & apply"}
							</h3>
						</div>

						{/* Step 0: Platform picker */}
						{step === 0 && (
							<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
								{PLATFORM_OPTS.map((p, i) => {
									const selected = selectedPlatform === i;
									const Icon = p.name === "Instagram" ? IGIcon : p.name === "YouTube" ? YTIcon : TTIcon;
									return (
										<button
											key={p.name}
											onClick={() => setSelectedPlatform(i)}
											style={{
												display: "flex",
												alignItems: "center",
												gap: 12,
												padding: "14px 16px",
												borderRadius: 10,
												border: `1.5px solid ${selected ? accent.chip : "var(--color-line)"}`,
												background: selected ? accent.from : "var(--color-glass)",
												cursor: "pointer",
												textAlign: "left",
												transition: "all 0.15s",
											}}
										>
											<div
												style={{
													width: 34,
													height: 34,
													borderRadius: 8,
													background: "rgba(255,255,255,0.06)",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													color: selected ? accent.chip : "var(--color-ink-1)",
												}}
											>
												<Icon />
											</div>
											<div style={{ flex: 1 }}>
												<div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--color-ink-0)" }}>
													{p.name}
												</div>
												<div style={{ fontSize: 11.5, color: "var(--color-ink-2)" }}>
													{p.handle} &middot; {p.followers}
												</div>
											</div>
											<div
												style={{
													width: 18,
													height: 18,
													borderRadius: "50%",
													border: `2px solid ${selected ? accent.chip : "var(--color-ink-3)"}`,
													background: selected ? accent.chip : "transparent",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												{selected && (
													<CheckIcon style={{ width: 10, height: 10, color: "#0a0a0c" }} />
												)}
											</div>
										</button>
									);
								})}
							</div>
						)}

						{/* Step 1: Pitch */}
						{step === 1 && (
							<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
								<div>
									<label style={{ fontSize: 12.5, color: "var(--color-ink-1)", display: "block", marginBottom: 6 }}>
										Your pitch <span style={{ color: "var(--color-ink-3)" }}>(min 20 characters)</span>
									</label>
									<textarea
										value={pitch}
										onChange={(e) => setPitch(e.target.value)}
										placeholder="Tell the brand why you'd be a great fit for this campaign..."
										rows={4}
										style={{
											width: "100%",
											padding: "12px 14px",
											borderRadius: 10,
											border: "1px solid var(--color-line-2)",
											background: "var(--color-bg-2)",
											color: "var(--color-ink-0)",
											fontSize: 13.5,
											fontFamily: "inherit",
											resize: "vertical",
											outline: "none",
											lineHeight: 1.5,
										}}
									/>
									<div
										style={{
											fontSize: 11,
											color: pitch.length >= 20 ? accent.chip : "var(--color-ink-3)",
											marginTop: 4,
											textAlign: "right",
										}}
									>
										{pitch.length}/20
									</div>
								</div>
								<div>
									<label style={{ fontSize: 12.5, color: "var(--color-ink-1)", display: "block", marginBottom: 6 }}>
										Example post URL <span style={{ color: "var(--color-ink-3)" }}>(optional)</span>
									</label>
									<input
										type="url"
										value={exampleUrl}
										onChange={(e) => setExampleUrl(e.target.value)}
										placeholder="https://instagram.com/p/..."
										style={{
											width: "100%",
											padding: "10px 14px",
											borderRadius: 10,
											border: "1px solid var(--color-line-2)",
											background: "var(--color-bg-2)",
											color: "var(--color-ink-0)",
											fontSize: 13.5,
											fontFamily: "inherit",
											outline: "none",
										}}
									/>
								</div>
							</div>
						)}

						{/* Step 2: Confirm */}
						{step === 2 && (
							<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
								<label
									style={{
										display: "flex",
										alignItems: "flex-start",
										gap: 10,
										padding: "12px 14px",
										borderRadius: 10,
										border: `1px solid ${checkGuidelines ? accent.chip + "44" : "var(--color-line)"}`,
										background: checkGuidelines ? accent.from : "var(--color-glass)",
										cursor: "pointer",
										fontSize: 13,
										lineHeight: 1.5,
										color: "var(--color-ink-1)",
										transition: "all 0.15s",
									}}
								>
									<input
										type="checkbox"
										checked={checkGuidelines}
										onChange={(e) => setCheckGuidelines(e.target.checked)}
										style={{ display: "none" }}
									/>
									<div
										style={{
											width: 20,
											height: 20,
											borderRadius: 6,
											border: `1.5px solid ${checkGuidelines ? accent.chip : "var(--color-ink-3)"}`,
											background: checkGuidelines ? accent.chip : "transparent",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexShrink: 0,
											marginTop: 1,
										}}
									>
										{checkGuidelines && (
											<CheckIcon style={{ width: 11, height: 11, color: "#0a0a0c" }} />
										)}
									</div>
									I&apos;ve read the campaign guidelines and will include #ad and #lumenpro2 in my post.
								</label>
								<label
									style={{
										display: "flex",
										alignItems: "flex-start",
										gap: 10,
										padding: "12px 14px",
										borderRadius: 10,
										border: `1px solid ${checkDeadline ? accent.chip + "44" : "var(--color-line)"}`,
										background: checkDeadline ? accent.from : "var(--color-glass)",
										cursor: "pointer",
										fontSize: 13,
										lineHeight: 1.5,
										color: "var(--color-ink-1)",
										transition: "all 0.15s",
									}}
								>
									<input
										type="checkbox"
										checked={checkDeadline}
										onChange={(e) => setCheckDeadline(e.target.checked)}
										style={{ display: "none" }}
									/>
									<div
										style={{
											width: 20,
											height: 20,
											borderRadius: 6,
											border: `1.5px solid ${checkDeadline ? accent.chip : "var(--color-ink-3)"}`,
											background: checkDeadline ? accent.chip : "transparent",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexShrink: 0,
											marginTop: 1,
										}}
									>
										{checkDeadline && (
											<CheckIcon style={{ width: 11, height: 11, color: "#0a0a0c" }} />
										)}
									</div>
									I understand the deadline is {CAMPAIGN.deadline} and the post must stay live for 30 days.
								</label>
							</div>
						)}

						{/* Navigation */}
						<div style={{ display: "flex", gap: 10, marginTop: 24 }}>
							{step > 0 && (
								<button
									onClick={() => setStep(step - 1)}
									style={{
										flex: 1,
										padding: "12px 0",
										borderRadius: 10,
										border: "1px solid var(--color-line-2)",
										background: "transparent",
										color: "var(--color-ink-1)",
										fontSize: 13.5,
										fontWeight: 600,
										cursor: "pointer",
									}}
								>
									Back
								</button>
							)}
							<button
								onClick={handleNext}
								disabled={!canNext}
								style={{
									flex: 1,
									padding: "12px 0",
									borderRadius: 10,
									border: "none",
									background: canNext
										? `linear-gradient(135deg, ${accent.chip}, ${accent.text})`
										: "rgba(255,255,255,0.06)",
									color: canNext ? "#0a0a0c" : "var(--color-ink-3)",
									fontSize: 13.5,
									fontWeight: 700,
									cursor: canNext ? "pointer" : "not-allowed",
									transition: "all 0.15s",
								}}
							>
								{step === 2 ? "Submit application" : "Continue"}
							</button>
						</div>

						{/* Step dots */}
						<div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
							{[0, 1, 2].map((s) => (
								<div
									key={s}
									style={{
										width: s === step ? 20 : 6,
										height: 6,
										borderRadius: 3,
										background: s === step ? accent.chip : "rgba(255,255,255,0.1)",
										transition: "all 0.2s",
									}}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function CampaignDetailPage() {
	const params = useParams();
	const id = Number(params.id);
	const campaign = getCampaign(id);

	const [activeTab, setActiveTab] = useState(0);
	const [showModal, setShowModal] = useState(false);

	const tabContent = [
		<BriefBlock key="brief" />,
		<DeliverablesBlock key="deliverables" />,
		<TimelineBlock key="timeline" />,
		<EarningsCalc key="earnings" />,
		<ExamplesBlock key="examples" />,
		<FaqBlock key="faq" />,
	];

	return (
		<CampaignContext.Provider value={campaign}>
			<div className="app">
				<div className="ambient" />
				<div className="grain" />

				<Nav />

				<div className="shell">
					<Crumb />
					<CampaignHero onApply={() => setShowModal(true)} />

					<Tabs active={activeTab} onChange={setActiveTab} />

					{/* Two-column: content + sidebar */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 340px",
							gap: 32,
							alignItems: "start",
						}}
					>
						{/* Main content */}
						<div>{tabContent[activeTab]}</div>

						{/* Sidebar */}
						<aside>
							<MatchCard />
							<ActivityCard />
							<AboutBrandCard />
						</aside>
					</div>

					<SimilarSection />
				</div>

				<Footer />

				{showModal && <ApplyModal onClose={() => setShowModal(false)} />}
			</div>
		</CampaignContext.Provider>
	);
}
