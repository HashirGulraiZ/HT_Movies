"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TVShow } from "@/types/tvShow";

export default function AdminTVShowsPage() {
	const [shows, setShows] = useState<TVShow[]>([]);
	useEffect(() => { fetch("/api/admin/tv-shows").then((response) => response.json()).then((body) => setShows(body.data ?? [])); }, []);
	async function remove(id: number) { if (!window.confirm("Delete this TV show and its seasons?")) return; const response = await fetch(`/api/admin/tv-shows/${id}`, { method: "DELETE" }); if (response.ok) setShows(shows.filter((show) => show.id !== id)); }
	return <main className="py-4"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.2em] text-brand-400">Content</p><h1 className="mt-2 text-4xl font-semibold text-white">TV shows</h1><p className="mt-3 text-muted">Manage series metadata, artwork, publishing, and featured placement.</p></div><Link href="/admin/tv-shows/create" className="rounded-button bg-brand-600 px-4 py-3 font-semibold text-white">Add TV show</Link></div><div className="overflow-x-auto rounded-card border border-white/10"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-white/[0.04] text-muted"><tr><th className="p-4">Title</th><th className="p-4">Year</th><th className="p-4">Status</th><th className="p-4">Featured</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{shows.map((show) => <tr className="border-t border-white/10 text-white" key={show.id}><td className="p-4 font-semibold">{show.title}<span className="mt-1 block text-xs text-muted">{show.slug}</span></td><td className="p-4 text-muted">{show.release_year ?? "—"}</td><td className="p-4"><span className="rounded-full bg-white/10 px-2 py-1 text-xs">{show.status}</span></td><td className="p-4 text-muted">{show.featured ? "Yes" : "No"}</td><td className="p-4 text-right"><button className="text-red-300 hover:text-red-200" onClick={() => remove(show.id)}>Delete</button></td></tr>)}</tbody></table>{!shows.length && <p className="p-8 text-center text-muted">No TV shows found.</p>}</div></main>;
}
