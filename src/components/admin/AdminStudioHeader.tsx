"use client";

import Link from "next/link";
import { ExternalLink, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminStudioHeader({ email }: { email?: string | null }) {
	const router = useRouter();

	async function signOut() {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/login");
		router.refresh();
	}

	return <header className="admin-studio-header">
		<div className="container-page flex min-h-[4.5rem] items-center justify-between gap-5">
			<div className="flex items-center gap-4">
				<Link className="flex items-center gap-2.5 text-white" href="/admin">
					<span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-950/40"><Sparkles size={18} /></span>
					<span><span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-brand-300">HTMovie</span><span className="block text-lg font-bold leading-none">Studio</span></span>
				</Link>
				<span className="hidden h-7 w-px bg-white/10 sm:block" />
				<span className="hidden text-sm text-muted sm:block">Content management workspace</span>
			</div>
			<div className="flex items-center gap-2 sm:gap-3">
				<div className="hidden text-right md:block"><p className="text-xs font-semibold text-white">Administrator</p>{email && <p className="text-[11px] text-muted">{email}</p>}</div>
				<Link className="admin-header-action" href="/" target="_blank"><ExternalLink size={15} /> <span className="hidden sm:inline">View site</span></Link>
				<button className="admin-header-action" type="button" onClick={() => void signOut}><LogOut size={15} /> <span className="hidden sm:inline">Sign out</span></button>
			</div>
		</div>
	</header>;
}
