"use client";

import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
	ArrowIcon,
	BackIcon,
	CheckIcon,
	IGIcon,
	TTIcon,
	YTIcon,
} from "@/components/icons";
import { useSession } from "@/lib/auth-client";
import { api } from "../../../../convex/_generated/api";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES = [
	"Tech",
	"Fashion",
	"Beauty",
	"Food & Bev",
	"Finance",
	"Fitness",
	"Lifestyle",
	"Gaming",
	"Travel",
	"Music",
	"Education",
	"Other",
];

const CONTENT_TAGS = [
	"Reels",
	"Shorts",
	"UGC",
	"Unboxing",
	"Review",
	"Tutorial",
	"Lifestyle",
	"GRWM",
	"Vlog",
	"Story",
	"Collab",
	"Other",
];

const PLATFORMS = [
	{ id: "Instagram", label: "Instagram", Icon: IGIcon },
	{ id: "YouTube", label: "YouTube", Icon: YTIcon },
	{ id: "X", label: "X (Twitter)", Icon: TTIcon },
];

const COLORS = ["lime", "cyan", "violet", "amber", "rose"] as const;
type ColorKey = (typeof COLORS)[number];

const ACCENT_MAP: Record<
	ColorKey,
	{ from: string; to: string; chip: string; glow: string }
> = {
	lime: {
		from: "#bef264",
		to: "#22c55e",
		chip: "rgba(190,242,100,0.12)",
		glow: "rgba(190,242,100,0.15)",
	},
	cyan: {
		from: "#22d3ee",
		to: "#0ea5e9",
		chip: "rgba(34,211,238,0.12)",
		glow: "rgba(34,211,238,0.15)",
	},
	violet: {
		from: "#a78bfa",
		to: "#8b5cf6",
		chip: "rgba(167,139,250,0.12)",
		glow: "rgba(167,139,250,0.15)",
	},
	amber: {
		from: "#fbbf24",
		to: "#f59e0b",
		chip: "rgba(251,191,36,0.12)",
		glow: "rgba(251,191,36,0.15)",
	},
	rose: {
		from: "#fb7185",
		to: "#e11d48",
		chip: "rgba(251,113,133,0.12)",
		glow: "rgba(251,113,133,0.15)",
	},
};

const COLOR_DOT_BG: Record<ColorKey, string> = {
	lime: "linear-gradient(135deg, #bef264, #22c55e)",
	cyan: "linear-gradient(135deg, #22d3ee, #0ea5e9)",
	violet: "linear-gradient(135deg, #a78bfa, #8b5cf6)",
	amber: "linear-gradient(135deg, #fbbf24, #f59e0b)",
	rose: "linear-gradient(135deg, #fb7185, #e11d48)",
};

const CURRENCIES = ["₹", "$", "€"];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignFormData {
	// Step 1
	title: string;
	brief: string;
	longBriefRaw: string;
	category: string;
	// Step 2
	platform: string;
	tags: string[];
	color: ColorKey;
	// Step 3
	budget: string;
	rate: string;
	currency: string;
	perViews: string;
	minViews: string;
	// Step 4
	totalSpots: string;
	deadline: string;
	bonusThreshold: string;
	bonusAmount: string;
	// Step 5 — Eligibility (optional)
	eligMinFollowers: string;
	eligMinAvgViews: string;
	eligGeos: string[];
	eligLanguages: string[];
	eligAgeRange: string;
	eligNiche: string[];
}

const INITIAL_DATA: CampaignFormData = {
	title: "",
	brief: "",
	longBriefRaw: "",
	category: "",
	platform: "",
	tags: [],
	color: "lime",
	budget: "",
	rate: "",
	currency: "₹",
	perViews: "1k",
	minViews: "",
	totalSpots: "",
	deadline: "",
	bonusThreshold: "",
	bonusAmount: "",
	eligMinFollowers: "",
	eligMinAvgViews: "",
	eligGeos: [],
	eligLanguages: [],
	eligAgeRange: "",
	eligNiche: [],
};

const GEOS = [
	"Pan India", "Maharashtra", "Delhi NCR", "Karnataka", "Tamil Nadu",
	"Telangana", "Gujarat", "Rajasthan", "Uttar Pradesh", "West Bengal",
	"Kerala", "Punjab", "Haryana", "Madhya Pradesh", "Bihar",
	"Andhra Pradesh", "Odisha", "Assam", "Jharkhand", "Goa",
	"Chandigarh", "Himachal Pradesh", "Uttarakhand", "J&K",
];

const LANGUAGES = [
	"Hindi", "English", "Hinglish", "Tamil", "Telugu", "Kannada",
	"Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi",
	"Odia", "Assamese", "Urdu", "Rajasthani", "Bhojpuri",
];

const AGE_RANGES = [
	"18–24", "25–34", "35–44", "45+", "All ages",
];

const NICHES = [
	"Tech", "Fashion", "Beauty", "Food", "Fitness", "Gaming",
	"Finance", "Travel", "Education", "Lifestyle", "Parenting",
	"Music", "Comedy", "Health", "DIY",
];

// ---------------------------------------------------------------------------
// Field Error
// ---------------------------------------------------------------------------

