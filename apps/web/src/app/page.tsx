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
   Float cards – hero preview
───────────────────────────────────────── */
function FloatCard1() {
	return (
		<div className="float-card f1">
			<div className="fc-row">
				<div
					className="fc-mark"
					style={{
						background: "linear-gradient(135deg,#fde68a,#d97706)",
						color: "#422006",
					}}
				>
					Z
				</div>
				<div>
					<div className="fc-name">Zomato India</div>
					<div className="fc-handle">@zomato</div>
				</div>
			</div>
			<p className="fc-title">
				Taste the city — food reel campaign, Summer 2025
			</p>
			<div className="fc-rate">
				<div className="fc-rate-num">
					<span className="currency">₹</span>18
					<span className="per">/ 1k views</span>
				</div>
				<span className="fc-rate-pulse">● LIVE</span>
			</div>
		</div>
	);
}

function FloatCard2() {
	return (
		<div className="float-card f2">
			<div className="fc-row">
				<div
					className="fc-mark"
					style={{
						background: "linear-gradient(135deg,#c084fc,#7c3aed)",
						color: "#f3e8ff",
					}}
				>
					N
				</div>
				<div>
					<div className="fc-name">Nykaa Beauty</div>
					<div className="fc-handle">@nykaa</div>
				</div>
			</div>
			<p className="fc-title">
				Glow-up series — skincare tutorial &amp; honest review
			</p>
			<div className="fc-rate">
				<div className="fc-rate-num">
					<span className="currency">₹</span>24
					<span className="per">/ 1k views</span>
				</div>
				<span className="fc-rate-pulse">● LIVE</span>
			</div>
		</div>
	);
}

function FloatCard3() {
	return (
		<div className="float-card f3">
			<div className="fc-row">
				<div
					className="fc-mark"
					style={{
						background: "linear-gradient(135deg,#6ee7b7,#059669)",
						color: "#022c22",
					}}
				>
					B
				</div>
				<div>
					<div className="fc-name">boAt Lifestyle</div>
					<div className="fc-handle">@boat</div>
				</div>
			</div>
			<p className="fc-title">
				Unbox the beat — audio gear review &amp; lifestyle drop
			</p>
			<div className="fc-rate">
				<div className="fc-rate-num">
					<span className="currency">₹</span>21
					<span className="per">/ 1k views</span>
				</div>
				<span className="fc-rate-pulse">● LIVE</span>
			</div>
		</div>
	);
}

