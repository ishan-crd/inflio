import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.heading}>Wallet</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>Coming soon</Text>
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
