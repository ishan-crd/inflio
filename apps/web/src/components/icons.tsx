import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export function SearchIcon(p: P) {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			{...p}
		>
			<circle cx="7" cy="7" r="5" />
			<path d="M11 11l3 3" />
		</svg>
	);
}

export function ArrowIcon(p: P) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M3 7h8" />
			<path d="M8 4l3 3-3 3" />
		</svg>
	);
}

export function BackIcon(p: P) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M11 7H3" />
			<path d="M6 4L3 7l3 3" />
		</svg>
	);
}

export function ChevIcon(p: P) {
	return (
		<svg
			width="11"
			height="11"
			viewBox="0 0 12 12"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M3 4.5l3 3 3-3" />
		</svg>
	);
}

export function CheckIcon(p: P) {
	return (
		<svg
			width="13"
			height="13"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M3 7.5l2.8 2.8L11 4.5" />
		</svg>
	);
}

export function CheckBigIcon(p: P) {
	return (
		<svg
			width="28"
			height="28"
			viewBox="0 0 28 28"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M6 14l5 5 11-12" />
		</svg>
	);
}

export function VerifiedIcon(p: P) {
	return (
		<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" {...p}>
			<path d="M6 0l1.4 1.2 1.8-.2.4 1.8 1.6.9-.7 1.7.7 1.7-1.6.9-.4 1.8-1.8-.2L6 9l-1.4-1.2-1.8.2L2.4 6.2.8 5.3 1.5 3.6.8 1.9l1.6-.9.4-1.8 1.8.2L6 0zM4.4 6.4l3.5-3.5-.7-.7L4.4 5l-1.1-1.1-.7.7 1.8 1.8z" />
		</svg>
	);
}

export function TrendIcon(p: P) {
	return (
		<svg
			width="9"
			height="9"
			viewBox="0 0 12 12"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M2 8l3-3 2 2 4-5" />
			<path d="M8 2h3v3" />
		</svg>
	);
}

export function SortIcon(p: P) {
	return (
		<svg
			width="13"
			height="13"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			{...p}
		>
			<path d="M2 4h10" />
			<path d="M3.5 7h7" />
			<path d="M5 10h4" />
		</svg>
	);
}

export function SlidersIcon(p: P) {
	return (
		<svg
			width="13"
			height="13"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			{...p}
		>
			<path d="M2 4h6" />
			<circle cx="10" cy="4" r="1.5" />
			<path d="M12 4h0" />
			<path d="M2 10h2" />
			<circle cx="6" cy="10" r="1.5" />
			<path d="M8 10h4" />
		</svg>
	);
}

export function BellIcon(p: P) {
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
			<path d="M8 2a4 4 0 014 4v3l1 2H3l1-2V6a4 4 0 014-4z" />
			<path d="M6.5 13a1.5 1.5 0 003 0" />
		</svg>
	);
}

export function PlusIcon(p: P) {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			{...p}
		>
			<path d="M6 2v8M2 6h8" />
		</svg>
	);
}

export function IGIcon(p: P) {
	return (
		<svg
			width="11"
			height="11"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.4"
			{...p}
		>
			<rect x="2" y="2" width="10" height="10" rx="3" />
			<circle cx="7" cy="7" r="2.4" />
			<circle cx="10.2" cy="3.8" r="0.6" fill="currentColor" />
		</svg>
	);
}

export function YTIcon(p: P) {
	return (
		<svg width="13" height="13" viewBox="0 0 16 12" fill="currentColor" {...p}>
			<path d="M15.5 3a2 2 0 00-1.4-1.4C12.9 1.3 8 1.3 8 1.3s-4.9 0-6.1.3A2 2 0 00.5 3C.2 4.2.2 6 .2 6s0 1.8.3 3a2 2 0 001.4 1.4c1.2.3 6.1.3 6.1.3s4.9 0 6.1-.3A2 2 0 0015.5 9c.3-1.2.3-3 .3-3s0-1.8-.3-3z" />
			<path d="M6.4 8.3V3.7L10.4 6l-4 2.3z" fill="#0a0a0c" />
		</svg>
	);
}

export function TTIcon(p: P) {
	return (
		<svg width="11" height="11" viewBox="0 0 14 14" fill="currentColor" {...p}>
			<path d="M9.5 1.5v6.7a2.6 2.6 0 11-2.6-2.6v1.7a.9.9 0 100 1.8.9.9 0 00.9-.9V1.5h.9a2.4 2.4 0 002.4 2.4V5.6a4 4 0 01-1.6-.4z" />
		</svg>
	);
}

export function PinIcon(p: P) {
	return (
		<svg
			width="10"
			height="10"
			viewBox="0 0 12 12"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M6 1v0a3 3 0 013 3v2l1.5 1.5h-9L3 6V4a3 3 0 013-3z" />
			<path d="M6 7.5V11" />
		</svg>
	);
}

export function GridIcon(p: P) {
	return (
		<svg
			width="13"
			height="13"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			{...p}
		>
			<rect x="2" y="2" width="4" height="4" rx="1" />
			<rect x="8" y="2" width="4" height="4" rx="1" />
			<rect x="2" y="8" width="4" height="4" rx="1" />
			<rect x="8" y="8" width="4" height="4" rx="1" />
		</svg>
	);
}

export function RowsIcon(p: P) {
	return (
		<svg
			width="13"
			height="13"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			{...p}
		>
			<rect x="2" y="2.5" width="10" height="3" rx="1" />
			<rect x="2" y="8.5" width="10" height="3" rx="1" />
		</svg>
	);
}

export function CreatorIcon(p: P) {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<circle cx="8" cy="6" r="2.5" />
			<path d="M3 13c.5-2.5 2.5-4 5-4s4.5 1.5 5 4" />
		</svg>
	);
}

export function BrandIcon(p: P) {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<rect x="2.5" y="3" width="11" height="10" rx="1.5" />
			<path d="M5 6.5h6M5 9h4" />
		</svg>
	);
}

export function SparklesIcon(p: P) {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.4"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<path d="M10 2v3M10 15v3M2 10h3M15 10h3M5 5l2 2M13 13l2 2M5 15l2-2M13 7l2-2" />
		</svg>
	);
}

export function TargetIcon(p: P) {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.4"
			{...p}
		>
			<circle cx="10" cy="10" r="7" />
			<circle cx="10" cy="10" r="4" />
			<circle cx="10" cy="10" r="1.4" fill="currentColor" />
		</svg>
	);
}

export function WalletIcon(p: P) {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.4"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...p}
		>
			<rect x="2.5" y="5" width="15" height="11" rx="1.5" />
			<path d="M2.5 8h15" />
			<circle cx="14" cy="12" r="1" fill="currentColor" />
		</svg>
	);
}

export function GoogleG(p: P) {
	return (
		<svg width="16" height="16" viewBox="0 0 18 18" {...p}>
			<path
				d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.61z"
				fill="#4285F4"
			/>
			<path
				d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.95v2.33A9 9 0 0 0 9 18z"
				fill="#34A853"
			/>
			<path
				d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.04l3.02-2.33z"
				fill="#FBBC05"
			/>
			<path
				d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .95 4.96l3.02 2.33C4.68 5.16 6.66 3.58 9 3.58z"
				fill="#EA4335"
			/>
		</svg>
	);
}

export function PlatformIcon({ name, ...p }: { name: string } & P) {
	if (name === "Instagram") return <IGIcon {...p} />;
	if (name === "YouTube") return <YTIcon {...p} />;
	if (name === "TikTok") return <TTIcon {...p} />;
	return null;
}
