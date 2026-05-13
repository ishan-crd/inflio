"use client";

import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
	createContext,
	type SVGProps,
	useContext,
	useEffect,
	useState,
} from "react";
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
import { Nav as SharedNav } from "@/components/nav";
import { fmtFollowers, fmtViews } from "@/data/constants";
import { useSession } from "@/lib/auth-client";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

/* ─── Local icons ──────────────────────────────────────────────────────────── */
type P = SVGProps<SVGSVGElement>;

function HeartIcon(p: P) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M7 12S1.5 8.5 1.5 5a2.5 2.5 0 015 0h1a2.5 2.5 0 015 0C12.5 8.5 7 12 7 12z" />
		</svg>
	);
}

function ShareIcon(p: P) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<circle cx="10.5" cy="2.5" r="1.5" />
			<circle cx="3.5" cy="7" r="1.5" />
			<circle cx="10.5" cy="11.5" r="1.5" />
			<path d="M5 8l4 2.5M5 6l4-2.5" />
		</svg>
	);
}

function FlagIcon(p: P) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M2.5 1.5v11M2.5 1.5h8l-2 3 2 3h-8" />
		</svg>
	);
}

function PlayIcon(p: P) {
	return (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" {...p}>
			<path d="M4 2.5l7.5 4.5L4 11.5V2.5z" />
		</svg>
	);
}

function ClockIcon(p: P) {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<circle cx="7" cy="7" r="5.5" />
			<path d="M7 4v3.5l2.5 1.5" />
		</svg>
	);
}

function SparkIcon(p: P) {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M7 1v3M7 10v3M1 7h3M10 7h3M3 3l2 2M9 9l2 2M3 11l2-2M9 5l2-2" />
		</svg>
	);
}

function FileIcon(p: P) {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M8 1H4a1.5 1.5 0 00-1.5 1.5v9A1.5 1.5 0 004 13h6a1.5 1.5 0 001.5-1.5V4.5L8 1z" />
			<path d="M8 1v3.5h3.5M5 7.5h4M5 10h2.5" />
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
			strokeWidth="1.8"
			strokeLinecap="round"
			{...p}
		>
			<path d="M3 3l8 8M11 3l-8 8" />
		</svg>
	);
}

function PinIconC(p: P) {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M7 1.5a4 4 0 014 4c0 3-4 6.5-4 6.5S3 8.5 3 5.5a4 4 0 014-4z" />
			<circle cx="7" cy="5.5" r="1.4" />
		</svg>
	);
}

/* ─── helpers ──────────────────────────────────────────────────────────────── */
const initials = (s: string) =>
	s
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

