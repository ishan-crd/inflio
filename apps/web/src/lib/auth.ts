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
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="dark"/>
<meta name="supported-color-schemes" content="dark"/>
<title>${heading}</title>
<!--[if mso]>
<xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml>
<style>table{border-collapse:collapse;}td{font-family:Arial,sans-serif;}</style>
<![endif]-->
<style>
body,html{margin:0;padding:0;width:100%;background-color:#09090b!important;}
body{-webkit-text-size-adjust:none;-ms-text-size-adjust:none;}
img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
table{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;}
td{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}
u+.body a{color:inherit;text-decoration:none;font-size:inherit;font-weight:inherit;line-height:inherit;}
@media only screen and (max-width:520px){
.outer{width:100%!important;padding:24px 16px!important;}
.card{padding:32px 24px!important;}
.otp-code{font-size:28px!important;letter-spacing:8px!important;}
.otp-box{padding:20px 24px!important;}
}
</style>
</head>
<body class="body" style="margin:0;padding:0;background-color:#09090b;width:100%;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#09090b;min-height:100%;">
<tr><td align="center" class="outer" style="padding:48px 24px;">
<table width="480" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;width:100%;">

<!-- Logo -->
<tr><td align="center" style="padding-bottom:40px;">
<table cellpadding="0" cellspacing="0" role="presentation"><tr>
<td style="vertical-align:middle;"><table cellpadding="0" cellspacing="0"><tr><td style="width:12px;height:12px;border-radius:6px;background-color:#d9f99d;font-size:0;line-height:0;">&nbsp;</td></tr></table></td>
<td style="padding-left:10px;font-size:24px;font-weight:700;color:#fafafa;letter-spacing:-0.5px;vertical-align:middle;">inflio</td>
</tr></table>
</td></tr>

<!-- Card -->
<tr><td class="card" style="background-color:#111113;border:1px solid #1e1e22;border-radius:20px;padding:44px 36px;">

<!-- Heading -->
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr><td align="center" style="font-size:24px;font-weight:700;color:#fafafa;padding-bottom:8px;line-height:1.3;">${heading}</td></tr>
<tr><td align="center" style="font-size:15px;color:#71717a;line-height:1.6;padding-bottom:36px;">${subtext}</td></tr>
</table>

<!-- OTP Code Box -->
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr><td align="center" style="padding-bottom:36px;">
<table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
<tr><td class="otp-box" align="center" style="background-color:#0f1a08;border:1px solid #2a3a1a;border-radius:16px;padding:28px 36px;">
<table cellpadding="0" cellspacing="0" role="presentation">
<tr><td align="center" class="otp-code" style="font-family:'Courier New',Courier,monospace;font-size:38px;font-weight:700;letter-spacing:12px;color:#d9f99d;line-height:1;">${otp}</td></tr>
<tr><td align="center" style="font-size:12px;color:#52525b;padding-top:12px;line-height:1.4;">This code expires in 10 minutes</td></tr>
</table>
</td></tr>
</table>
</td></tr>
</table>

<!-- Divider -->
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr><td style="border-top:1px solid #1e1e22;padding-top:24px;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr><td style="font-size:13px;color:#52525b;line-height:1.7;">If you didn't request this code, you can safely ignore this email. Someone may have entered your email address by mistake.</td></tr>
</table>
</td></tr>
</table>

</td></tr>

<!-- Footer -->
<tr><td align="center" style="padding-top:36px;">
<table cellpadding="0" cellspacing="0" role="presentation">
<tr><td align="center" style="font-size:12px;color:#3f3f46;line-height:1.8;">
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
		expo(),
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
