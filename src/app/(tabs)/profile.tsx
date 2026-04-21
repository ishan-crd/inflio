import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Svg, { Path, Circle, Polygon } from "react-native-svg";

const TAB_OPTIONS = ["Submissions", "Accounts"] as const;
type TabOption = (typeof TAB_OPTIONS)[number];

const MOCK_SUBMISSIONS = [
  { id: "1", random: 10 },
  { id: "2", random: 11 },
  { id: "3", random: 12 },
  { id: "4", random: 13 },
];

function PlayButton() {
  return (
    <View style={styles.playButtonContainer}>
      <Svg width={36} height={36} viewBox="0 0 36 36">
        <Circle cx={18} cy={18} r={18} fill="rgba(0,0,0,0.5)" />
        <Polygon points="14,11 14,25 26,18" fill="white" />
      </Svg>
    </View>
  );
}

function EyeIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
        stroke="#6B7280"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx={12}
        cy={12}
        r={3}
        stroke="#6B7280"
        strokeWidth={2}
      />
    </Svg>
  );
}

function HeartIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="#6B7280"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

type SubmissionItem = { id: string; random: number };

function SubmissionCard({ item }: { item: SubmissionItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: `https://picsum.photos/200/300?random=${item.random}` }}
          style={styles.thumbnail}
          contentFit="cover"
        />
        <PlayButton />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.usernameRow}>
          <Text style={styles.username}>@ishanxib</Text>
          <Text style={styles.separator}> · </Text>
          <Text style={styles.timeAgo}>3d</Text>
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          EPICBET - Exclusive Football
        </Text>
        <View style={styles.statsRow}>
          <EyeIcon />
          <Text style={styles.statText}>122.0k</Text>
          <View style={{ width: 12 }} />
          <HeartIcon />
          <Text style={styles.statText}>12.0k</Text>
        </View>
      </View>
    </View>
  );
}

function SubmissionsGrid({ bottomPadding }: { bottomPadding: number }) {
  const rows: SubmissionItem[][] = [];
  for (let i = 0; i < MOCK_SUBMISSIONS.length; i += 2) {
    rows.push(MOCK_SUBMISSIONS.slice(i, i + 2));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.gridRow}>
          {row.map((item) => (
            <SubmissionCard key={item.id} item={item} />
          ))}
        </View>
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabOption>("Submissions");
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.handle}>@inflio</Text>
            <Text style={styles.role}>UGC Creator</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.tabRow}>
          {TAB_OPTIONS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tabItem,
                  isActive && styles.tabItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    isActive ? styles.tabTextActive : styles.tabTextInactive,
                  ]}
                >
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {activeTab === "Submissions" ? (
          <SubmissionsGrid bottomPadding={insets.bottom + 100} />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No accounts connected</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingTop: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#374151",
  },
  handle: {
    fontFamily: "StackSans-Bold",
    fontSize: 22,
    color: "#FFFFFF",
  },
  role: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#9CA3AF",
  },
  divider: {
    height: 1,
    backgroundColor: "#1F1F1F",
    marginVertical: 24,
    marginHorizontal: 20,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },
  tabItem: {
    paddingBottom: 8,
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#FFFFFF",
  },
  tabText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  tabTextInactive: {
    color: "#6B7280",
  },
  grid: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    marginBottom: 4,
  },
  thumbnailContainer: {
    borderRadius: 12,
    height: 200,
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  thumbnail: {
    height: 200,
    width: "100%",
  },
  playButtonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: 8,
  },
  usernameRow: {
    marginBottom: 2,
  },
  username: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  separator: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#6B7280",
  },
  timeAgo: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#6B7280",
  },
  description: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#6B7280",
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#6B7280",
  },
});
