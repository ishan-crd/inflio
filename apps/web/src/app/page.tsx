"use client";

import Link from "next/link";
import { useState } from "react";
import {
	ArrowIcon,
	IGIcon,
	PlusIcon,
	VerifiedIcon,
	YTIcon,
} from "@/components/icons";
import { Nav as SharedNav } from "@/components/nav";

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const stats = [
	{ num: "237", label: "Live campaigns", sub: "updated hourly" },
	{ num: "12.4K+", label: "Verified creators", sub: "on platform" },
	{ num: "\u20B92.4Cr", label: "Paid this month", sub: "real-time payouts" },
	{ num: "48hrs", label: "Avg. first payout", sub: "from sign-up" },
];

const brands = [
	"Zomato", "Nykaa", "boAt", "Mamaearth", "Sugar", "Lenskart",
	"Cred", "PhonePe", "Swiggy", "Meesho", "Myntra", "Noise",
	"Fire-Boltt", "Dunzo", "Blinkit",
];

const creatorValueProps = [
	{
		num: "01",
		title: "Pay-per-view model",
		desc: "Brands set a rate per 1,000 views. Your content earns proportionally \u2014 the more views, the more you make. No flat fees, no guesswork.",
		accent: "You set the rate, we track the views",
	},
	{
		num: "02",
		title: "Verified view tracking",
		desc: "We integrate directly with Instagram and YouTube APIs. Bot traffic is filtered out \u2014 only real, verified views count toward your earnings.",
		accent: "Official API integration",
	},
	{
		num: "03",
		title: "Instant withdrawals",
		desc: "Earnings accumulate in real time. Withdraw to your bank or UPI whenever you want \u2014 no minimum threshold, processed within 24\u201348 hours.",
		accent: "Zero minimum withdrawal",
	},
];

const brandValueProps = [
	{
		num: "01",
		title: "Pay only for results",
		desc: "Set your rate per 1,000 views and only spend when content actually performs. No upfront creator fees, no wasted budget on content that doesn\u2019t land.",
		accent: "Zero wasted ad spend",
	},
	{
		num: "02",
		title: "Vetted creator network",
		desc: "Access 12,000+ verified creators across every niche. Filter by platform, engagement rate, audience demographics, and content quality.",
		accent: "12K+ creators, all verified",
	},
	{
		num: "03",
		title: "Real-time campaign dashboard",
		desc: "Track views, spend, and creator submissions live. Approve content before it goes public and pause campaigns anytime with one click.",
		accent: "Full control, full transparency",
	},
];

const creatorSteps = [
	{ k: "01", t: "Browse & apply", d: "Discover campaigns from top Indian brands filtered by niche, platform, and pay rate. Apply in one tap." },
	{ k: "02", t: "Post your content", d: "Create authentic content on Instagram or YouTube. Submit the link \u2014 we verify and start tracking views instantly." },
	{ k: "03", t: "Get paid instantly", d: "Earnings accumulate in real time. Withdraw to your bank or UPI whenever you want." },
];

const testimonials = [
	{
		q: "\u201CI posted one reel for a Zomato campaign and made \u20B922,000 in ten days. With Inflio I finally get paid what my audience is actually worth.\u201D",
		a: "Aanya V.",
		r: "Food & lifestyle \u00b7 1.2M followers",
	},
	{
		q: "\u201CThe pay-per-view model is genius. No more negotiating flat fees that undervalue my reach.\u201D",
		a: "Rohan M.",
		r: "Tech reviewer \u00b7 840K subs",
	},
	{
		q: "\u201CWithdrew \u20B945,000 in my first month. The UPI payout is instant \u2014 feels like getting paid by the hour.\u201D",
		a: "Priya K.",
		r: "Beauty creator \u00b7 2.1M followers",
	},
];

