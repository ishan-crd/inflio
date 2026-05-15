import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import { ConvexClientProvider } from "@/providers/convex-provider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
	variable: "--font-instrument-serif",
	subsets: ["latin"],
	weight: "400",
	style: ["normal", "italic"],
});

export const metadata: Metadata = {
	title: "Inflio — Performance pay for the creator economy",
	description:
		"The marketplace where brands post campaigns and creators get paid by the view.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			data-theme="dark"
			className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
			suppressHydrationWarning
		>
			<body>
				<ThemeProvider>
					<ConvexClientProvider>
						<div className="bg-glow" />
						<div className="bg-canvas" />
						<div style={{ position: "relative", zIndex: 1 }}>
							{children}
						</div>
					</ConvexClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
