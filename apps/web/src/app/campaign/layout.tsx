import { Navbar } from "@/components/navbar";

export default function CampaignLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
}
