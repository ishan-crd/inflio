import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { emailOTP, oAuthProxy } from "better-auth/plugins";
import { Pool } from "pg";
import { Resend } from "resend";

const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const isHttps = baseURL.startsWith("https://");

const resend = new Resend(process.env.RESEND_API_KEY);

function buildOtpEmail(otp: string, type: string) {
	const isSignIn = type === "sign-in";
	const heading = isSignIn ? "Sign in to Inflio" : "Verify your email";
	const subtext = isSignIn
		? "Enter this code to sign in to your account."
		: "Enter this code to verify your email address.";

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${heading}</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#09090b;">
<tr><td align="center" style="padding:48px 24px;">
<table width="480" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;width:100%;">

<!-- Logo -->
<tr><td align="center" style="padding-bottom:36px;">
<table cellpadding="0" cellspacing="0" role="presentation"><tr>
<td style="width:10px;height:10px;border-radius:50%;background:#d9f99d;"></td>
<td style="padding-left:10px;font-size:22px;font-weight:700;color:#fafafa;letter-spacing:-0.5px;">inflio</td>
</tr></table>
</td></tr>

<!-- Card -->
<tr><td style="background:#111113;border:1px solid #1e1e22;border-radius:20px;padding:44px 36px;">

<!-- Heading -->
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr><td align="center" style="font-size:22px;font-weight:700;color:#fafafa;padding-bottom:8px;">${heading}</td></tr>
<tr><td align="center" style="font-size:14px;color:#71717a;line-height:1.6;padding-bottom:32px;">${subtext}</td></tr>
</table>

<!-- Code -->
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr><td align="center" style="padding-bottom:32px;">
<table cellpadding="0" cellspacing="0" role="presentation" style="background:rgba(217,249,157,0.06);border:1px dashed rgba(217,249,157,0.25);border-radius:16px;padding:24px 48px;">
<tr><td align="center" style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:700;letter-spacing:10px;color:#d9f99d;">${otp}</td></tr>
<tr><td align="center" style="font-size:12px;color:#52525b;padding-top:8px;">This code expires in 10 minutes</td></tr>
</table>
</td></tr>
</table>

<!-- Divider -->
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr><td style="border-top:1px solid #1e1e22;padding-top:24px;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr><td style="font-size:13px;color:#52525b;line-height:1.6;">If you didn't request this code, you can safely ignore this email. Someone may have entered your email address by mistake.</td></tr>
</table>
</td></tr>
</table>

</td></tr>

<!-- Footer -->
<tr><td align="center" style="padding-top:32px;">
<table cellpadding="0" cellspacing="0" role="presentation">
<tr><td align="center" style="font-size:12px;color:#3f3f46;line-height:1.6;">
Inflio &middot; Creator-first influence platform<br/>
<span style="color:#27272a;">&copy; ${new Date().getFullYear()} Inflio. All rights reserved.</span>
</td></tr>
</table>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export const auth = betterAuth({
	baseURL,
	database: new Pool({
		connectionString: process.env.DATABASE_URL,
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		oAuthProxy({
			productionURL: "https://www.inflio.in",
		}),
		expo({
			overrideOrigin: true,
		}),
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				await resend.emails.send({
					from: "Inflio <noreply@inflio.in>",
					to: email,
					subject:
						type === "sign-in"
							? `${otp} is your Inflio sign-in code`
							: `${otp} is your Inflio verification code`,
					html: buildOtpEmail(otp, type),
				});
			},
		}),
	],
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: isHttps ? "none" : "lax",
			secure: isHttps,
		},
	},
	trustedOrigins: [
		baseURL,
		"https://www.inflio.in",
		"https://inflio.in",
		"https://inflio-green.vercel.app",
		"inflio://",
		"expo://",
		"exp://",
	],
});
