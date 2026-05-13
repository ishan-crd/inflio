"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
	createContext,
	type SVGProps,
	useContext,
	useState,
} from "react";
import {
	ArrowIcon,
	BackIcon,
} from "@/components/icons";
import { Nav as SharedNav } from "@/components/nav";
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

function GlobeIcon(p: P) {
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
			<path d="M7 1.5C7 1.5 5 4 5 7s2 5.5 2 5.5M7 1.5C7 1.5 9 4 9 7s-2 5.5-2 5.5M1.5 7h11" />
		</svg>
	);
}

function TagIcon(p: P) {
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
			<path d="M1.5 1.5h5l5.5 5.5-5 5L1.5 6.5V1.5z" />
			<circle cx="4" cy="4" r="0.8" fill="currentColor" stroke="none" />
		</svg>
	);
}

function MoneyIcon(p: P) {
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
			<rect x="1.5" y="3.5" width="11" height="7" rx="1.5" />
			<circle cx="7" cy="7" r="1.5" />
			<path d="M4 3.5V2M10 3.5V2" />
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

function BriefcaseIcon(p: P) {
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
			<rect x="1.5" y="4.5" width="11" height="8" rx="1.5" />
			<path d="M5 4.5V3a1 1 0 011-1h2a1 1 0 011 1v1.5" />
			<path d="M1.5 9h11" />
		</svg>
	);
}

function UsersIcon(p: P) {
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
			<circle cx="5" cy="4.5" r="2" />
			<path d="M1 12.5c0-2.2 1.8-4 4-4s4 1.8 4 4" />
			<circle cx="10" cy="4.5" r="1.5" />
			<path d="M12.5 12.5c0-1.9-1.2-3.4-2.5-3.9" />
		</svg>
	);
}