const fauxCampaigns = [
	{ tag: "LIVE", title: "Summer Food Reel", company: "Zomato India \u00b7 Instagram", comp: "\u20B918 / 1k views", rot: -6, top: 30, z: 1, op: 0.55 },
	{ tag: "NEW", title: "Glow-up Series", company: "Nykaa Beauty \u00b7 YouTube", comp: "\u20B924 / 1k views", rot: 3, top: 130, z: 2, op: 0.85 },
	{ tag: "HOT", title: "Unbox the Beat", company: "boAt Lifestyle \u00b7 IG + YT", comp: "\u20B921 / 1k views", rot: -2, top: 250, z: 3, op: 1 },
];

const faqs = [
	{
		q: "How does the pay-per-view model work?",
		a: "Brands set a rate (e.g. \u20B918 per 1,000 views). When your content earns views, Inflio tracks them in real time and credits your wallet automatically. You earn proportionally \u2014 the more views, the more you make.",
	},
	{
		q: "Is there a minimum follower count to join?",
		a: "No strict minimum. We accept creators from 5,000 followers upwards. What matters more is engagement rate and content quality.",
	},
	{
		q: "How quickly can I withdraw my earnings?",
		a: "Withdrawals are processed within 24\u201348 hours to any Indian bank account or UPI handle. There is no minimum withdrawal threshold.",
	},
	{
		q: "What platforms are supported?",
		a: "Currently Instagram (Reels & posts), YouTube (Shorts & long-form), and X (Twitter). Brands can specify which platforms they want content on.",
	},
	{
		q: "How does Inflio verify views are real?",
		a: "We integrate directly with the official Instagram and YouTube APIs to pull verified view counts. Bot traffic and artificially inflated views are filtered out.",
	},
];

/* ─────────────────────────────────────────
   Components
───────────────────────────────────────── */
function ArrowRightIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M3 8h10M9 4l4 4-4 4" />
		</svg>
	);
}

/* ─────────────────────────────────────────
   Hero
───────────────────────────────────────── */
function Hero() {
	return (
		<section style={{ paddingTop: 96, paddingBottom: 80 }}>
			<div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
				{/* Eyebrow */}
				<div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
					<span
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 6,
							fontSize: 11.5,
							fontWeight: 500,
							fontFamily: "var(--font-geist-mono), monospace",
							textTransform: "uppercase",
							letterSpacing: "0.04em",
							padding: "5px 10px",
							borderRadius: 999,
							background: "transparent",
							border: "1px solid oklch(0.75 0.18 145 / 0.4)",
							color: "oklch(0.75 0.18 145)",
						}}
					>
						<span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", boxShadow: "0 0 8px currentColor" }} />
						Now live in India
					</span>
				</div>

				{/* Headline */}
				<h1
					style={{
						fontFamily: "var(--font-instrument-serif), 'Instrument Serif', serif",
						fontWeight: 400,
						lineHeight: 0.96,
						letterSpacing: "-0.025em",
						fontSize: "clamp(56px, 8vw, 112px)",
						margin: 0,
					}}
				>
					Performance pay, <em style={{ color: "var(--accent)" }}>for the</em>
					<br />
					<em style={{ color: "var(--accent)" }}>creator</em> economy.
				</h1>

				{/* Subtitle */}
				<p
					style={{
						fontSize: 18,
						lineHeight: 1.625,
						maxWidth: 620,
						margin: "36px auto 0",
						color: "var(--text-2)",
						letterSpacing: "-0.005em",
					}}
				>
					Inflio connects brands with creators on a pure pay-per-view model.
					No flat fees. No guesswork. Just content that earns every view it gets.
				</p>

				{/* Actions */}
				<div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 40 }}>
					<Link
						href="/login?mode=signup"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							fontSize: 14.5,
							fontWeight: 600,
							padding: "14px 22px",
							borderRadius: 12,
							textDecoration: "none",
							background: "var(--accent)",
							color: "var(--accent-ink)",
							boxShadow: "0 0 0 1px var(--accent), 0 8px 24px -8px var(--glow)",
							transition: "all 0.2s",
						}}
					>
						Start earning free <ArrowRightIcon />
					</Link>
					<Link
						href="/marketplace"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							fontSize: 14.5,
							fontWeight: 500,
							padding: "14px 22px",
							borderRadius: 12,
							textDecoration: "none",
							background: "var(--surface)",
							border: "1px solid var(--border)",
							color: "var(--text)",
							transition: "all 0.2s",
						}}
					>
						Browse campaigns
					</Link>
				</div>

				{/* Trust */}
				<div style={{ marginTop: 32, display: "inline-flex", alignItems: "center", gap: 14, fontSize: 13, color: "var(--text-3)" }}>
					<div style={{ display: "flex" }}>
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								style={{
									width: 26,
									height: 26,
									borderRadius: "50%",
									fontFamily: "var(--font-instrument-serif), serif",
									fontSize: 13,
									display: "grid",
									placeItems: "center",
									color: "white",
									background: `oklch(${0.55 + i * 0.07} 0.12 ${i * 70})`,
									border: "2px solid var(--bg)",
									marginLeft: i === 1 ? 0 : -8,
								}}
							>
								{["A", "R", "P", "S"][i - 1]}
							</div>
						))}
					</div>
					<span>
						<span style={{ fontWeight: 500, color: "var(--text-2)" }}>12,400+ creators</span> &middot; zero upfront cost
					</span>
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────
   Stats Ribbon
