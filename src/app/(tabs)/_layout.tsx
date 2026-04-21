import React, { useEffect, useRef } from "react";
import {
  View,
  Pressable,
  Animated,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  IconBasket2,
  IconVideoClip,
  IconWallet4,
  IconCryptopunk,
} from "@central-icons-react-native/round-outlined-radius-3-stroke-1.5";
import {
  IconBasket2 as IconBasket2Filled,
  IconVideoClip as IconVideoClipFilled,
  IconWallet4 as IconWallet4Filled,
  IconCryptopunk as IconCryptopunkFilled,
} from "@central-icons-react-native/round-filled-radius-3-stroke-1.5";

const TAB_COUNT = 5;
const INDICATOR_SIZE = 44;
const INDICATOR_RADIUS = 12;
const INACTIVE_COLOR = "#6B7280";
const ACTIVE_COLOR = "#000000";
const CENTER_ACTIVE_COLOR = "#EC4899";

const TAB_KEYS = ["campaigns", "videos", "index", "wallet", "profile"] as const;

type TabKey = (typeof TAB_KEYS)[number];

const TAB_ICONS: Record<
  TabKey,
  {
    outlined: React.ComponentType<{ size: number; color: string }>;
    filled: React.ComponentType<{ size: number; color: string }>;
  } | null
> = {
  campaigns: { outlined: IconBasket2, filled: IconBasket2Filled },
  videos: { outlined: IconVideoClip, filled: IconVideoClipFilled },
  index: null,
  wallet: { outlined: IconWallet4, filled: IconWallet4Filled },
  profile: { outlined: IconCryptopunk, filled: IconCryptopunkFilled },
} as const;

function CustomTabBar({
  state,
  descriptors,
  navigation,
}: {
  state: any;
  descriptors: any;
  navigation: any;
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tabWidth = width / TAB_COUNT;

  const translateX = useRef(
    new Animated.Value(state.index * tabWidth + (tabWidth - INDICATOR_SIZE) / 2)
  ).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth + (tabWidth - INDICATOR_SIZE) / 2,
      tension: 68,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth]);

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom }]}>
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.topBorder} />
      <View style={styles.tabBarContent}>
        <Animated.View
          style={[
            styles.indicator,
            { transform: [{ translateX }] },
          ]}
        />
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const tabKey = TAB_KEYS[index];
          const iconSet = TAB_ICONS[tabKey];

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
                    { color: isFocused ? CENTER_ACTIVE_COLOR : INACTIVE_COLOR },
                  ]}
                >
                  f
                </Text>
              ) : iconSet ? (
                isFocused ? (
                  <iconSet.filled size={24} color={ACTIVE_COLOR} />
                ) : (
                  <iconSet.outlined size={24} color={INACTIVE_COLOR} />
                )
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
    backgroundColor: "#FFFFFF",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
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
