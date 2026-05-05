import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
	baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	database: new Database("./auth.db"),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
});
