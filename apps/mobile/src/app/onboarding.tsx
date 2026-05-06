import { useMutation } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useAuth } from "~/providers/auth";
import { api } from "../../convex/_generated/api";

// ---------------------------------------------------------------------------
// Constants (matching web)
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
		range: "1K - 50K",
		desc: "High engagement, niche reach",
	},
	{
		id: "med",
		label: "Med",
		range: "50K - 100K",
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
	},
	{
		id: "performance",
		label: "Performance",
		desc: "Drive clicks, signups & sales",
	},
	{
		id: "ugc",
		label: "UGC Content",
		desc: "Authentic content for your channels",
	},
];

const BUDGETS = [
	{ id: "50k-2l", label: "₹50K - ₹2L", desc: "Starter" },
	{ id: "2l-5l", label: "₹2L - ₹5L", desc: "Growth" },
	{ id: "5l-15l", label: "₹5L - ₹15L", desc: "Scale" },
	{ id: "15l-plus", label: "₹15L+", desc: "Enterprise" },
];

const PLATFORMS = [
	{ id: "instagram", label: "Instagram" },
	{ id: "youtube", label: "YouTube" },
	{ id: "tiktok", label: "TikTok" },
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
// Icons
// ---------------------------------------------------------------------------

function CheckIcon() {
	return (
		<Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
			<Path
				d="M5 13l4 4L19 7"
				stroke="#d9f99d"
				strokeWidth={2.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function BackArrow() {
	return (
		<Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
			<Path
				d="M19 12H5M12 5l-7 7 7 7"
				stroke="#FFFFFF"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function LogOutIcon() {
	return (
		<Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
			<Path
				d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
				stroke="#9CA3AF"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function SuccessIcon() {
	return (
		<Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
			<Circle cx={12} cy={12} r={10} stroke="#d9f99d" strokeWidth={2} />
			<Path
				d="M8 12l3 3 5-5"
				stroke="#d9f99d"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function CreatorIcon({ color }: { color: string }) {
	return (
		<Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
			<Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.5} />
			<Path
				d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
				stroke={color}
				strokeWidth={1.5}
				strokeLinecap="round"
			/>
		</Svg>
	);
}

function BrandSvgIcon({ color }: { color: string }) {
	return (
		<Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
			<Rect
				x={3}
				y={3}
				width={18}
				height={18}
				rx={4}
				stroke={color}
				strokeWidth={1.5}
			/>
			<Path
				d="M8 12h8M8 8h8M8 16h5"
				stroke={color}
				strokeWidth={1.5}
				strokeLinecap="round"
			/>
		</Svg>
	);
}

// ---------------------------------------------------------------------------
// Shared UI
// ---------------------------------------------------------------------------

function OptionCard({
	selected,
	onPress,
	children,
}: {
	selected: boolean;
	onPress: () => void;
	children: React.ReactNode;
}) {
	return (
		<Pressable
			style={[styles.optionCard, selected && styles.optionCardActive]}
			onPress={onPress}
		>
			{selected && (
				<View style={styles.optionCheck}>
					<CheckIcon />
				</View>
			)}
			{children}
		</Pressable>
	);
}

function Chip({
	label,
	selected,
	onPress,
}: {
	label: string;
	selected: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			style={[styles.chip, selected && styles.chipActive]}
			onPress={onPress}
		>
			<Text style={[styles.chipText, selected && styles.chipTextActive]}>
				{label}
			</Text>
		</Pressable>
	);
}

// ---------------------------------------------------------------------------
// Role Selection Step (Step 0)
// ---------------------------------------------------------------------------

function RoleSelectStep({
	role,
	onSelect,
}: {
	role: "creator" | "brand" | null;
	onSelect: (r: "creator" | "brand") => void;
}) {
	const scaleCreator = useRef(new Animated.Value(1)).current;
	const scaleBrand = useRef(new Animated.Value(1)).current;

	function pressIn(anim: Animated.Value) {
		Animated.spring(anim, { toValue: 0.97, useNativeDriver: true }).start();
	}
	function pressOut(anim: Animated.Value) {
		Animated.spring(anim, { toValue: 1, useNativeDriver: true }).start();
	}

	return (
		<View>
			<Text style={styles.eyebrow}>Let's get started</Text>
			<Text style={styles.stepTitle}>How will you use Inflio?</Text>
			<Text style={styles.stepLead}>
				Choose your role to get a personalized experience.
			</Text>

			<View style={styles.roleCards}>
				<Pressable
					onPress={() => onSelect("creator")}
					onPressIn={() => pressIn(scaleCreator)}
					onPressOut={() => pressOut(scaleCreator)}
				>
					<Animated.View
						style={[
							styles.roleCard,
							role === "creator" && styles.roleCardActive,
							{ transform: [{ scale: scaleCreator }] },
						]}
					>
						<View style={styles.roleCardHeader}>
							<View
								style={[
									styles.roleIconWrap,
									role === "creator" && styles.roleIconWrapActive,
								]}
							>
								<CreatorIcon
									color={role === "creator" ? "#d9f99d" : "#9CA3AF"}
								/>
							</View>
							{role === "creator" && (
								<View style={styles.roleCheckBadge}>
									<CheckIcon />
								</View>
							)}
						</View>
						<Text style={styles.roleTitle}>Creator</Text>
						<Text style={styles.roleDesc}>
							Monetise your audience with brand deals
						</Text>
						<View style={styles.roleFeatures}>
							{[
								"Get paid per view",
								"Pick campaigns that match you",
								"Track earnings in real-time",
							].map((f) => (
								<View key={f} style={styles.roleFeatureRow}>
									<View
										style={[
											styles.roleFeatureDot,
											role === "creator" && styles.roleFeatureDotActive,
										]}
									/>
									<Text style={styles.roleFeatureText}>{f}</Text>
								</View>
							))}
						</View>
					</Animated.View>
				</Pressable>

				<Pressable
					onPress={() => onSelect("brand")}
					onPressIn={() => pressIn(scaleBrand)}
					onPressOut={() => pressOut(scaleBrand)}
				>
					<Animated.View
						style={[
							styles.roleCard,
							role === "brand" && styles.roleCardActive,
							{ transform: [{ scale: scaleBrand }] },
						]}
					>
						<View style={styles.roleCardHeader}>
							<View
								style={[
									styles.roleIconWrap,
									role === "brand" && styles.roleIconWrapActive,
								]}
							>
								<BrandSvgIcon
									color={role === "brand" ? "#d9f99d" : "#9CA3AF"}
								/>
							</View>
							{role === "brand" && (
								<View style={styles.roleCheckBadge}>
									<CheckIcon />
								</View>
							)}
						</View>
						<Text style={styles.roleTitle}>Brand</Text>
						<Text style={styles.roleDesc}>Run creator campaigns at scale</Text>
						<View style={styles.roleFeatures}>
							{[
								"Access verified creators",
								"Pay only for real views",
								"Campaign analytics dashboard",
							].map((f) => (
								<View key={f} style={styles.roleFeatureRow}>
									<View
										style={[
											styles.roleFeatureDot,
											role === "brand" && styles.roleFeatureDotActive,
										]}
									/>
									<Text style={styles.roleFeatureText}>{f}</Text>
								</View>
							))}
						</View>
					</Animated.View>
				</Pressable>
			</View>
		</View>
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
		<View>
			<Text style={styles.eyebrow}>Step 2 of 5 — Profile</Text>
			<Text style={styles.stepTitle}>Tell us about yourself</Text>
			<Text style={styles.stepLead}>
				We use this to match you with the right brands and campaigns.
			</Text>

			<View style={styles.field}>
				<Text style={styles.label}>Full name</Text>
				<TextInput
					style={styles.input}
					placeholder="Your name"
					placeholderTextColor="#6B7280"
					value={data.name}
					onChangeText={(v) => onChange({ name: v })}
				/>
			</View>
			<View style={styles.field}>
				<Text style={styles.label}>Handle (without @)</Text>
				<TextInput
					style={styles.input}
					placeholder="yourhandle"
					placeholderTextColor="#6B7280"
					value={data.handle}
					onChangeText={(v) => onChange({ handle: v })}
					autoCapitalize="none"
				/>
			</View>
			<View style={styles.field}>
				<Text style={styles.label}>City</Text>
				<TextInput
					style={styles.input}
					placeholder="Mumbai"
					placeholderTextColor="#6B7280"
					value={data.city}
					onChangeText={(v) => onChange({ city: v })}
				/>
			</View>

			<Text style={[styles.label, { marginBottom: 12 }]}>Creator tier</Text>
			<View style={styles.tierGrid}>
				{TIERS.map((t) => {
					const selected = data.tier === t.id;
					return (
						<Pressable
							key={t.id}
							style={[styles.tierCard, selected && styles.tierCardActive]}
							onPress={() => onChange({ tier: t.id })}
						>
							{selected && (
								<View style={styles.optionCheck}>
									<CheckIcon />
								</View>
							)}
							<Text style={styles.tierLabel}>{t.label}</Text>
							<Text style={styles.tierRange}>{t.range}</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
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
		<View>
			<Text style={styles.eyebrow}>Step 3 of 5 — Niches</Text>
			<Text style={styles.stepTitle}>What do you create?</Text>
			<Text style={styles.stepLead}>
				Pick up to 4 niches that best describe your content.
			</Text>

			<View style={styles.chipGrid}>
				{CREATOR_NICHES.map((n) => (
					<Chip
						key={n}
						label={n}
						selected={data.niches.includes(n)}
						onPress={() => toggle(n)}
					/>
				))}
			</View>
			<Text style={styles.counter}>{data.niches.length} / 4 selected</Text>
		</View>
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
		<View>
			<Text style={styles.eyebrow}>Step 4 of 5 — Platforms</Text>
			<Text style={styles.stepTitle}>Connect your channels</Text>
			<Text style={styles.stepLead}>
				Link your social accounts so brands can verify your reach.
			</Text>

			<View style={styles.platformList}>
				{PLATFORMS.map(({ id, label }) => {
					const isConnected = data.connected.includes(id);
					return (
						<View key={id} style={styles.platformRow}>
							<View style={styles.platformLeft}>
								<View style={styles.platformIcon}>
									<Text style={styles.platformIconText}>{label.charAt(0)}</Text>
								</View>
								<View>
									<Text style={styles.platformName}>{label}</Text>
									{isConnected && (
										<Text style={styles.platformHandle}>
											@{data.handle || "yourhandle"}
										</Text>
									)}
								</View>
							</View>
							<Pressable
								style={[styles.connectBtn, isConnected && styles.connectedBtn]}
								onPress={() => togglePlatform(id)}
							>
								<Text
									style={[
										styles.connectBtnText,
										isConnected && styles.connectedBtnText,
									]}
								>
									{isConnected ? "Connected" : "Connect"}
								</Text>
							</Pressable>
						</View>
					);
				})}
			</View>
		</View>
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
		<View>
			<Text style={styles.eyebrow}>Step 5 of 5 — Payouts</Text>
			<Text style={styles.stepTitle}>Set up payouts</Text>
			<Text style={styles.stepLead}>
				We pay directly to your UPI or bank. Your details are encrypted.
			</Text>

			<View style={styles.field}>
				<Text style={styles.label}>UPI ID</Text>
				<TextInput
					style={styles.input}
					placeholder="yourname@upi"
					placeholderTextColor="#6B7280"
					value={data.upi}
					onChangeText={(v) => onChange({ upi: v })}
					autoCapitalize="none"
				/>
			</View>
		</View>
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
		<View>
			<Text style={styles.eyebrow}>Step 2 of 5 — Company</Text>
			<Text style={styles.stepTitle}>About your brand</Text>
			<Text style={styles.stepLead}>
				Help us understand who you are so we can match you with the right
				creators.
			</Text>

			<View style={styles.field}>
				<Text style={styles.label}>Company name</Text>
				<TextInput
					style={styles.input}
					placeholder="Acme Inc."
					placeholderTextColor="#6B7280"
					value={data.company}
					onChangeText={(v) => onChange({ company: v })}
				/>
			</View>
			<View style={styles.field}>
				<Text style={styles.label}>Website</Text>
				<TextInput
					style={styles.input}
					placeholder="https://yoursite.com"
					placeholderTextColor="#6B7280"
					value={data.website}
					onChangeText={(v) => onChange({ website: v })}
					autoCapitalize="none"
					keyboardType="url"
				/>
			</View>
			<View style={styles.field}>
				<Text style={styles.label}>Your role</Text>
				<TextInput
					style={styles.input}
					placeholder="Head of Marketing"
					placeholderTextColor="#6B7280"
					value={data.role}
					onChangeText={(v) => onChange({ role: v })}
				/>
			</View>
		</View>
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
		<View>
			<Text style={styles.eyebrow}>Step 3 of 5 — Industry</Text>
			<Text style={styles.stepTitle}>What industry are you in?</Text>
			<Text style={styles.stepLead}>
				This helps us recommend the best-fit creator verticals.
			</Text>

			<View style={styles.chipGrid}>
				{BRAND_INDUSTRIES.map((ind) => (
					<Chip
						key={ind}
						label={ind}
						selected={data.industry === ind}
						onPress={() => onChange({ industry: ind })}
					/>
				))}
			</View>
		</View>
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
		<View>
			<Text style={styles.eyebrow}>Step 4 of 5 — Goals</Text>
			<Text style={styles.stepTitle}>What's your primary goal?</Text>
			<Text style={styles.stepLead}>
				We'll tailor campaign types and creator recommendations around this.
			</Text>

			<View style={styles.tierRow}>
				{GOALS.map(({ id, label, desc }) => (
					<OptionCard
						key={id}
						selected={data.goal === id}
						onPress={() => onChange({ goal: id })}
					>
						<Text style={styles.optionTitle}>{label}</Text>
						<Text style={styles.optionDesc}>{desc}</Text>
					</OptionCard>
				))}
			</View>
		</View>
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
		<View>
			<Text style={styles.eyebrow}>Step 5 of 5 — Budget</Text>
			<Text style={styles.stepTitle}>Monthly influencer budget</Text>
			<Text style={styles.stepLead}>
				Choose your typical monthly spend. You can adjust per campaign.
			</Text>

			<View style={styles.budgetGrid}>
				{BUDGETS.map(({ id, label, desc }) => (
					<OptionCard
						key={id}
						selected={data.budget === id}
						onPress={() => onChange({ budget: id })}
					>
						<Text style={styles.optionTitle}>{label}</Text>
						<Text style={styles.optionDesc}>{desc}</Text>
					</OptionCard>
				))}
			</View>
		</View>
	);
}

// ---------------------------------------------------------------------------
// Success
// ---------------------------------------------------------------------------

function SuccessScreen({
	role,
	creatorData,
	brandData,
}: {
	role: "creator" | "brand";
	creatorData: CreatorData;
	brandData: BrandData;
}) {
	const isCreator = role === "creator";
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
		<View style={styles.successWrap}>
			<SuccessIcon />
			<Text style={[styles.stepTitle, { marginTop: 16 }]}>You're in.</Text>
			<Text style={[styles.stepLead, { marginBottom: 24 }]}>
				{isCreator
					? "Your creator profile is live. Start applying to campaigns."
					: "Your brand account is ready. Start finding creators."}
			</Text>
			<View style={styles.summaryCard}>
				{rows.map(({ label, value }) => (
					<View key={label} style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>{label}</Text>
						<Text style={styles.summaryValue}>{value}</Text>
					</View>
				))}
			</View>
			<Pressable
				style={({ pressed }) => [
					styles.primaryBtn,
					{ width: "100%" },
					pressed && { opacity: 0.85 },
				]}
				onPress={() => router.replace("/(tabs)")}
			>
				<Text style={styles.primaryBtnText}>
					{isCreator ? "Browse campaigns" : "Find creators"}
				</Text>
			</Pressable>
		</View>
	);
}

// ---------------------------------------------------------------------------
// Main Onboarding Screen
// ---------------------------------------------------------------------------

export default function OnboardingScreen() {
	const params = useLocalSearchParams<{ role?: string }>();
	const initialRole =
		params.role === "brand"
			? "brand"
			: params.role === "creator"
				? "creator"
				: null;

	const { user, signOut } = useAuth();
	const onboardCreator = useMutation(api.creators.onboard);
	const onboardBrand = useMutation(api.brands.onboard);

	const [step, setStep] = useState(0); // 0 = role select, 1-4 = form steps, 5 = success
	const [role, setRole] = useState<"creator" | "brand" | null>(initialRole);
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

	const TOTAL_STEPS = 5; // role(0) + 4 form steps

	function canContinue(): boolean {
		if (saving) return false;
		if (step === 0) return role !== null;

		if (role === "creator") {
			if (step === 1)
				return (
					!!creatorData.name.trim() &&
					!!creatorData.handle.trim() &&
					!!creatorData.tier
				);
			if (step === 2) return creatorData.niches.length > 0;
			if (step === 3) return true;
			if (step === 4) return !!creatorData.upi.trim();
		} else {
			if (step === 1)
				return (
					!!brandData.company.trim() &&
					!!brandData.website.trim() &&
					!!brandData.role.trim()
				);
			if (step === 2) return !!brandData.industry;
			if (step === 3) return !!brandData.goal;
			if (step === 4) return !!brandData.budget;
		}
		return true;
	}

	async function handleNext() {
		if (step < TOTAL_STEPS - 1) {
			setStep((s) => s + 1);
			return;
		}

		// Final step — save to Convex
		if (!user || !role) {
			setStep(TOTAL_STEPS);
			return;
		}

		setSaving(true);
		try {
			if (role === "creator") {
				await onboardCreator({
					userId: user.id,
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
					userId: user.id,
					company: brandData.company,
					website: brandData.website,
					role: brandData.role,
					industry: brandData.industry,
					goal: brandData.goal,
					budget: brandData.budget,
				});
			}
			setStep(TOTAL_STEPS);
		} catch (err) {
			console.error("Failed to save onboarding data:", err);
			setStep(TOTAL_STEPS);
		} finally {
			setSaving(false);
		}
	}

	function handleBack() {
		if (step > 0) setStep((s) => s - 1);
	}

	async function handleLogout() {
		await signOut();
		router.replace("/login");
	}

	const progress = step >= TOTAL_STEPS ? 100 : (step / TOTAL_STEPS) * 100;
	const isSuccess = step >= TOTAL_STEPS;

	function renderStep() {
		if (isSuccess && role) {
			return (
				<SuccessScreen
					role={role}
					creatorData={creatorData}
					brandData={brandData}
				/>
			);
		}

		if (step === 0) {
			return <RoleSelectStep role={role} onSelect={setRole} />;
		}

		if (role === "creator") {
			const onChange = (p: Partial<CreatorData>) =>
				setCreatorData((d) => ({ ...d, ...p }));
			if (step === 1)
				return <CreatorStep1 data={creatorData} onChange={onChange} />;
			if (step === 2)
				return <CreatorStep2 data={creatorData} onChange={onChange} />;
			if (step === 3)
				return <CreatorStep3 data={creatorData} onChange={onChange} />;
			if (step === 4)
				return <CreatorStep4 data={creatorData} onChange={onChange} />;
		} else if (role === "brand") {
			const onChange = (p: Partial<BrandData>) =>
				setBrandData((d) => ({ ...d, ...p }));
			if (step === 1)
				return <BrandStep1 data={brandData} onChange={onChange} />;
			if (step === 2)
				return <BrandStep2 data={brandData} onChange={onChange} />;
			if (step === 3)
				return <BrandStep3 data={brandData} onChange={onChange} />;
			if (step === 4)
				return <BrandStep4 data={brandData} onChange={onChange} />;
		}

		return null;
	}

	return (
		<SafeAreaView style={styles.container}>
			{/* Top nav */}
			<View style={styles.nav}>
				{step > 0 && !isSuccess ? (
					<Pressable onPress={handleBack} style={styles.backBtn}>
						<BackArrow />
					</Pressable>
				) : (
					<View style={{ width: 40 }} />
				)}

				{!isSuccess && (
					<Text style={styles.stepCount}>
						{step + 1} / {TOTAL_STEPS}
					</Text>
				)}

				{!isSuccess ? (
					<Pressable onPress={handleLogout} style={styles.logoutBtn}>
						<LogOutIcon />
					</Pressable>
				) : (
					<View style={{ width: 40 }} />
				)}
			</View>

			{/* Progress bar */}
			<View style={styles.progressBar}>
				<View style={[styles.progressFill, { width: `${progress}%` }]} />
			</View>

			{/* Content */}
			<ScrollView
				style={styles.body}
				contentContainerStyle={styles.bodyContent}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				{renderStep()}
			</ScrollView>

			{/* Bottom nav */}
			{!isSuccess && (
				<View style={styles.bottomNav}>
					<Pressable
						style={({ pressed }) => [
							styles.primaryBtn,
							!canContinue() && styles.btnDisabled,
							pressed && canContinue() && { opacity: 0.85 },
						]}
						onPress={handleNext}
						disabled={!canContinue()}
					>
						{saving ? (
							<ActivityIndicator color="#0a0a0c" size="small" />
						) : (
							<Text style={styles.primaryBtnText}>
								{step === TOTAL_STEPS - 1 ? "Finish" : "Continue"}
							</Text>
						)}
					</Pressable>
				</View>
			)}
		</SafeAreaView>
	);
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#0a0a0c" },
	nav: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	backBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#1A1A1E",
		alignItems: "center",
		justifyContent: "center",
	},
	stepCount: { fontFamily: "Inter-SemiBold", fontSize: 14, color: "#9CA3AF" },
	logoutBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#1A1A1E",
		alignItems: "center",
		justifyContent: "center",
	},
	progressBar: {
		height: 3,
		backgroundColor: "#1A1A1E",
		marginHorizontal: 20,
		borderRadius: 2,
	},
	progressFill: { height: 3, backgroundColor: "#d9f99d", borderRadius: 2 },
	body: { flex: 1 },
	bodyContent: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 40 },
	eyebrow: {
		fontFamily: "Inter-SemiBold",
		fontSize: 12,
		color: "#d9f99d",
		textTransform: "uppercase",
		letterSpacing: 1,
		marginBottom: 12,
	},
	stepTitle: {
		fontFamily: "StackSansHeadline-Medium",
		fontSize: 26,
		color: "#F5E8E8",
		marginBottom: 8,
	},
	stepLead: {
		fontFamily: "Inter-Regular",
		fontSize: 15,
		color: "#9CA3AF",
		lineHeight: 22,
		marginBottom: 28,
	},
	field: { marginBottom: 16 },
	label: {
		fontFamily: "Inter-SemiBold",
		fontSize: 13,
		color: "#D1D5DB",
		marginBottom: 8,
	},
	input: {
		backgroundColor: "#1A1A1E",
		borderWidth: 1,
		borderColor: "#2A2A2E",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 15,
		fontFamily: "Inter-Regular",
		color: "#FFFFFF",
	},
	tierRow: { gap: 10 },
	tierGrid: {
		flexDirection: "row",
		gap: 10,
	},
	tierCard: {
		flex: 1,
		backgroundColor: "#1A1A1E",
		borderWidth: 1.5,
		borderColor: "#2A2A2E",
		borderRadius: 14,
		paddingVertical: 20,
		paddingHorizontal: 14,
		position: "relative",
		alignItems: "center",
		justifyContent: "center",
	},
	tierCardActive: {
		borderColor: "#d9f99d",
		backgroundColor: "rgba(217,249,157,0.05)",
	},
	tierLabel: {
		fontFamily: "Inter-SemiBold",
		fontSize: 15,
		color: "#FFFFFF",
		textAlign: "center",
		marginBottom: 2,
	},
	tierRange: {
		fontFamily: "Inter-Regular",
		fontSize: 12,
		color: "#9CA3AF",
		textAlign: "center",
	},
	optionCard: {
		backgroundColor: "#1A1A1E",
		borderWidth: 1.5,
		borderColor: "#2A2A2E",
		borderRadius: 14,
		padding: 16,
		position: "relative",
	},
	optionCardActive: {
		borderColor: "#d9f99d",
		backgroundColor: "rgba(217,249,157,0.05)",
	},
	optionCheck: { position: "absolute", top: 12, right: 12 },
	optionTitle: {
		fontFamily: "Inter-SemiBold",
		fontSize: 15,
		color: "#FFFFFF",
		marginBottom: 2,
	},
	optionDesc: { fontFamily: "Inter-Regular", fontSize: 13, color: "#9CA3AF" },
	chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
	chip: {
		backgroundColor: "#1A1A1E",
		borderWidth: 1,
		borderColor: "#2A2A2E",
		borderRadius: 20,
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	chipActive: {
		borderColor: "#d9f99d",
		backgroundColor: "rgba(217,249,157,0.1)",
	},
	chipText: { fontFamily: "Inter-Regular", fontSize: 14, color: "#9CA3AF" },
	chipTextActive: { color: "#d9f99d" },
	counter: {
		fontFamily: "Inter-Regular",
		fontSize: 12,
		color: "#6B7280",
		marginTop: 12,
	},
	platformList: { gap: 12 },
	platformRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#1A1A1E",
		borderRadius: 14,
		padding: 16,
	},
	platformLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
	platformIcon: {
		width: 40,
		height: 40,
		borderRadius: 10,
		backgroundColor: "#2A2A2E",
		alignItems: "center",
		justifyContent: "center",
	},
	platformIconText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: "#FFFFFF",
	},
	platformName: {
		fontFamily: "Inter-SemiBold",
		fontSize: 15,
		color: "#FFFFFF",
	},
	platformHandle: {
		fontFamily: "Inter-Regular",
		fontSize: 13,
		color: "#6B7280",
	},
	connectBtn: {
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#2A2A2E",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	connectedBtn: {
		borderColor: "#d9f99d",
		backgroundColor: "rgba(217,249,157,0.1)",
	},
	connectBtnText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 13,
		color: "#6B7280",
	},
	connectedBtnText: { color: "#d9f99d" },
	budgetGrid: { gap: 10 },
	bottomNav: { paddingHorizontal: 24, paddingBottom: 16, paddingTop: 12 },
	primaryBtn: {
		backgroundColor: "#d9f99d",
		borderRadius: 14,
		paddingVertical: 16,
		alignItems: "center",
	},
	primaryBtnText: {
		color: "#0a0a0c",
		fontSize: 16,
		fontFamily: "Inter-SemiBold",
	},
	btnDisabled: { opacity: 0.4 },
	successWrap: { alignItems: "center", paddingTop: 80 },
	summaryCard: {
		backgroundColor: "#1A1A1E",
		borderRadius: 14,
		padding: 20,
		width: "100%",
		marginBottom: 28,
		gap: 14,
	},
	summaryRow: { flexDirection: "row", justifyContent: "space-between" },
	summaryLabel: { fontFamily: "Inter-Regular", fontSize: 14, color: "#6B7280" },
	summaryValue: {
		fontFamily: "Inter-SemiBold",
		fontSize: 14,
		color: "#FFFFFF",
		textAlign: "right",
		flex: 1,
		marginLeft: 16,
	},
	// Role selection styles
	roleCards: { gap: 14 },
	roleCard: {
		backgroundColor: "#1A1A1E",
		borderRadius: 18,
		borderWidth: 1.5,
		borderColor: "#2A2A2E",
		padding: 20,
	},
	roleCardActive: {
		borderColor: "#d9f99d",
		backgroundColor: "rgba(217,249,157,0.04)",
	},
	roleCardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	roleIconWrap: {
		width: 52,
		height: 52,
		borderRadius: 14,
		backgroundColor: "#2A2A2E",
		alignItems: "center",
		justifyContent: "center",
	},
	roleIconWrapActive: { backgroundColor: "rgba(217,249,157,0.12)" },
	roleCheckBadge: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "rgba(217,249,157,0.15)",
		alignItems: "center",
		justifyContent: "center",
	},
	roleTitle: {
		fontFamily: "Inter-SemiBold",
		fontSize: 18,
		color: "#f5f5f4",
		marginBottom: 4,
	},
	roleDesc: {
		fontFamily: "Inter-Regular",
		fontSize: 14,
		color: "#9CA3AF",
		marginBottom: 14,
	},
	roleFeatures: { gap: 8 },
	roleFeatureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
	roleFeatureDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "#3f3f46",
	},
	roleFeatureDotActive: { backgroundColor: "#d9f99d" },
	roleFeatureText: {
		fontFamily: "Inter-Regular",
		fontSize: 13,
		color: "#D1D5DB",
	},
});
