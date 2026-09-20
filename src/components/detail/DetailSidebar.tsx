import Link from "next/link";
import { getGenresWithMovieCounts } from "@/lib/db/queries/genres";

export default async function DetailSidebar() {
	const categories = await getGenresWithMovieCounts(10).catch(() => []);

	return (
		<aside className="grid gap-6 self-start">
			<form action="/search" className="flex overflow-hidden rounded-card border border-white/10 bg-white/[0.04]">
				<input
					name="q"
					placeholder="Search movies"
					className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
				/>
				<button type="submit" aria-label="Search" className="px-4 text-zinc-400 transition hover:text-brand-400">
					<svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
						<path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
					</svg>
				</button>
			</form>

			<div className="overflow-hidden rounded-card border border-white/10 bg-white/[0.03]">
				<h3 className="border-b border-white/10 px-5 py-4 text-center text-sm font-bold uppercase tracking-wide text-white">Categories</h3>
				<ul>
					{categories.map((category) => (
						<li key={category.id} className="border-b border-white/5 last:border-b-0">
							<Link
								href={`/genres/${category.slug}`}
								className="flex items-center justify-between gap-3 px-5 py-3 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
							>
								<span className="inline-flex min-w-0 items-center gap-2">
									<span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-brand-500/60 text-[9px] text-brand-400">▸</span>
									<span className="truncate">{category.name}</span>
								</span>
								<span className="shrink-0 text-xs text-zinc-500">({category.movie_count})</span>
							</Link>
						</li>
					))}
					{!categories.length && <li className="px-5 py-4 text-sm text-muted">No categories yet.</li>}
				</ul>
			</div>
		</aside>
	);
}
