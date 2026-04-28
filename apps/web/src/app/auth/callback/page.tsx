"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

function CallbackInner() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const role = searchParams.get("role") ?? "creator";

	const { data: session, isPending: authPending } = useSession();
	const userId = session?.user?.id;

	const creatorProfile = useQuery(
		api.creators.getByUserId,
		userId ? { userId } : "skip",
	);
	const brandProfile = useQuery(
		api.brands.getByUserId,
		userId ? { userId } : "skip",
	);

	const [redirected, setRedirected] = useState(false);

	useEffect(() => {
		if (authPending || redirected) return;

		// Not logged in — send to login
		if (!userId) {
			router.replace("/login");
			return;
		}

		// Still loading profiles from Convex
		if (creatorProfile === undefined || brandProfile === undefined) return;

		// Has an existing profile — go to dashboard
		if (creatorProfile || brandProfile) {
			setRedirected(true);
			router.replace(creatorProfile ? "/marketplace" : "/creators");
			return;
		}

		// No profile — go to onboarding
		setRedirected(true);
		router.replace(`/onboarding?role=${role}`);
	}, [authPending, userId, creatorProfile, brandProfile, role, router, redirected]);

	return (
		<div style={{
			minHeight: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "var(--color-ink-2)",
			fontSize: 14,
			gap: 12,
		}}>
			<div style={{
				width: 20,
				height: 20,
				border: "2px solid var(--color-line)",
				borderTopColor: "var(--color-accent-strong)",
				borderRadius: "50%",
				animation: "spin 0.8s linear infinite",
			}} />
			Setting up your account...
		</div>
	);
}

export default function AuthCallbackPage() {
	return (
		<Suspense>
			<CallbackInner />
		</Suspense>
	);
}
