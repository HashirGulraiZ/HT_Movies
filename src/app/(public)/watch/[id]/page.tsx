import { notFound } from "next/navigation";
import { getPublishedMovieById } from "@/lib/db/queries/movies";

export const dynamic = "force-dynamic";

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id;
	const movieId = id.startsWith("movie-") ? Number(id.slice(6)) : Number(id);
	const movie = Number.isInteger(movieId) ? await getPublishedMovieById(movieId) : null;
	if (!movie) return notFound();
	return <main className="container-page py-10"><h1 className="mb-5 text-2xl font-semibold text-white">{movie.title}</h1>{movie.video_url ? <div className="aspect-video overflow-hidden rounded-card bg-black"><iframe className="h-full w-full" src={movie.video_url} title={movie.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /></div> : <p className="text-muted">No playback URL has been configured for this title.</p>}</main>;
}