function FieldError({ show, message = "This field is required" }: { show: boolean; message?: string }) {
	if (!show) return null;
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 5,
				marginTop: 6,
				fontSize: 12,
				color: "#fb7185",
				fontFamily: "'Inter', sans-serif",
			}}
		>
			<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round">
				<circle cx="8" cy="8" r="6.5" />
				<path d="M8 5.5v3M8 10.5v.5" />
			</svg>
			{message}
		</div>
	);
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
	saving = false,
}: {
	step: number;
	totalSteps: number;
	onBack: () => void;
	onNext: () => void;
	canContinue: boolean;
	nextLabel?: string;
	saving?: boolean;
}) {
	return (
		<div className="onboard-actions" style={{ marginTop: 32 }}>
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
			<button
				className="btn-next"
				onClick={onNext}
				disabled={saving}
			>
				{saving ? "Publishing..." : nextLabel}
				{!saving && <ArrowIcon />}
			</button>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Live Preview Card
// ---------------------------------------------------------------------------

function PreviewCard({
	data,
	brandName,
}: {
	data: CampaignFormData;
	brandName: string;
}) {
	const accent = ACCENT_MAP[data.color];
	const spotsTotal = parseInt(data.totalSpots) || 10;
	const spotsLeft = spotsTotal;
	const fillPct = 0; // new campaign, 0 filled

	const initials = brandName ? brandName.slice(0, 2).toUpperCase() : "BR";

	return (
		<div
			className="card"
			style={
				{
					height: "auto",
					cursor: "default",
					"--rate-from": accent.from,
					"--rate-to": accent.to,
					"--rate-glow": accent.glow,
					"--card-glow": `radial-gradient(ellipse at top left, ${accent.glow}, transparent 60%)`,
				} as React.CSSProperties
			}
		>
			<div className="card-top">
				<div className="card-head">
					<div className="brand-cluster">
						<div
							className="brand-mark"
							style={{
								background: `linear-gradient(135deg, ${accent.from}22, ${accent.to}44)`,
								color: accent.from,
							}}
						>
							{initials}
						</div>
						<div>
							<div className="brand-name">{brandName || "Your Brand"}</div>
							<div className="brand-handle">
								{data.platform
									? `@${data.platform.toLowerCase()}`
									: "@platform"}
							</div>
						</div>
					</div>
					{data.platform && (
						<div className="platform-pill">
							{data.platform === "Instagram" && (
								<IGIcon width={11} height={11} />
							)}
							{data.platform === "YouTube" && <YTIcon width={13} height={13} />}
							{data.platform === "X" && <TTIcon width={11} height={11} />}
							{data.platform}
						</div>
					)}
				</div>

				<h3 className="card-title">
					{data.title || "Campaign title will appear here"}
				</h3>
				<p className="card-brief">
					{data.brief || "Your short brief or tagline will show here."}
				</p>

				{data.tags.length > 0 && (
					<div className="tag-row" style={{ marginBottom: 16 }}>
						{data.tags.slice(0, 4).map((tag) => (
							<span key={tag} className="tag">
								{tag}
							</span>
						))}
					</div>
				)}
			</div>

			<div style={{ marginTop: 16 }}>
				<div className="card-rate">
					<div className="rate-label">CPM Rate</div>
					<div className="rate-amount">
						<span className="currency">{data.currency}</span>
						{data.rate ? formatMoney(data.rate, data.currency) : "—"}
						<span className="per">/ {data.perViews} views</span>
					</div>
					<div className="rate-meta">
						<span>Min. {data.minViews || "—"} views</span>
						<span className="mono">
							Budget {data.currency}
							{data.budget ? formatMoney(data.budget, data.currency) : "—"}
						</span>
					</div>
				</div>

				<div className="card-foot">
					<div className="spots-cluster">
						<div className="spots-bar">
							<div className="spots-fill" style={{ width: `${fillPct}%` }} />
						</div>
						<span>{spotsLeft} spots left</span>
					</div>
					{data.deadline && (
						<span>
							{(() => {
								const days = Math.max(
									0,
									Math.ceil(
										(new Date(data.deadline).getTime() - Date.now()) / 86400000,
									),
								);
								return `${days}d left`;
							})()}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Step Components
// ---------------------------------------------------------------------------

function Step1({
	data,
	onChange,
	errors = [],
}: {
	data: CampaignFormData;
	onChange: (patch: Partial<CampaignFormData>) => void;
	errors?: string[];
}) {
	const [showCatInput, setShowCatInput] = useState(false);
	const [catValue, setCatValue] = useState("");

	const customCat =
		data.category &&
		!CATEGORIES.filter((c) => c !== "Other").includes(data.category)
			? data.category
			: null;

	function handleOtherCatClick() {
		if (customCat) {
			setCatValue(customCat);
			setShowCatInput(true);
		} else {
			setShowCatInput(true);
		}
	}

	function addCustomCat() {
		const trimmed = catValue.trim();
		if (!trimmed) return;
		onChange({ category: trimmed });
		setShowCatInput(false);
		setCatValue("");
	}

	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 1 of 6 &mdash; Basics</div>
			<h2>Campaign basics</h2>
			<p className="lead">
				Give your campaign a title, tagline, and detailed guidelines.
			</p>

			<div className="field">
				<label className="field-label">Campaign title</label>
				<input
					className="field-input"
					placeholder="e.g. Summer Tech Drop 2025"
					value={data.title}
					onChange={(e) => onChange({ title: e.target.value })}
					style={errors.includes("title") ? { borderColor: "rgba(251,113,133,0.5)" } : undefined}
				/>
				<FieldError show={errors.includes("title")} message="Give your campaign a title" />
			</div>

			<div className="field">
				<label className="field-label">Short brief / tagline</label>
				<input
					className="field-input"
					placeholder="e.g. Showcase our new earbuds in your style"
					value={data.brief}
					onChange={(e) => onChange({ brief: e.target.value })}
					style={errors.includes("brief") ? { borderColor: "rgba(251,113,133,0.5)" } : undefined}
				/>
				<FieldError show={errors.includes("brief")} message="Add a short description" />
			</div>

			<div className="field">
				<label className="field-label">Detailed guidelines</label>
				<textarea
					className="cc-textarea"
					placeholder={
						"Line 1: mention the product name\nLine 2: include a discount code\nLine 3: show unboxing in first 10 seconds"
					}
					value={data.longBriefRaw}
					onChange={(e) => onChange({ longBriefRaw: e.target.value })}
					rows={5}
				/>
				<div
					style={{ fontSize: 11.5, color: "var(--color-ink-3)", marginTop: 6 }}
				>
					Each line becomes a separate guideline bullet.
				</div>
			</div>

			<div className="field" style={{ marginBottom: 0 }}>
				<label className="field-label" style={{ marginBottom: 10 }}>
					Category
				</label>
				<div className="chip-multi">
					{CATEGORIES.filter((c) => c !== "Other").map((cat) => (
						<button
							key={cat}
							className={data.category === cat ? "active" : ""}
							onClick={() => {
								onChange({ category: cat });
								setShowCatInput(false);
							}}
						>
							{cat}
						</button>
					))}
					<button
						className={customCat ? "active" : ""}
						onClick={handleOtherCatClick}
					>
						{customCat || "Other"}
					</button>
				</div>
				{showCatInput && (
					<div style={{ display: "flex", gap: 8, marginTop: 12 }}>
						<input
							type="text"
							value={catValue}
							onChange={(e) => setCatValue(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addCustomCat();
								}
							}}
							placeholder="Type your category..."
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
							onClick={addCustomCat}
							disabled={!catValue.trim()}
							style={{
								padding: "10px 16px",
								borderRadius: 10,
								border: "none",
								background: catValue.trim()
									? "var(--color-accent)"
									: "var(--color-glass)",
								color: catValue.trim() ? "#0a0a0c" : "var(--color-ink-3)",
								fontSize: 13,
								fontWeight: 600,
								cursor: catValue.trim() ? "pointer" : "default",
							}}
						>
							Add
						</button>
					</div>
				)}
				<FieldError show={errors.includes("category")} message="Pick a category" />
			</div>
		</div>
	);
}

function Step2({
	data,
	onChange,
	errors = [],
}: {
	data: CampaignFormData;
	onChange: (patch: Partial<CampaignFormData>) => void;
	errors?: string[];
}) {
	const [showTagInput, setShowTagInput] = useState(false);
	const [tagValue, setTagValue] = useState("");

	const builtinTags = CONTENT_TAGS.filter((t) => t !== "Other");
	const customTag = data.tags.find((t) => !builtinTags.includes(t));

	function toggleTag(tag: string) {
		if (data.tags.includes(tag)) {
			onChange({ tags: data.tags.filter((t) => t !== tag) });
		} else {
			onChange({ tags: [...data.tags, tag] });
		}
	}

	function handleOtherTagClick() {
		if (customTag) {
			setTagValue(customTag);
			setShowTagInput(true);
		} else {
			setShowTagInput(true);
		}
	}

	function addCustomTag() {
		const trimmed = tagValue.trim();
		if (!trimmed) return;
		const withoutCustom = data.tags.filter((t) => builtinTags.includes(t));
		if (withoutCustom.includes(trimmed)) return;
		onChange({ tags: [...withoutCustom, trimmed] });
		setShowTagInput(false);
		setTagValue("");
	}

	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 2 of 6 &mdash; Platform</div>
			<h2>Platform &amp; content</h2>
			<p className="lead">
				Choose where your campaign runs and what kind of content you want.
			</p>

			<div className="field-label" style={{ marginBottom: 10 }}>
				Platform
			</div>
			<div className="option-grid three" style={{ marginBottom: errors.includes("platform") ? 8 : 24 }}>
				{PLATFORMS.map(({ id, label, Icon }) => (
					<button
						key={id}
						className={`option-card${data.platform === id ? " active" : ""}`}
						onClick={() => onChange({ platform: id })}
					>
						<div className="o-ic">
							<Icon width={20} height={20} />
						</div>
						<div className="o-check">
							<CheckIcon />
						</div>
						<div className="o-title">{label}</div>
					</button>
				))}
			</div>
			<FieldError show={errors.includes("platform")} message="Select a platform" />
			{errors.includes("platform") && <div style={{ marginBottom: 16 }} />}

			<div className="field-label" style={{ marginBottom: 10 }}>
				Content tags
			</div>
			<div
				className="chip-multi"
				style={{ marginBottom: showTagInput ? 0 : 24 }}
			>
				{builtinTags.map((tag) => (
					<button
						key={tag}
						className={data.tags.includes(tag) ? "active" : ""}
						onClick={() => toggleTag(tag)}
					>
						{tag}
					</button>
				))}
				<button
					className={customTag ? "active" : ""}
					onClick={handleOtherTagClick}
				>
					{customTag || "Other"}
				</button>
			</div>
			{showTagInput && (
				<div
					style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 24 }}
				>
					<input
						type="text"
						value={tagValue}
						onChange={(e) => setTagValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addCustomTag();
							}
						}}
						placeholder="Type your tag..."
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
						onClick={addCustomTag}
						disabled={!tagValue.trim()}
						style={{
							padding: "10px 16px",
							borderRadius: 10,
							border: "none",
							background: tagValue.trim()
								? "var(--color-accent)"
								: "var(--color-glass)",
							color: tagValue.trim() ? "#0a0a0c" : "var(--color-ink-3)",
							fontSize: 13,
							fontWeight: 600,
							cursor: tagValue.trim() ? "pointer" : "default",
						}}
					>
						Add
					</button>
				</div>
			)}

			<div className="field-label" style={{ marginBottom: 10 }}>
				Color theme
			</div>
			<div className="cc-colors">
				{COLORS.map((c) => (
					<button
						key={c}
						className={`cc-color-dot${data.color === c ? " active" : ""}`}
						style={{ background: COLOR_DOT_BG[c] }}
						onClick={() => onChange({ color: c })}
						title={c}
					/>
				))}
			</div>
		</div>
	);
}

