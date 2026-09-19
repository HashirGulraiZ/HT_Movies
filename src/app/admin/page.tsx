import Link from "next/link";
import { db } from "@/lib/db/mysql";

async function count(table: string) {
	try {
		const [rows] = await db.query(`SELECT COUNT(*) AS total FROM \`${table}\``);
		return Number((rows as Array<{ total: number }>)[0]?.total ?? 0);
	} catch (error) {
		console.error(`Admin ${table} count failed`, error);
		return 0;
	}
}

export default async function AdminDashboardPage() {
	const [movies, shows, users, episodes] = await Promise.all(["movies", "tv_shows", "users", "episodes"].map(count));
	const stats = [["Movies", movies, "/admin/movies"], ["TV shows", shows, "/admin/tv-shows"], ["Episodes", episodes, "/admin/episodes"], ["Users", users, "/admin/users"]];
	return <main className="py-4"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">Studio</p><h1 className="mt-2 text-4xl font-semibold text-white">Dashboard</h1><p className="mt-3 text-muted">Your public catalog is controlled from this workspace.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value, href]) => <Link href={String(href)} key={label} className="card-surface-elevated p-5 transition hover:border-brand-500"><p className="text-sm text-muted">{label}</p><p className="mt-3 text-3xl font-semibold text-white">{value}</p></Link>)}</div><div className="mt-8 card-surface-elevated p-6"><h2 className="text-xl font-semibold text-white">Quick actions</h2><div className="mt-4 flex flex-wrap gap-3"><Link href="/admin/movies/create" className="rounded-button bg-brand-600 px-4 py-2 font-semibold text-white">Add movie</Link><Link href="/admin/settings" className="rounded-button border border-white/10 px-4 py-2 font-semibold text-white">Edit homepage</Link></div></div></main>;
}
