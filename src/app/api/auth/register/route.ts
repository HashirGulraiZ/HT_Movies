import { NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, sessionCookieName, sessionCookieOptions } from "@/lib/auth/auth";
import { hashPassword } from "@/lib/auth/password";
import { createUser, findUserByEmail, findUserById } from "@/lib/db/queries/users";

const registerSchema = z.object({
	name: z.string().trim().min(2).max(120),
	email: z.string().trim().email().max(255),
	password: z.string().min(8).max(200),
});

export async function POST(request: Request) {
	const parsed = registerSchema.safeParse(await request.json());
	if (!parsed.success) return NextResponse.json({ error: "Name, email, and an 8-character password are required." }, { status: 400 });
	try {
		const email = parsed.data.email.toLowerCase();
		if (await findUserByEmail(email)) return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
		const id = await createUser({ ...parsed.data, email, password: await hashPassword(parsed.data.password) });
		const user = await findUserById(id);
		if (!user) return NextResponse.json({ error: "Account was created but could not be loaded." }, { status: 503 });
		const response = NextResponse.json({ data: user }, { status: 201 });
		response.cookies.set(sessionCookieName, createSessionToken(user), sessionCookieOptions);
		return response;
	} catch (error) {
		console.error("Registration failed", error);
		return NextResponse.json({ error: "Unable to create your account right now." }, { status: 503 });
	}
}
