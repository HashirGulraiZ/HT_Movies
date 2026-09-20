import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/permissions";
import { AdminStudioHeader } from "@/components/admin/AdminStudioHeader";

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
	return <><AdminStudioHeader email={user?.email} /><div className="admin-shell container-page min-h-[calc(100vh-4.5rem)] py-5 sm:py-8"><details className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 lg:hidden"><summary className="cursor-pointer text-sm font-semibold text-white">Studio navigation</summary><nav className="mt-3 grid gap-1">{adminLinks.map(([label, href]) => <Link className="rounded-button px-3 py-2 text-sm text-foreground-muted hover:bg-white/5 hover:text-white" href={href} key={href}>{label}</Link>)}</nav></details><div className="flex gap-8"><aside className="hidden w-56 shrink-0 lg:block"><div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.03] p-3"><p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Studio menu</p><nav className="grid gap-1">{adminLinks.map(([label, href]) => <Link className="rounded-button px-3 py-2.5 text-sm text-foreground-muted transition hover:bg-white/5 hover:text-white" href={href} key={href}>{label}</Link>)}</nav></div></aside><div className="min-w-0 flex-1">{children}</div></div></div></>;
}
