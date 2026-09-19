import { cookies } from "next/headers";
import { findUserById } from "@/lib/db/queries/users";
import { sessionCookieName, verifySessionToken } from "@/lib/auth/auth";
import type { User } from "@/types/user";

export async function getCurrentUser(): Promise<User | null> {
	const token = (await cookies()).get(sessionCookieName)?.value;
	if (!token) return null;
	const payload = verifySessionToken(token);
	if (!payload) return null;
	const user = await findUserById(Number(payload.sub));
	if (!user || user.status !== "active" || user.role !== payload.role) return null;
	return user;
}