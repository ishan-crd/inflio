"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
	ArrowIcon,
	BackIcon,
	CheckBigIcon,
	CheckIcon,
	IGIcon,
	SparklesIcon,
	TargetIcon,
	TTIcon,
	YTIcon,
} from "@/components/icons";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CREATOR_NICHES = [
	"Fashion",
	"Tech",
	"Beauty",
	"Food",
	"Finance",
	"Fitness",
	"Outdoor",
	"Auto",
	"Dance",
	"Lifestyle",
	"Gaming",
	"Travel",
	"Comedy",
	"Music",
	"Education",
];

const BRAND_INDUSTRIES = [
	"DTC / e-com",
	"SaaS",
	"Fintech",
	"Beauty",
	"Food & Bev",
	"Fashion",
	"Mobility",
	"Health",
	"Education",
	"Gaming",
	"Other",
];

const TIERS = [
	{
		id: "micro",
		label: "Micro",
		range: "10K – 100K",
		desc: "High engagement, niche reach",
	},
	{
		id: "mid",
		label: "Mid",
		range: "100K – 1M",
		desc: "Balanced scale & community",
	},
	{
		id: "macro",
		label: "Macro",
		range: "1M+",
		desc: "Broad reach, premium deals",
	},
];

const GOALS = [
	{
		id: "awareness",
		label: "Brand Awareness",
		desc: "Reach new audiences at scale",
		Icon: SparklesIcon,
	},
	{
		id: "performance",
		label: "Performance",
		desc: "Drive clicks, signups & sales",
		Icon: TargetIcon,
	},
	{
		id: "ugc",
		label: "UGC Content",
		desc: "Authentic content for your channels",
		Icon: CheckBigIcon,
	},
];

const BUDGETS = [
	{ id: "50k-2l", label: "₹50K – ₹2L", desc: "Starter" },
	{ id: "2l-5l", label: "₹2L – ₹5L", desc: "Growth" },
	{ id: "5l-15l", label: "₹5L – ₹15L", desc: "Scale" },
	{ id: "15l-plus", label: "₹15L+", desc: "Enterprise" },
];

