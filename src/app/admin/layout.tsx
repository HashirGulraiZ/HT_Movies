import Link from "next/link";
import type { ReactNode } from "react";

const adminLinks = [
	["Overview", "/admin"],
	["Movies", "/admin/movies"],
	["TV shows", "/admin/tv-shows"],
	["People", "/admin/people"],
	["Users", "/admin/users"],
	["Settings", "/admin/settings"],
];

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
	return <div className="container-page flex min-h-[calc(100vh-4rem)] gap-8 py-8"><aside className="hidden w-52 shrink-0 border-r border-white/10 pr-5 lg:block"><p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Studio</p><nav className="grid gap-1">{adminLinks.map(([label, href]) => <Link className="rounded-button px-3 py-2 text-sm text-foreground-muted transition hover:bg-white/5 hover:text-white" href={href} key={href}>{label}</Link>)}</nav></aside><div className="min-w-0 flex-1">{children}</div></div>;
}
