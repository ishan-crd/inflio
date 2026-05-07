import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
	baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	database: new Pool({
		connectionString: process.env.DATABASE_URL,
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				// TODO: Replace with real email service (Resend, SendGrid, etc.)
				console.log(`[OTP] ${type} code for ${email}: ${otp}`);
			},
		}),
	],
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
});
