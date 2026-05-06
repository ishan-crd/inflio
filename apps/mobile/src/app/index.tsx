import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "~/providers/auth";

export default function IndexScreen() {
	const { user, loading } = useAuth();

	useEffect(() => {
		if (loading) return;
		if (user) {
			router.replace("/(tabs)");
		} else {
			router.replace("/login");
		}
	}, [user, loading]);

	return (
		<View style={styles.container}>
			<ActivityIndicator color="#d9f99d" size="large" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0a0a0c",
		justifyContent: "center",
		alignItems: "center",
	},
});
