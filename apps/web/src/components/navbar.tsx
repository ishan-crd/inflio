"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InflioLogo } from "./inflio-logo";

const NAV_LINKS = [
	{ href: "/marketplace", label: "Marketplace" },
	{ href: "/videos", label: "Videos" },
	{ href: "/wallet", label: "Wallet" },
] as const;

export function Navbar() {
	const pathname = usePathname();

	return (
		<nav className="sticky top-0 z-50 border-b border-border-secondary bg-bg/80 backdrop-blur-xl">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
				<div className="flex items-center gap-10">
					<Link href="/marketplace">
						<InflioLogo className="h-5 w-auto" />
					</Link>
					<div className="hidden items-center gap-1 md:flex">
						{NAV_LINKS.map((link) => {
							const isActive = pathname === link.href;
							return (
								<Link
									key={link.href}
									href={link.href}
									className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
										isActive
											? "bg-bg-card text-text"
											: "text-text-tertiary hover:text-text-secondary"
									}`}
								>
									{link.label}
								</Link>
							);
						})}
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button
						type="button"
						className="relative rounded-xl bg-bg-card p-2.5 text-text-secondary transition-colors hover:text-text border border-border"
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" />
							<path d="M13.73 21a2 2 0 0 1-3.46 0" />
						</svg>
						<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
					</button>
					<div className="h-9 w-9 rounded-full bg-bg-card border border-border" />
				</div>
			</div>
		</nav>
	);
}
