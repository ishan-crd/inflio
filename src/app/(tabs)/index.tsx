import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TAB_OPTIONS = ["Transactions", "Withdrawals"] as const;
type TabOption = (typeof TAB_OPTIONS)[number];

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState<TabOption>("Transactions");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.heading}>Dashboard</Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceDollars}>$0</Text>
        <Text style={styles.balanceCents}>.00</Text>
      </View>

      <View style={styles.tabsContainer}>
        {TAB_OPTIONS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable key={tab} onPress={() => setActiveTab(tab)}>
              <View
                style={[
                  styles.tabButton,
                  isActive && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    isActive && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  heading: {
    fontFamily: "StackSansHeadline-Medium",
    fontSize: 28.5,
    color: "#F5E8E8",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginTop: 40,
  },
  balanceDollars: {
    fontFamily: "StackSans-Bold",
    fontSize: 56,
    color: "#FFFFFF",
  },
  balanceCents: {
    fontFamily: "StackSans-Bold",
    fontSize: 28,
    color: "#6B7280",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    marginTop: 40,
  },
  tabButton: {
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabButtonActive: {
    borderBottomColor: "#FFFFFF",
  },
  tabText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
});
