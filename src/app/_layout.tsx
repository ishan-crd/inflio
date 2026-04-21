import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#000000" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="campaign/[id]" />
      </Stack>
    </GestureHandlerRootView>
  );
}