function EarningsTicker() {
	const bars = [40, 55, 35, 70, 60, 80, 65, 90, 75, 100];
	return (
		<div className="float-card f-ticker">
			<div className="tick-label">Your earnings</div>
			<div className="tick-num">
				<span className="currency">₹</span>14,280
			</div>
			<div className="tick-delta">+₹2,340 this week</div>
			<div className="tick-bar">
				{bars.map((h, i) => (
					<span key={i} style={{ height: `${h}%` }} />
				))}
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────
   LHero
───────────────────────────────────────── */
function LHero() {
	return (
		<section className="lhero">
			<div className="shell">
				{/* Eyebrow */}
				<div className="eyebrow">
					<span className="eyebrow-dot">
						<span className="eyebrow-pulse" />
					</span>
					Now live in 9 cities · ₹ 2.4 Cr paid out this month
				</div>

				{/* Headline */}
				<h1>
					Performance pay,{" "}
					<span className="accent">for the creator economy.</span>
				</h1>

				{/* Subtitle */}
				<p>
					Inflio connects brands with creators on a pure pay-per-view model. No
					flat fees. No guesswork. Just content that earns every view it gets.
				</p>

				{/* Actions */}
				<div className="lhero-actions">
					<Link href="/login?mode=signup" className="btn btn-primary">
						Start earning free <ArrowIcon />
					</Link>
					<Link href="/marketplace" className="btn btn-glass">
						Browse campaigns
					</Link>
				</div>

				{/* Trust stats */}
				<div className="lhero-trust">
					<span>237 live campaigns</span>
					<span>12,400+ creators</span>
					<span>Zero upfront cost</span>
				</div>

				{/* Floating preview */}
				<div className="lhero-preview">
					<FloatCard1 />
					<FloatCard2 />
					<FloatCard3 />
					<EarningsTicker />
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────
   HowItWorks
───────────────────────────────────────── */
const creatorSteps = [
	{
		step: "Step 01",
		title: "Browse & apply",
		desc: "Discover campaigns from top Indian brands filtered by niche, platform, and pay rate. Apply in one tap.",
		visual: (
			<div className="how-visual">
				<div className="mini-feed">
					{[
						{ text: "Zomato Summer Reel", num: "₹18/1k" },
						{ text: "Nykaa Glow Series", num: "₹24/1k" },
						{ text: "boAt Audio Drop", num: "₹21/1k" },
					].map((item) => (
						<div key={item.text} className="mini-feed-item">
							<div className="mini-feed-dot" />
							<span className="mini-feed-text">{item.text}</span>
							<span className="mini-feed-num">{item.num}</span>
						</div>
					))}
				</div>
			</div>
		),
	},
	{
		step: "Step 02",
		title: "Post your content",
		desc: "Create authentic content on Instagram or YouTube. Submit the link — we verify and start tracking views instantly.",
		visual: (
			<div className="how-visual">
				<div className="mini-brief-row">
					<span className="mini-label">Platform</span>
					<span
						className="mini-value"
						style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
					>
						<IGIcon /> Instagram &nbsp;
						<YTIcon /> YouTube
					</span>
				</div>
				<div className="mini-brief-row">
					<span className="mini-label">Status</span>
					<span className="mini-pill">● Tracking live</span>
				</div>
				<div className="mini-brief-row">
					<span className="mini-label">Views today</span>
					<span className="mini-value">48,230</span>
				</div>
			</div>
		),
	},
	{
		step: "Step 03",
		title: "Get paid instantly",
		desc: "Earnings accumulate in real time. Withdraw to your bank or UPI whenever you want — no minimum threshold.",
		visual: (
			<div className="how-visual">
				<div className="mini-wallet-num">
					<span className="currency">₹</span>14,280
				</div>
				<div className="mini-wallet-delta">+₹2,340 this week</div>
				<div className="mini-wallet-graph">
					{[40, 55, 35, 70, 60, 80, 65, 90, 75, 100].map((h, i) => (
						<span key={i} style={{ height: `${h}%` }} />
					))}
				</div>
			</div>
		),
	},
];

const brandSteps = [
	{
		step: "Step 01",
		title: "Post a campaign brief",
		desc: "Set your pay-per-view rate, target platforms, content guidelines, and budget. Go live in under 10 minutes.",
		visual: (
			<div className="how-visual">
				<div className="mini-brief-row">
					<span className="mini-label">Budget</span>
					<span className="mini-value">₹5,00,000</span>
				</div>
				<div className="mini-brief-row">
					<span className="mini-label">Rate</span>
					<span className="mini-value">₹18 / 1k views</span>
				</div>
				<div className="mini-brief-row">
					<span className="mini-label">Platform</span>
					<span className="mini-value">IG + YT</span>
				</div>
			</div>
		),
	},
	{
		step: "Step 02",
		title: "Creators apply & post",
		desc: "Thousands of vetted creators discover your brief and start posting. You review content before it goes live.",
		visual: (
			<div className="how-visual">
				<div className="mini-feed">
					{[
						{ text: "Riya Sharma applied", num: "2.1M" },
						{ text: "Aman Gupta applied", num: "840K" },
						{ text: "Priya Nair applied", num: "3.4M" },
					].map((item) => (
						<div key={item.text} className="mini-feed-item">
							<div className="mini-feed-dot" />
							<span className="mini-feed-text">{item.text}</span>
							<span className="mini-feed-num">{item.num}</span>
						</div>
					))}
				</div>
			</div>
		),
	},
	{
		step: "Step 03",
		title: "Pay only for views",
		desc: "We track verified views in real time and charge your wallet as views roll in. Zero wasted spend.",
		visual: (
			<div className="how-visual">
				<div className="mini-brief-row">
					<span className="mini-label">Total views</span>
					<span className="mini-value">2,84,300</span>
				</div>
				<div className="mini-brief-row">
					<span className="mini-label">Spent so far</span>
					<span className="mini-value">₹51,174</span>
				</div>
				<div className="mini-brief-row">
					<span className="mini-label">Budget left</span>
					<span className="mini-pill">₹4,48,826</span>
				</div>
			</div>
		),
	},
];

function HowItWorks() {
	const [tab, setTab] = useState<"creators" | "brands">("creators");
	const steps = tab === "creators" ? creatorSteps : brandSteps;

	return (
		<section className="section" id="how-it-works">
			<div className="shell">
				<div className="section-head">
					<span className="section-eyebrow">How it works</span>
					<h2>
						Simple for creators. <em>Powerful for brands.</em>
					</h2>
					<p>
						One platform, two sides of the creator economy, working in perfect
						sync.
					</p>
				</div>

				{/* Tab toggle */}
				<div style={{ textAlign: "center" }}>
					<div className="audience-tabs">
						<button
							className={`audience-tab${tab === "creators" ? " active" : ""}`}
							onClick={() => setTab("creators")}
						>
							For creators
						</button>
						<button
							className={`audience-tab${tab === "brands" ? " active" : ""}`}
							onClick={() => setTab("brands")}
						>
							For brands
						</button>
					</div>
				</div>

				{/* Step cards */}
				<div className="how-grid">
					{steps.map((s) => (
						<div key={s.step} className="how-card">
							<div className="how-step">{s.step}</div>
							<h3>{s.title}</h3>
							<p>{s.desc}</p>
							{s.visual}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────
   MarketplacePreview
───────────────────────────────────────── */
const previewCampaigns = [
	{
		mark: "Z",
		markStyle: {
			background: "linear-gradient(135deg,#fde68a,#d97706)",
			color: "#422006",
		},
		brand: "Zomato India",
		platform: "Instagram · Reel",
		title: "Taste the city — summer food discovery series",
		rate: "18",
		spots: "42 spots left",
		from: "rgba(253,230,138,0.07)",
		to: "rgba(253,230,138,0.02)",
	},
	{
		mark: "N",
		markStyle: {
			background: "linear-gradient(135deg,#c084fc,#7c3aed)",
			color: "#f3e8ff",
		},
		brand: "Nykaa Beauty",
		platform: "YouTube · Long-form",
		title: "Honest glow-up review — skincare routine collab",
		rate: "24",
		spots: "18 spots left",
		from: "rgba(192,132,252,0.07)",
		to: "rgba(192,132,252,0.02)",
	},
	{
		mark: "B",
		markStyle: {
			background: "linear-gradient(135deg,#6ee7b7,#059669)",
			color: "#022c22",
		},
		brand: "boAt Lifestyle",
		platform: "Instagram · Reel",
		title: "Unbox the beat — audio gear lifestyle drop",
		rate: "21",
		spots: "67 spots left",
		from: "rgba(110,231,183,0.07)",
		to: "rgba(110,231,183,0.02)",
	},
];

function MarketplacePreview() {
	return (
		<section className="section" id="marketplace">
			<div className="shell">
				<div className="section-head">
					<span className="section-eyebrow">Marketplace</span>
					<h2>
						Live campaigns, <em>waiting for you.</em>
					</h2>
					<p>
						Hundreds of briefs from India's top brands, updated daily. Filter by
						platform, niche, and pay rate.
					</p>
				</div>

				<div className="preview-frame">
					{/* Browser chrome */}
					<div className="preview-window-bar">
						<div className="dot" />
						<div className="dot" />
						<div className="dot" />
						<div className="url">inflio.in/marketplace</div>
					</div>

					{/* Campaign cards */}
					<div className="preview-grid">
						{previewCampaigns.map((c) => (
							<div
								key={c.brand}
								className="preview-card"
								style={
									{
										"--pc-from": c.from,
										"--pc-to": c.to,
									} as React.CSSProperties
								}
							>
								<div className="pc-head">
									<div className="pc-brand-cluster">
										<div className="pc-mark" style={c.markStyle}>
											{c.mark}
										</div>
										<div>
											<div className="pc-brand-name">
												{c.brand}
												<VerifiedIcon
													style={{ color: "var(--color-accent-strong)" }}
												/>
											</div>
											<div className="pc-platform">{c.platform}</div>
										</div>
									</div>
								</div>
								<p className="pc-title">{c.title}</p>
								<div className="pc-rate-band">
									<div className="pc-rate-num">
										<span className="currency">₹</span>
										{c.rate}
										<span className="per">/ 1k views</span>
									</div>
									<span className="pc-spots">{c.spots}</span>
								</div>
							</div>
						))}
					</div>
				</div>

				<div style={{ textAlign: "center", marginTop: 32 }}>
					<Link href="/marketplace" className="btn btn-glass">
						Browse all campaigns <ArrowIcon />
					</Link>
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────
   StatsBand
───────────────────────────────────────── */
function StatsBand() {
	return (
		<div className="shell">
			<div className="stats-band">
				<div className="stats-cell">
					<div className="stats-num">
						237<span className="unit"> live</span>
					</div>
					<div className="stats-label">Active campaigns right now</div>
				</div>
				<div className="stats-cell">
					<div className="stats-num">
						12.4<span className="unit">K+</span>
					</div>
					<div className="stats-label">Verified creators on platform</div>
				</div>
				<div className="stats-cell">
					<div className="stats-num">
						<span className="currency">₹</span>2.4
						<span className="unit"> Cr</span>
					</div>
					<div className="stats-label">Paid out this month</div>
				</div>
				<div className="stats-cell">
					<div className="stats-num">
						48<span className="unit"> hrs</span>
					</div>
					<div className="stats-label">Avg. time to first payout</div>
				</div>
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────
   Testimonial
───────────────────────────────────────── */
function Testimonial() {
	return (
		<section className="section">
			<div className="shell">
				<div className="testimonial">
					<p className="testimonial-quote">
						I posted one reel for a Zomato campaign and made ₹22,000 in ten
						days. With Inflio I finally get paid what my audience is actually
						worth.
					</p>
					<div className="testimonial-attr">
						<div className="av">A</div>
						<div className="meta">
							<div className="name">
								Aanya Verma
								<VerifiedIcon
									style={{ color: "var(--color-accent-strong)", marginLeft: 6 }}
								/>
							</div>
							<div className="role">
								Food &amp; lifestyle creator · 1.2M followers
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────
   FAQ
───────────────────────────────────────── */
const faqs = [
	{
		q: "How does the pay-per-view model work?",
		a: "Brands set a rate (e.g. ₹18 per 1,000 views). When your content earns views, Inflio tracks them in real time and credits your wallet automatically. You earn proportionally — the more views, the more you make.",
	},
	{
		q: "Is there a minimum follower count to join?",
		a: "No strict minimum. We accept creators from 5,000 followers upwards. What matters more is engagement rate and content quality. Micro-creators often outperform mega influencers on a per-view basis.",
	},
	{
		q: "How quickly can I withdraw my earnings?",
		a: "Withdrawals are processed within 24–48 hours to any Indian bank account or UPI handle. There is no minimum withdrawal threshold — even ₹1 can be withdrawn.",
	},
	{
		q: "What platforms are supported?",
		a: "Currently Instagram (Reels & posts), YouTube (Shorts & long-form), and X (Twitter). Brands can specify which platforms they want content on.",
	},
	{
		q: "How does Inflio verify views are real?",
		a: "We integrate directly with the official Instagram and YouTube APIs to pull verified view counts. Bot traffic and artificially inflated views are filtered out using our proprietary detection layer.",
	},
];

function FAQ() {
	const [open, setOpen] = useState<number | null>(null);

	return (
		<section className="section" id="pricing">
			<div className="shell">
				<div className="section-head">
					<span className="section-eyebrow">FAQ</span>
					<h2>
						Questions, <em>answered.</em>
					</h2>
				</div>
				<div className="faq-list">
					{faqs.map((faq, i) => (
						<div
							key={i}
							className={`faq-item${open === i ? " open" : ""}`}
							onClick={() => setOpen(open === i ? null : i)}
						>
							<div className="faq-q">
								{faq.q}
								<span className="faq-q-icon">
									<PlusIcon />
								</span>
							</div>
							<p className="faq-a">{faq.a}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─────────────────────────────────────────
   FinalCTA
───────────────────────────────────────── */
function FinalCTA() {
	return (
		<div className="shell">
			<div className="final-cta">
				<h2>
					Your content.
					<br />
					<em>Your paycheck.</em>
				</h2>
				<p>
					Join 12,400+ creators already earning with Inflio. Free to join. No
					contracts. Start today.
				</p>
				<div style={{ display: "inline-flex", gap: 12 }}>
					<Link
						href="/login?mode=signup"
						className="btn btn-primary"
						style={{ padding: "14px 24px", fontSize: 14 }}
					>
						Get started free <ArrowIcon />
					</Link>
					<Link
						href="/marketplace"
						className="btn btn-glass"
						style={{ padding: "14px 24px", fontSize: 14 }}
					>
						Browse campaigns
					</Link>
				</div>
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────
   Footer
───────────────────────────────────────── */
function Footer() {
	return (
		<footer className="footer">
			<div className="shell">
				<div className="footer-grid">
					{/* Brand col */}
					<div className="footer-brand">
						<div className="logo" style={{ marginBottom: 14 }}>
							<div className="logo-dot" />
							Inflio
						</div>
						<p>
							Performance pay for the creator economy. Brands pay per view.
							Creators earn every time.
						</p>
					</div>

					{/* Product */}
					<div className="footer-col">
						<div className="footer-col-title">Product</div>
						<Link href="/marketplace">Marketplace</Link>
						<Link href="/creators">For Creators</Link>
						<a href="#how-it-works">How it works</a>
						<a href="#pricing">Pricing</a>
					</div>

					{/* Creators */}
					<div className="footer-col">
						<div className="footer-col-title">Creators</div>
						<Link href="/login?mode=signup">Sign up</Link>
						<Link href="/login">Sign in</Link>
						<Link href="/creators">Creator hub</Link>
						<a href="#faq">FAQ</a>
					</div>

					{/* Brands */}
					<div className="footer-col">
						<div className="footer-col-title">Brands</div>
						<Link href="/login?mode=signup&role=brand">Post a campaign</Link>
						<a href="#how-it-works">How brands use Inflio</a>
						<a href="#pricing">Pricing</a>
					</div>

					{/* Legal */}
					<div className="footer-col">
						<div className="footer-col-title">Legal</div>
						<a href="/privacy">Privacy policy</a>
						<a href="/terms">Terms of service</a>
						<a href="/community">Community guidelines</a>
					</div>
				</div>

				<div className="footer-bottom">
					<span>© 2025 Inflio Technologies Pvt. Ltd. All rights reserved.</span>
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
		<>
			<div className="ambient" />
			<div className="grain" />
			<div className="landing">
				<SharedNav />
				<LHero />
				<HowItWorks />
				<MarketplacePreview />
				<StatsBand />
				<Testimonial />
				<FAQ />
				<FinalCTA />
				<Footer />
			</div>
		</>
	);
}
