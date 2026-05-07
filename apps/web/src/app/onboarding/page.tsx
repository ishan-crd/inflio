"use client";

import { useMutation, useQuery } from "convex/react";
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
import { useSession } from "@/lib/auth-client";
import { api } from "../../../convex/_generated/api";

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
		range: "1K – 50K",
		desc: "High engagement, niche reach",
	},
	{
		id: "med",
		label: "Med",
		range: "50K – 100K",
		desc: "Balanced scale & community",
	},
	{
		id: "macro",
		label: "Macro",
		range: "100K+",
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
					onChange={(e) =>
						onChange({ handle: e.target.value.replace(/\s/g, "") })
					}
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
	const [showOtherInput, setShowOtherInput] = useState(false);
	const [otherValue, setOtherValue] = useState("");

	const customNiche = data.niches.find((n) => !CREATOR_NICHES.includes(n));

	function toggle(niche: string) {
		if (data.niches.includes(niche)) {
			onChange({ niches: data.niches.filter((n) => n !== niche) });
		} else if (data.niches.length < 4) {
			onChange({ niches: [...data.niches, niche] });
		}
	}

	function handleOtherClick() {
		if (customNiche) {
			// Already has a custom niche — open input to edit it
			setOtherValue(customNiche);
			setShowOtherInput(true);
		} else {
			setShowOtherInput(true);
		}
	}

	function addCustomNiche() {
		const trimmed = otherValue.trim();
		if (!trimmed) return;
		// Remove old custom niche if editing, then add new one
		const withoutCustom = data.niches.filter((n) => CREATOR_NICHES.includes(n));
		if (withoutCustom.includes(trimmed)) return;
		if (withoutCustom.length >= 4) return;
		onChange({ niches: [...withoutCustom, trimmed] });
		setShowOtherInput(false);
		setOtherValue("");
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.preventDefault();
			addCustomNiche();
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
				<button
					className={customNiche ? "active" : ""}
					onClick={handleOtherClick}
				>
					{customNiche || "Other"}
				</button>
			</div>

			{showOtherInput && (
				<div style={{ display: "flex", gap: 8, marginTop: 12 }}>
					<input
						type="text"
						value={otherValue}
						onChange={(e) => setOtherValue(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Type your niche..."
						autoFocus
						style={{
							flex: 1,
							padding: "10px 14px",
							borderRadius: 10,
							border: "1px solid var(--color-line-2)",
							background: "rgba(255,255,255,0.03)",
							color: "var(--color-ink-0)",
							fontSize: 13.5,
							outline: "none",
						}}
					/>
					<button
						onClick={addCustomNiche}
						disabled={!otherValue.trim()}
						style={{
							padding: "10px 16px",
							borderRadius: 10,
							border: "none",
							background: otherValue.trim()
								? "var(--color-accent)"
								: "var(--color-glass)",
							color: otherValue.trim() ? "#0a0a0c" : "var(--color-ink-3)",
							fontSize: 13,
							fontWeight: 600,
							cursor: otherValue.trim() ? "pointer" : "default",
						}}
					>
						Add
					</button>
				</div>
			)}

			<div
				style={{
					fontSize: 12,
					color: "var(--color-ink-2)",
					marginTop: showOtherInput ? 8 : 0,
				}}
			>
				{data.niches.length} / 4 selected
			</div>
		</div>
	);
}

function CreatorStep3({
	data,
	onChange,
	userId,
}: {
	data: CreatorData;
	onChange: (patch: Partial<CreatorData>) => void;
	userId: string;
}) {
	const createVerification = useMutation(api.verifications.create);
	const verifications = useQuery(
		api.verifications.getByUserId,
		userId ? { userId } : "skip",
	);
	const [verifyModal, setVerifyModal] = useState<{
		platform: string;
		label: string;
		code: string;
	} | null>(null);
	const [copied, setCopied] = useState(false);
	const [loading, setLoading] = useState<string | null>(null);

	function getVerificationStatus(
		platformId: string,
	): "none" | "pending" | "verified" {
		if (!verifications)
			return data.connected.includes(platformId) ? "pending" : "none";
		const record = verifications.find((v) => v.platform === platformId);
		if (!record) return "none";
		return record.status as "pending" | "verified";
	}

	async function handleConnect(id: string, label: string) {
		const status = getVerificationStatus(id);
		if (status === "verified" || status === "pending") return;

		setLoading(id);
		try {
			const code = await createVerification({
				userId,
				platform: id,
				handle: data.handle || "unknown",
			});
			setVerifyModal({ platform: id, label, code });
		} catch {
			const code = String(Math.floor(100000 + Math.random() * 900000));
			setVerifyModal({ platform: id, label, code });
		} finally {
			setLoading(null);
		}
	}

	function handleVerified() {
		if (verifyModal) {
			onChange({ connected: [...data.connected, verifyModal.platform] });
			setVerifyModal(null);
			setCopied(false);
		}
	}

	async function handleCopyCode() {
		if (verifyModal) {
			await navigator.clipboard.writeText(verifyModal.code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
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
					const status = getVerificationStatus(id);
					const isPending = status === "pending";
					const isVerified = status === "verified";
					const isActive = isPending || isVerified;
					return (
						<div key={id} className="platform-row">
							<div className="platform-left">
								<div className="platform-icon-box">
									<Icon width={16} height={16} />
								</div>
								<div>
									<div className="platform-name">{label}</div>
									{isActive && (
										<div className="platform-handle">
											@{data.handle || "yourhandle"}
										</div>
									)}
								</div>
							</div>
							<button
								type="button"
								className={`platform-status ${isVerified ? "connected" : isPending ? "pending" : "connect"}`}
								onClick={() => handleConnect(id, label)}
								disabled={loading === id || isActive}
							>
								{loading === id
									? "..."
									: isVerified
										? "Connected"
										: isPending
											? "Pending"
											: "Connect"}
							</button>
						</div>
					);
				})}
			</div>

			{/* Verification Code Modal */}
			{verifyModal && (
				<div className="verify-overlay">
					<div className="verify-modal">
						<button
							type="button"
							className="verify-close"
							onClick={() => setVerifyModal(null)}
						>
							&times;
						</button>

						<div className="verify-icon-wrap">
							<IGIcon width={24} height={24} />
						</div>

						<h3 className="verify-title">Verify {verifyModal.label}</h3>
						<p className="verify-desc">
							Send this code to{" "}
							<span className="verify-highlight">@getinflio</span> on Instagram
							to verify your account.
						</p>

						<button
							type="button"
							className="verify-code-box"
							onClick={handleCopyCode}
						>
							<span className="verify-code">{verifyModal.code}</span>
							<span className="verify-copy-hint">
								{copied ? "Copied!" : "Click to copy"}
							</span>
						</button>

						<div className="verify-steps">
							{[
								"Copy the code above",
								"Open Instagram and DM @getinflio",
								"Send the code as a message",
								'Come back and click "I\'ve sent it"',
							].map((s, i) => (
								<div key={i} className="verify-step-row">
									<div className="verify-step-num">{i + 1}</div>
									<span>{s}</span>
								</div>
							))}
						</div>

						<div className="verify-actions">
							<a
								href="https://instagram.com/getinflio"
								target="_blank"
								rel="noopener noreferrer"
								className="verify-btn-ig"
							>
								Open Instagram
							</a>
							<button
								type="button"
								className="verify-btn-done"
								onClick={handleVerified}
							>
								I&rsquo;ve sent it
							</button>
						</div>
					</div>
				</div>
			)}
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

	const { data: session } = useSession();
	const onboardCreator = useMutation(api.creators.onboard);
	const onboardBrand = useMutation(api.brands.onboard);

	const [step, setStep] = useState(0);
	const [saving, setSaving] = useState(false);

	const [creatorData, setCreatorData] = useState<CreatorData>({
		name: "",
		handle: "",
		city: "",
		tier: "",
		niches: [],
		connected: [],
		upi: "",
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
		if (saving) return false;
		if (role === "creator") {
			if (step === 0)
				return (
					!!creatorData.name.trim() &&
					!!creatorData.handle.trim() &&
					!!creatorData.tier
				);
			if (step === 1) return creatorData.niches.length > 0;
			if (step === 2) return true; // connecting platforms is optional to proceed
			if (step === 3) return !!creatorData.upi.trim();
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

	async function handleNext() {
		if (step < TOTAL_STEPS - 1) {
			setStep((s) => s + 1);
			return;
		}

		// Final step — save to DB
		if (!session?.user) {
			// Not logged in, just advance to show success (data won't persist)
			setStep((s) => s + 1);
			return;
		}

		setSaving(true);
		try {
			if (role === "creator") {
				await onboardCreator({
					userId: session.user.id,
					name: creatorData.name,
					handle: creatorData.handle,
					city: creatorData.city,
					tier: creatorData.tier,
					niches: creatorData.niches,
					connected: creatorData.connected,
					upi: creatorData.upi,
				});
			} else {
				await onboardBrand({
					userId: session.user.id,
					company: brandData.company,
					website: brandData.website,
					role: brandData.role,
					industry: brandData.industry,
					goal: brandData.goal,
					budget: brandData.budget,
				});
			}
			setStep((s) => s + 1);
		} catch (err) {
			console.error("Failed to save onboarding data:", err);
			// Still advance so user isn't stuck
			setStep((s) => s + 1);
		} finally {
			setSaving(false);
		}
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
						userId={session?.user?.id ?? ""}
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

				<span />
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
							nextLabel={
								saving
									? "Saving..."
									: step === TOTAL_STEPS - 1
										? "Finish"
										: "Continue"
							}
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