function StarIcon(p: P) {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 14 14"
			fill="currentColor"
			{...p}
		>
			<path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4.5L7 9.5 3 12l1.5-4.5L1 5h4.5L7 1z" />
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

function EditIcon(p: P) {
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
			<path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" />
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

/* ─── Brand Data type ──────────────────────────────────────────────────────── */
type BrandData = {
	_id: string;
	name: string;
	handle: string;
	logoColors: [string, string];
	bio: string;
	followers: string;
	rating: string;
	totalPaidOut: string;
	responseTime: string;
	website?: string;
	category: string;
	userId?: string;
};

const BrandCtx = createContext<BrandData>(null as any);
const useBrand = () => useContext(BrandCtx);

/* ─── Mock data for tabs ───────────────────────────────────────────────────── */
const PAST_CREATORS = [
	{
		name: "Aanya Sharma",
		handle: "@aanyasharma",
		color: ["#ddd6fe", "#1e1b4b"] as [string, string],
		deals: 3,
		last: "Apr",
		category: "Fashion",
	},
	{
		name: "Rahul Dev",
		handle: "@rahuldev",
		color: ["#fde68a", "#422006"] as [string, string],
		deals: 2,
		last: "Mar",
		category: "Tech",
	},
	{
		name: "Priya Nair",
		handle: "@priyanair",
		color: ["#a7f3d0", "#022c22"] as [string, string],
		deals: 4,
		last: "Mar",
		category: "Lifestyle",
	},
	{
		name: "Kiran Mehta",
		handle: "@kiranmehta",
		color: ["#fecdd3", "#4c0519"] as [string, string],
		deals: 1,
		last: "Feb",
		category: "Beauty",
	},
	{
		name: "Arjun Kapoor",
		handle: "@arjunkapoor",
		color: ["#bae6fd", "#082f49"] as [string, string],
		deals: 2,
		last: "Jan",
		category: "Fitness",
	},
	{
		name: "Meera Joshi",
		handle: "@meerajoshi",
		color: ["#fed7aa", "#431407"] as [string, string],
		deals: 3,
		last: "Jan",
		category: "Food",
	},
];

const BRAND_REVIEWS = [
	{
		creator: "Aanya Sharma",
		rating: 5,
		when: "Apr 2026",
		body: "Working with this brand was seamless from start to finish. Clear briefs, fast feedback, and they actually let the creative breathe. Payment was on time and communication was top-notch throughout.",
		color: ["#ddd6fe", "#1e1b4b"] as [string, string],
	},
	{
		creator: "Rahul Dev",
		rating: 5,
		when: "Mar 2026",
		body: "One of the best brand partnerships I've done. They had a strong vision but were open to my style. The campaign brief was detailed and the review cycle was quick. Would work with them again.",
		color: ["#fde68a", "#422006"] as [string, string],
	},
	{
		creator: "Priya Nair",
		rating: 4,
		when: "Feb 2026",
		body: "Great brand to work with overall. Small delay on the final payment but the team was communicative and resolved it promptly. Creative direction was excellent — loved the aesthetic they were going for.",
		color: ["#a7f3d0", "#022c22"] as [string, string],
	},
];

/* ─── Styles (inline object) ───────────────────────────────────────────────── */
const S: Record<string, React.CSSProperties> = {
	/* page */
	page: {
		position: "relative",
		zIndex: 2,
		minHeight: "100vh",
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
	websiteLink: {
		display: "inline-flex",
		alignItems: "center",
		gap: 5,
		padding: "4px 10px",
		borderRadius: 999,
		background: "rgba(255,255,255,0.04)",
		border: "1px solid var(--color-line)",
		color: "var(--color-ink-2)",
		textDecoration: "none",
		fontSize: 12.5,
		transition: "color .18s, border-color .18s",
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
	statsPrimary: {
		fontFamily: "'Geist', sans-serif",
		fontSize: 44,
		fontWeight: 500,
		letterSpacing: "-0.03em",
		lineHeight: 1,
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

	/* campaigns block */
	campaignsGrid: {
		display: "grid",
		gridTemplateColumns: "1fr",
		gap: 14,
	},
	campaignCard: {
		padding: "20px 22px",
		borderRadius: 16,
		background:
			"linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
		border: "1px solid var(--color-line)",
		display: "flex",
		flexDirection: "column" as const,
		gap: 12,
	},
	campaignTop: {
		display: "flex",
		alignItems: "flex-start",
		gap: 14,
	},
	campaignMark: {
		width: 42,
		height: 42,
		borderRadius: 12,
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
	campaignMarkShine: {
		position: "absolute" as const,
		inset: 0,
		background:
			"linear-gradient(135deg, rgba(255,255,255,0.08), transparent 60%)",
	},
	campaignTitle: {
		fontFamily: "'Geist', sans-serif",
		fontSize: 16,
		fontWeight: 500,
		letterSpacing: "-0.01em",
		color: "var(--color-ink-0)",
		marginBottom: 4,
	},
	campaignBrief: {
		fontSize: 13,
		color: "var(--color-ink-2)",
		lineHeight: 1.5,
	},
	campaignMeta: {
		display: "flex",
		flexWrap: "wrap" as const,
		gap: 8,
		alignItems: "center",
	},
	campaignChip: {
		fontSize: 11,
		padding: "3px 9px",
		borderRadius: 999,
		background: "rgba(255,255,255,0.04)",
		border: "1px solid var(--color-line)",
		color: "var(--color-ink-2)",
	},
	campaignRate: {
		fontSize: 13,
		fontFamily: "'JetBrains Mono', monospace",
		color: "var(--color-accent-strong)",
		fontWeight: 500,
	},
	spotsBar: {
		height: 4,
		borderRadius: 999,
		background: "rgba(255,255,255,0.06)",
		overflow: "hidden",
	},
	spotsBarFill: {
		height: "100%",
		borderRadius: 999,
		background: "var(--color-accent-strong)",
	},
	spotsLabel: {
		fontSize: 11.5,
		color: "var(--color-ink-3)",
		fontFamily: "'JetBrains Mono', monospace",
		marginTop: 5,
	},

	/* past creators / brands block */
	creatorsGrid: {
		display: "grid",
		gridTemplateColumns: "repeat(3, 1fr)",
		gap: 12,
	},
	creatorCell: {
		padding: "16px 18px",
		borderRadius: 14,
		background:
			"linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
		border: "1px solid var(--color-line)",
		display: "flex",
		alignItems: "center",
		gap: 12,
	},
	creatorMark: {
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
	creatorMarkShine: {
		position: "absolute" as const,
		inset: 0,
		background:
			"linear-gradient(135deg, rgba(255,255,255,0.08), transparent 60%)",
	},
	creatorMeta: {
		flex: 1,
	},
	creatorName: {
		fontSize: 13.5,
		fontWeight: 500,
		color: "var(--color-ink-0)",
	},
	creatorSub: {
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

	/* similar brands section */
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

	/* empty state */
	emptyState: {
		padding: "48px 0",
		textAlign: "center" as const,
		color: "var(--color-ink-3)",
		fontSize: 14,
	},
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  COMPONENTS                                                                */
/* ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Breadcrumb ───────────────────────────────────────────────────────────── */
function BrandCrumb() {
	const brand = useBrand();
	return (
		<div style={S.crumb}>
			<div style={S.crumbLeft}>
				<Link
					href="/brands"
					style={{
						...S.crumbLink,
						display: "inline-flex",
						alignItems: "center",
						gap: 6,
					}}
				>
					<BackIcon /> Brands
				</Link>
				<span style={S.crumbSep}>/</span>
				<span>{brand.category}</span>
				<span style={S.crumbSep}>/</span>
				<span style={S.crumbCurrent}>{brand.name}</span>
			</div>
			<div style={S.crumbRight}>
				<button style={S.crumbBtn} aria-label="Save">
					<HeartIcon />
				</button>
				<button style={S.crumbBtn} aria-label="Share">
					<ShareIcon />
				</button>
			</div>
		</div>
	);
}

/* ─── BrandHero ────────────────────────────────────────────────────────────── */
function BrandHero({
	isOwner,
	campaigns,
}: {
	isOwner: boolean;
	campaigns: any[] | undefined;
}) {
	const brand = useBrand();
	const activeCampaigns = (campaigns ?? []).filter(
		(c) => c.status === "active",
	);

	return (
		<div className="cr-hero" style={S.heroGrid}>
			{/* Left: info */}
			<div className="cr-info" style={S.info}>
				<div style={S.avatarRow}>
					<div
						style={{
							...S.avatarBig,
							background: `linear-gradient(135deg, ${brand.logoColors[0]}, ${brand.logoColors[1]})`,
							color: brand.logoColors[0],
						}}
					>
						<div style={S.avatarShine} />
						{initials(brand.name)}
					</div>
					<div style={S.nameRow}>
						<div style={S.name}>{brand.name}</div>
						<div style={S.handle}>@{brand.handle}</div>
					</div>
				</div>

				<p style={S.bio}>{brand.bio}</p>

				<div style={S.metaRow}>
					<span style={S.metaPill}>
						<TagIcon /> {brand.category}
					</span>
					{brand.website && (
						<a
							href={
								brand.website.startsWith("http")
									? brand.website
									: `https://${brand.website}`
							}
							target="_blank"
							rel="noopener noreferrer"
							style={S.websiteLink}
						>
							<GlobeIcon /> {brand.website.replace(/^https?:\/\//, "")}
						</a>
					)}
					{activeCampaigns.length > 0 && (
						<span
							style={{
								...S.metaPill,
								background: "rgba(74,222,128,0.1)",
								border: "1px solid rgba(74,222,128,0.25)",
								color: "#4ade80",
							}}
						>
							<span
								style={{
									width: 6,
									height: 6,
									borderRadius: "50%",
									background: "#4ade80",
									display: "inline-block",
								}}
							/>{" "}
							{activeCampaigns.length} active campaign
							{activeCampaigns.length !== 1 ? "s" : ""}
						</span>
					)}
				</div>
			</div>

			{/* Right: stats card */}
			<div className="cr-stats" style={S.statsCard}>
				<div style={S.statsEyebrow}>Total paid out</div>
				<div style={S.statsPrimary}>{brand.totalPaidOut}</div>
				<div style={S.statsHelper}>
					Across {(campaigns ?? []).length} campaign
					{(campaigns ?? []).length !== 1 ? "s" : ""}
				</div>

				<div style={S.statsGrid}>
					<div style={S.statsCell}>
						<div style={S.statsCellNum}>{brand.rating}</div>
						<div style={S.starsRow}>
							{brand.rating !== "—" &&
								Array.from({ length: 5 }).map((_, i) => (
									<span
										key={i}
										style={{
											color:
												i < Math.round(parseFloat(brand.rating))
													? "#fbbf24"
													: "var(--color-ink-3)",
											fontSize: 11,
										}}
									>
										★
									</span>
								))}
						</div>
						<div style={S.statsCellLabel}>Avg. rating</div>
					</div>
					<div style={S.statsCell}>
						<div style={S.statsCellNum}>{brand.responseTime}</div>
						<div style={S.statsCellLabel}>Response time</div>
					</div>
					<div style={S.statsCell}>
						<div style={S.statsCellNum}>{brand.followers}</div>
						<div style={S.statsCellLabel}>Followers</div>
					</div>
					<div style={S.statsCell}>
						<div style={S.statsCellNum}>
							{activeCampaigns.length}
							<span style={S.statsCellUnit}> live</span>
						</div>
						<div style={S.statsCellLabel}>Campaigns</div>
					</div>
				</div>

				<div style={S.ctaRow}>
					{isOwner ? (
						<>
							<Link
								href="/settings"
								className="btn btn-glass"
								style={{
									width: "100%",
									justifyContent: "center",
									padding: "13px 20px",
									textDecoration: "none",
									display: "flex",
									alignItems: "center",
									gap: 8,
								}}
							>
								<EditIcon /> Edit profile
							</Link>
							<Link
								href="/campaigns/new"
								className="btn btn-primary"
								style={{
									width: "100%",
									justifyContent: "center",
									padding: "13px 20px",
									textDecoration: "none",
									display: "flex",
									alignItems: "center",
									gap: 8,
								}}
							>
								<ArrowIcon /> Create campaign
							</Link>
						</>
					) : (
						<>
							<Link
								href="/campaigns"
								className="btn btn-primary"
								style={{
									width: "100%",
									justifyContent: "center",
									padding: "13px 20px",
									textDecoration: "none",
									display: "flex",
									alignItems: "center",
									gap: 8,
								}}
							>
								<ArrowIcon /> View campaigns
							</Link>
							<div style={S.ctaSecRow}>
								<button
									className="btn btn-glass"
									style={{ flex: 1, justifyContent: "center" }}
								>
									Send message
								</button>
							</div>
						</>
					)}
					<p style={S.fineprint}>
						Response time: {brand.responseTime} · {PAST_CREATORS.length} past
						creators
					</p>
				</div>
			</div>
		</div>
	);
}

/* ─── Tabs ─────────────────────────────────────────────────────────────────── */
const TAB_NAMES = [
	"About",
	"Active Campaigns",
	"Past Creators",
	"Reviews",
] as const;
type TabName = (typeof TAB_NAMES)[number];

function TabBar({
	active,
	onChange,
	campaignCount,
}: {
	active: TabName;
	onChange: (t: TabName) => void;
	campaignCount: number;
}) {
	return (
		<div style={S.tabBar}>
			{TAB_NAMES.map((t) => {
				const isActive = t === active;
				const badge =
					t === "Active Campaigns"
						? campaignCount
						: t === "Past Creators"
							? PAST_CREATORS.length
							: t === "Reviews"
								? BRAND_REVIEWS.length
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
	const brand = useBrand();
	return (
		<div>
			<div style={S.blockEyebrow}>
				<FileIcon /> About
			</div>
			<h2 style={S.blockH2}>Who is {brand.name.split(" ")[0]}?</h2>
			<p style={S.longBioP}>{brand.bio}</p>
			<p style={S.longBioP}>
				Based in the {brand.category} space, {brand.name} partners with
				creators who align with their brand values and aesthetic. They look for
				authentic voices that can connect with their audience in a meaningful
				way.
			</p>
			<p style={S.longBioP}>
				With a track record of successful campaigns and {brand.totalPaidOut}{" "}
				paid out to creators, {brand.name} is a trusted partner on the inflio
				platform.
			</p>
			<div style={S.callout}>
				<span style={S.calloutStrong}>Looking for:</span> Creators in the{" "}
				{brand.category} category with engaged audiences. Typically books
				micro-to-mid tier creators for performance-driven campaigns.
				{brand.website && (
					<>
						{" "}
						Visit{" "}
						<a
							href={
								brand.website.startsWith("http")
									? brand.website
									: `https://${brand.website}`
							}
							target="_blank"
							rel="noopener noreferrer"
							style={{ color: "var(--color-accent-strong)" }}
						>
							{brand.website.replace(/^https?:\/\//, "")}
						</a>{" "}
						for more.
					</>
				)}
			</div>
		</div>
	);
}

/* ─── ActiveCampaignsBlock ─────────────────────────────────────────────────── */
function ActiveCampaignsBlock({ campaigns }: { campaigns: any[] | undefined }) {
	const brand = useBrand();
	const activeCampaigns = (campaigns ?? []).filter(
		(c) => c.status === "active",
	);

	if (activeCampaigns.length === 0) {
		return (
			<div style={S.emptyState}>
				No active campaigns right now. Check back soon.
			</div>
		);
	}

	const COLOR_PAIRS: [string, string][] = [
		["#bef264", "#1a2e05"],
		["#fde68a", "#422006"],
		["#ddd6fe", "#1e1b4b"],
		["#fecdd3", "#4c0519"],
		["#a7f3d0", "#022c22"],
		["#bae6fd", "#082f49"],
	];

	return (
		<div style={S.campaignsGrid}>
			<div style={S.blockEyebrow}>
				<BriefcaseIcon /> Active Campaigns
			</div>
			{activeCampaigns.map((campaign, i) => {
				const pair = COLOR_PAIRS[i % COLOR_PAIRS.length];
				const spotsUsed = campaign.totalSpots - campaign.spotsLeft;
				const spotsPct = (spotsUsed / (campaign.totalSpots || 1)) * 100;
				return (
					<Link
						key={campaign._id}
						href={`/campaign/${campaign._id}`}
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<div style={S.campaignCard}>
							<div style={S.campaignTop}>
								<div
									style={{
										...S.campaignMark,
										background: `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`,
										color: pair[0],
									}}
								>
									<div style={S.campaignMarkShine} />
									{initials(brand.name)}
								</div>
								<div style={{ flex: 1 }}>
									<div style={S.campaignTitle}>{campaign.title}</div>
									<div style={S.campaignBrief}>{campaign.brief}</div>
								</div>
							</div>
							<div style={S.campaignMeta}>
								<span style={S.campaignRate}>
									{campaign.currency}
									{campaign.rate}/{campaign.perViews}
								</span>
								<span style={S.campaignChip}>{campaign.platform}</span>
								<span style={S.campaignChip}>{campaign.category}</span>
								{campaign.trending && (
									<span
										style={{
											...S.campaignChip,
											color: "var(--color-accent-strong)",
											background: "rgba(190,242,100,0.08)",
											border: "1px solid rgba(190,242,100,0.2)",
										}}
									>
										Trending
									</span>
								)}
								<span style={{ ...S.campaignChip, marginLeft: "auto" }}>
									{campaign.daysLeft}d left
								</span>
							</div>
							<div>
								<div style={S.spotsBar}>
									<div
										style={{
											...S.spotsBarFill,
											width: `${spotsPct}%`,
										}}
									/>
								</div>
								<div style={S.spotsLabel}>
									{campaign.spotsLeft} of {campaign.totalSpots} spots remaining
								</div>
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}

/* ─── PastCreatorsBlock ────────────────────────────────────────────────────── */
function PastCreatorsBlock() {
	return (
		<div>
			<div style={S.blockEyebrow}>
				<UsersIcon /> Past Creators
			</div>
			<div style={S.creatorsGrid}>
				{PAST_CREATORS.map((c) => (
					<div key={c.name} style={S.creatorCell}>
						<div
							style={{
								...S.creatorMark,
								background: `linear-gradient(135deg, ${c.color[0]}, ${c.color[1]})`,
								color: c.color[1],
							}}
						>
							<div style={S.creatorMarkShine} />
							{initials(c.name)}
						</div>
						<div style={S.creatorMeta}>
							<div style={S.creatorName}>{c.name}</div>
							<div style={S.creatorSub}>
								{c.deals} deal{c.deals > 1 ? "s" : ""} · Last {c.last}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

/* ─── ReviewsBlock ─────────────────────────────────────────────────────────── */
function ReviewsBlock() {
	return (
		<div>
			<div style={S.blockEyebrow}>
				<StarIcon /> Reviews from creators
			</div>
			{BRAND_REVIEWS.map((r, i) => (
				<div key={i} style={S.reviewCard}>
					<div style={S.reviewHead}>
						<div
							style={{
								...S.creatorMark,
								width: 32,
								height: 32,
								fontSize: 12,
								borderRadius: 8,
								background: `linear-gradient(135deg, ${r.color[0]}, ${r.color[1]})`,
								color: r.color[1],
							}}
						>
							<div style={S.creatorMarkShine} />
							{initials(r.creator)}
						</div>
						<div>
							<div style={S.reviewName}>{r.creator}</div>
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

/* ─── ActivityCard (aside) ─────────────────────────────────────────────────── */
function ActivityCard() {
	const items = [
		{ text: "Launched new campaign", time: "2d ago" },
		{ text: "Paid out to creator", time: "5d ago" },
		{ text: "Brief approved", time: "1w ago" },
		{ text: "Joined inflio", time: "2mo ago" },
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

/* ─── BrandInfoCard (aside) ────────────────────────────────────────────────── */
function BrandInfoCard() {
	const brand = useBrand();
	const rows: { key: string; val: React.ReactNode }[] = [
		{ key: "Category", val: brand.category },
		{ key: "Reply time", val: brand.responseTime },
		{
			key: "Status",
			val: (
				<span style={{ display: "flex", alignItems: "center", gap: 6 }}>
					<span style={S.greenDot} /> Accepting briefs
				</span>
			),
		},
		{ key: "Rating", val: brand.rating === "—" ? "No ratings yet" : `${brand.rating} / 5` },
		{ key: "Total paid", val: brand.totalPaidOut },
		...(brand.website
			? [
					{
						key: "Website",
						val: (
							<a
								href={
									brand.website.startsWith("http")
										? brand.website
										: `https://${brand.website}`
								}
								target="_blank"
								rel="noopener noreferrer"
								style={{ color: "var(--color-accent-strong)", fontWeight: 500 }}
							>
								{brand.website.replace(/^https?:\/\//, "")}
							</a>
						),
					},
				]
			: []),
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

/* ─── SimilarBrands ────────────────────────────────────────────────────────── */
type SimilarBrand = {
	_id: string;
	name: string;
	handle: string;
	logoColors: [string, string];
	category: string;
	totalPaidOut: string;
	rating: string;
	responseTime: string;
};

function SimilarBrands({ brands }: { brands: SimilarBrand[] }) {
	if (brands.length === 0) return null;
	return (
		<div style={S.similarSection}>
			<h2 style={S.blockH2}>Similar brands</h2>
			<div style={S.similarGrid}>
				{brands.map((b) => (
					<Link
						key={b._id}
						href={`/brand/${b._id}`}
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<div style={S.simCard}>
							<div style={S.simHead}>
								<div
									style={{
										...S.simAvatar,
										background: `linear-gradient(135deg, ${b.logoColors[0]}, ${b.logoColors[1]})`,
										color: b.logoColors[0],
									}}
								>
									<div style={S.avatarShine} />
									{initials(b.name)}
								</div>
								<div>
									<div style={S.simName}>{b.name}</div>
									<div style={S.simHandle}>@{b.handle}</div>
								</div>
							</div>
							<div style={S.simStats}>
								<div style={S.simStatCell}>
									<div style={S.simStatNum}>{b.totalPaidOut}</div>
									<div style={S.simStatLabel}>Paid out</div>
								</div>
								<div style={S.simStatCell}>
									<div style={S.simStatNum}>{b.rating}</div>
									<div style={S.simStatLabel}>Rating</div>
								</div>
								<div style={S.simStatCell}>
									<div style={S.simStatNum}>{b.responseTime}</div>
									<div style={S.simStatLabel}>Response</div>
								</div>
							</div>
							<div style={S.simFoot}>
								<span>{b.category}</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

/* ─── Footer ───────────────────────────────────────────────────────────────── */
function FooterBrand() {
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
export default function BrandDetailPage() {
	const params = useParams();
	const id = params.id as string;

	const base = useQuery(
		api.brands.getById,
		id ? { id: id as Id<"brands"> } : "skip",
	);
	const allBrands = useQuery(api.brands.list);
	const campaigns = useQuery(
		api.campaigns.listByBrand,
		id ? { brandId: id as Id<"brands"> } : "skip",
	);

	const { data: session } = useSession();
	const userId = session?.user?.id;
	const myBrandProfile = useQuery(
		api.brands.getByUserId,
		userId ? { userId } : "skip",
	);
	const isOwner = !!myBrandProfile && myBrandProfile._id === id;

	const [tab, setTab] = useState<TabName>("About");

	/* Loading state */
	if (base === undefined) {
		return (
			<>
				<div className="ambient" />
				<div className="grain" />
				<div style={{ position: "relative", zIndex: 1 }}>
					<SharedNav />
					<div className="shell" style={{ paddingTop: 48 }}>
						{/* Hero skeleton */}
						<div
							style={{
								display: "flex",
								alignItems: "flex-start",
								gap: 24,
								marginBottom: 40,
							}}
						>
							<div
								style={{
									width: 80,
									height: 80,
									borderRadius: 18,
									background: "rgba(255,255,255,0.06)",
									flexShrink: 0,
								}}
							/>
							<div style={{ flex: 1 }}>
								<div
									style={{
										width: "40%",
										height: 24,
										borderRadius: 8,
										marginBottom: 10,
										background: "rgba(255,255,255,0.06)",
									}}
								/>
								<div
									style={{
										width: "25%",
										height: 14,
										borderRadius: 6,
										marginBottom: 12,
										background: "rgba(255,255,255,0.06)",
									}}
								/>
								<div
									style={{
										width: "80%",
										height: 14,
										borderRadius: 6,
										marginBottom: 6,
										background: "rgba(255,255,255,0.06)",
									}}
								/>
								<div
									style={{
										width: "55%",
										height: 14,
										borderRadius: 6,
										marginBottom: 16,
										background: "rgba(255,255,255,0.06)",
									}}
								/>
								<div style={{ display: "flex", gap: 20 }}>
									{[64, 72, 56, 64].map((w, i) => (
										<div
											key={i}
											style={{
												width: w,
												height: 14,
												borderRadius: 6,
												background: "rgba(255,255,255,0.06)",
											}}
										/>
									))}
								</div>
							</div>
						</div>
						{/* Tab bar skeleton */}
						<div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
							{[60, 120, 100, 70].map((w, i) => (
								<div
									key={i}
									style={{
										width: w,
										height: 14,
										borderRadius: 6,
										background: "rgba(255,255,255,0.06)",
									}}
								/>
							))}
						</div>
						{/* Content + sidebar skeleton */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 340px",
								gap: 32,
							}}
						>
							<div>
								{[100, 90, 95, 100, 80, 100, 70].map((pct, i) => (
									<div
										key={i}
										style={{
											width: `${pct}%`,
											height: 14,
											borderRadius: 6,
											marginBottom: 10,
											background: "rgba(255,255,255,0.06)",
										}}
									/>
								))}
							</div>
							<div>
								<div
									style={{
										width: "100%",
										height: 140,
										borderRadius: 16,
										marginBottom: 16,
										background: "rgba(255,255,255,0.04)",
									}}
								/>
								<div
									style={{
										width: "100%",
										height: 120,
										borderRadius: 16,
										background: "rgba(255,255,255,0.04)",
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}

	/* Not-found state */
	if (base === null) {
		return (
			<>
				<div className="ambient" />
				<div className="grain" />
				<div style={{ position: "relative", zIndex: 1 }}>
					<SharedNav />
					<div
						style={{
							padding: 80,
							textAlign: "center",
							color: "var(--color-ink-2)",
						}}
					>
						Brand not found
					</div>
				</div>
			</>
		);
	}

	const brand: BrandData = {
		_id: base._id,
		name: base.name,
		handle: base.handle,
		logoColors: (base.logoColors ?? ["#1e1e24", "#f5f5f5"]) as [string, string],
		bio: base.bio,
		followers: base.followers,
		rating: base.rating,
		totalPaidOut: base.totalPaidOut,
		responseTime: base.responseTime,
		website: base.website,
		category: base.category,
		userId: base.userId,
	};

	const activeCampaigns = (campaigns ?? []).filter(
		(c) => c.status === "active",
	);

	const similarBrands: SimilarBrand[] = (() => {
		const others = (allBrands ?? []).filter(
			(b) => b._id !== base._id && b.accountStatus !== "disabled",
		);
		const matched = others
			.filter((b) => b.category === base.category)
			.slice(0, 3);
		const result =
			matched.length >= 3
				? matched
				: [
						...matched,
						...others
							.filter((b) => !matched.includes(b))
							.slice(0, 3 - matched.length),
					];
		return result.map((b) => ({
			_id: b._id,
			name: b.name,
			handle: b.handle,
			logoColors: (b.logoColors ?? ["#1e1e24", "#f5f5f5"]) as [string, string],
			category: b.category,
			totalPaidOut: b.totalPaidOut,
			rating: b.rating,
			responseTime: b.responseTime,
		}));
	})();

	const renderTab = () => {
		switch (tab) {
			case "About":
				return <AboutBlock />;
			case "Active Campaigns":
				return <ActiveCampaignsBlock campaigns={campaigns} />;
			case "Past Creators":
				return <PastCreatorsBlock />;
			case "Reviews":
				return <ReviewsBlock />;
		}
	};

	return (
		<BrandCtx.Provider value={brand}>
			<>
				<div className="ambient" />
				<div className="grain" />
				<div style={S.page}>
					<SharedNav />
					<div className="shell">
						<BrandCrumb />
						<BrandHero isOwner={isOwner} campaigns={campaigns} />
						<TabBar
							active={tab}
							onChange={setTab}
							campaignCount={activeCampaigns.length}
						/>
						<div style={S.contentGrid}>
							<div style={S.main}>{renderTab()}</div>
							<aside style={S.aside}>
								<ActivityCard />
								<BrandInfoCard />
							</aside>
						</div>
						<SimilarBrands brands={similarBrands} />
					</div>
					<FooterBrand />
				</div>
			</>
		</BrandCtx.Provider>
	);
}
