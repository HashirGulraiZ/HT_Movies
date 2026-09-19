import Link from "next/link";
import { getPublishedMovies } from "@/lib/db/queries/movies";
import type { Movie } from "@/types/movie";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
	let movies: Movie[] = [];
	try {
		movies = await getPublishedMovies({ limit: 48, offset: 0 });
	} catch (error) {
		console.error("Movie catalog page query failed", error);
	}
	return <main className="container-page section">
		<div className="mb-10"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">Catalog</p><h1 className="mt-2 text-4xl font-semibold text-white">Movies</h1><p className="mt-3 text-muted">Every published movie is managed from the admin studio.</p></div>
		{movies.length === 0 ? <div className="card-surface-elevated p-10 text-center text-muted">No published movies yet. Add one from the admin studio.</div> : <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
			{movies.map((movie) => <Link href={`/movies/${movie.slug}`} className="group" key={movie.id}><div className="media-poster relative bg-background-card">{movie.poster_url && <img src={movie.poster_url} alt="" className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />}<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-4"><h2 className="font-semibold text-white">{movie.title}</h2><p className="mt-1 text-xs text-zinc-300">{movie.release_year ?? "—"} · {movie.rating ?? "NR"}</p></div></div></Link>)}
		</div>}
	</main>;
}