/* ─── SparkChart ───────────────────────────────────────────────────────────── */
function SparkChart({ data }: { data: number[] }) {
	const w = 220,
		h = 56,
		max = Math.max(...data),
		min = Math.min(...data);
	const pts = data
		.map((v, i) => {
			const x = (i / (data.length - 1)) * w;
			const y = h - ((v - min) / (max - min || 1)) * (h - 6) - 3;
			return `${x},${y}`;
		})
		.join(" ");
	return (
		<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
			<defs>
				<linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor="rgba(190,242,100,0.45)" />
					<stop offset="100%" stopColor="rgba(190,242,100,0)" />
				</linearGradient>
			</defs>
			<polyline
				points={`0,${h} ${pts} ${w},${h}`}
				fill="url(#sg)"
				stroke="none"
			/>
			<polyline
				points={pts}
				fill="none"
				stroke="#bef264"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const ACCENT_MAP_C: Record<
	string,
	{ from: string; to: string; chip: string; text: string }
> = {
	amber: {
		from: "rgba(251, 191, 36, 0.22)",
		to: "rgba(251, 191, 36, 0.04)",
		chip: "#fbbf24",
		text: "#fde68a",
	},
	lime: {
		from: "rgba(190, 242, 100, 0.22)",
		to: "rgba(190, 242, 100, 0.04)",
		chip: "#bef264",
		text: "#d9f99d",
	},
	violet: {
		from: "rgba(167, 139, 250, 0.22)",
		to: "rgba(167, 139, 250, 0.04)",
		chip: "#a78bfa",
		text: "#ddd6fe",
	},
	rose: {
		from: "rgba(251, 113, 133, 0.22)",
		to: "rgba(251, 113, 133, 0.04)",
		chip: "#fb7185",
		text: "#fecdd3",
	},
	sky: {
		from: "rgba(125, 211, 252, 0.22)",
		to: "rgba(125, 211, 252, 0.04)",
		chip: "#7dd3fc",
		text: "#bae6fd",
	},
};

/* ─── Creator Context ──────────────────────────────────────────────────────── */
type CreatorData = {
	_id: string;
	name: string;
	handle: string;
	avatarColor: [string, string];
	location: string;
	bio: string;
	primaryPlatform: string;
	followers: number;
	monthlyViews: number;
	engagement: number;
	avgRate: number;
	category: string;
	tags: string[];
	completedDeals: number;
	trending: boolean;
	tier: string;
	verified: boolean;
	spark: number[];
	// Detail fields:
	longBio: string[];
	timezone: string;
	responseTime: string;
	rating: number;
	ratingCount: number;
	available: boolean;
	exclusive: boolean;
	color: string;
	ratePer: string;
	currency: string;
	followersFmt: string;
	monthlyViewsFmt: string;
	audience: {
		genderF: number;
		genderM: number;
		ageBuckets: { label: string; pct: number }[];
		topGeo: { city: string; pct: number }[];
		interests: string[];
	};
	rates: { kind: string; ig: string; yt: string; tt: string }[];
	platforms: {
		name: string;
		handle: string;
		followers: string;
		growth: string;
		primary: boolean;
	}[];
};

const CreatorCtx = createContext<CreatorData>(null as any);
const useCreator = () => useContext(CreatorCtx);

const PAST_BRANDS = [
	{
		name: "Northform",
		color: ["#ddd6fe", "#1e1b4b"] as [string, string],
		deals: 4,
		last: "Apr",
	},
	{
		name: "Petal & Press",
		color: ["#fecdd3", "#4c0519"] as [string, string],
		deals: 2,
		last: "Mar",
	},
	{
		name: "Halfmoon Kitchen",
		color: ["#fde68a", "#422006"] as [string, string],
		deals: 1,
		last: "Feb",
	},
	{
		name: "Soko Stationery",
		color: ["#e9d5ff", "#2e1065"] as [string, string],
		deals: 3,
		last: "Feb",
	},
	{
		name: "Atlas Outdoors",
		color: ["#a7f3d0", "#022c22"] as [string, string],
		deals: 2,
		last: "Jan",
	},
	{
		name: "Kavi Coffee Co.",
		color: ["#fed7aa", "#431407"] as [string, string],
		deals: 1,
		last: "Dec",
	},
];

const RECENT_POSTS = [
	{
		from: "#fde68a",
		to: "#7c2d12",
		views: "412k",
		likes: "38k",
		caption: "soft studio fits · ss26 prep",
		date: "3d",
	},
	{
		from: "#fed7aa",
		to: "#431407",
		views: "284k",
		likes: "21k",
		caption: "morning walks in lighter denim",
		date: "1w",
	},
	{
		from: "#fecdd3",
		to: "#4c0519",
		views: "612k",
		likes: "54k",
		caption: "petal & press · spring drop",
		date: "2w",
	},
	{
		from: "#ddd6fe",
		to: "#1e1b4b",
		views: "188k",
		likes: "14k",
		caption: "northform editorial b-roll",
		date: "3w",
	},
	{
		from: "#bef264",
		to: "#1a2e05",
		views: "92k",
		likes: "8.4k",
		caption: "lazy sunday try-on",
		date: "1mo",
	},
	{
		from: "#a7f3d0",
		to: "#022c22",
		views: "324k",
		likes: "27k",
		caption: "atlas x1 — first look",
		date: "1mo",
	},
];

const REVIEWS = [
	{
		brand: "Northform",
		rating: 5,
		when: "Apr 2026",
		body: "Aanya is one of those rare creators who reads the brief once and gets it. Three reels, all on time, all on tone. Her grade is unmistakable — softer and warmer than anything we'd briefed, but better than what we'd asked for.",
		color: ["#ddd6fe", "#1e1b4b"] as [string, string],
	},
	{
		brand: "Petal & Press",
		rating: 5,
		when: "Mar 2026",
		body: "Sold out the spring drop in 6 hours after her reel went live. She iterates quickly on draft notes and never makes you feel like you're nagging. Will book again.",
		color: ["#fecdd3", "#4c0519"] as [string, string],
	},
	{
		brand: "Halfmoon Kitchen",
		rating: 4,
		when: "Feb 2026",
		body: "Lovely visual sensibility. Slightly slower turnaround than promised on the last deliverable but kept us in the loop. End result was strong.",
		color: ["#fde68a", "#422006"] as [string, string],
	},
];

const CAMPAIGN_OPTS = [
	{
		id: 1,
		name: "Lumen Pro 2 reels",
		brand: "Lumen Audio",
		rate: "₹240/1k",
		platform: "Instagram",
		color: ["#fde68a", "#451a03"] as [string, string],
	},
	{
		id: 2,
		name: "Spring SS26 lookbook",
		brand: "Northform",
		rate: "₹420/1k",
		platform: "YouTube",
		color: ["#ddd6fe", "#1e1b4b"] as [string, string],
	},
	{
		id: 3,
		name: "Petal & Press · drop 04",
		brand: "Petal & Press",
		rate: "₹260/1k",
		platform: "Instagram",
		color: ["#fecdd3", "#4c0519"] as [string, string],
	},
];

const DELIVS = [
	{ id: "reel", label: "1× Reel", help: "30–60s, IG primary" },
	{ id: "story", label: "3× Story frames", help: "Same day as reel" },
	{ id: "post", label: "1× Static post", help: "Optional crosspost" },
];

/* ─── Styles (inline object) ───────────────────────────────────────────────── */
const S: Record<string, React.CSSProperties> = {
	/* page */
	page: {
		position: "relative",
		zIndex: 2,
		minHeight: "100vh",
	},
	shell: {
		maxWidth: 1320,
		margin: "0 auto",
		padding: "0 32px",
	},

	/* crumb */
	crumb: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "18px 0",
		borderBottom: "1px solid var(--color-line)",
		fontSize: 13,
		color: "var(--color-ink-2)",
	},
	crumbLeft: {
		display: "flex",
		alignItems: "center",
		gap: 8,
	},
	crumbLink: {
		color: "var(--color-ink-2)",
		textDecoration: "none",
		transition: "color .18s",
	},
	crumbSep: {
		opacity: 0.4,
	},
	crumbCurrent: {
		color: "var(--color-ink-0)",
		fontWeight: 500,
	},
	crumbRight: {
		display: "flex",
		gap: 6,
	},
	crumbBtn: {
		width: 32,
		height: 32,
		borderRadius: 8,
		background: "rgba(255,255,255,0.03)",
		border: "1px solid var(--color-line)",
		display: "grid",
		placeItems: "center",
		color: "var(--color-ink-2)",
		cursor: "pointer",
		transition: "all .18s",
	},

	/* hero grid */
	heroGrid: {
		display: "grid",
		gridTemplateColumns: "1.55fr 1fr",
		gap: 28,
		padding: "40px 0 0",
	},

	/* left info */
	info: {
		display: "flex",
		flexDirection: "column",
		gap: 22,
	},
	trendFlag: {
		display: "inline-flex",
		alignItems: "center",
		gap: 5,
		fontSize: 9.5,
		textTransform: "uppercase" as const,
		letterSpacing: "0.14em",
		color: "var(--color-accent-strong)",
		background: "rgba(190,242,100,0.1)",
		border: "1px solid rgba(190,242,100,0.25)",
		padding: "4px 9px",
		borderRadius: 999,
		fontWeight: 500,
		alignSelf: "flex-start",
	},
	avatarRow: {
		display: "flex",
		alignItems: "center",
		gap: 18,
	},
	avatarBig: {
		width: 92,
		height: 92,
		borderRadius: 18,
		display: "grid",
		placeItems: "center",
		fontFamily: "'Geist', sans-serif",
		fontWeight: 600,
		fontSize: 28,
		letterSpacing: "-0.02em",
		border: "1px solid var(--color-line-2)",
		position: "relative" as const,
		overflow: "hidden",
	},
	avatarShine: {
		position: "absolute" as const,
		inset: 0,
		background:
			"linear-gradient(135deg, rgba(255,255,255,0.08), transparent 60%)",
	},
	liveDot: {
		position: "absolute" as const,
		bottom: 4,
		right: 4,
		width: 10,
		height: 10,
		borderRadius: "50%",
		background: "#4ade80",
		border: "2px solid var(--color-bg-0)",
	},
	nameRow: {
		display: "flex",
		flexDirection: "column" as const,
		gap: 4,
	},
	name: {
		fontFamily: "'Geist', sans-serif",
		fontSize: 28,
		fontWeight: 500,
		letterSpacing: "-0.025em",
		display: "flex",
		alignItems: "center",
		gap: 8,
	},
	handle: {
		fontSize: 13,
		color: "var(--color-ink-2)",
		fontFamily: "'JetBrains Mono', monospace",
	},
	bio: {
		fontSize: 14.5,
		lineHeight: 1.55,
		color: "var(--color-ink-1)",
		maxWidth: 520,
	},
	metaRow: {
		display: "flex",
		flexWrap: "wrap" as const,
		gap: 10,
		alignItems: "center",
		fontSize: 12.5,
		color: "var(--color-ink-2)",
	},
	metaPill: {
		display: "inline-flex",
		alignItems: "center",
		gap: 5,
		padding: "4px 10px",
		borderRadius: 999,
		background: "rgba(255,255,255,0.04)",
		border: "1px solid var(--color-line)",
	},
	openPill: {
		display: "inline-flex",
		alignItems: "center",
		gap: 6,
		padding: "4px 10px",
		borderRadius: 999,
		background: "rgba(74,222,128,0.1)",
		border: "1px solid rgba(74,222,128,0.25)",
		color: "#4ade80",
		fontSize: 12,
		fontWeight: 500,
	},
	pulseDot: {
		width: 6,
		height: 6,
		borderRadius: "50%",
		background: "#4ade80",
	},
	tagRow: {
		display: "flex",
		gap: 6,
		flexWrap: "wrap" as const,
	},
	tag: {
		fontSize: 11,
		color: "var(--color-ink-2)",
		background: "rgba(255,255,255,0.03)",
		border: "1px solid var(--color-line)",
		padding: "4px 8px",
		borderRadius: 6,
		letterSpacing: "0.01em",
	},
	platformsGrid: {
		display: "grid",
		gridTemplateColumns: "repeat(3, 1fr)",
		gap: 10,
	},
	platformCell: {
		padding: "14px 16px",
		borderRadius: 14,
		background:
			"linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
		border: "1px solid var(--color-line)",
		display: "flex",
		flexDirection: "column" as const,
		gap: 8,
	},
	platformTop: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	platformName: {
		display: "flex",
		alignItems: "center",
		gap: 6,
		fontSize: 12.5,
		fontWeight: 500,
		color: "var(--color-ink-0)",
	},
	primaryBadge: {
		fontSize: 9,
		textTransform: "uppercase" as const,
		letterSpacing: "0.1em",
		color: "var(--color-accent-strong)",
		background: "rgba(190,242,100,0.1)",
		padding: "2px 6px",
		borderRadius: 999,
	},
	platformFollowers: {
		fontFamily: "'Geist', sans-serif",
		fontSize: 20,
		fontWeight: 500,
		letterSpacing: "-0.02em",
		color: "var(--color-ink-0)",
	},
	platformGrowth: {
		fontSize: 11,
		fontFamily: "'JetBrains Mono', monospace",
		color: "var(--color-accent-strong)",
	},
	platformHandle: {
		fontSize: 11,
		color: "var(--color-ink-3)",
		fontFamily: "'JetBrains Mono', monospace",
	},

	/* right stats card */
	statsCard: {
		padding: 28,
		borderRadius: 22,
		background:
			"linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
		border: "1px solid var(--color-line)",
		display: "flex",
		flexDirection: "column" as const,
		gap: 22,
		alignSelf: "flex-start",
		boxShadow:
			"0 1px 0 rgba(255,255,255,0.04) inset, 0 30px 60px -30px rgba(0,0,0,0.6)",
	},
	statsEyebrow: {
		fontSize: 10.5,
		textTransform: "uppercase" as const,
		letterSpacing: "0.12em",
		color: "var(--color-ink-2)",
	},
	statsRate: {
		fontFamily: "'Geist', sans-serif",
		fontSize: 44,
		fontWeight: 500,
		letterSpacing: "-0.03em",
		lineHeight: 1,
		display: "flex",
		alignItems: "baseline",
		gap: 4,
	},
	statsCurrency: {
		fontSize: 24,
		color: "var(--color-ink-1)",
	},
	statsPer: {
		fontFamily: "'Inter', sans-serif",
		fontSize: 14,
		fontWeight: 400,
		color: "var(--color-ink-2)",
		marginLeft: 6,
		letterSpacing: 0,
	},
	statsHelper: {
		fontSize: 12,
		color: "var(--color-ink-3)",
		marginTop: -12,
	},
	statsGrid: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: 1,
		background: "var(--color-line)",
		border: "1px solid var(--color-line)",
		borderRadius: 14,
		overflow: "hidden",
	},
	statsCell: {
		background: "var(--color-bg-1)",
		padding: "16px 18px",
	},
	statsCellNum: {
		fontFamily: "'Geist', sans-serif",
		fontSize: 22,
		fontWeight: 500,
		letterSpacing: "-0.02em",
		color: "var(--color-ink-0)",
		display: "flex",
		alignItems: "baseline",
		gap: 3,
	},
	statsCellUnit: {
		fontSize: 12,
		color: "var(--color-ink-2)",
	},
	statsCellLabel: {
		fontSize: 11.5,
		color: "var(--color-ink-2)",
		marginTop: 2,
	},
	starsRow: {
		display: "flex",
		gap: 2,
		marginTop: 2,
	},
	ctaRow: {
		display: "flex",
		flexDirection: "column" as const,
		gap: 10,
	},
	ctaSecRow: {
		display: "flex",
		gap: 8,
	},
	fineprint: {
		fontSize: 11,
		color: "var(--color-ink-3)",
		textAlign: "center" as const,
	},

	/* tabs */
	tabBar: {
		display: "flex",
		gap: 0,
		borderBottom: "1px solid var(--color-line)",
		margin: "40px 0 0",
		background: "transparent",
	},
	tab: {
		fontSize: 13.5,
		padding: "14px 20px",
		color: "var(--color-ink-2)",
		cursor: "pointer",
		border: "none",
		background: "none",
		position: "relative" as const,
		fontFamily: "inherit",
		fontWeight: 450,
		transition: "color .18s",
	},
	tabActive: {
		color: "var(--color-ink-0)",
	},
	tabLine: {
		position: "absolute" as const,
		left: 0,
		right: 0,
		bottom: -1,
		height: 1,
		background: "var(--color-accent)",
	},

	/* content + sidebar layout */
	contentGrid: {
		display: "grid",
		gridTemplateColumns: "1fr 340px",
		gap: 32,
		padding: "32px 0 80px",
		alignItems: "flex-start",
	},
	main: {
		minWidth: 0,
	},
	aside: {
		display: "flex",
		flexDirection: "column" as const,
		gap: 20,
		position: "sticky" as const,
		top: 100,
	},

	/* about block */
	blockEyebrow: {
		display: "inline-flex",
		alignItems: "center",
		gap: 8,
		fontSize: 11,
		textTransform: "uppercase" as const,
		letterSpacing: "0.14em",
		color: "var(--color-accent-strong)",
		fontFamily: "'JetBrains Mono', monospace",
		marginBottom: 14,
	},
	blockH2: {
		fontFamily: "'Geist', sans-serif",
		fontSize: 24,
		fontWeight: 500,
		letterSpacing: "-0.02em",
		margin: "0 0 18px",
	},
	longBioP: {
		fontSize: 14.5,
		lineHeight: 1.65,
		color: "var(--color-ink-1)",
		margin: "0 0 16px",
	},
	callout: {
		padding: "18px 20px",
		borderRadius: 14,
		background: "rgba(190,242,100,0.06)",
		border: "1px solid rgba(190,242,100,0.18)",
		fontSize: 13,
		lineHeight: 1.55,
		color: "var(--color-ink-1)",
		marginTop: 24,
	},
	calloutStrong: {
		color: "var(--color-accent-strong)",
		fontWeight: 500,
	},

	/* audience block */
	audGrid: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: 16,
	},
	audCard: {
		padding: "20px 22px",
		borderRadius: 16,
		background:
			"linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
		border: "1px solid var(--color-line)",
	},
	audLabel: {
		fontSize: 11,
		textTransform: "uppercase" as const,
		letterSpacing: "0.12em",
		color: "var(--color-ink-3)",
		marginBottom: 14,
	},
	audBarTrack: {
		height: 8,
		borderRadius: 999,
		background: "rgba(255,255,255,0.06)",
		overflow: "hidden",
		display: "flex",
	},
	audBarRow: {
		display: "flex",
		alignItems: "center",
		gap: 10,
		marginBottom: 10,
	},
	audBarLabel: {
		fontSize: 12,
		color: "var(--color-ink-2)",
		width: 56,
		flexShrink: 0,
	},
	audBarFill: {
		height: 6,
		borderRadius: 999,
		background: "var(--color-accent-strong)",
	},
	audBarPct: {
		fontSize: 12,
		fontFamily: "'JetBrains Mono', monospace",
		color: "var(--color-ink-0)",
		width: 36,
		textAlign: "right" as const,
	},
	audInterest: {
		display: "inline-block",
		fontSize: 12,
		color: "var(--color-ink-1)",
		background: "rgba(255,255,255,0.04)",
		border: "1px solid var(--color-line)",
		padding: "5px 10px",
		borderRadius: 8,
		margin: "0 6px 6px 0",
	},

	/* posts block */
	postsGrid: {
		display: "grid",
		gridTemplateColumns: "repeat(3, 1fr)",
		gap: 14,
	},
	postCard: {
		borderRadius: 16,
		overflow: "hidden",
		border: "1px solid var(--color-line)",
		cursor: "pointer",
		transition: "transform .3s ease, border-color .3s",
	},
	postThumb: {
		height: 160,
		display: "flex",
		flexDirection: "column" as const,
		justifyContent: "space-between",
		padding: 14,
		position: "relative" as const,
	},
	postPlay: {
		width: 36,
		height: 36,
		borderRadius: "50%",
		background: "rgba(0,0,0,0.55)",
		backdropFilter: "blur(10px)",
		display: "grid",
		placeItems: "center",
		color: "#fff",
		alignSelf: "center",
		margin: "auto 0",
	},
	postDate: {
		position: "absolute" as const,
		top: 10,
		right: 10,
		fontSize: 10,
		color: "rgba(255,255,255,0.7)",
		background: "rgba(0,0,0,0.4)",
		padding: "2px 7px",
		borderRadius: 999,
	},
	postBottom: {
		padding: "12px 14px",
		background: "var(--color-bg-1)",
	},
	postViews: {
		fontSize: 12,
		fontFamily: "'JetBrains Mono', monospace",
		color: "var(--color-ink-0)",
		marginBottom: 3,
	},
	postCaption: {
		fontSize: 12,
		color: "var(--color-ink-2)",
		lineHeight: 1.4,
	},

	/* rates block */
	ratesWrap: {
		display: "flex",
		flexDirection: "column" as const,
		gap: 20,
	},
	rateTable: {
		width: "100%",
		borderCollapse: "collapse" as const,
		fontSize: 13,
	},
	rateTh: {
		textAlign: "left" as const,
		padding: "10px 14px",
		fontSize: 11,
		textTransform: "uppercase" as const,
		letterSpacing: "0.1em",
		color: "var(--color-ink-3)",
		borderBottom: "1px solid var(--color-line)",
		fontWeight: 500,
	},
	rateTd: {
		padding: "12px 14px",
		borderBottom: "1px solid var(--color-line)",
		color: "var(--color-ink-1)",
	},
	rateTdKind: {
		padding: "12px 14px",
		borderBottom: "1px solid var(--color-line)",
		color: "var(--color-ink-0)",
		fontWeight: 500,
	},

	/* brands block */
	brandsGrid: {
		display: "grid",
		gridTemplateColumns: "repeat(3, 1fr)",
		gap: 12,
	},
	brandCell: {
		padding: "16px 18px",
		borderRadius: 14,
		background:
			"linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
		border: "1px solid var(--color-line)",
		display: "flex",
		alignItems: "center",
		gap: 12,
	},
	brandMark: {
		width: 38,
		height: 38,
		borderRadius: 10,
		display: "grid",
		placeItems: "center",
		fontFamily: "'Geist', sans-serif",
		fontWeight: 600,
		fontSize: 14,
		letterSpacing: "-0.02em",
		border: "1px solid var(--color-line-2)",
		position: "relative" as const,
		overflow: "hidden",
		flexShrink: 0,
	},
	brandMarkShine: {
		position: "absolute" as const,
		inset: 0,
		background:
			"linear-gradient(135deg, rgba(255,255,255,0.08), transparent 60%)",
	},
	brandMeta: {
		flex: 1,
	},
	brandName: {
		fontSize: 13.5,
		fontWeight: 500,
		color: "var(--color-ink-0)",
	},
	brandSub: {
		fontSize: 11.5,
		color: "var(--color-ink-2)",
		marginTop: 2,
	},

	/* reviews block */
	reviewCard: {
		padding: "22px 24px",
		borderRadius: 16,
		background:
			"linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
		border: "1px solid var(--color-line)",
		marginBottom: 14,
	},
	reviewHead: {
		display: "flex",
		alignItems: "center",
		gap: 12,
		marginBottom: 14,
	},
	reviewName: {
		fontSize: 13.5,
		fontWeight: 500,
		color: "var(--color-ink-0)",
	},
	reviewWhen: {
		fontSize: 11.5,
		color: "var(--color-ink-3)",
		marginTop: 1,
	},
	reviewBody: {
		fontSize: 13.5,
		lineHeight: 1.6,
		color: "var(--color-ink-1)",
	},

	/* sidebar cards */
	sideCard: {
		padding: "22px 24px",
		borderRadius: 18,
		background:
			"linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
		border: "1px solid var(--color-line)",
		boxShadow:
			"0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.5)",
	},
	sideLabel: {
		fontSize: 11,
		textTransform: "uppercase" as const,
		letterSpacing: "0.12em",
		color: "var(--color-ink-3)",
		marginBottom: 14,
	},
	fitDonut: {
		display: "flex",
		alignItems: "center",
		gap: 20,
		marginBottom: 16,
	},
	fitBullets: {
		display: "flex",
		flexDirection: "column" as const,
		gap: 8,
	},
	fitBullet: {
		display: "flex",
		alignItems: "center",
		gap: 8,
		fontSize: 12.5,
		color: "var(--color-ink-1)",
	},
	fitDot: {
		width: 5,
		height: 5,
		borderRadius: "50%",
		background: "var(--color-accent-strong)",
		flexShrink: 0,
	},
	actItem: {
		display: "flex",
		alignItems: "center",
		gap: 10,
		padding: "10px 0",
		borderBottom: "1px solid var(--color-line)",
		fontSize: 12.5,
	},
	actDot: {
		width: 6,
		height: 6,
		borderRadius: "50%",
		background: "var(--color-accent-strong)",
		flexShrink: 0,
	},
	actText: {
		flex: 1,
		color: "var(--color-ink-1)",
	},
	actTime: {
		fontSize: 11,
		color: "var(--color-ink-3)",
		fontFamily: "'JetBrains Mono', monospace",
	},
	contactRow: {
		display: "flex",
		justifyContent: "space-between",
		padding: "9px 0",
		borderBottom: "1px solid var(--color-line)",
		fontSize: 12.5,
	},
	contactKey: {
		color: "var(--color-ink-3)",
	},
	contactVal: {
		color: "var(--color-ink-0)",
		fontWeight: 500,
		display: "flex",
		alignItems: "center",
		gap: 6,
	},
	greenDot: {
		width: 6,
		height: 6,
		borderRadius: "50%",
		background: "#4ade80",
	},

	/* similar creators */
	similarSection: {
		padding: "60px 0 0",
		borderTop: "1px solid var(--color-line)",
	},
	similarGrid: {
		display: "grid",
		gridTemplateColumns: "repeat(3, 1fr)",
		gap: 16,
		marginTop: 24,
	},
	simCard: {
		padding: 22,
		borderRadius: 18,
		background:
			"linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
		border: "1px solid var(--color-line)",
		cursor: "pointer",
		transition: "transform .3s ease, border-color .3s",
	},
	simHead: {
		display: "flex",
		alignItems: "center",
		gap: 12,
		marginBottom: 16,
	},
	simAvatar: {
		width: 44,
		height: 44,
		borderRadius: 12,
		display: "grid",
		placeItems: "center",
		fontFamily: "'Geist', sans-serif",
		fontWeight: 600,
		fontSize: 15,
		border: "1px solid var(--color-line-2)",
		position: "relative" as const,
		overflow: "hidden",
	},
	simName: {
		fontSize: 14,
		fontWeight: 500,
		color: "var(--color-ink-0)",
	},
	simHandle: {
		fontSize: 11,
		color: "var(--color-ink-3)",
		fontFamily: "'JetBrains Mono', monospace",
	},
	simPill: {
		display: "inline-flex",
		alignItems: "center",
		gap: 5,
		fontSize: 11,
		color: "var(--color-ink-1)",
		background: "rgba(255,255,255,0.04)",
		border: "1px solid var(--color-line-2)",
		padding: "4px 8px",
		borderRadius: 999,
		marginLeft: "auto",
	},
	simStats: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr 1fr",
		gap: 1,
		background: "var(--color-line)",
		border: "1px solid var(--color-line)",
		borderRadius: 10,
		overflow: "hidden",
		marginBottom: 14,
	},
	simStatCell: {
		background: "var(--color-bg-1)",
		padding: "10px 12px",
		textAlign: "center" as const,
	},
	simStatNum: {
		fontFamily: "'Geist', sans-serif",
		fontSize: 15,
		fontWeight: 500,
		letterSpacing: "-0.01em",
		color: "var(--color-ink-0)",
	},
	simStatLabel: {
		fontSize: 10,
		color: "var(--color-ink-3)",
		marginTop: 1,
	},
	simFoot: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		fontSize: 12,
		color: "var(--color-ink-2)",
	},

	/* modal */
	overlay: {
		position: "fixed" as const,
		inset: 0,
		zIndex: 100,
		background: "rgba(0,0,0,0.65)",
		backdropFilter: "blur(6px)",
		display: "grid",
		placeItems: "center",
		padding: 24,
	},
	modal: {
		width: "100%",
		maxWidth: 520,
		background: "var(--color-bg-1)",
		border: "1px solid var(--color-line-2)",
		borderRadius: 22,
		padding: "28px 32px 32px",
		boxShadow: "0 40px 100px -20px rgba(0,0,0,0.7)",
		position: "relative" as const,
		maxHeight: "90vh",
		overflowY: "auto" as const,
	},
	modalClose: {
		position: "absolute" as const,
		top: 16,
		right: 16,
		width: 32,
		height: 32,
		borderRadius: 8,
		background: "rgba(255,255,255,0.04)",
		border: "1px solid var(--color-line)",
		display: "grid",
		placeItems: "center",
		color: "var(--color-ink-2)",
		cursor: "pointer",
	},
	modalH3: {
		fontFamily: "'Geist', sans-serif",
		fontSize: 22,
		fontWeight: 500,
		letterSpacing: "-0.02em",
		margin: "0 0 6px",
	},
	modalSub: {
		fontSize: 13,
		color: "var(--color-ink-2)",
		margin: "0 0 22px",
	},
	modalStep: {
		fontSize: 11,
		textTransform: "uppercase" as const,
		letterSpacing: "0.12em",
		color: "var(--color-ink-3)",
		fontFamily: "'JetBrains Mono', monospace",
		marginBottom: 14,
	},
	campaignOpt: {
		padding: "14px 16px",
		borderRadius: 14,
		border: "1px solid var(--color-line)",
		background: "rgba(255,255,255,0.02)",
		cursor: "pointer",
		transition: "all .18s",
		marginBottom: 10,
		display: "flex",
		alignItems: "center",
		gap: 12,
	},
	campaignOptActive: {
		borderColor: "rgba(190,242,100,0.45)",
		background: "rgba(190,242,100,0.06)",
	},
	delivRow: {
		padding: "12px 0",
		borderBottom: "1px solid var(--color-line)",
		display: "flex",
		alignItems: "flex-start",
		gap: 10,
	},
	checkbox: {
		accentColor: "var(--color-accent-strong)",
		marginTop: 2,
	},
	delivLabel: {
		fontSize: 13.5,
		fontWeight: 500,
		color: "var(--color-ink-0)",
	},
	delivHelp: {
		fontSize: 11.5,
		color: "var(--color-ink-3)",
		marginTop: 2,
	},
	fieldLabel: {
		display: "block",
		fontSize: 12,
		color: "var(--color-ink-2)",
		marginBottom: 7,
	},
	fieldInput: {
		width: "100%",
		background: "rgba(255,255,255,0.03)",
		border: "1px solid var(--color-line-2)",
		borderRadius: 10,
		padding: "12px 14px",
		fontSize: 14,
		color: "var(--color-ink-0)",
		outline: "none",
		fontFamily: "inherit",
	},
	textarea: {
		width: "100%",
		background: "rgba(255,255,255,0.03)",
		border: "1px solid var(--color-line-2)",
		borderRadius: 10,
		padding: "12px 14px",
		fontSize: 14,
		color: "var(--color-ink-0)",
		outline: "none",
		fontFamily: "inherit",
		minHeight: 100,
		resize: "vertical" as const,
	},
	modalFooter: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 22,
		gap: 10,
	},
	successCenter: {
		textAlign: "center" as const,
		padding: "20px 0",
		display: "flex",
		flexDirection: "column" as const,
		alignItems: "center",
		gap: 14,
	},
	successCircle: {
		width: 64,
		height: 64,
		borderRadius: "50%",
		background: "rgba(190,242,100,0.12)",
		border: "1px solid rgba(190,242,100,0.3)",
		display: "grid",
		placeItems: "center",
		color: "var(--color-accent-strong)",
	},
	successH3: {
		fontFamily: "'Geist', sans-serif",
		fontSize: 22,
		fontWeight: 500,
		letterSpacing: "-0.02em",
		margin: 0,
	},
	successMeta: {
		display: "flex",
		flexDirection: "column" as const,
		gap: 6,
		fontSize: 13,
		color: "var(--color-ink-2)",
	},
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  COMPONENTS                                                                */
/* ═══════════════════════════════════════════════════════════════════════════ */