───────────────────────────────────────── */
function StatsRibbon() {
	return (
		<section style={{ padding: "40px 0" }}>
			<div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(4, 1fr)",
						gap: 1,
						borderRadius: 20,
						overflow: "hidden",
						background: "var(--border-soft)",
						border: "1px solid var(--border-soft)",
					}}
				>
					{stats.map((s, i) => (
						<div key={i} style={{ padding: 32, background: "var(--surface)", position: "relative" }}>
							<div style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 56, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.num}</div>
							<div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 8, color: "var(--text-3)" }}>{s.label}</div>
							<div style={{ fontSize: 12, fontFamily: "var(--font-geist-mono), monospace", marginTop: 4, color: "var(--text-4)" }}>{s.sub}</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────
   Marquee
───────────────────────────────────────── */
function BrandMarquee() {
	return (
		<section style={{ padding: "60px 0" }}>
			<div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", textAlign: "center", marginBottom: 24 }}>
				<span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text-3)" }}>
					<span style={{ width: 24, height: 1, background: "var(--text-4)" }} />
					Campaigns from
				</span>
			</div>
			<div className="marquee">
				<div className="marquee-track">
					{[...brands, ...brands].map((c, i) => (
						<div
							key={i}
							style={{
								fontFamily: "var(--font-instrument-serif), serif",
								fontSize: 36,
								whiteSpace: "nowrap",
								letterSpacing: "-0.02em",
								color: "var(--text-3)",
								fontStyle: i % 3 === 0 ? "italic" : "normal",
							}}
						>
							{c}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────
   Value Props
───────────────────────────────────────── */
function ValueProps() {
	const [tab, setTab] = useState<"creators" | "brands">("creators");
	const props = tab === "creators" ? creatorValueProps : brandValueProps;

	return (
		<section style={{ padding: "100px 0" }}>
			<div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
				<div style={{ maxWidth: 720, marginBottom: 40 }}>
					<span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text-3)" }}>
						<span style={{ width: 24, height: 1, background: "var(--text-4)" }} />
						Why Inflio
					</span>
					<h2
						style={{
							fontFamily: "var(--font-instrument-serif), serif",
							fontWeight: 400,
							marginTop: 16,
							lineHeight: 1.02,
							letterSpacing: "-0.02em",
							fontSize: "clamp(36px, 4.5vw, 56px)",
						}}
					>
						The creator economy <em style={{ color: "var(--accent)" }}>you see</em> is broken.
						<br />
						We built the <em style={{ color: "var(--accent)" }}>fix</em>.
					</h2>
				</div>

				{/* Tab toggle */}
				<div style={{ marginBottom: 32 }}>
					<div
						style={{
							display: "inline-flex",
							borderRadius: 999,
							padding: 4,
							background: "var(--surface)",
							border: "1px solid var(--border-soft)",
						}}
					>
						{(["creators", "brands"] as const).map((t) => (
							<button
								key={t}
								type="button"
								onClick={() => setTab(t)}
								style={{
									padding: "8px 20px",
									borderRadius: 999,
									border: "none",
									fontSize: 13.5,
									fontWeight: 500,
									cursor: "pointer",
									transition: "all 0.2s",
									background: tab === t ? "var(--surface-3)" : "transparent",
									color: tab === t ? "var(--text)" : "var(--text-3)",
								}}
							>
								For {t === "creators" ? "Creators" : "Brands"}
							</button>
						))}
					</div>
				</div>

				<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
					{props.map((v) => (
						<div
							key={v.title}
							style={{
								padding: 32,
								minHeight: 280,
								display: "flex",
								flexDirection: "column",
								gap: 14,
								borderRadius: 18,
								background: "var(--surface)",
								border: "1px solid var(--border-soft)",
								transition: "border-color 0.2s",
							}}
						>
							<div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 12, letterSpacing: "0.1em", color: "var(--text-4)" }}>
								{v.num} / 03
							</div>
							<h3 style={{ fontFamily: "var(--font-instrument-serif), serif", fontWeight: 400, fontSize: 30, lineHeight: 1.1, letterSpacing: "-0.015em", margin: 0 }}>
								{v.title}
							</h3>
							<p style={{ fontSize: 14.5, lineHeight: 1.625, margin: 0, color: "var(--text-2)" }}>{v.desc}</p>
							<div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border-soft)", fontFamily: "var(--font-geist-mono), monospace", fontSize: 11.5, letterSpacing: "0.04em", color: "var(--accent)" }}>
								&rarr; {v.accent}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────
   How It Works
───────────────────────────────────────── */
function HowItWorks() {
	return (
		<section style={{ paddingTop: 60, paddingBottom: 120 }}>
			<div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
					<div>
						<span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text-3)" }}>
							<span style={{ width: 24, height: 1, background: "var(--text-4)" }} />
							How it works
						</span>
						<h2
							style={{
								fontFamily: "var(--font-instrument-serif), serif",
								fontWeight: 400,
								marginTop: 16,
								marginBottom: 24,
								lineHeight: 1.02,
								letterSpacing: "-0.02em",
								fontSize: "clamp(36px, 4.5vw, 56px)",
							}}
						>
							A <em style={{ color: "var(--accent)" }}>simple</em> model,
							<br />
							wired to <em style={{ color: "var(--accent)" }}>real</em> results.
						</h2>
						<p style={{ fontSize: 15, lineHeight: 1.625, maxWidth: 480, color: "var(--text-2)" }}>
							Brands post campaigns, creators apply, content earns views, and everyone gets paid.
							The entire flow takes under 10 minutes.
						</p>
						<div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 14 }}>
							{creatorSteps.map((s) => (
								<div
									key={s.k}
									style={{
										display: "flex",
										gap: 18,
										alignItems: "flex-start",
										padding: "16px 0",
										borderTop: "1px solid var(--border-soft)",
									}}
								>
									<span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 12, fontWeight: 500, marginTop: 2, color: "var(--accent)" }}>
										{s.k}
									</span>
									<div>
										<div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>{s.t}</div>
										<div style={{ fontSize: 13.5, lineHeight: 1.625, color: "var(--text-3)" }}>{s.d}</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Faux campaign stack */}
					<div style={{ position: "relative", height: 480 }}>
						<div
							style={{
								position: "absolute",
								top: 100,
								left: "50%",
								transform: "translateX(-50%)",
								width: 400,
								height: 400,
								background: "radial-gradient(circle, var(--glow), transparent 65%)",
								filter: "blur(20px)",
							}}
						/>
						{fauxCampaigns.map((it, i) => (
							<div
								key={i}
								style={{
									position: "absolute",
									left: "50%",
									width: 360,
									borderRadius: 16,
									padding: 22,
									top: it.top,
									transform: `translateX(-50%) rotate(${it.rot}deg)`,
									background: "var(--surface)",
									border: "1px solid var(--border)",
									boxShadow: "var(--shadow-lg)",
									zIndex: it.z,
									opacity: it.op,
								}}
							>
								<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
									<span
										style={{
											display: "inline-flex",
											alignItems: "center",
											gap: 6,
											fontSize: 11.5,
											fontWeight: 500,
											fontFamily: "var(--font-geist-mono), monospace",
											textTransform: "uppercase",
											letterSpacing: "0.04em",
											padding: "5px 10px",
											borderRadius: 999,
											background: "color-mix(in oklch, var(--accent) 14%, transparent)",
											color: "var(--accent)",
											border: "1px solid color-mix(in oklch, var(--accent) 30%, transparent)",
										}}
									>
										{it.tag}
									</span>
									<span style={{ marginLeft: "auto", fontSize: 12, fontFamily: "var(--font-geist-mono), monospace", color: "var(--text-4)" }}>2h ago</span>
								</div>
								<h4 style={{ fontFamily: "var(--font-instrument-serif), serif", fontWeight: 400, fontSize: 24, letterSpacing: "-0.01em", margin: "0 0 4px" }}>{it.title}</h4>
								<div style={{ fontSize: 13, marginBottom: 16, color: "var(--text-3)" }}>{it.company}</div>
								<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid var(--border-soft)" }}>
									<span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 13, color: "var(--accent)" }}>{it.comp}</span>
									<ArrowRightIcon />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────
   Testimonials
───────────────────────────────────────── */
function Testimonials() {
	return (
		<section style={{ padding: "80px 0", borderTop: "1px solid var(--border-soft)", borderBottom: "1px solid var(--border-soft)" }}>
			<div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
				{testimonials.map((t, i) => (
					<div key={i}>
						<p style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.01em", margin: 0, color: "var(--text)" }}>
							{t.q}
						</p>
						<div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 10 }}>
							<div
								style={{
									width: 32,
									height: 32,
									borderRadius: "50%",
									fontFamily: "var(--font-instrument-serif), serif",
									fontSize: 15,
									display: "grid",
									placeItems: "center",
									color: "white",
									background: `oklch(${0.55 + i * 0.08} 0.12 ${(i + 1) * 90})`,
								}}
							>
								{t.a[0]}
							</div>
							<div>
								<div style={{ fontSize: 13, fontWeight: 500 }}>{t.a}</div>
								<div style={{ fontSize: 12, fontFamily: "var(--font-geist-mono), monospace", color: "var(--text-3)" }}>{t.r}</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────
   FAQ
───────────────────────────────────────── */
function FAQ() {
	const [open, setOpen] = useState<number | null>(null);

	return (
		<section style={{ padding: "100px 0" }}>
			<div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px" }}>
				<div style={{ textAlign: "center", marginBottom: 48 }}>
					<span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text-3)" }}>
						<span style={{ width: 24, height: 1, background: "var(--text-4)" }} />
						FAQ
					</span>
					<h2
						style={{
							fontFamily: "var(--font-instrument-serif), serif",
							fontWeight: 400,
							marginTop: 16,
							lineHeight: 1.02,
							letterSpacing: "-0.02em",
							fontSize: "clamp(36px, 4.5vw, 56px)",
						}}
					>
						Questions, <em style={{ color: "var(--accent)" }}>answered.</em>
					</h2>
				</div>
				<div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
					{faqs.map((faq, i) => (
						<div
							key={i}
							onClick={() => setOpen(open === i ? null : i)}
							style={{
								borderTop: "1px solid var(--border-soft)",
								padding: "20px 0",
								cursor: "pointer",
							}}
						>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16, fontWeight: 500 }}>
								{faq.q}
								<span style={{ flexShrink: 0, marginLeft: 16, color: "var(--text-3)", transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>
									<PlusIcon />
								</span>
							</div>
							<div
								style={{
									overflow: "hidden",
									maxHeight: open === i ? 200 : 0,
									opacity: open === i ? 1 : 0,
									transition: "max-height 0.3s ease, opacity 0.2s ease",
								}}
							>
								<p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-2)", marginTop: 12, marginBottom: 0 }}>{faq.a}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────
   Final CTA
───────────────────────────────────────── */
function FinalCTA() {
	return (
		<section style={{ padding: "120px 0" }}>
			<div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
				<h2
					style={{
						fontFamily: "var(--font-instrument-serif), serif",
						fontWeight: 400,
						marginBottom: 24,
						lineHeight: 1.02,
						letterSpacing: "-0.02em",
						fontSize: "clamp(36px, 4.5vw, 56px)",
					}}
				>
					Your content. <em style={{ color: "var(--accent)" }}>Your paycheck.</em>
				</h2>
				<p style={{ fontSize: 16, maxWidth: 520, margin: "0 auto 36px", color: "var(--text-2)" }}>
					Join 12,400+ creators already earning with Inflio. Free to join. No contracts. Start today.
				</p>
				<div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
					<Link
						href="/login?mode=signup"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							fontSize: 14.5,
							fontWeight: 600,
							padding: "14px 22px",
							borderRadius: 12,
							textDecoration: "none",
							background: "var(--accent)",
							color: "var(--accent-ink)",
							boxShadow: "0 0 0 1px var(--accent), 0 8px 24px -8px var(--glow)",
							transition: "all 0.2s",
						}}
					>
						Get started free <ArrowRightIcon />
					</Link>
					<Link
						href="/marketplace"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							fontSize: 14.5,
							fontWeight: 500,
							padding: "14px 22px",
							borderRadius: 12,
							textDecoration: "none",
							background: "var(--surface)",
							border: "1px solid var(--border)",
							color: "var(--text)",
							transition: "all 0.2s",
						}}
					>
						Browse campaigns
					</Link>
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────
   Footer
───────────────────────────────────────── */
function Footer() {
	return (
		<footer style={{ borderTop: "1px solid var(--border-soft)", padding: "64px 0 40px" }}>
			<div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
				<div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 48 }}>
					<div>
						<div className="logo" style={{ marginBottom: 14 }}>
							<div className="logo-dot" />
							Inflio
						</div>
						<p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text-3)", maxWidth: 280 }}>
							Performance pay for the creator economy. Brands pay per view. Creators earn every time.
						</p>
					</div>
					<div>
						<div style={{ fontSize: 12, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-4)", marginBottom: 16 }}>Product</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							<Link href="/marketplace" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>Marketplace</Link>
							<Link href="/creators" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>For Creators</Link>
							<a href="#how-it-works" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>How it works</a>
						</div>
					</div>
					<div>
						<div style={{ fontSize: 12, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-4)", marginBottom: 16 }}>Creators</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							<Link href="/login?mode=signup" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>Sign up</Link>
							<Link href="/login" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>Sign in</Link>
						</div>
					</div>
					<div>
						<div style={{ fontSize: 12, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-4)", marginBottom: 16 }}>Brands</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							<Link href="/login?mode=signup&role=brand" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>Post a campaign</Link>
							<a href="#how-it-works" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>How brands use Inflio</a>
						</div>
					</div>
					<div>
						<div style={{ fontSize: 12, fontFamily: "var(--font-geist-mono), monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-4)", marginBottom: 16 }}>Legal</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							<a href="/privacy" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>Privacy policy</a>
							<a href="/terms" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>Terms of service</a>
						</div>
					</div>
				</div>
				<div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-soft)", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-4)" }}>
					<span>&copy; 2025 Inflio Technologies Pvt. Ltd. All rights reserved.</span>
					<span>Made in India</span>
				</div>
			</div>
		</footer>
	);
}

/* ─────────────────────────────────────────
   Page root
───────────────────────────────────────── */
export default function LandingPage() {
	return (
		<div className="page-enter">
			<SharedNav />
			<Hero />
			<StatsRibbon />
			<BrandMarquee />
			<ValueProps />
			<HowItWorks />
			<Testimonials />
			<FAQ />
			<FinalCTA />
			<Footer />
		</div>
	);
}
