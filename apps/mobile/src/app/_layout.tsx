import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AnimatedSplash } from "~/components/animated-splash";
import { AuthProvider } from "~/providers/auth";
import { ConvexClientProvider } from "~/providers/convex";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		"StackSans-Regular": require("../../assets/fonts/StackSans_400Regular.ttf"),
		"StackSans-SemiBold": require("../../assets/fonts/StackSans_600SemiBold.ttf"),
		"StackSans-Bold": require("../../assets/fonts/StackSans_700Bold.ttf"),
		"Inter-Regular": require("../../assets/fonts/Inter_400Regular.ttf"),
		"Inter-SemiBold": require("../../assets/fonts/Inter_600SemiBold.ttf"),
		"StackSansHeadline-Medium": require("../../assets/fonts/StackSansHeadline-Medium.ttf"),
	});

	const [showSplash, setShowSplash] = useState(true);

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	const handleSplashFinish = useCallback(() => {
		setShowSplash(false);
	}, []);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ConvexClientProvider>
				<AuthProvider>
					<BottomSheetModalProvider>
						<StatusBar style="light" />
						<Stack
							screenOptions={{
								headerShown: false,
								contentStyle: { backgroundColor: "#0a0a0c" },
								animation: "fade",
							}}
						>
							<Stack.Screen name="index" />
							<Stack.Screen name="login" />
							<Stack.Screen name="verify-otp" />
							<Stack.Screen name="onboarding" />
							<Stack.Screen name="(tabs)" />
							<Stack.Screen name="campaign/[id]" />
							<Stack.Screen name="settings" />
						</Stack>
						{showSplash && <AnimatedSplash onFinish={handleSplashFinish} />}
					</BottomSheetModalProvider>
				</AuthProvider>
			</ConvexClientProvider>
		</GestureHandlerRootView>
	);
}
