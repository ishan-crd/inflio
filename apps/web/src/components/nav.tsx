"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ArrowIcon, BellIcon } from "@/components/icons";

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

	if (loggedIn) {
		return <LoggedInNav pathname={pathname} name={session.user.name ?? ""} image={session.user.image} />;
	}

	return <PublicNav pathname={pathname} />;
}

function PublicNav({ pathname }: { pathname: string }) {
	return (
		<nav className="nav">
			<div className="shell nav-inner">
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
					style={{ flex: 1, justifyContent: "center", display: "flex" }}
				>
					<Link href="/marketplace" className={pathname === "/marketplace" ? "active" : ""}>
						Campaigns
					</Link>
					<Link href="/creators" className={pathname === "/creators" ? "active" : ""}>
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

function LoggedInNav({
	pathname,
	name,
	image,
}: {
	pathname: string;
	name: string;
	image?: string | null;
}) {
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
						<Link href="/marketplace" className={pathname === "/marketplace" ? "active" : ""}>
							Campaigns
						</Link>
						<Link href="/creators" className={pathname === "/creators" ? "active" : ""}>
							Creators
						</Link>
						<Link href="/campaigns" className={pathname === "/campaigns" ? "active" : ""}>
							My campaigns
						</Link>
						<Link href="/earnings" className={pathname === "/earnings" ? "active" : ""}>
							Earnings
						</Link>
					</div>

					<div className="nav-cta">
						<button className="btn btn-ghost" aria-label="Notifications">
							<BellIcon />
						</button>
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
					</div>
				</div>
			</div>
		</nav>
	);
}
