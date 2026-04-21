import React from "react";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.heading}>Dashboard</Text>
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
});
