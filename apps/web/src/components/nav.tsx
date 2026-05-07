"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon, BellIcon } from "@/components/icons";
import { signOut, useSession } from "@/lib/auth-client";
import { api } from "../../convex/_generated/api";

function initials(s: string) {
	return s
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

export function Nav() {
	const { data: session } = useSession();
	const pathname = usePathname();
	const loggedIn = !!session?.user;
	const userId = session?.user?.id;

	const creatorProfile = useQuery(
		api.creators.getByUserId,
		userId ? { userId } : "skip",
	);
	const brandProfile = useQuery(
		api.brands.getByUserId,
		userId ? { userId } : "skip",
	);

	const role: "creator" | "brand" = brandProfile ? "brand" : "creator";

	if (loggedIn) {
		return (
			<LoggedInNav
				pathname={pathname}
				name={session.user.name ?? ""}
				image={session.user.image}
				role={role}
				brandName={brandProfile?.name}
			/>
		);
	}

	return <PublicNav pathname={pathname} />;
}

function PublicNav({ pathname }: { pathname: string }) {
	return (
		<nav className="nav">
			<div className="shell nav-inner" style={{ position: "relative" }}>
				<Link
					href="/"
					className="logo"
					style={{ textDecoration: "none", color: "inherit" }}
				>
					<div className="logo-dot" />
					Inflio
				</Link>

				<div
					className="nav-links"
					style={{
						position: "absolute",
						left: "50%",
						transform: "translateX(-50%)",
						display: "flex",
					}}
				>
					<Link
						href="/marketplace"
						className={pathname === "/marketplace" ? "active" : ""}
					>
						Campaigns
					</Link>
					<Link
						href="/creators"
						className={pathname === "/creators" ? "active" : ""}
					>
						Creators
					</Link>
				</div>

				<div className="nav-cta">
					<Link href="/login" className="btn btn-ghost">
						Sign in
					</Link>
					<Link href="/login?mode=signup" className="btn btn-primary">
						Get started <ArrowIcon />
					</Link>
				</div>
			</div>
		</nav>
	);
}

function ProfileDropdown({
	name,
	image,
}: {
	name: string;
	image?: string | null;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const router = useRouter();

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	return (
		<div ref={ref} style={{ position: "relative" }}>
			<button
				onClick={() => setOpen((o) => !o)}
				style={{
					background: "none",
					border: "none",
					padding: 0,
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
				}}
			>
				{image ? (
					<img
						src={image}
						alt={name}
						style={{
							width: 32,
							height: 32,
							borderRadius: "50%",
							objectFit: "cover",
						}}
					/>
				) : (
					<div className="avatar">{initials(name || "U")}</div>
				)}
			</button>

			{open && (
				<div
					style={{
						position: "absolute",
						top: "calc(100% + 8px)",
						right: 0,
						minWidth: 180,
						background: "rgba(22, 22, 26, 0.95)",
						border: "1px solid var(--color-line)",
						borderRadius: 12,
						padding: "6px",
						backdropFilter: "blur(20px)",
						WebkitBackdropFilter: "blur(20px)",
						boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
						zIndex: 100,
					}}
				>
					<button
						onClick={() => {
							setOpen(false);
							router.push("/profile");
						}}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							width: "100%",
							padding: "10px 14px",
							background: "none",
							border: "none",
							borderRadius: 8,
							color: "var(--color-ink-1)",
							fontSize: 13,
							cursor: "pointer",
							transition: "background 0.15s",
						}}
						onMouseEnter={(e) =>
							(e.currentTarget.style.background = "rgba(255,255,255,0.06)")
						}
						onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="8" cy="5.5" r="2.5" />
							<path d="M3 14c0-2.5 2.2-4 5-4s5 1.5 5 4" />
						</svg>
						View profile
					</button>
					<button
						onClick={() => {
							setOpen(false);
							signOut({
								fetchOptions: {
									onSuccess: () => router.push("/"),
								},
							});
						}}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							width: "100%",
							padding: "10px 14px",
							background: "none",
							border: "none",
							borderRadius: 8,
							color: "#fb7185",
							fontSize: 13,
							cursor: "pointer",
							transition: "background 0.15s",
						}}
						onMouseEnter={(e) =>
							(e.currentTarget.style.background = "rgba(251,113,133,0.08)")
						}
						onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M6 2H4a2 2 0 00-2 2v8a2 2 0 002 2h2M10.5 12L14 8l-3.5-4M14 8H6" />
						</svg>
						Log out
					</button>
				</div>
			)}
		</div>
	);
}

function LoggedInNav({
	pathname,
	name,
	image,
	role,
	brandName,
}: {
	pathname: string;
	name: string;
	image?: string | null;
	role: "creator" | "brand";
	brandName?: string;
}) {
	const links =
		role === "brand"
			? [
					{ href: "/marketplace", label: "Campaigns" },
					{ href: "/creators", label: "Creators" },
					{ href: "/dashboard", label: "Dashboard" },
				]
			: [
					{ href: "/marketplace", label: "Campaigns" },
					{ href: "/creators", label: "Creators" },
					{ href: "/applications?tab=submissions", label: "My Submissions" },
					{ href: "/dashboard", label: "Dashboard" },
				];

	return (
		<nav className="nav">
			<div className="shell">
				<div className="nav-inner">
					<Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
						<div className="logo">
							<div className="logo-dot" />
							inflio
						</div>
					</Link>

					<div className="nav-links">
						{links.map((l) => (
							<Link
								key={l.href}
								href={l.href}
								className={pathname === l.href.split("?")[0] ? "active" : ""}
							>
								{l.label}
							</Link>
						))}
					</div>

					<div className="nav-cta">
						{role === "brand" && (
							<Link
								href="/campaigns/create"
								className="btn btn-primary"
								style={{
									fontSize: 13,
									padding: "8px 16px",
									textDecoration: "none",
								}}
							>
								+ Create Campaign
							</Link>
						)}
						<button className="btn btn-ghost" aria-label="Notifications">
							<BellIcon />
						</button>
						<ProfileDropdown name={brandName || name} image={image} />
					</div>
				</div>
			</div>
		</nav>
	);
}
