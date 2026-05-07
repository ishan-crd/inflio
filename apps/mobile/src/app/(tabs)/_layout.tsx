import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import type React from "react";
import { useEffect, useRef } from "react";
import {
	Animated,
	Pressable,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";

const TAB_COUNT = 5;
const INDICATOR_SIZE = 44;
const INDICATOR_RADIUS = 12;
const INACTIVE_COLOR = "rgba(245,245,244,0.4)";
const ACTIVE_COLOR = "#0a0a0c";

const TAB_KEYS = ["campaigns", "videos", "index", "wallet", "profile"] as const;
type TabKey = (typeof TAB_KEYS)[number];

function CampaignsIcon({ color, size }: { color: string; size: number }) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<Path
				d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
				stroke={color}
				strokeWidth={1.8}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function VideosIcon({ color, size }: { color: string; size: number }) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<Rect
				x={2}
				y={4}
				width={20}
				height={16}
				rx={3}
				stroke={color}
				strokeWidth={1.8}
			/>
			<Path
				d="M10 9l5 3-5 3V9z"
				stroke={color}
				strokeWidth={1.8}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}

function WalletIcon({ color, size }: { color: string; size: number }) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<Path
				d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5z"
				stroke={color}
				strokeWidth={1.8}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path d="M16 12h5v4h-5a2 2 0 010-4z" stroke={color} strokeWidth={1.8} />
		</Svg>
	);
}

function ProfileIcon({ color, size }: { color: string; size: number }) {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.8} />
			<Path
				d="M5 20c0-3 3.1-5 7-5s7 2 7 5"
				stroke={color}
				strokeWidth={1.8}
				strokeLinecap="round"
			/>
		</Svg>
	);
}

const TAB_ICONS: Record<
	TabKey,
	React.ComponentType<{ size: number; color: string }> | null
> = {
	campaigns: CampaignsIcon,
	videos: VideosIcon,
	index: null,
	wallet: WalletIcon,
	profile: ProfileIcon,
};

function CustomTabBar({
	state,
	descriptors,
	navigation,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: expo-router tab bar props lack exported types
	state: any;
	// biome-ignore lint/suspicious/noExplicitAny: expo-router tab bar props lack exported types
	descriptors: any;
	// biome-ignore lint/suspicious/noExplicitAny: expo-router tab bar props lack exported types
	navigation: any;
}) {
	const insets = useSafeAreaInsets();
	const { width } = useWindowDimensions();
	const tabWidth = width / TAB_COUNT;

	const translateX = useRef(
		new Animated.Value(
			state.index * tabWidth + (tabWidth - INDICATOR_SIZE) / 2,
		),
	).current;

	useEffect(() => {
		Animated.spring(translateX, {
			toValue: state.index * tabWidth + (tabWidth - INDICATOR_SIZE) / 2,
			tension: 68,
			friction: 12,
			useNativeDriver: true,
		}).start();
	}, [state.index, tabWidth, translateX]);

	return (
		<View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom }]}>
			<BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
			<View style={styles.topBorder} />
			<View style={styles.tabBarContent}>
				<Animated.View
					style={[styles.indicator, { transform: [{ translateX }] }]}
				/>
				{/* biome-ignore lint/suspicious/noExplicitAny: expo-router route type */}
				{state.routes.map((route: any, index: number) => {
					const { options } = descriptors[route.key];
					const isFocused = state.index === index;
					const tabKey = TAB_KEYS[index];
					const IconComponent = TAB_ICONS[tabKey];

					const onPress = () => {
						const event = navigation.emit({
							type: "tabPress",
							target: route.key,
							canPreventDefault: true,
						});
						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name, route.params);
						}
					};

					const onLongPress = () => {
						navigation.emit({ type: "tabLongPress", target: route.key });
					};

					const isCenter = index === 2;

					return (
						<Pressable
							key={route.key}
							accessibilityRole="button"
							accessibilityState={isFocused ? { selected: true } : {}}
							accessibilityLabel={options.tabBarAccessibilityLabel}
							onPress={onPress}
							onLongPress={onLongPress}
							style={styles.tab}
						>
							{isCenter ? (
								<Text
									style={[
										styles.centerLetter,
										{ color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR },
									]}
								>
									f
								</Text>
							) : IconComponent ? (
								<IconComponent
									size={24}
									color={isFocused ? ACTIVE_COLOR : INACTIVE_COLOR}
								/>
							) : null}
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}

export default function TabsLayout() {
	return (
		<Tabs
			tabBar={(props) => <CustomTabBar {...props} />}
			screenOptions={{ headerShown: false }}
		>
			<Tabs.Screen name="campaigns" />
			<Tabs.Screen name="videos" />
			<Tabs.Screen name="index" />
			<Tabs.Screen name="wallet" />
			<Tabs.Screen name="profile" />
		</Tabs>
	);
}

const styles = StyleSheet.create({
	tabBarWrapper: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "transparent",
		overflow: "hidden",
	},
	topBorder: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: "rgba(255,255,255,0.08)",
	},
	tabBarContent: {
		flexDirection: "row",
		height: 56,
		alignItems: "center",
	},
	indicator: {
		position: "absolute",
		width: INDICATOR_SIZE,
		height: INDICATOR_SIZE,
		borderRadius: INDICATOR_RADIUS,
		backgroundColor: "#d9f99d",
		shadowColor: "#bef264",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 8,
	},
	tab: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		height: 56,
	},
	centerLetter: {
		fontFamily: "StackSans-Bold",
		fontSize: 24,
		lineHeight: 28,
	},
});
