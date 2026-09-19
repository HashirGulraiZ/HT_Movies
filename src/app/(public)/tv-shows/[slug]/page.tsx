import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedTVShowBySlug } from "@/lib/db/queries/tvShows";

export const dynamic = "force-dynamic";

export default async function TVShowDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const show = await getPublishedTVShowBySlug((await params).slug);
	if (!show) notFound();
	return <main><section className="relative overflow-hidden border-b border-white/10"><div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: show.backdrop_url ? `url(${show.backdrop_url})` : undefined }} /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" /><div className="container-page relative py-24"><div className="max-w-2xl"><p className="text-sm uppercase tracking-[0.2em] text-brand-400">TV show</p><h1 className="mt-3 text-5xl font-semibold text-white">{show.title}</h1><p className="mt-4 text-muted">{show.release_year ?? "—"} · {show.rating ?? "NR"} · {show.age_rating ?? "Unrated"}</p><p className="mt-6 text-lg leading-8 text-zinc-300">{show.description}</p><Link href="/watch-history" className="mt-8 inline-flex rounded-button bg-brand-600 px-5 py-3 font-semibold text-white">Browse episodes</Link></div></div></section><section className="container-page section-sm"><h2 className="text-2xl font-semibold text-white">Seasons and episodes</h2><p className="mt-4 text-muted">Episodes for this series can be managed from the Seasons and Episodes studio pages.</p></section></main>;
}
