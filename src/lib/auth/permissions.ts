import type { User } from "@/types/user";

export function isAdmin(user: User | null): user is User & { role: "admin" } {
	return user?.role === "admin" && user.status === "active";
}