import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

function LogoDot({ size = 36 }: { size?: number }) {
	const r = size * 0.32;
	const inner = size * 0.18;
	return (
		<View
			style={{
				width: size,
				height: size,
				borderRadius: r,
				overflow: "hidden",
			}}
		>
			<Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
				<Defs>
					<LinearGradient id="dotGrad" x1="0" y1="0" x2="1" y2="1">
						<Stop offset="0" stopColor="#bef264" />
						<Stop offset="0.8" stopColor="#65a30d" />
					</LinearGradient>
				</Defs>
				<Rect width={size} height={size} rx={r} fill="url(#dotGrad)" />
				<Rect
					x={size * 0.18}
					y={size * 0.18}
					width={size * 0.64}
					height={size * 0.64}
					rx={inner}
					fill="rgba(0,0,0,0.4)"
				/>
			</Svg>
		</View>
	);
}

interface AnimatedSplashProps {
	onFinish: () => void;
}

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
	const opacity = useRef(new Animated.Value(0)).current;
	const scale = useRef(new Animated.Value(0.8)).current;
	const fadeOut = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(opacity, {
				toValue: 1,
				duration: 600,
				useNativeDriver: true,
			}),
			Animated.spring(scale, {
				toValue: 1,
				tension: 60,
				friction: 8,
				useNativeDriver: true,
			}),
		]).start(() => {
			setTimeout(() => {
				Animated.timing(fadeOut, {
					toValue: 0,
					duration: 400,
					useNativeDriver: true,
				}).start(onFinish);
			}, 800);
		});
	}, [opacity, scale, fadeOut, onFinish]);

	return (
		<Animated.View style={[styles.container, { opacity: fadeOut }]}>
			<Animated.View
				style={[
					styles.content,
					{
						opacity,
						transform: [{ scale }],
					},
				]}
			>
				<LogoDot size={40} />
				<Text style={styles.title}>inflio</Text>
			</Animated.View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "#0a0a0c",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 100,
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	title: {
		fontFamily: "StackSans-SemiBold",
		fontSize: 32,
		color: "#f5f5f4",
	},
});
