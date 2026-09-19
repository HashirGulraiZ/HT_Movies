import { db } from "@/lib/db/mysql";
import type { User } from "@/types/user";

type StoredUser = User & { password: string };

const publicUserColumns = "id, name, email, avatar_url, role, status, created_at, updated_at";

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
	const [rows] = await db.execute(
		`SELECT ${publicUserColumns}, password FROM users WHERE email = ? LIMIT 1`,
		[email],
	);
	return ((rows as StoredUser[])[0] ?? null);
}

export async function findUserById(id: number): Promise<User | null> {
	const [rows] = await db.execute(
		`SELECT ${publicUserColumns} FROM users WHERE id = ? LIMIT 1`,
		[id],
	);
	return ((rows as User[])[0] ?? null);
}

export async function createUser(input: { name: string; email: string; password: string }) {
	const [result] = await db.execute(
		`INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, 'user', 'active')`,
		[input.name, input.email, input.password],
	);
	return (result as { insertId: number }).insertId;
}