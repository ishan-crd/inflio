import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MobileCallbackPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("better-auth.session_token")?.value;

	if (token) {
		redirect(`inflio://auth-callback?token=${token}`);
	} else {
		redirect("inflio://auth-callback?error=no_session");
	}
}
