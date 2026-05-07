import { Image } from "expo-image";

const ASPECT_RATIO = 592 / 265;

export function InflioLogo({ height = 28 }: { height?: number }) {
	const width = height * ASPECT_RATIO;

	return (
		<Image
			source={require("../../assets/logo.svg")}
			style={{ width, height }}
			contentFit="contain"
		/>
	);
}
