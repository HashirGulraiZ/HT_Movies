import jwt from "jsonwebtoken";
import type { User, UserRole } from "@/types/user";

const SESSION_COOKIE = "htmovie_session";
const SESSION_TTL = "7d";

type SessionPayload = {
	sub: string;
	role: UserRole;
};

function getAuthSecret() {
	const secret = process.env.AUTH_SECRET;
	if (!secret || secret.length < 32) {
		throw new Error("AUTH_SECRET must be configured with at least 32 characters");
	}
	return secret;
}

export function createSessionToken(user: Pick<User, "id" | "role">) {
	return jwt.sign({ sub: String(user.id), role: user.role } satisfies SessionPayload, getAuthSecret(), {
		expiresIn: SESSION_TTL,
	});
}

export function verifySessionToken(token: string): SessionPayload | null {
	try {
		const payload = jwt.verify(token, getAuthSecret());
		if (typeof payload !== "object" || typeof payload.sub !== "string" || (payload.role !== "user" && payload.role !== "admin")) return null;
		return { sub: payload.sub, role: payload.role };
	} catch (error) {
		console.error("Session token verification failed", error);
		return null;
	}
}

export const sessionCookieName = SESSION_COOKIE;
export const sessionCookieOptions = {
	httpOnly: true,
	sameSite: "lax" as const,
	secure: process.env.NODE_ENV === "production",
	path: "/",
	maxAge: 60 * 60 * 24 * 7,
};