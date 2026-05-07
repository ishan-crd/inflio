import { useConvex } from "convex/react";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "~/providers/auth";
import { api } from "../../convex/_generated/api";

export default function IndexScreen() {
	const { user, loading } = useAuth();
	const convex = useConvex();

	useEffect(() => {
		if (loading) return;

		if (!user) {
			router.replace("/login");
			return;
		}

		// Check if user has completed onboarding
		Promise.all([
			convex.query(api.creators.getByUserId, { userId: user.id }),
			convex.query(api.brands.getByUserId, { userId: user.id }),
		])
			.then(([creator, brand]) => {
				if (creator || brand) {
					router.replace("/(tabs)");
				} else {
					router.replace("/onboarding");
				}
			})
			.catch(() => {
				router.replace("/(tabs)");
			});
	}, [user, loading, convex]);

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