function formatMoney(value: string, currency: string): string {
	const digits = value.replace(/[^0-9]/g, "");
	if (!digits) return "";
	if (currency === "₹") {
		// Indian: last 3 digits, then groups of 2
		const len = digits.length;
		if (len <= 3) return digits;
		let result = digits.slice(-3);
		let remaining = digits.slice(0, -3);
		while (remaining.length > 2) {
			result = remaining.slice(-2) + "," + result;
			remaining = remaining.slice(0, -2);
		}
		if (remaining) result = remaining + "," + result;
		return result;
	}
	// Western: groups of 3
	return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatNumber(value: string): string {
	const digits = value.replace(/[^0-9]/g, "");
	if (!digits) return "";
	return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const DIGIT_LIMITS: Record<string, number> = { budget: 8, rate: 4 };

function handleMoneyInput(
	e: React.ChangeEvent<HTMLInputElement>,
	field: "budget" | "rate",
	currency: string,
	onChange: (patch: Partial<CampaignFormData>) => void,
) {
	const raw = e.target.value.replace(/[^0-9]/g, "");
	const limit = DIGIT_LIMITS[field] || 10;
	const clamped = raw.slice(0, limit);
	onChange({ [field]: clamped } as Partial<CampaignFormData>);
}

function Step3({
	data,
	onChange,
	errors = [],
}: {
	data: CampaignFormData;
	onChange: (patch: Partial<CampaignFormData>) => void;
	errors?: string[];
}) {
	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 3 of 6 &mdash; Budget</div>
			<h2>Budget &amp; rates</h2>
			<p className="lead">
				Define how much you&apos;re paying and what you expect in return.
			</p>

			<div className="field">
				<label className="field-label">Total campaign budget</label>
				<div className="cc-input-prefix" style={errors.includes("budget") ? { borderColor: "rgba(251,113,133,0.5)" } : undefined}>
					<span className="prefix">{data.currency}</span>
					<input
						type="text"
						inputMode="numeric"
						placeholder="5,00,000"
						value={formatMoney(data.budget, data.currency)}
						onChange={(e) =>
							handleMoneyInput(e, "budget", data.currency, onChange)
						}
					/>
				</div>
				<FieldError show={errors.includes("budget")} message="Enter a campaign budget" />
			</div>

			<div className="field">
				<label className="field-label">CPM rate (per 1k views)</label>
				<div className="cc-input-prefix" style={errors.includes("rate") ? { borderColor: "rgba(251,113,133,0.5)" } : undefined}>
					<span className="prefix">{data.currency}</span>
					<input
						type="text"
						inputMode="numeric"
						placeholder="150"
						value={formatMoney(data.rate, data.currency)}
						onChange={(e) =>
							handleMoneyInput(e, "rate", data.currency, onChange)
						}
					/>
				</div>
				<FieldError show={errors.includes("rate")} message="Set a CPM rate" />
			</div>

			<div className="field">
				<label className="field-label">Currency</label>
				<div className="chip-multi" style={{ marginBottom: 0 }}>
					{CURRENCIES.map((cur) => (
						<button
							key={cur}
							className={data.currency === cur ? "active" : ""}
							onClick={() => onChange({ currency: cur })}
						>
							{cur}
						</button>
					))}
				</div>
			</div>

			<div className="field">
				<label className="field-label">
					Minimum views required{" "}
					<span style={{ color: "var(--color-ink-3)", fontWeight: 400 }}>
						(Optional)
					</span>
				</label>
				<input
					className="field-input"
					type="text"
					inputMode="numeric"
					placeholder="10,000"
					value={formatNumber(data.minViews)}
					onChange={(e) =>
						onChange({ minViews: e.target.value.replace(/[^0-9]/g, "") })
					}
				/>
			</div>
		</div>
	);
}

function Step4({
	data,
	onChange,
	errors = [],
}: {
	data: CampaignFormData;
	onChange: (patch: Partial<CampaignFormData>) => void;
	errors?: string[];
}) {
	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 4 of 6 &mdash; Timeline</div>
			<h2>Spots &amp; timeline</h2>
			<p className="lead">
				Set how many creators you want and when the campaign ends.
			</p>

			<div className="field">
				<label className="field-label">Total creator spots</label>
				<input
					className="field-input"
					type="number"
					placeholder="20"
					value={data.totalSpots}
					onChange={(e) => onChange({ totalSpots: e.target.value })}
					style={errors.includes("totalSpots") ? { borderColor: "rgba(251,113,133,0.5)" } : undefined}
				/>
				<FieldError show={errors.includes("totalSpots")} message="Enter the number of spots" />
			</div>

			<div className="field">
				<label className="field-label">Campaign deadline</label>
				<input
					className="field-input"
					type="date"
					value={data.deadline}
					style={errors.includes("deadline") ? { borderColor: "rgba(251,113,133,0.5)" } : undefined}
					onChange={(e) => {
						const val = e.target.value;
						const today = new Date().toISOString().split("T")[0];
						if (!val || val >= today) onChange({ deadline: val });
					}}
					onKeyDown={(e) => e.preventDefault()}
					min={new Date().toISOString().split("T")[0]}
					style={{ colorScheme: "dark", ...(errors.includes("deadline") ? { borderColor: "rgba(251,113,133,0.5)" } : {}) }}
				/>
				<FieldError show={errors.includes("deadline")} message="Set a campaign deadline" />
			</div>

			<div style={{ marginTop: 8, marginBottom: 16 }}>
				<div
					style={{
						fontSize: 11,
						textTransform: "uppercase",
						letterSpacing: "0.1em",
						color: "var(--color-ink-3)",
						fontFamily: "'JetBrains Mono', monospace",
						marginBottom: 12,
					}}
				>
					Bonus (optional)
				</div>
				<div
					style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
				>
					<div className="field" style={{ marginBottom: 0 }}>
						<label className="field-label">Bonus threshold</label>
						<input
							className="field-input"
							placeholder="50k views"
							value={data.bonusThreshold}
							onChange={(e) => onChange({ bonusThreshold: e.target.value })}
						/>
					</div>
					<div className="field" style={{ marginBottom: 0 }}>
						<label className="field-label">Bonus amount</label>
						<input
							className="field-input"
							placeholder="₹2,000"
							value={data.bonusAmount}
							onChange={(e) => onChange({ bonusAmount: e.target.value })}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function Step5Eligibility({
	data,
	onChange,
}: {
	data: CampaignFormData;
	onChange: (patch: Partial<CampaignFormData>) => void;
}) {
	function toggleIn(arr: string[], item: string): string[] {
		return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
	}

	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 5 of 6 &mdash; Eligibility</div>
			<h2>Creator eligibility</h2>
			<p className="lead">
				Set requirements for who can apply. All fields are optional — skip any
				that don&apos;t matter for this campaign.
			</p>

			{/* Optional badge */}
			<div
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: 6,
					padding: "6px 14px",
					borderRadius: 20,
					background: "rgba(190,242,100,0.06)",
					border: "1px solid rgba(190,242,100,0.15)",
					marginBottom: 28,
					fontSize: 12,
					color: "rgba(190,242,100,0.7)",
					fontFamily: "'JetBrains Mono', monospace",
					letterSpacing: "0.03em",
				}}
			>
				<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
					<circle cx="8" cy="8" r="6.5" />
					<path d="M8 5v3M8 10.5v.5" />
				</svg>
				Entirely optional — skip to continue
			</div>

			{/* Follower & Views row */}
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 4 }}>
				<div className="field">
					<label className="field-label">
						Min. followers
					</label>
					<input
						className="field-input"
						type="text"
						inputMode="numeric"
						placeholder="e.g. 10,000"
						value={data.eligMinFollowers ? formatNumber(data.eligMinFollowers) : ""}
						onChange={(e) =>
							onChange({ eligMinFollowers: e.target.value.replace(/[^0-9]/g, "") })
						}
					/>
				</div>
				<div className="field">
					<label className="field-label">
						Min. avg. monthly views
					</label>
					<input
						className="field-input"
						type="text"
						inputMode="numeric"
						placeholder="e.g. 50,000"
						value={data.eligMinAvgViews ? formatNumber(data.eligMinAvgViews) : ""}
						onChange={(e) =>
							onChange({ eligMinAvgViews: e.target.value.replace(/[^0-9]/g, "") })
						}
					/>
				</div>
			</div>

			{/* Geo targeting */}
			<div className="field">
				<label className="field-label" style={{ marginBottom: 10 }}>
					Target regions
					<span style={{ color: "var(--color-ink-3)", fontWeight: 400, marginLeft: 6 }}>
						Creator&apos;s audience location
					</span>
				</label>
				<div className="chip-multi">
					{GEOS.map((geo) => (
						<button
							key={geo}
							className={data.eligGeos.includes(geo) ? "active" : ""}
							onClick={() => onChange({ eligGeos: toggleIn(data.eligGeos, geo) })}
						>
							{geo}
						</button>
					))}
				</div>
			</div>

			{/* Languages */}
			<div className="field">
				<label className="field-label" style={{ marginBottom: 10 }}>
					Content language
				</label>
				<div className="chip-multi">
					{LANGUAGES.map((lang) => (
						<button
							key={lang}
							className={data.eligLanguages.includes(lang) ? "active" : ""}
							onClick={() => onChange({ eligLanguages: toggleIn(data.eligLanguages, lang) })}
						>
							{lang}
						</button>
					))}
				</div>
			</div>

			{/* Audience age range */}
			<div className="field">
				<label className="field-label" style={{ marginBottom: 10 }}>
					Audience age range
				</label>
				<div className="chip-multi">
					{AGE_RANGES.map((age) => (
						<button
							key={age}
							className={data.eligAgeRange === age ? "active" : ""}
							onClick={() => onChange({ eligAgeRange: data.eligAgeRange === age ? "" : age })}
						>
							{age}
						</button>
					))}
				</div>
			</div>

			{/* Creator niche */}
			<div className="field" style={{ marginBottom: 0 }}>
				<label className="field-label" style={{ marginBottom: 10 }}>
					Preferred creator niche
				</label>
				<div className="chip-multi">
					{NICHES.map((n) => (
						<button
							key={n}
							className={data.eligNiche.includes(n) ? "active" : ""}
							onClick={() => onChange({ eligNiche: toggleIn(data.eligNiche, n) })}
						>
							{n}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

function Step6Review({
	data,
	brandName,
}: {
	data: CampaignFormData;
	brandName: string;
}) {
	const eligRows = [
		{ label: "Min. followers", value: data.eligMinFollowers ? formatNumber(data.eligMinFollowers) : "" },
		{ label: "Min. avg. views", value: data.eligMinAvgViews ? formatNumber(data.eligMinAvgViews) : "" },
		{ label: "Target regions", value: data.eligGeos.join(", ") },
		{ label: "Languages", value: data.eligLanguages.join(", ") },
		{ label: "Audience age", value: data.eligAgeRange },
		{ label: "Creator niche", value: data.eligNiche.join(", ") },
	].filter((r) => r.value);

	const rows = [
		{ label: "Title", value: data.title || "—" },
		{ label: "Brief", value: data.brief || "—" },
		{ label: "Category", value: data.category || "—" },
		{ label: "Platform", value: data.platform || "—" },
		{ label: "Tags", value: data.tags.length ? data.tags.join(", ") : "—" },
		{ label: "Color theme", value: data.color },
		{
			label: "Budget",
			value: data.budget
				? `${data.currency}${formatMoney(data.budget, data.currency)}`
				: "—",
		},
		{
			label: "CPM rate",
			value: data.rate
				? `${data.currency}${formatMoney(data.rate, data.currency)} / ${data.perViews} views`
				: "—",
		},
		{ label: "Min. views", value: data.minViews || "—" },
		{ label: "Spots", value: data.totalSpots || "—" },
		{ label: "Deadline", value: data.deadline || "—" },
		{
			label: "Bonus",
			value:
				data.bonusThreshold && data.bonusAmount
					? `${data.bonusAmount} at ${data.bonusThreshold}`
					: "None",
		},
		...eligRows.map((r) => ({ label: r.label, value: r.value })),
	];

	return (
		<div className="onboard-step">
			<div className="onboard-eyebrow">Step 6 of 6 &mdash; Review</div>
			<h2>Review &amp; publish</h2>
			<p className="lead">
				Check your campaign details below. Once published it will go live in the
				marketplace.
			</p>

			<div className="summary-card">
				{rows.map(({ label, value }) => (
					<div key={label} className="summary-row">
						<span className="label">{label}</span>
						<span
							className="value"
							style={{
								maxWidth: 260,
								textAlign: "right",
								wordBreak: "break-word",
							}}
						>
							{value}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

function hasEligibility(d: CampaignFormData): boolean {
	return !!(d.eligMinFollowers || d.eligMinAvgViews || d.eligGeos.length || d.eligLanguages.length || d.eligAgeRange || d.eligNiche.length);
}

// ---------------------------------------------------------------------------
// Cancel Confirm Dialog
// ---------------------------------------------------------------------------

function CancelConfirmDialog({
	onConfirm,
	onCancel,
}: {
	onConfirm: () => void;
	onCancel: () => void;
}) {
	const overlayRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={overlayRef}
			onClick={(e) => { if (e.target === overlayRef.current) onCancel(); }}
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(0,0,0,0.6)",
				backdropFilter: "blur(4px)",
				WebkitBackdropFilter: "blur(4px)",
				zIndex: 9998,
				display: "grid",
				placeItems: "center",
			}}
		>
			<div
				style={{
					background: "rgba(22,22,26,0.98)",
					border: "1px solid var(--color-line)",
					borderRadius: 16,
					padding: 28,
					width: 400,
					maxWidth: "90vw",
					boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
				}}
			>
				<h3 style={{
					fontFamily: "'Geist', sans-serif",
					fontSize: 17,
					fontWeight: 600,
					letterSpacing: "-0.02em",
					margin: "0 0 8px",
				}}>
					Discard campaign?
				</h3>
				<p style={{
					fontSize: 13,
					color: "var(--color-ink-2)",
					lineHeight: 1.6,
					margin: "0 0 24px",
				}}>
					You haven&apos;t published yet. All progress on this campaign will be lost.
				</p>
				<div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
					<button
						onClick={onCancel}
						style={{
							padding: "9px 20px",
							borderRadius: 8,
							fontSize: 13,
							fontWeight: 500,
							background: "rgba(255,255,255,0.04)",
							border: "1px solid var(--color-line-2)",
							color: "var(--color-ink-1)",
							cursor: "pointer",
							transition: "background 0.15s",
						}}
					>
						Keep editing
					</button>
					<button
						onClick={onConfirm}
						style={{
							padding: "9px 20px",
							borderRadius: 8,
							fontSize: 13,
							fontWeight: 500,
							border: "none",
							cursor: "pointer",
							transition: "all 0.15s",
							background: "rgba(251,113,133,0.15)",
							color: "#fb7185",
							boxShadow: "0 0 0 1px rgba(251,113,133,0.3)",
						}}
					>
						Discard & leave
					</button>
				</div>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Inner page
// ---------------------------------------------------------------------------

function CreateCampaignInner() {
	const { data: session, isPending: sessionPending } = useSession();
	const router = useRouter();

	const brandProfile = useQuery(
		api.brands.getByUserId,
		session?.user?.id ? { userId: session.user.id } : "skip",
	);

	const createCampaign = useMutation(api.campaigns.create);

	const [step, setStep] = useState(0);
	const [saving, setSaving] = useState(false);
	const [published, setPublished] = useState(false);
	const [data, setData] = useState<CampaignFormData>(INITIAL_DATA);
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);

	const TOTAL_STEPS = 6;
	const progress = ((step + 1) / TOTAL_STEPS) * 100;

	function patch(p: Partial<CampaignFormData>) {
		setData((d) => ({ ...d, ...p }));
		if (errors.length) setErrors([]);
	}

	function validate(): string[] {
		const e: string[] = [];
		if (step === 0) {
			if (!data.title.trim()) e.push("title");
			if (!data.brief.trim()) e.push("brief");
			if (!data.category) e.push("category");
		} else if (step === 1) {
			if (!data.platform) e.push("platform");
		} else if (step === 2) {
			if (!data.budget.trim()) e.push("budget");
			if (!data.rate.trim()) e.push("rate");
		} else if (step === 3) {
			if (!data.totalSpots.trim()) e.push("totalSpots");
			if (!data.deadline) e.push("deadline");
		}
		return e;
	}

	async function handleNext() {
		const errs = validate();
		if (errs.length) {
			setErrors(errs);
			return;
		}

		if (step < TOTAL_STEPS - 1) {
			setStep((s) => s + 1);
			return;
		}

		// Final step — publish
		if (!session?.user || !brandProfile) return;

		setSaving(true);
		try {
			const daysLeft = Math.max(
				0,
				Math.ceil((new Date(data.deadline).getTime() - Date.now()) / 86400000),
			);
			const spots = parseInt(data.totalSpots) || 0;

			await createCampaign({
				brandId: brandProfile._id,
				title: data.title,
				brief: data.brief,
				longBrief: data.longBriefRaw
					.split("\n")
					.map((l) => l.trim())
					.filter(Boolean),
				platform: data.platform,
				category: data.category,
				rate: parseFloat(data.rate) || 0,
				currency: data.currency,
				perViews: data.perViews,
				minViews: data.minViews,
				budget: data.budget,
				deadline: data.deadline,
				daysLeft,
				spotsLeft: spots,
				totalSpots: spots,
				trending: false,
				color: data.color,
				tags: data.tags,
				creatorsJoined: 0,
				bonus: {
					threshold: data.bonusThreshold || "—",
					amount: data.bonusAmount || "—",
				},
				...(hasEligibility(data) ? {
					eligibility: {
						...(data.eligMinFollowers ? { minFollowers: data.eligMinFollowers } : {}),
						...(data.eligMinAvgViews ? { minAvgViews: data.eligMinAvgViews } : {}),
						...(data.eligGeos.length ? { geos: data.eligGeos } : {}),
						...(data.eligLanguages.length ? { languages: data.eligLanguages } : {}),
						...(data.eligAgeRange ? { ageRange: data.eligAgeRange } : {}),
						...(data.eligNiche.length ? { niche: data.eligNiche } : {}),
					},
				} : {}),
				status: "active",
			});

			setPublished(true);
		} catch (err) {
			console.error("Failed to create campaign:", err);
			setSaving(false);
		}
	}

	function handleBack() {
		if (step > 0) {
			setErrors([]);
			setStep((s) => s - 1);
		}
	}

	// Loading state
	if (sessionPending || brandProfile === undefined) {
		return (
			<div className="cc-page">
				<nav className="onboard-nav">
					<div className="logo">
						<div className="logo-dot" />
						Inflio
					</div>
					<span />
					<Link href="/dashboard/campaigns" className="skip">
						Cancel
					</Link>
				</nav>
				<div className="onboard-progress">
					<div className="onboard-progress-fill" style={{ width: "0%" }} />
				</div>
				<div
					style={{
						display: "grid",
						placeItems: "center",
						flex: 1,
						minHeight: "60vh",
					}}
				>
					<div style={{ color: "var(--color-ink-2)", fontSize: 14 }}>
						Loading...
					</div>
				</div>
			</div>
		);
	}

	// No brand profile — prompt to complete onboarding
	if (!brandProfile) {
		return (
			<div className="cc-page">
				<nav className="onboard-nav">
					<div className="logo">
						<div className="logo-dot" />
						Inflio
					</div>
					<span />
					<Link href="/dashboard/campaigns" className="skip">
						Back
					</Link>
				</nav>
				<div
					style={{
						display: "grid",
						placeItems: "center",
						flex: 1,
						minHeight: "60vh",
						padding: 32,
					}}
				>
					<div style={{ textAlign: "center", maxWidth: 440 }}>
						<div
							style={{
								width: 56,
								height: 56,
								borderRadius: "50%",
								background: "rgba(190,242,100,0.08)",
								border: "1px solid rgba(190,242,100,0.2)",
								display: "grid",
								placeItems: "center",
								margin: "0 auto 20px",
								fontSize: 24,
							}}
						>
							✦
						</div>
						<h2
							style={{
								fontFamily: "'Geist', sans-serif",
								fontSize: 28,
								fontWeight: 500,
								letterSpacing: "-0.025em",
								margin: "0 0 12px",
							}}
						>
							Complete brand onboarding first
						</h2>
						<p
							style={{
								color: "var(--color-ink-1)",
								fontSize: 14,
								lineHeight: 1.6,
								margin: "0 0 28px",
							}}
						>
							You need a brand profile before creating a campaign. It only takes
							a minute.
						</p>
						<Link
							href="/onboarding?role=brand"
							className="btn-next"
							style={{ display: "inline-flex", textDecoration: "none" }}
						>
							Set up brand profile
							<ArrowIcon />
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const brandName = brandProfile.name || "Your Brand";

	// ── Success state ──
	if (published) {
		const accent = ACCENT_MAP[data.color];
		return (
			<div className="cc-page">
				<nav className="onboard-nav">
					<div className="logo">
						<div className="logo-dot" />
						Inflio
					</div>
					<span />
					<span />
				</nav>
				<div className="onboard-progress">
					<div className="onboard-progress-fill" style={{ width: "100%" }} />
				</div>

				<div className="cc-success">
					{/* Animated check */}
					<div className="cc-success-icon">
						<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
							<path
								className="cc-success-check"
								d="M9 16.5L14 21.5L23 11.5"
								stroke={accent.from}
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>

					<h2 className="cc-success-title">Campaign published!</h2>
					<p className="cc-success-desc">
						Your campaign is now live in the marketplace. Creators can start
						applying immediately.
					</p>

					{/* Preview card */}
					<div className="cc-success-card">
						<PreviewCard data={data} brandName={brandName} />
					</div>

					{/* Actions */}
					<div className="cc-success-actions">
						<Link
							href="/marketplace"
							className="btn-next"
							style={{ textDecoration: "none", display: "inline-flex" }}
						>
							View in Marketplace
							<ArrowIcon />
						</Link>
						<Link
							href="/campaigns/create"
							onClick={(e) => {
								e.preventDefault();
								setData(INITIAL_DATA);
								setStep(0);
								setPublished(false);
								setSaving(false);
							}}
							className="btn-back"
							style={{ textDecoration: "none", display: "inline-flex" }}
						>
							Create Another
						</Link>
					</div>
				</div>
			</div>
		);
	}

	function renderStep() {
		if (step === 0) return <Step1 data={data} onChange={patch} errors={errors} />;
		if (step === 1) return <Step2 data={data} onChange={patch} errors={errors} />;
		if (step === 2) return <Step3 data={data} onChange={patch} errors={errors} />;
		if (step === 3) return <Step4 data={data} onChange={patch} errors={errors} />;
		if (step === 4) return <Step5Eligibility data={data} onChange={patch} />;
		if (step === 5) return <Step6Review data={data} brandName={brandName} />;
		return null;
	}

	return (
		<div className="cc-page">
			{/* Nav */}
			<nav className="onboard-nav">
				<div className="logo">
					<div className="logo-dot" />
					Inflio
				</div>
				<span
					className="step-count"
					style={{
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: 12,
						color: "var(--color-ink-2)",
					}}
				>
					{step + 1} / {TOTAL_STEPS}
				</span>
				<button
					onClick={() => setShowCancelConfirm(true)}
					className="skip"
					style={{ background: "none", border: "none", cursor: "pointer" }}
				>
					Cancel
				</button>
			</nav>

			{showCancelConfirm && (
				<CancelConfirmDialog
					onConfirm={() => router.push("/dashboard/campaigns")}
					onCancel={() => setShowCancelConfirm(false)}
				/>
			)}

			{/* Progress */}
			<div className="onboard-progress">
				<div
					className="onboard-progress-fill"
					style={{ width: `${progress}%` }}
				/>
			</div>

			{/* Body */}
			<div className="cc-body">
				{/* Form column */}
				<div className="cc-form">
					{renderStep()}
					<StepNav
						step={step}
						totalSteps={TOTAL_STEPS}
						onBack={handleBack}
						onNext={handleNext}
						canContinue={canContinue()}
						nextLabel={
							step === TOTAL_STEPS - 1
								? "Publish Campaign"
								: step === 4
									? hasEligibility(data) ? "Continue" : "Skip & Continue"
									: "Continue"
						}
						saving={saving}
					/>
				</div>

				{/* Preview column */}
				<div className="cc-preview">
					<div className="cc-preview-label">Live Preview</div>
					<PreviewCard data={data} brandName={brandName} />

					{/* Extra info pill */}
					<div
						style={{
							marginTop: 16,
							padding: "10px 14px",
							borderRadius: 10,
							background: "rgba(255,255,255,0.03)",
							border: "1px solid var(--color-line)",
							fontSize: 12,
							color: "var(--color-ink-2)",
							lineHeight: 1.6,
						}}
					>
						This preview updates live as you fill in the form. The card will
						appear exactly like this in the marketplace.
					</div>
				</div>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------

export default function CreateCampaignPage() {
	return (
		<>
			<div className="ambient" />
			<div className="grain" />
			<CreateCampaignInner />
		</>
	);
}