const PLATFORMS = [
	{ id: "instagram", label: "Instagram", Icon: IGIcon },
	{ id: "youtube", label: "YouTube", Icon: YTIcon },
	{ id: "tiktok", label: "TikTok", Icon: TTIcon },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CreatorData {
	name: string;
	handle: string;
	city: string;
	tier: string;
	niches: string[];
	connected: string[];
	upi: string;
	pan: string;
}

interface BrandData {
	company: string;
	website: string;
	role: string;
	industry: string;
	goal: string;
	budget: string;
}

// ---------------------------------------------------------------------------
// StepNav
// ---------------------------------------------------------------------------

function StepNav({
	step,
	totalSteps,
	onBack,
	onNext,
	canContinue,
	nextLabel = "Continue",
}: {
	step: number;
	totalSteps: number;
	onBack: () => void;
	onNext: () => void;
	canContinue: boolean;
	nextLabel?: string;
}) {
	return (
		<div className="onboard-actions">
			{step > 0 ? (
				<button className="btn-back" onClick={onBack}>
					<BackIcon
						style={{
							display: "inline",
							marginRight: 6,
							verticalAlign: "middle",
						}}
					/>
					Back
				</button>
			) : (
				<span />
			)}
			<button className="btn-next" onClick={onNext} disabled={!canContinue}>
				{nextLabel}
				<ArrowIcon />
			</button>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Creator Steps
// ---------------------------------------------------------------------------

function CreatorStep1({
	data,
	onChange,
}: {
	data: CreatorData;
	onChange: (patch: Partial<CreatorData>) => void;
}) {
	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 1 of 4 &mdash; Profile</div>
			<h2>Tell us about yourself</h2>
			<p className="lead">
				We use this to match you with the right brands and campaigns.
			</p>

			<div className="field">
				<label className="field-label">Full name</label>
				<input
					className="field-input"
					placeholder="Your name"
					value={data.name}
					onChange={(e) => onChange({ name: e.target.value })}
				/>
			</div>

			<div className="field">
				<label className="field-label">Handle (without @)</label>
				<input
					className="field-input"
					placeholder="yourhandle"
					value={data.handle}
					onChange={(e) => onChange({ handle: e.target.value })}
				/>
			</div>

			<div className="field" style={{ marginBottom: 24 }}>
				<label className="field-label">City</label>
				<input
					className="field-input"
					placeholder="Mumbai"
					value={data.city}
					onChange={(e) => onChange({ city: e.target.value })}
				/>
			</div>

			<div className="field-label" style={{ marginBottom: 10 }}>
				Creator tier
			</div>
			<div className="option-grid three">
				{TIERS.map((t) => (
					<button
						key={t.id}
						className={`option-card${data.tier === t.id ? " active" : ""}`}
						onClick={() => onChange({ tier: t.id })}
					>
						<div className="o-check">
							<CheckIcon />
						</div>
						<div className="o-title">{t.label}</div>
						<div className="o-desc">{t.range}</div>
						<div className="o-desc" style={{ marginTop: 4 }}>
							{t.desc}
						</div>
					</button>
				))}
			</div>
		</div>
	);
}

function CreatorStep2({
	data,
	onChange,
}: {
	data: CreatorData;
	onChange: (patch: Partial<CreatorData>) => void;
}) {
	function toggle(niche: string) {
		if (data.niches.includes(niche)) {
			onChange({ niches: data.niches.filter((n) => n !== niche) });
		} else if (data.niches.length < 4) {
			onChange({ niches: [...data.niches, niche] });
		}
	}

	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 2 of 4 &mdash; Niches</div>
			<h2>What do you create?</h2>
			<p className="lead">
				Pick up to 4 niches that best describe your content.
			</p>

			<div className="chip-multi">
				{CREATOR_NICHES.map((n) => (
					<button
						key={n}
						className={data.niches.includes(n) ? "active" : ""}
						onClick={() => toggle(n)}
					>
						{n}
					</button>
				))}
			</div>

			<div style={{ fontSize: 12, color: "var(--color-ink-2)" }}>
				{data.niches.length} / 4 selected
			</div>
		</div>
	);
}

function CreatorStep3({
	data,
	onChange,
}: {
	data: CreatorData;
	onChange: (patch: Partial<CreatorData>) => void;
}) {
	function togglePlatform(id: string) {
		if (data.connected.includes(id)) {
			onChange({ connected: data.connected.filter((p) => p !== id) });
		} else {
			onChange({ connected: [...data.connected, id] });
		}
	}

	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 3 of 4 &mdash; Platforms</div>
			<h2>Connect your channels</h2>
			<p className="lead">
				Link your social accounts so brands can verify your reach.
			</p>

			<div className="platform-connect">
				{PLATFORMS.map(({ id, label, Icon }) => {
					const isConnected = data.connected.includes(id);
					return (
						<div key={id} className="platform-row">
							<div className="platform-left">
								<div className="platform-icon-box">
									<Icon width={16} height={16} />
								</div>
								<div>
									<div className="platform-name">{label}</div>
									{isConnected && (
										<div className="platform-handle">
											@{data.handle || "yourhandle"}
										</div>
									)}
								</div>
							</div>
							<button
								className={`platform-status ${isConnected ? "connected" : "connect"}`}
								onClick={() => togglePlatform(id)}
							>
								{isConnected ? "Connected" : "Connect"}
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}

function CreatorStep4({
	data,
	onChange,
}: {
	data: CreatorData;
	onChange: (patch: Partial<CreatorData>) => void;
}) {
	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 4 of 4 &mdash; Payouts</div>
			<h2>Set up payouts</h2>
			<p className="lead">
				We pay directly to your UPI or bank. Your details are encrypted.
			</p>

			<div className="field">
				<label className="field-label">UPI ID</label>
				<input
					className="field-input"
					placeholder="yourname@upi"
					value={data.upi}
					onChange={(e) => onChange({ upi: e.target.value })}
				/>
			</div>

			<div className="field">
				<label className="field-label">PAN number</label>
				<input
					className="field-input"
					placeholder="ABCDE1234F"
					value={data.pan}
					onChange={(e) => onChange({ pan: e.target.value.toUpperCase() })}
					maxLength={10}
				/>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Brand Steps
// ---------------------------------------------------------------------------

function BrandStep1({
	data,
	onChange,
}: {
	data: BrandData;
	onChange: (patch: Partial<BrandData>) => void;
}) {
	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 1 of 4 &mdash; Company</div>
			<h2>About your brand</h2>
			<p className="lead">
				Help us understand who you are so we can match you with the right
				creators.
			</p>

			<div className="field">
				<label className="field-label">Company name</label>
				<input
					className="field-input"
					placeholder="Acme Inc."
					value={data.company}
					onChange={(e) => onChange({ company: e.target.value })}
				/>
			</div>

			<div className="field">
				<label className="field-label">Website</label>
				<input
					className="field-input"
					placeholder="https://yoursite.com"
					value={data.website}
					onChange={(e) => onChange({ website: e.target.value })}
				/>
			</div>

			<div className="field">
				<label className="field-label">Your role</label>
				<input
					className="field-input"
					placeholder="Head of Marketing"
					value={data.role}
					onChange={(e) => onChange({ role: e.target.value })}
				/>
			</div>
		</div>
	);
}

function BrandStep2({
	data,
	onChange,
}: {
	data: BrandData;
	onChange: (patch: Partial<BrandData>) => void;
}) {
	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 2 of 4 &mdash; Industry</div>
			<h2>What industry are you in?</h2>
			<p className="lead">
				This helps us recommend the best-fit creator verticals.
			</p>

			<div className="chip-multi">
				{BRAND_INDUSTRIES.map((ind) => (
					<button
						key={ind}
						className={data.industry === ind ? "active" : ""}
						onClick={() => onChange({ industry: ind })}
					>
						{ind}
					</button>
				))}
			</div>
		</div>
	);
}

function BrandStep3({
	data,
	onChange,
}: {
	data: BrandData;
	onChange: (patch: Partial<BrandData>) => void;
}) {
	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 3 of 4 &mdash; Goals</div>
			<h2>What's your primary goal?</h2>
			<p className="lead">
				We'll tailor campaign types and creator recommendations around this.
			</p>

			<div className="option-grid three">
				{GOALS.map(({ id, label, desc, Icon }) => (
					<button
						key={id}
						className={`option-card${data.goal === id ? " active" : ""}`}
						onClick={() => onChange({ goal: id })}
					>
						<div className="o-ic">
							<Icon width={20} height={20} />
						</div>
						<div className="o-check">
							<CheckIcon />
						</div>
						<div className="o-title">{label}</div>
						<div className="o-desc">{desc}</div>
					</button>
				))}
			</div>
		</div>
	);
}

function BrandStep4({
	data,
	onChange,
}: {
	data: BrandData;
	onChange: (patch: Partial<BrandData>) => void;
}) {
	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 4 of 4 &mdash; Budget</div>
			<h2>Monthly influencer budget</h2>
			<p className="lead">
				Choose your typical monthly spend. You can adjust per campaign.
			</p>

			<div className="option-grid">
				{BUDGETS.map(({ id, label, desc }) => (
					<button
						key={id}
						className={`option-card${data.budget === id ? " active" : ""}`}
						onClick={() => onChange({ budget: id })}
					>
						<div className="o-check">
							<CheckIcon />
						</div>
						<div className="o-title">{label}</div>
						<div className="o-desc">{desc}</div>
					</button>
				))}
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Success Step
// ---------------------------------------------------------------------------

function SuccessStep({
	role,
	creatorData,
	brandData,
}: {
	role: "creator" | "brand";
	creatorData: CreatorData;
	brandData: BrandData;
}) {
	const isCreator = role === "creator";
	const destination = isCreator ? "/marketplace" : "/creators";
	const ctaLabel = isCreator ? "Browse campaigns" : "Find creators";

	const rows = isCreator
		? [
				{ label: "Name", value: creatorData.name || "—" },
				{
					label: "Handle",
					value: creatorData.handle ? `@${creatorData.handle}` : "—",
				},
				{ label: "City", value: creatorData.city || "—" },
				{
					label: "Tier",
					value: creatorData.tier
						? creatorData.tier.charAt(0).toUpperCase() +
							creatorData.tier.slice(1)
						: "—",
				},
				{
					label: "Niches",
					value: creatorData.niches.length
						? creatorData.niches.join(", ")
						: "—",
				},
				{
					label: "Platforms",
					value: creatorData.connected.length
						? creatorData.connected.join(", ")
						: "—",
				},
			]
		: [
				{ label: "Company", value: brandData.company || "—" },
				{ label: "Website", value: brandData.website || "—" },
				{ label: "Industry", value: brandData.industry || "—" },
				{
					label: "Goal",
					value: brandData.goal
						? brandData.goal.charAt(0).toUpperCase() + brandData.goal.slice(1)
						: "—",
				},
				{
					label: "Budget",
					value: brandData.budget
						? (BUDGETS.find((b) => b.id === brandData.budget)?.label ?? "—")
						: "—",
				},
			];

	return (
		<div className="onboard-step">
			<div className="success-wrap">
				<div className="success-icon">
					<CheckBigIcon />
				</div>

				<h2 style={{ marginBottom: 8 }}>You&rsquo;re in.</h2>
				<p className="lead" style={{ marginBottom: 28 }}>
					{isCreator
						? "Your creator profile is live. Start applying to campaigns."
						: "Your brand account is ready. Start finding creators."}
				</p>

				<div className="summary-card">
					{rows.map(({ label, value }) => (
						<div key={label} className="summary-row">
							<span className="label">{label}</span>
							<span className="value">{value}</span>
						</div>
					))}
				</div>

				<Link
					href={destination}
					className="btn-next"
					style={{ display: "inline-flex", textDecoration: "none" }}
				>
					{ctaLabel}
					<ArrowIcon />
				</Link>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Inner page (needs useSearchParams — wrapped in Suspense below)
// ---------------------------------------------------------------------------

function OnboardingInner() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const role = (searchParams.get("role") === "brand" ? "brand" : "creator") as
		| "creator"
		| "brand";

	const [step, setStep] = useState(0);

	const [creatorData, setCreatorData] = useState<CreatorData>({
		name: "",
		handle: "",
		city: "",
		tier: "",
		niches: [],
		connected: [],
		upi: "",
		pan: "",
	});

	const [brandData, setBrandData] = useState<BrandData>({
		company: "",
		website: "",
		role: "",
		industry: "",
		goal: "",
		budget: "",
	});

	const TOTAL_STEPS = 4; // steps 0-3, success is step 4

	// ---- Validation ----
	function canContinue(): boolean {
		if (role === "creator") {
			if (step === 0)
				return (
					!!creatorData.name.trim() &&
					!!creatorData.handle.trim() &&
					!!creatorData.tier
				);
			if (step === 1) return creatorData.niches.length > 0;
			if (step === 2) return true; // connecting platforms is optional to proceed
			if (step === 3)
				return !!creatorData.upi.trim() && !!creatorData.pan.trim();
		} else {
			if (step === 0)
				return (
					!!brandData.company.trim() &&
					!!brandData.website.trim() &&
					!!brandData.role.trim()
				);
			if (step === 1) return !!brandData.industry;
			if (step === 2) return !!brandData.goal;
			if (step === 3) return !!brandData.budget;
		}
		return true;
	}

	function handleNext() {
		if (step < TOTAL_STEPS) setStep((s) => s + 1);
	}

	function handleBack() {
		if (step > 0) setStep((s) => s - 1);
	}

	const progress = step >= TOTAL_STEPS ? 100 : (step / TOTAL_STEPS) * 100;

	// ---- Render current step content ----
	function renderStep() {
		if (step >= TOTAL_STEPS) {
			return (
				<SuccessStep
					role={role}
					creatorData={creatorData}
					brandData={brandData}
				/>
			);
		}

		if (role === "creator") {
			if (step === 0)
				return (
					<CreatorStep1
						data={creatorData}
						onChange={(p) => setCreatorData((d) => ({ ...d, ...p }))}
					/>
				);
			if (step === 1)
				return (
					<CreatorStep2
						data={creatorData}
						onChange={(p) => setCreatorData((d) => ({ ...d, ...p }))}
					/>
				);
			if (step === 2)
				return (
					<CreatorStep3
						data={creatorData}
						onChange={(p) => setCreatorData((d) => ({ ...d, ...p }))}
					/>
				);
			if (step === 3)
				return (
					<CreatorStep4
						data={creatorData}
						onChange={(p) => setCreatorData((d) => ({ ...d, ...p }))}
					/>
				);
		} else {
			if (step === 0)
				return (
					<BrandStep1
						data={brandData}
						onChange={(p) => setBrandData((d) => ({ ...d, ...p }))}
					/>
				);
			if (step === 1)
				return (
					<BrandStep2
						data={brandData}
						onChange={(p) => setBrandData((d) => ({ ...d, ...p }))}
					/>
				);
			if (step === 2)
				return (
					<BrandStep3
						data={brandData}
						onChange={(p) => setBrandData((d) => ({ ...d, ...p }))}
					/>
				);
			if (step === 3)
				return (
					<BrandStep4
						data={brandData}
						onChange={(p) => setBrandData((d) => ({ ...d, ...p }))}
					/>
				);
		}

		return null;
	}

	const isSuccess = step >= TOTAL_STEPS;

	return (
		<div className="onboard-page">
			{/* Top nav */}
			<nav className="onboard-nav">
				<div className="logo">
					<div className="logo-dot" />
					Inflio
				</div>

				{!isSuccess && (
					<span className="step-count">
						{step + 1} / {TOTAL_STEPS}
					</span>
				)}

				<Link href="/" className="skip">
					Skip &rarr;
				</Link>
			</nav>

			{/* Progress bar */}
			<div className="onboard-progress">
				<div
					className="onboard-progress-fill"
					style={{ width: `${progress}%` }}
				/>
			</div>

			{/* Step content */}
			<div className="onboard-body">
				{renderStep()}

				{!isSuccess && (
					<div style={{ width: "100%", maxWidth: 580, marginTop: 32 }}>
						<StepNav
							step={step}
							totalSteps={TOTAL_STEPS}
							onBack={handleBack}
							onNext={handleNext}
							canContinue={canContinue()}
							nextLabel={step === TOTAL_STEPS - 1 ? "Finish" : "Continue"}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Page export (Suspense boundary for useSearchParams)
// ---------------------------------------------------------------------------

export default function OnboardingPage() {
	return (
		<>
			<div className="ambient" />
			<div className="grain" />
			<Suspense>
				<OnboardingInner />
			</Suspense>
		</>
	);
}
