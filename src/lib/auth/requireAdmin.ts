import { getCurrentUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/permissions";

export async function requireAdmin() {
	const user = await getCurrentUser();
	return isAdmin(user) ? user : null;
}
