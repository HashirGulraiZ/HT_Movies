import { NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, sessionCookieName, sessionCookieOptions } from "@/lib/auth/auth";
import { verifyPassword } from "@/lib/auth/password";
import { findUserByEmail } from "@/lib/db/queries/users";

const loginSchema = z.object({
	email: z.string().trim().email().max(255),
	password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
	const parsed = loginSchema.safeParse(await request.json());
	if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
	try {
		const user = await findUserByEmail(parsed.data.email.toLowerCase());
		if (!user || user.status !== "active" || !(await verifyPassword(parsed.data.password, user.password))) {
			return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
		}
		const response = NextResponse.json({
			data: { id: user.id, name: user.name, email: user.email, role: user.role },
		});
		response.cookies.set(sessionCookieName, createSessionToken(user), sessionCookieOptions);
		return response;
	} catch (error) {
		console.error("Login failed", error);
		return NextResponse.json({ error: "Unable to sign in right now." }, { status: 503 });
	}
}
