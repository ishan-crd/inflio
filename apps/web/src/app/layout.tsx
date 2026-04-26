import type { Metadata } from "next";
import "./globals.css";

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
		<html lang="en" className="dark">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Inter:wght@400;450;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
