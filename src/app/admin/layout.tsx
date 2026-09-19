import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/permissions";

const adminLinks = [
	["Overview", "/admin"],
	["Homepage", "/admin/homepage"],
	["Pages", "/admin/pages"],
	["Movies", "/admin/movies"],
	["TV shows", "/admin/tv-shows"],
	["Genres & languages", "/admin/genres"],
	["Media library", "/admin/media"],
	["People", "/admin/people"],
	["Users", "/admin/users"],
	["Settings", "/admin/settings"],
];

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
	const user = await getCurrentUser();
	if (!isAdmin(user)) redirect("/login?next=/admin");
	return <div className="container-page flex min-h-[calc(100vh-4rem)] gap-8 py-8"><aside className="hidden w-52 shrink-0 border-r border-white/10 pr-5 lg:block"><p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Studio</p><nav className="grid gap-1">{adminLinks.map(([label, href]) => <Link className="rounded-button px-3 py-2 text-sm text-foreground-muted transition hover:bg-white/5 hover:text-white" href={href} key={href}>{label}</Link>)}</nav></aside><div className="min-w-0 flex-1">{children}</div></div>;
}
