import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedMovieBySlug } from "@/lib/db/queries/movies";

export const dynamic = "force-dynamic";

export default async function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const movie = await getPublishedMovieBySlug((await params).slug);
	if (!movie) notFound();
	return <main><section className="relative overflow-hidden border-b border-white/10"><div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: movie.backdrop_url ? `url(${movie.backdrop_url})` : undefined }} /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" /><div className="container-page relative py-24"><div className="max-w-2xl"><p className="text-sm uppercase tracking-[0.2em] text-brand-400">Movie</p><h1 className="mt-3 text-5xl font-semibold text-white">{movie.title}</h1><p className="mt-4 text-muted">{movie.release_year ?? "—"} · {movie.rating ?? "NR"} · {movie.age_rating ?? "Unrated"}</p><p className="mt-6 text-lg leading-8 text-zinc-300">{movie.description}</p><Link href={`/watch/movie-${movie.id}`} className="mt-8 inline-flex rounded-button bg-brand-600 px-5 py-3 font-semibold text-white">Play movie</Link></div></div></section><section className="container-page section-sm"><h2 className="text-2xl font-semibold text-white">Watch {movie.title}</h2>{movie.video_url ? <div className="mt-5 aspect-video overflow-hidden rounded-card bg-black"><iframe className="h-full w-full" src={movie.video_url} title={movie.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /></div> : <p className="mt-4 text-muted">This movie does not have a video URL yet.</p>}</section></main>;
}
