import Link from "next/link";
import { getPublishedTVShows } from "@/lib/db/queries/tvShows";
import type { TVShow } from "@/types/tvShow";

export const dynamic = "force-dynamic";

export default async function TVShowsPage() {
	let shows: TVShow[] = [];
	try { shows = await getPublishedTVShows(); } catch (error) { console.error("TV show catalog query failed", error); }
	return <main className="container-page section"><div className="mb-10"><p className="text-sm uppercase tracking-[0.2em] text-brand-400">Catalog</p><h1 className="mt-2 text-4xl font-semibold text-white">TV shows</h1><p className="mt-3 text-muted">Series published from the admin studio.</p></div>{shows.length === 0 ? <div className="card-surface-elevated p-10 text-center text-muted">No published TV shows yet.</div> : <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">{shows.map((show) => <Link href={`/tv-shows/${show.slug}`} className="group" key={show.id}><div className="media-poster relative bg-background-card">{show.poster_url && <img src={show.poster_url} alt="" className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />}<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-4"><h2 className="font-semibold text-white">{show.title}</h2><p className="mt-1 text-xs text-zinc-300">{show.release_year ?? "—"} · {show.rating ?? "NR"}</p></div></div></Link>)}</div>}</main>;
}
