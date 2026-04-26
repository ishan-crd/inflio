"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InflioLogo } from "@/components/inflio-logo";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		router.push("/marketplace");
	};

	return (
		<div className="flex min-h-screen">
			{/* Left — branding panel */}
			<div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-bg-secondary lg:flex">
				{/* Gradient orbs */}
				<div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-[128px]" />
				<div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent-dark/15 blur-[128px]" />

				<div className="relative z-10 max-w-md px-12">
					<InflioLogo className="mb-10 h-8 w-auto" />
					<h1 className="text-4xl font-bold leading-tight tracking-tight text-text">
						Connect with top brands.
						<br />
						<span className="text-accent">Get paid</span> for your content.
					</h1>
					<p className="mt-5 text-lg leading-relaxed text-text-secondary">
						Join thousands of creators earning through UGC campaigns on Inflio.
					</p>

					{/* Social proof */}
					<div className="mt-10 flex items-center gap-4">
						<div className="flex -space-x-2">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="h-9 w-9 rounded-full border-2 border-bg-secondary bg-bg-card"
								/>
							))}
						</div>
						<p className="text-sm text-text-secondary">
							<span className="font-semibold text-text">2,400+</span> creators
							already earning
						</p>
					</div>
				</div>
			</div>

			{/* Right — login form */}
			<div className="flex flex-1 items-center justify-center px-6">
				<div className="w-full max-w-sm">
					<div className="mb-10 lg:hidden">
						<InflioLogo className="mx-auto mb-6 h-7 w-auto" />
					</div>

					<h2 className="text-2xl font-bold tracking-tight text-text">
						Welcome back
					</h2>
					<p className="mt-2 text-sm text-text-secondary">
						Log in to your creator account
					</p>

					<form onSubmit={handleSubmit} className="mt-8 space-y-4">
						<div>
							<label
								htmlFor="email"
								className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-tertiary"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								className="w-full rounded-xl border border-border bg-bg-card px-4 py-3 text-sm text-text placeholder-text-tertiary outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-tertiary"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								className="w-full rounded-xl border border-border bg-bg-card px-4 py-3 text-sm text-text placeholder-text-tertiary outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
							/>
						</div>

						<div className="flex items-center justify-between pt-1">
							<label className="flex items-center gap-2 text-sm text-text-secondary">
								<input
									type="checkbox"
									className="h-4 w-4 rounded border-border bg-bg-card accent-accent"
								/>
								Remember me
							</label>
							<button
								type="button"
								className="text-sm font-medium text-accent hover:text-accent-dark"
							>
								Forgot password?
							</button>
						</div>

						<button
							type="submit"
							className="mt-2 w-full rounded-xl bg-gradient-to-r from-accent to-accent-dark py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
						>
							Log in
						</button>
					</form>

					<div className="mt-8 text-center text-sm text-text-secondary">
						Don&apos;t have an account?{" "}
						<Link
							href="/login"
							className="font-semibold text-accent hover:text-accent-dark"
						>
							Sign up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
