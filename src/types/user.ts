export type UserRole = "user" | "admin";
export type UserStatus = "active" | "blocked";

export type User = {
	id: number;
	name: string;
	email: string;
	avatar_url: string | null;
	role: UserRole;
	status: UserStatus;
	created_at?: string;
	updated_at?: string;
};