import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

const AUTH_BASE_URL = "https://www.inflio.in";

export const authClient = createAuthClient({
	baseURL: AUTH_BASE_URL,
	plugins: [
		expoClient({
			scheme: "inflio",
			storagePrefix: "inflio",
			storage: SecureStore,
		}),
		emailOTPClient(),
	],
});