/* ─── NavCr ────────────────────────────────────────────────────────────────── */
// Nav is now shared via @/components/nav

/* ─── CrumbCr ──────────────────────────────────────────────────────────────── */
function CrumbCr() {
	const CREATOR = useCreator();
	return (
		<div style={S.crumb}>
			<div style={S.crumbLeft}>
				<Link
					href="/creators"
					style={{
						...S.crumbLink,
						display: "inline-flex",
						alignItems: "center",
						gap: 6,
					}}
				>
					<BackIcon /> Creators
				</Link>
				<span style={S.crumbSep}>/</span>
				<span>{CREATOR.category}</span>
				<span style={S.crumbSep}>/</span>
				<span style={S.crumbCurrent}>{CREATOR.name}</span>
			</div>
			<div style={S.crumbRight}>
				<button style={S.crumbBtn} aria-label="Save">
					<HeartIcon />
				</button>
				<button style={S.crumbBtn} aria-label="Share">
					<ShareIcon />
				</button>
				<button style={S.crumbBtn} aria-label="Report">
					<FlagIcon />
				</button>
			</div>
		</div>
	);
}

/* ─── CreatorHero ──────────────────────────────────────────────────────────── */
function CreatorHero({
	onInvite,
	onAddToList,
	isInList,
	isBrand,
}: {
	onInvite: () => void;
	onAddToList: () => void;
	isInList: boolean;
	isBrand: boolean;
}) {
	const CREATOR = useCreator();
	const ac = ACCENT_MAP_C[CREATOR.color] ?? ACCENT_MAP_C.amber;

	return (
		<div className="cr-hero" style={S.heroGrid}>
			{/* Left: info */}
			<div className="cr-info" style={S.info}>
				{CREATOR.trending && (
					<div style={S.trendFlag}>
						<TrendIcon /> Trending
					</div>
				)}

				<div style={S.avatarRow}>
					<div
						style={{
							...S.avatarBig,
							background: `linear-gradient(135deg, ${CREATOR.avatarColor[0]}, ${CREATOR.avatarColor[1]})`,
							color: CREATOR.avatarColor[1],
						}}
					>
						<div style={S.avatarShine} />
						{initials(CREATOR.name)}
						{CREATOR.available && <div style={S.liveDot} />}
					</div>
					<div style={S.nameRow}>
						<div style={S.name}>
							{CREATOR.name}
							{CREATOR.verified && (
								<span className="verified">
									<VerifiedIcon />
								</span>
							)}
						</div>
						<div style={S.handle}>{CREATOR.handle}</div>
					</div>
				</div>

				<p style={S.bio}>{CREATOR.bio}</p>

				<div style={S.metaRow}>
					<span style={S.metaPill}>
						<PinIconC /> {CREATOR.location}
					</span>
					<span style={S.metaPill}>
						<ClockIcon /> {CREATOR.timezone}
					</span>
					<span style={S.metaPill}>{CREATOR.tier} tier</span>
					<span style={S.metaPill}>{CREATOR.category}</span>
					<span style={S.openPill}>
						<span style={S.pulseDot} /> Open to briefs
					</span>
				</div>

				<div style={S.tagRow}>
					{CREATOR.tags.map((t) => (
						<span key={t} style={S.tag}>
							{t}
						</span>
					))}
				</div>

				<div style={S.platformsGrid}>
					{CREATOR.platforms.map((pl) => (
						<div key={pl.name} style={S.platformCell}>
							<div style={S.platformTop}>
								<span style={S.platformName}>
									<PlatformIcon name={pl.name} /> {pl.name}
								</span>
								{pl.primary && <span style={S.primaryBadge}>Primary</span>}
							</div>
							<div style={S.platformFollowers}>{pl.followers}</div>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<span style={S.platformGrowth}>{pl.growth}</span>
								<span style={S.platformHandle}>{pl.handle}</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Right: stats card */}
			<div className="cr-stats" style={S.statsCard}>
				<div style={S.statsEyebrow}>Avg. CPM rate</div>
				<div style={S.statsRate}>
					<span style={S.statsCurrency}>{CREATOR.currency}</span>
					{CREATOR.avgRate}
					<span style={S.statsPer}>/{CREATOR.ratePer}</span>
				</div>
				<div style={S.statsHelper}>
					Based on {CREATOR.completedDeals} completed deals
				</div>

				<div style={S.statsGrid}>
					<div style={S.statsCell}>
						<div style={S.statsCellNum}>{CREATOR.followersFmt}</div>
						<div style={S.statsCellLabel}>Followers</div>
					</div>
					<div style={S.statsCell}>
						<div style={S.statsCellNum}>{CREATOR.monthlyViewsFmt}</div>
						<div style={S.statsCellLabel}>Monthly views</div>
					</div>
					<div style={S.statsCell}>
						<div style={S.statsCellNum}>
							{CREATOR.engagement}
							<span style={S.statsCellUnit}>%</span>
						</div>
						<div style={S.statsCellLabel}>Engagement</div>
					</div>
					<div style={S.statsCell}>
						<div style={S.statsCellNum}>{CREATOR.rating}</div>
						<div style={S.starsRow}>
							{Array.from({ length: 5 }).map((_, i) => (
								<span
									key={i}
									style={{
										color:
											i < Math.round(CREATOR.rating)
												? "#fbbf24"
												: "var(--color-ink-3)",
										fontSize: 11,
									}}
								>
									★
								</span>
							))}
							<span
								style={{
									fontSize: 11,
									color: "var(--color-ink-3)",
									marginLeft: 4,
								}}
							>
								({CREATOR.ratingCount})
							</span>
						</div>
					</div>
				</div>

				<div style={S.ctaRow}>
					{isBrand ? (
						<>
							<button
								className="btn btn-primary"
								style={{
									width: "100%",
									justifyContent: "center",
									padding: "13px 20px",
								}}
								onClick={onInvite}
							>
								<ArrowIcon /> Invite to campaign
							</button>
							<div style={S.ctaSecRow}>
								<button
									className="btn btn-glass"
									style={{ flex: 1, justifyContent: "center" }}
								>
									Send message
								</button>
								<button
									className={`btn ${isInList ? "btn-listed" : "btn-glass"}`}
									style={{ flex: 1, justifyContent: "center" }}
									onClick={onAddToList}
								>
									{isInList ? (
										<>
											<CheckIcon /> Added
										</>
									) : (
										<>
											<PlusIcon /> Add to list
										</>
									)}
								</button>
							</div>
						</>
					) : (
						<button
							className="btn btn-glass"
							style={{
								width: "100%",
								justifyContent: "center",
								padding: "13px 20px",
							}}
						>
							Send message
						</button>
					)}
					<p style={S.fineprint}>
						Response time: {CREATOR.responseTime} · {CREATOR.completedDeals}{" "}
						deals completed
					</p>
				</div>
			</div>
		</div>
	);
}

/* ─── Tabs ─────────────────────────────────────────────────────────────────── */
const TAB_NAMES = [
	"About",
	"Audience",
	"Recent posts",
	"Rates",
	"Past brands",
	"Reviews",
] as const;
type TabName = (typeof TAB_NAMES)[number];

function TabBar({
	active,
	onChange,
}: {
	active: TabName;
	onChange: (t: TabName) => void;
}) {
	return (
		<div style={S.tabBar}>
			{TAB_NAMES.map((t) => {
				const isActive = t === active;
				const badge =
					t === "Recent posts"
						? 6
						: t === "Past brands"
							? 6
							: t === "Reviews"
								? 3
								: null;
				return (
					<button
						key={t}
						style={{
							...S.tab,
							...(isActive ? S.tabActive : {}),
						}}
						onClick={() => onChange(t)}
					>
						{t}
						{badge !== null && (
							<span
								style={{
									marginLeft: 5,
									fontSize: 11,
									color: "var(--color-ink-3)",
								}}
							>
								{badge}
							</span>
						)}
						{isActive && <span style={S.tabLine} />}
					</button>
				);
			})}
		</div>
	);
}

/* ─── AboutBlock ───────────────────────────────────────────────────────────── */
function AboutBlock() {
	const CREATOR = useCreator();
	return (
		<div>
			<div style={S.blockEyebrow}>
				<FileIcon /> About
			</div>
			<h2 style={S.blockH2}>Who is {CREATOR.name.split(" ")[0]}?</h2>
			{CREATOR.longBio.map((p, i) => (
				<p key={i} style={S.longBioP}>
					{p}
				</p>
			))}
			<div style={S.callout}>
				<span style={S.calloutStrong}>Best fit:</span> Fashion, lifestyle, and
				editorial campaigns. Prefers indie and mid-market labels. 30-day
				exclusivity windows for fashion verticals.
			</div>
		</div>
	);
}

/* ─── AudienceBlock ────────────────────────────────────────────────────────── */
function AudienceBlock() {
	const CREATOR = useCreator();
	const aud = CREATOR.audience;
	return (
		<div style={S.audGrid}>
			{/* Gender */}
			<div style={S.audCard}>
				<div style={S.audLabel}>Gender split</div>
				<div style={S.audBarTrack}>
					<div
						style={{
							width: `${aud.genderF}%`,
							background: "#f472b6",
							borderRadius: "999px 0 0 999px",
						}}
					/>
					<div
						style={{
							width: `${aud.genderM}%`,
							background: "#60a5fa",
							borderRadius: "0 999px 999px 0",
						}}
					/>
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginTop: 10,
						fontSize: 12,
					}}
				>
					<span style={{ color: "#f472b6" }}>Female {aud.genderF}%</span>
					<span style={{ color: "#60a5fa" }}>Male {aud.genderM}%</span>
				</div>
			</div>

			{/* Age */}
			<div style={S.audCard}>
				<div style={S.audLabel}>Age distribution</div>
				{aud.ageBuckets.map((b) => (
					<div key={b.label} style={S.audBarRow}>
						<span style={S.audBarLabel}>{b.label}</span>
						<div
							style={{
								flex: 1,
								height: 6,
								borderRadius: 999,
								background: "rgba(255,255,255,0.06)",
								overflow: "hidden",
							}}
						>
							<div style={{ ...S.audBarFill, width: `${b.pct}%` }} />
						</div>
						<span style={S.audBarPct}>{b.pct}%</span>
					</div>
				))}
			</div>

			{/* Geo */}
			<div style={S.audCard}>
				<div style={S.audLabel}>Top geographies</div>
				{aud.topGeo.map((g) => (
					<div key={g.city} style={S.audBarRow}>
						<span style={S.audBarLabel}>{g.city}</span>
						<div
							style={{
								flex: 1,
								height: 6,
								borderRadius: 999,
								background: "rgba(255,255,255,0.06)",
								overflow: "hidden",
							}}
						>
							<div style={{ ...S.audBarFill, width: `${g.pct * 2}%` }} />
						</div>
						<span style={S.audBarPct}>{g.pct}%</span>
					</div>
				))}
			</div>

			{/* Interests */}
			<div style={S.audCard}>
				<div style={S.audLabel}>Interests</div>
				<div>
					{aud.interests.map((i) => (
						<span key={i} style={S.audInterest}>
							{i}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

/* ─── PostsBlock ───────────────────────────────────────────────────────────── */
function PostsBlock() {
	return (
		<div style={S.postsGrid}>
			{RECENT_POSTS.map((p, i) => (
				<div key={i} style={S.postCard}>
					<div
						style={{
							...S.postThumb,
							background: `linear-gradient(135deg, ${p.from}, ${p.to})`,
						}}
					>
						<span style={S.postDate}>{p.date}</span>
						<div style={S.postPlay}>
							<PlayIcon />
						</div>
					</div>
					<div style={S.postBottom}>
						<div style={S.postViews}>
							{p.views} views · {p.likes} likes
						</div>
						<div style={S.postCaption}>{p.caption}</div>
					</div>
				</div>
			))}
		</div>
	);
}

/* ─── RatesBlock ───────────────────────────────────────────────────────────── */
function RatesBlock() {
	const CREATOR = useCreator();
	return (
		<div style={S.ratesWrap}>
			<div>
				<div style={S.blockEyebrow}>
					<SparkIcon /> Growth trend (12 mo)
				</div>
				<SparkChart data={CREATOR.spark} />
			</div>
			<table style={S.rateTable}>
				<thead>
					<tr>
						<th style={S.rateTh}>Deliverable</th>
						<th style={S.rateTh}>
							<IGIcon style={{ marginRight: 4 }} /> Instagram
						</th>
						<th style={S.rateTh}>
							<YTIcon style={{ marginRight: 4 }} /> YouTube
						</th>
						<th style={S.rateTh}>
							<TTIcon style={{ marginRight: 4 }} /> TikTok
						</th>
					</tr>
				</thead>
				<tbody>
					{CREATOR.rates.map((r) => (
						<tr key={r.kind}>
							<td style={S.rateTdKind}>{r.kind}</td>
							<td style={S.rateTd}>{r.ig}</td>
							<td style={S.rateTd}>{r.yt}</td>
							<td style={S.rateTd}>{r.tt}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

/* ─── BrandsBlock ──────────────────────────────────────────────────────────── */
function BrandsBlock() {
	return (
		<div style={S.brandsGrid}>
			{PAST_BRANDS.map((b) => (
				<div key={b.name} style={S.brandCell}>
					<div
						style={{
							...S.brandMark,
							background: `linear-gradient(135deg, ${b.color[0]}, ${b.color[1]})`,
							color: b.color[1],
						}}
					>
						<div style={S.brandMarkShine} />
						{initials(b.name)}
					</div>
					<div style={S.brandMeta}>
						<div style={S.brandName}>{b.name}</div>
						<div style={S.brandSub}>
							{b.deals} deal{b.deals > 1 ? "s" : ""} · Last {b.last}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

/* ─── ReviewsBlock ─────────────────────────────────────────────────────────── */
function ReviewsBlock() {
	return (
		<div>
			{REVIEWS.map((r, i) => (
				<div key={i} style={S.reviewCard}>
					<div style={S.reviewHead}>
						<div
							style={{
								...S.brandMark,
								width: 32,
								height: 32,
								fontSize: 12,
								borderRadius: 8,
								background: `linear-gradient(135deg, ${r.color[0]}, ${r.color[1]})`,
								color: r.color[1],
							}}
						>
							<div style={S.brandMarkShine} />
							{initials(r.brand)}
						</div>
						<div>
							<div style={S.reviewName}>{r.brand}</div>
							<div style={S.reviewWhen}>{r.when}</div>
						</div>
						<div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
							{Array.from({ length: 5 }).map((_, si) => (
								<span
									key={si}
									style={{
										color: si < r.rating ? "#fbbf24" : "var(--color-ink-3)",
										fontSize: 12,
									}}
								>
									★
								</span>
							))}
						</div>
					</div>
					<p style={S.reviewBody}>{r.body}</p>
				</div>
			))}
		</div>
	);
}

/* ─── FitCard (aside) ──────────────────────────────────────────────────────── */
function FitCard() {
	const pct = 88;
	const r = 36;
	const circ = 2 * Math.PI * r;
	const offset = circ - (pct / 100) * circ;

	return (
		<div style={S.sideCard}>
			<div style={S.sideLabel}>Brand-fit score</div>
			<div style={S.fitDonut}>
				<svg width="88" height="88" viewBox="0 0 88 88">
					<circle
						cx="44"
						cy="44"
						r={r}
						fill="none"
						stroke="rgba(255,255,255,0.06)"
						strokeWidth="6"
					/>
					<circle
						cx="44"
						cy="44"
						r={r}
						fill="none"
						stroke="var(--color-accent-strong)"
						strokeWidth="6"
						strokeDasharray={circ}
						strokeDashoffset={offset}
						strokeLinecap="round"
						transform="rotate(-90 44 44)"
					/>
					<text
						x="44"
						y="44"
						textAnchor="middle"
						dominantBaseline="central"
						style={{
							fontFamily: "'Geist', sans-serif",
							fontSize: 20,
							fontWeight: 500,
							fill: "var(--color-ink-0)",
						}}
					>
						{pct}%
					</text>
				</svg>
				<div>
					<div
						style={{
							fontSize: 14,
							fontWeight: 500,
							color: "var(--color-ink-0)",
							marginBottom: 4,
						}}
					>
						Strong fit for fashion
					</div>
					<div style={{ fontSize: 12, color: "var(--color-ink-2)" }}>
						Based on your brand profile
					</div>
				</div>
			</div>
			<div style={S.fitBullets}>
				<div style={S.fitBullet}>
					<span style={S.fitDot} /> Audience overlaps 72% with your target
				</div>
				<div style={S.fitBullet}>
					<span style={S.fitDot} /> Engagement rate above category avg
				</div>
				<div style={S.fitBullet}>
					<span style={S.fitDot} /> 4 brands in common vertical
				</div>
				<div style={S.fitBullet}>
					<span style={S.fitDot} /> CPM within your budget range
				</div>
			</div>
		</div>
	);
}

/* ─── ActivityCardCr (aside) ───────────────────────────────────────────────── */
function ActivityCardCr() {
	const items = [
		{ text: "Posted reel", time: "3d ago" },
		{ text: "Accepted brief", time: "1w ago" },
		{ text: "Hit 500k views", time: "2w ago" },
		{ text: "Joined list", time: "3w ago" },
	];
	return (
		<div style={S.sideCard}>
			<div style={S.sideLabel}>Recent activity</div>
			{items.map((a, i) => (
				<div
					key={i}
					style={{
						...S.actItem,
						...(i === items.length - 1 ? { borderBottom: "none" } : {}),
					}}
				>
					<span style={S.actDot} />
					<span style={S.actText}>{a.text}</span>
					<span style={S.actTime}>{a.time}</span>
				</div>
			))}
		</div>
	);
}

/* ─── ContactCard (aside) ──────────────────────────────────────────────────── */
function ContactCard() {
	const CREATOR = useCreator();
	const rows: { key: string; val: React.ReactNode }[] = [
		{ key: "Location", val: CREATOR.location },
		{ key: "Timezone", val: CREATOR.timezone },
		{ key: "Languages", val: "English, Hindi" },
		{ key: "Reply time", val: CREATOR.responseTime },
		{
			key: "Status",
			val: (
				<span style={{ display: "flex", alignItems: "center", gap: 6 }}>
					<span style={S.greenDot} /> Available
				</span>
			),
		},
		{ key: "Exclusivity", val: CREATOR.exclusive ? "Yes" : "Non-exclusive" },
		{
			key: "Min budget",
			val: `${CREATOR.currency}14k`,
		},
	];
	return (
		<div style={S.sideCard}>
			<div style={S.sideLabel}>At a glance</div>
			{rows.map((r, i) => (
				<div
					key={i}
					style={{
						...S.contactRow,
						...(i === rows.length - 1 ? { borderBottom: "none" } : {}),
					}}
				>
					<span style={S.contactKey}>{r.key}</span>
					<span style={S.contactVal}>{r.val}</span>
				</div>
			))}
		</div>
	);
}

/* ─── SimilarCreators ──────────────────────────────────────────────────────── */
type SimilarCreator = {
	_id: string;
	name: string;
	handle: string;
	color: [string, string];
	location: string;
	category: string;
	followers: string;
	monthlyViews: string;
	engagement: number;
	rate: number;
	accent: string;
	platform: string;
};

function SimilarCreators({
	similarCreators,
}: {
	similarCreators: SimilarCreator[];
}) {
	const CREATOR = useCreator();
	return (
		<div style={S.similarSection}>
			<h2 style={S.blockH2}>Similar creators</h2>
			<div style={S.similarGrid}>
				{similarCreators.map((c) => (
					<Link
						key={c._id}
						href={`/creator/${c._id}`}
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<div style={S.simCard}>
							<div style={S.simHead}>
								<div
									style={{
										...S.simAvatar,
										background: `linear-gradient(135deg, ${c.color[0]}, ${c.color[1]})`,
										color: c.color[1],
									}}
								>
									<div style={S.avatarShine} />
									{initials(c.name)}
								</div>
								<div>
									<div style={S.simName}>{c.name}</div>
									<div style={S.simHandle}>{c.handle}</div>
								</div>
								<span style={S.simPill}>
									<PlatformIcon name={c.platform} /> {c.platform}
								</span>
							</div>
							<div style={S.simStats}>
								<div style={S.simStatCell}>
									<div style={S.simStatNum}>{c.followers}</div>
									<div style={S.simStatLabel}>Followers</div>
								</div>
								<div style={S.simStatCell}>
									<div style={S.simStatNum}>{c.engagement}%</div>
									<div style={S.simStatLabel}>Eng.</div>
								</div>
								<div style={S.simStatCell}>
									<div style={S.simStatNum}>
										{CREATOR.currency}
										{c.rate}
									</div>
									<div style={S.simStatLabel}>CPM</div>
								</div>
							</div>
							<div style={S.simFoot}>
								<span>{c.category}</span>
								<span>{c.location}</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

/* ─── InviteModal ──────────────────────────────────────────────────────────── */
function InviteModal({ onClose }: { onClose: () => void }) {
	const CREATOR = useCreator();
	const [step, setStep] = useState(0);
	const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
	const [selectedDelivs, setSelectedDelivs] = useState<string[]>([]);
	const [rate, setRate] = useState("₹280");
	const [pitch, setPitch] = useState("");
	const [attachBrief, setAttachBrief] = useState(false);

	const toggleDeliv = (id: string) =>
		setSelectedDelivs((prev) =>
			prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
		);

	const campaignName =
		CAMPAIGN_OPTS.find((c) => c.id === selectedCampaign)?.name ?? "";

	return (
		<div style={S.overlay} onClick={onClose}>
			<div style={S.modal} onClick={(e) => e.stopPropagation()}>
				<button style={S.modalClose} onClick={onClose}>
					<CloseIcon />
				</button>

				{/* Step 0: Pick campaign */}
				{step === 0 && (
					<>
						<div style={S.modalStep}>Step 1 of 3</div>
						<h3 style={S.modalH3}>Pick a campaign</h3>
						<p style={S.modalSub}>
							Choose which campaign to invite {CREATOR.name.split(" ")[0]} to.
						</p>
						{CAMPAIGN_OPTS.map((c) => (
							<button
								key={c.id}
								style={{
									...S.campaignOpt,
									...(selectedCampaign === c.id ? S.campaignOptActive : {}),
								}}
								onClick={() => setSelectedCampaign(c.id)}
							>
								<div
									style={{
										...S.brandMark,
										width: 34,
										height: 34,
										fontSize: 12,
										borderRadius: 9,
										background: `linear-gradient(135deg, ${c.color[0]}, ${c.color[1]})`,
										color: c.color[1],
									}}
								>
									<div style={S.brandMarkShine} />
									{initials(c.brand)}
								</div>
								<div style={{ flex: 1, textAlign: "left" as const }}>
									<div
										style={{
											fontSize: 13.5,
											fontWeight: 500,
											color: "var(--color-ink-0)",
										}}
									>
										{c.name}
									</div>
									<div
										style={{
											fontSize: 11.5,
											color: "var(--color-ink-2)",
											marginTop: 1,
										}}
									>
										{c.brand} · {c.platform} · {c.rate}
									</div>
								</div>
								{selectedCampaign === c.id && (
									<CheckIcon style={{ color: "var(--color-accent-strong)" }} />
								)}
							</button>
						))}
						<div style={S.modalFooter}>
							<button className="btn btn-ghost" onClick={onClose}>
								Cancel
							</button>
							<button
								className="btn btn-primary"
								style={{
									opacity: selectedCampaign ? 1 : 0.4,
									pointerEvents: selectedCampaign ? "auto" : "none",
								}}
								onClick={() => setStep(1)}
							>
								Next <ArrowIcon />
							</button>
						</div>
					</>
				)}

				{/* Step 1: Deliverables */}
				{step === 1 && (
					<>
						<div style={S.modalStep}>Step 2 of 3</div>
						<h3 style={S.modalH3}>Deliverables</h3>
						<p style={S.modalSub}>
							Select what you need and set a proposed rate.
						</p>
						{DELIVS.map((d) => (
							<div key={d.id} style={S.delivRow}>
								<input
									type="checkbox"
									checked={selectedDelivs.includes(d.id)}
									onChange={() => toggleDeliv(d.id)}
									style={S.checkbox}
								/>
								<div>
									<div style={S.delivLabel}>{d.label}</div>
									<div style={S.delivHelp}>{d.help}</div>
								</div>
							</div>
						))}
						<div style={{ marginTop: 18 }}>
							<label style={S.fieldLabel}>Proposed rate (CPM)</label>
							<input
								type="text"
								value={rate}
								onChange={(e) => setRate(e.target.value)}
								style={S.fieldInput}
								placeholder="e.g. ₹280"
							/>
						</div>
						<div style={S.modalFooter}>
							<button className="btn btn-ghost" onClick={() => setStep(0)}>
								<BackIcon /> Back
							</button>
							<button
								className="btn btn-primary"
								style={{
									opacity: selectedDelivs.length ? 1 : 0.4,
									pointerEvents: selectedDelivs.length ? "auto" : "none",
								}}
								onClick={() => setStep(2)}
							>
								Next <ArrowIcon />
							</button>
						</div>
					</>
				)}

				{/* Step 2: Pitch */}
				{step === 2 && (
					<>
						<div style={S.modalStep}>Step 3 of 3</div>
						<h3 style={S.modalH3}>Write your pitch</h3>
						<p style={S.modalSub}>
							Add a personal note to {CREATOR.name.split(" ")[0]}.
						</p>
						<textarea
							value={pitch}
							onChange={(e) => setPitch(e.target.value)}
							style={S.textarea}
							placeholder={`Hi ${CREATOR.name.split(" ")[0]}, we'd love to work with you on...`}
						/>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: 8,
								marginTop: 14,
								fontSize: 12.5,
								color: "var(--color-ink-2)",
							}}
						>
							<input
								type="checkbox"
								checked={attachBrief}
								onChange={(e) => setAttachBrief(e.target.checked)}
								style={S.checkbox}
							/>
							Attach campaign brief
						</div>
						<div style={S.modalFooter}>
							<button className="btn btn-ghost" onClick={() => setStep(1)}>
								<BackIcon /> Back
							</button>
							<button className="btn btn-primary" onClick={() => setStep(3)}>
								Send invite <ArrowIcon />
							</button>
						</div>
					</>
				)}

				{/* Step 3: Success */}
				{step === 3 && (
					<div style={S.successCenter}>
						<div style={S.successCircle}>
							<CheckBigIcon />
						</div>
						<h3 style={S.successH3}>Invite sent!</h3>
						<p
							style={{
								fontSize: 13.5,
								color: "var(--color-ink-1)",
								margin: 0,
								lineHeight: 1.55,
							}}
						>
							Your invite to{" "}
							<strong style={{ color: "var(--color-ink-0)" }}>
								{CREATOR.name}
							</strong>{" "}
							has been sent for{" "}
							<strong style={{ color: "var(--color-ink-0)" }}>
								{campaignName}
							</strong>
							.
						</p>
						<div style={S.successMeta}>
							<span>Deliverables: {selectedDelivs.length} selected</span>
							<span>Proposed rate: {rate}/1k</span>
							{attachBrief && <span>Brief attached</span>}
						</div>
						<button
							className="btn btn-primary"
							style={{ marginTop: 8 }}
							onClick={onClose}
						>
							Done
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

/* ─── AddToListModal ──────────────────────────────────────────────────────── */

const LIST_COLORS = [
	{ name: "lime", hex: "#bef264" },
	{ name: "sky", hex: "#7dd3fc" },
	{ name: "violet", hex: "#c084fc" },
	{ name: "rose", hex: "#fb7185" },
	{ name: "amber", hex: "#fbbf24" },
	{ name: "cyan", hex: "#22d3ee" },
];

function AddToListModal({
	creatorId,
	creatorName,
	onClose,
}: {
	creatorId: string;
	creatorName: string;
	onClose: () => void;
}) {
	const { data: session } = useSession();
	const userId = session?.user?.id;

	const lists = useQuery(api.lists.listByUser, userId ? { userId } : "skip");
	const createList = useMutation(api.lists.create);
	const addCreator = useMutation(api.lists.addCreator);
	const removeCreator = useMutation(api.lists.removeCreator);

	const [mode, setMode] = useState<"select" | "create">("select");
	const [newName, setNewName] = useState("");
	const [newDesc, setNewDesc] = useState("");
	const [newColor, setNewColor] = useState("lime");
	const [justAdded, setJustAdded] = useState<string | null>(null);
	const [creating, setCreating] = useState(false);

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [onClose]);

	async function handleCreateList() {
		if (!userId || !newName.trim()) return;
		setCreating(true);
		const listId = await createList({
			userId,
			name: newName.trim(),
			description: newDesc.trim() || undefined,
			color: newColor,
			creatorIds: [creatorId as Id<"creators">],
			createdAt: new Date().toISOString(),
		});
		setJustAdded(newName.trim());
		setCreating(false);
		setMode("select");
		setNewName("");
		setNewDesc("");
		setNewColor("lime");
	}

	async function handleToggle(listId: Id<"lists">, isInList: boolean) {
		if (isInList) {
			await removeCreator({
				id: listId,
				creatorId: creatorId as Id<"creators">,
			});
		} else {
			await addCreator({ id: listId, creatorId: creatorId as Id<"creators"> });
			const list = (lists ?? []).find((l) => l._id === listId);
			if (list) setJustAdded(list.name);
		}
	}

	if (!session?.user) {
		return (
			<div style={S.overlay} onClick={onClose}>
				<div style={S.modal} onClick={(e) => e.stopPropagation()}>
					<button style={S.modalClose} onClick={onClose}>
						<CloseIcon />
					</button>
					<h3 style={S.modalH3}>Sign in required</h3>
					<p style={S.modalSub}>
						Please sign in as a brand to create and manage lists.
					</p>
					<Link
						href="/login"
						className="btn btn-primary"
						style={{ textDecoration: "none" }}
					>
						Sign in
					</Link>
				</div>
			</div>
		);
	}

	const selectedColor =
		LIST_COLORS.find((c) => c.name === newColor)?.hex ?? "#bef264";

	return (
		<div style={S.overlay} onClick={onClose}>
			<div style={S.modal} onClick={(e) => e.stopPropagation()}>
				<button style={S.modalClose} onClick={onClose}>
					<CloseIcon />
				</button>

				{/* ── Just added toast ── */}
				{justAdded && (
					<div
						style={{
							padding: "10px 14px",
							borderRadius: 10,
							background: "rgba(190,242,100,0.08)",
							border: "1px solid rgba(190,242,100,0.2)",
							color: "var(--color-accent-strong)",
							fontSize: 12.5,
							marginBottom: 18,
							display: "flex",
							alignItems: "center",
							gap: 8,
						}}
					>
						<CheckIcon style={{ width: 14, height: 14 }} />
						Added {creatorName.split(" ")[0]} to &ldquo;{justAdded}&rdquo;
					</div>
				)}

				{/* ── Select list mode ── */}
				{mode === "select" && (
					<>
						<div style={S.modalStep}>Add to list</div>
						<h3 style={S.modalH3}>Save {creatorName.split(" ")[0]}</h3>
						<p style={S.modalSub}>
							Add this creator to one of your lists, or create a new one.
						</p>

						{/* Existing lists */}
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: 8,
								marginBottom: 8,
							}}
						>
							{(lists ?? []).length === 0 && !justAdded && (
								<div
									style={{
										padding: "24px 0",
										textAlign: "center",
										fontSize: 13,
										color: "var(--color-ink-3)",
									}}
								>
									No lists yet. Create your first one below.
								</div>
							)}
							{(lists ?? []).map((list) => {
								const isInList = list.creatorIds.includes(
									creatorId as Id<"creators">,
								);
								const colorHex =
									LIST_COLORS.find((c) => c.name === list.color)?.hex ??
									"#bef264";
								return (
									<button
										key={list._id}
										style={{
											...S.campaignOpt,
											...(isInList ? S.campaignOptActive : {}),
										}}
										onClick={() => handleToggle(list._id, isInList)}
									>
										<div
											style={{
												width: 34,
												height: 34,
												borderRadius: 9,
												background: `linear-gradient(135deg, ${colorHex}, ${colorHex}55)`,
												display: "grid",
												placeItems: "center",
												fontSize: 14,
												flexShrink: 0,
											}}
										>
											<svg
												width="16"
												height="16"
												viewBox="0 0 16 16"
												fill="none"
												stroke="rgba(0,0,0,0.6)"
												strokeWidth="1.5"
												strokeLinecap="round"
											>
												<line x1="3" y1="5" x2="13" y2="5" />
												<line x1="3" y1="8" x2="10" y2="8" />
												<line x1="3" y1="11" x2="7" y2="11" />
											</svg>
										</div>
										<div style={{ flex: 1, textAlign: "left" as const }}>
											<div
												style={{
													fontSize: 13.5,
													fontWeight: 500,
													color: "var(--color-ink-0)",
												}}
											>
												{list.name}
											</div>
											<div
												style={{
													fontSize: 11.5,
													color: "var(--color-ink-2)",
													marginTop: 1,
												}}
											>
												{list.creatorIds.length} creator
												{list.creatorIds.length !== 1 ? "s" : ""}
												{list.description ? ` · ${list.description}` : ""}
											</div>
										</div>
										{isInList ? (
											<CheckIcon
												style={{ color: "var(--color-accent-strong)" }}
											/>
										) : (
											<PlusIcon
												style={{
													color: "var(--color-ink-3)",
													width: 14,
													height: 14,
												}}
											/>
										)}
									</button>
								);
							})}
						</div>

						{/* Create new list button */}
						<button
							onClick={() => setMode("create")}
							style={{
								width: "100%",
								padding: "13px 16px",
								borderRadius: 14,
								border: "1px dashed var(--color-line-2)",
								background: "transparent",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: 8,
								fontSize: 13,
								color: "var(--color-accent-strong)",
								fontWeight: 500,
								transition: "all 0.15s",
								marginBottom: 6,
							}}
						>
							<PlusIcon style={{ width: 14, height: 14 }} />
							Create new list
						</button>

						<div style={S.modalFooter}>
							<div />
							<button className="btn btn-primary" onClick={onClose}>
								Done
							</button>
						</div>
					</>
				)}

				{/* ── Create list mode ── */}
				{mode === "create" && (
					<>
						<div style={S.modalStep}>New list</div>
						<h3 style={S.modalH3}>Create a list</h3>
						<p style={S.modalSub}>
							{creatorName.split(" ")[0]} will be added automatically.
						</p>

						{/* Name input */}
						<div style={{ marginBottom: 16 }}>
							<label style={S.fieldLabel}>List name</label>
							<input
								type="text"
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
								style={S.fieldInput}
								placeholder="e.g. Tech reviewers, Food creators"
								autoFocus
							/>
						</div>

						{/* Description input */}
						<div style={{ marginBottom: 18 }}>
							<label style={S.fieldLabel}>
								Description{" "}
								<span style={{ color: "var(--color-ink-3)" }}>(optional)</span>
							</label>
							<input
								type="text"
								value={newDesc}
								onChange={(e) => setNewDesc(e.target.value)}
								style={S.fieldInput}
								placeholder="What's this list for?"
							/>
						</div>

						{/* Color picker */}
						<div style={{ marginBottom: 4 }}>
							<label style={S.fieldLabel}>Color</label>
							<div style={{ display: "flex", gap: 8, marginTop: 4 }}>
								{LIST_COLORS.map((c) => (
									<button
										key={c.name}
										onClick={() => setNewColor(c.name)}
										style={{
											width: 32,
											height: 32,
											borderRadius: 10,
											background: c.hex,
											border:
												newColor === c.name
													? `2px solid ${c.hex}`
													: "2px solid transparent",
											outline:
												newColor === c.name ? `2px solid ${c.hex}44` : "none",
											cursor: "pointer",
											transition: "all 0.15s",
											position: "relative",
										}}
									>
										{newColor === c.name && (
											<CheckIcon
												style={{
													position: "absolute",
													inset: 0,
													margin: "auto",
													width: 14,
													height: 14,
													color: "rgba(0,0,0,0.6)",
												}}
											/>
										)}
									</button>
								))}
							</div>
						</div>

						{/* Preview */}
						<div
							style={{
								marginTop: 18,
								padding: "14px 16px",
								borderRadius: 14,
								border: "1px solid var(--color-line)",
								background: "rgba(255,255,255,0.02)",
								display: "flex",
								alignItems: "center",
								gap: 12,
							}}
						>
							<div
								style={{
									width: 34,
									height: 34,
									borderRadius: 9,
									background: `linear-gradient(135deg, ${selectedColor}, ${selectedColor}55)`,
									display: "grid",
									placeItems: "center",
									flexShrink: 0,
								}}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									stroke="rgba(0,0,0,0.6)"
									strokeWidth="1.5"
									strokeLinecap="round"
								>
									<line x1="3" y1="5" x2="13" y2="5" />
									<line x1="3" y1="8" x2="10" y2="8" />
									<line x1="3" y1="11" x2="7" y2="11" />
								</svg>
							</div>
							<div style={{ flex: 1 }}>
								<div style={{ fontSize: 13.5, fontWeight: 500 }}>
									{newName || "List name"}
								</div>
								<div
									style={{
										fontSize: 11.5,
										color: "var(--color-ink-3)",
										marginTop: 1,
									}}
								>
									1 creator{newDesc ? ` · ${newDesc}` : ""}
								</div>
							</div>
						</div>

						<div style={S.modalFooter}>
							<button
								className="btn btn-ghost"
								onClick={() => setMode("select")}
							>
								<BackIcon /> Back
							</button>
							<button
								className="btn btn-primary"
								style={{
									opacity: newName.trim() ? 1 : 0.4,
									pointerEvents: newName.trim() ? "auto" : "none",
								}}
								onClick={handleCreateList}
								disabled={creating}
							>
								{creating ? (
									"Creating..."
								) : (
									<>
										Create list <ArrowIcon />
									</>
								)}
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

/* ─── Footer ───────────────────────────────────────────────────────────────── */
function FooterCr() {
	return (
		<footer className="footer">
			<div className="shell">
				<div className="footer-grid">
					<div className="footer-brand">
						<Link
							href="/"
							className="logo"
							style={{
								textDecoration: "none",
								color: "inherit",
								marginBottom: 14,
							}}
						>
							<div className="logo-dot" />
							inflio
						</Link>
						<p>
							The creator-brand marketplace built for performance. Ship
							campaigns, track spend, grow together.
						</p>
					</div>
					<div className="footer-col">
						<div className="footer-col-title">Product</div>
						<a href="#">Marketplace</a>
						<a href="#">Creators</a>
						<a href="#">Analytics</a>
						<a href="#">Pricing</a>
					</div>
					<div className="footer-col">
						<div className="footer-col-title">Company</div>
						<a href="#">About</a>
						<a href="#">Blog</a>
						<a href="#">Careers</a>
						<a href="#">Press</a>
					</div>
					<div className="footer-col">
						<div className="footer-col-title">Resources</div>
						<a href="#">Help centre</a>
						<a href="#">Guides</a>
						<a href="#">API</a>
						<a href="#">Status</a>
					</div>
					<div className="footer-col">
						<div className="footer-col-title">Legal</div>
						<a href="#">Terms</a>
						<a href="#">Privacy</a>
						<a href="#">Cookies</a>
					</div>
				</div>
				<div className="footer-bottom">
					<span>&copy; 2026 inflio. All rights reserved.</span>
					<span style={{ display: "flex", gap: 18 }}>
						<a href="#" style={{ color: "inherit", textDecoration: "none" }}>
							Twitter
						</a>
						<a href="#" style={{ color: "inherit", textDecoration: "none" }}>
							LinkedIn
						</a>
						<a href="#" style={{ color: "inherit", textDecoration: "none" }}>
							Instagram
						</a>
					</span>
				</div>
			</div>
		</footer>
	);
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                      */
/* ═══════════════════════════════════════════════════════════════════════════ */
export default function CreatorDetailPage() {
	const params = useParams();
	const id = params.id as string;

	const base = useQuery(
		api.creators.getById,
		id ? { id: id as Id<"creators"> } : "skip",
	);
	const allCreators = useQuery(api.creators.list);

	const { data: session } = useSession();
	const userId = session?.user?.id;
	const brandProfile = useQuery(
		api.brands.getByUserId,
		userId ? { userId } : "skip",
	);
	const isBrand = !!brandProfile;
	const userLists = useQuery(
		api.lists.listByUser,
		userId ? { userId } : "skip",
	);
	const isInList = (userLists ?? []).some((l) =>
		l.creatorIds.some((cid) => String(cid) === id),
	);

	const [tab, setTab] = useState<TabName>("About");
	const [showInvite, setShowInvite] = useState(false);
	const [showAddToList, setShowAddToList] = useState(false);

	/* Loading state */
	if (base === undefined) {
		return (
			<div
				style={{
					padding: 80,
					textAlign: "center",
					color: "var(--color-ink-2)",
				}}
			>
				Loading…
			</div>
		);
	}

	/* Not-found state */
	if (base === null) {
		return (
			<div
				style={{
					padding: 80,
					textAlign: "center",
					color: "var(--color-ink-2)",
				}}
			>
				Creator not found
			</div>
		);
	}

	const creator: CreatorData = {
		_id: base._id,
		name: base.name,
		handle: base.handle,
		avatarColor: base.avatarColor as [string, string],
		location: base.location,
		bio: base.bio,
		primaryPlatform: base.primaryPlatform,
		followers: base.followers,
		monthlyViews: base.monthlyViews,
		engagement: base.engagement,
		avgRate: base.avgRate,
		category: base.category,
		tags: base.tags,
		completedDeals: base.completedDeals,
		trending: base.trending,
		tier: base.tier,
		verified: base.verified,
		spark: base.spark,
		longBio: base.longBio,
		timezone: base.timezone,
		responseTime: base.responseTime,
		rating: base.rating,
		ratingCount: base.ratingCount,
		available: base.available,
		exclusive: base.exclusive,
		color: base.color,
		ratePer: "1k",
		currency: base.currency,
		followersFmt: fmtFollowers(base.followers),
		monthlyViewsFmt: fmtViews(base.monthlyViews),
		audience: base.audience,
		rates: base.rates,
		platforms: base.platforms,
	};

	const similarCreators: SimilarCreator[] = (() => {
		const others = (allCreators ?? []).filter((c) => c._id !== base._id);
		const matched = others
			.filter(
				(c) =>
					c.category === base.category ||
					c.tags.some((t) => base.tags.includes(t)),
			)
			.slice(0, 3);
		const result =
			matched.length >= 3
				? matched
				: [
						...matched,
						...others
							.filter((c) => !matched.includes(c))
							.slice(0, 3 - matched.length),
					];
		return result.map((c) => ({
			_id: c._id,
			name: c.name,
			handle: c.handle,
			color: c.avatarColor as [string, string],
			location: c.location,
			category: c.category,
			followers: fmtFollowers(c.followers),
			monthlyViews: fmtViews(c.monthlyViews),
			engagement: c.engagement,
			rate: c.avgRate,
			accent: c.color ?? "amber",
			platform: c.primaryPlatform,
		}));
	})();

	const renderTab = () => {
		switch (tab) {
			case "About":
				return <AboutBlock />;
			case "Audience":
				return <AudienceBlock />;
			case "Recent posts":
				return <PostsBlock />;
			case "Rates":
				return <RatesBlock />;
			case "Past brands":
				return <BrandsBlock />;
			case "Reviews":
				return <ReviewsBlock />;
		}
	};

	return (
		<CreatorCtx.Provider value={creator}>
			<>
				<div className="ambient" />
				<div className="grain" />
				<div style={S.page}>
					<SharedNav />
					<div className="shell">
						<CrumbCr />
						<CreatorHero
							onInvite={() => setShowInvite(true)}
							onAddToList={() => setShowAddToList(true)}
							isInList={isInList}
							isBrand={isBrand}
						/>
						<TabBar active={tab} onChange={setTab} />
						<div style={S.contentGrid}>
							<div style={S.main}>{renderTab()}</div>
							<aside style={S.aside}>
								{isBrand && <FitCard />}
								<ActivityCardCr />
								<ContactCard />
							</aside>
						</div>
						<SimilarCreators similarCreators={similarCreators} />
					</div>
					<FooterCr />
				</div>
				{showInvite && isBrand && (
					<InviteModal onClose={() => setShowInvite(false)} />
				)}
				{showAddToList && isBrand && (
					<AddToListModal
						creatorId={id}
						creatorName={creator.name}
						onClose={() => setShowAddToList(false)}
					/>
				)}
			</>
		</CreatorCtx.Provider>
	);
}
