"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Movie } from "@/types/movie";

export default function AdminMoviesPage() {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [error, setError] = useState("");
	async function load() {
		const response = await fetch("/api/admin/movies");
		const body = await response.json();
		if (!response.ok) setError(body.error ?? "Unable to load movies");
		else setMovies(body.data ?? []);
	}
	useEffect(() => { load().catch(() => setError("Unable to load movies")); }, []);
	async function remove(id: number) {
		if (!window.confirm("Delete this movie?")) return;
		const response = await fetch(`/api/admin/movies/${id}`, { method: "DELETE" });
		if (!response.ok) setError("Unable to delete movie");
		else setMovies(movies.filter((movie) => movie.id !== id));
	}
	return <main className="py-4"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">Content</p><h1 className="mt-2 text-4xl font-semibold text-white">Movies</h1><p className="mt-3 text-muted">Draft, publish, feature, and remove catalog titles.</p></div><Link href="/admin/movies/create" className="rounded-button bg-brand-600 px-4 py-3 font-semibold text-white">Add movie</Link></div>{error && <p className="mb-4 rounded-button border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}<div className="overflow-x-auto rounded-card border border-white/10"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-white/[0.04] text-muted"><tr><th className="p-4">Title</th><th className="p-4">Year</th><th className="p-4">Status</th><th className="p-4">Featured</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{movies.map((movie) => <tr className="border-t border-white/10 text-white" key={movie.id}><td className="p-4 font-semibold">{movie.title}<span className="mt-1 block text-xs text-muted">{movie.slug}</span></td><td className="p-4 text-muted">{movie.release_year ?? "—"}</td><td className="p-4"><span className="rounded-full bg-white/10 px-2 py-1 text-xs">{movie.status}</span></td><td className="p-4 text-muted">{movie.featured ? "Yes" : "No"}</td><td className="p-4 text-right"><Link className="mr-4 text-brand-300 hover:text-white" href={`/admin/movies/${movie.id}/edit`}>Edit</Link><button className="text-red-300 hover:text-red-200" onClick={() => remove(movie.id)}>Delete</button></td></tr>)}</tbody></table>{!movies.length && <p className="p-8 text-center text-muted">No movies found.</p>}</div></main>;
}
