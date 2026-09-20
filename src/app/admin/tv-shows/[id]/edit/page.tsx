"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ImageField } from "@/components/admin/MediaField";
import SeasonEpisodeManager from "@/components/admin/SeasonEpisodeManager";

type TVShowForm = {
	title: string;
	slug: string;
	description: string;
	poster_url: string;
	backdrop_url: string;
	trailer_url: string;
	release_year: string;
	rating: string;
	age_rating: string;
	director: string;
	cast_members: string;
	quality: string;
	likes: string;
	status: string;
	featured: boolean;
};

export default function EditTVShowPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const [form, setForm] = useState<TVShowForm | null>(null);
	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetch(`/api/admin/tv-shows/${params.id}`)
			.then(async (response) => {
				const body = await response.json();
				if (!response.ok) {
					setError(body.error ?? "Unable to load TV show");
					return;
				}
				const show = body.data;
				setForm({
					title: show.title ?? "",
					slug: show.slug ?? "",
					description: show.description ?? "",
					poster_url: show.poster_url ?? "",
					backdrop_url: show.backdrop_url ?? "",
					trailer_url: show.trailer_url ?? "",
					release_year: show.release_year != null ? String(show.release_year) : "",
					rating: show.rating != null ? String(show.rating) : "",
					age_rating: show.age_rating ?? "",
					director: show.director ?? "",
					cast_members: show.cast_members ?? "",
					quality: show.quality ?? "",
					likes: show.likes != null ? String(show.likes) : "0",
					status: show.status ?? "draft",
					featured: Boolean(show.featured),
				});
			})
			.catch(() => setError("Unable to load TV show"));
	}, [params.id]);

	function update(key: keyof TVShowForm, value: string | boolean) {
		setForm((current) => (current ? { ...current, [key]: value } : current));
	}

	async function submit(event: React.FormEvent) {
		event.preventDefault();
		if (!form) return;
		setSaving(true);
		setError("");
		const response = await fetch(`/api/admin/tv-shows/${params.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				...form,
				release_year: form.release_year || null,
				rating: form.rating || null,
				director: form.director || null,
				cast_members: form.cast_members || null,
				quality: form.quality || null,
				likes: Number(form.likes) || 0,
			}),
		});
		setSaving(false);
		if (!response.ok) {
			const body = await response.json();
			setError(body.error ?? "Unable to update TV show");
			return;
		}
		router.push("/admin/tv-shows");
	}

	if (error && !form) {
		return (
			<main className="py-4">
				<p className="rounded-button border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>
			</main>
		);
	}

	if (!form) {
		return (
			<main className="py-4">
				<p className="text-muted">Loading TV show…</p>
			</main>
		);
	}

	return (
		<main className="py-4">
			<div className="mb-8 flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">Content</p>
					<h1 className="mt-2 text-4xl font-semibold text-white">Edit TV show</h1>
					<p className="mt-3 text-muted">Update the detail page content and artwork. Episodes are managed from the Seasons and Episodes studio pages.</p>
				</div>
				<Link href={`/tv-shows/${form.slug}`} className="rounded-button border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
					View detail page
				</Link>
			</div>
			{error && <p className="mb-4 rounded-button border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
			<form onSubmit={submit} className="card-surface-elevated grid gap-5 p-6 md:grid-cols-2">
				<label className="grid gap-2 text-sm font-medium text-white">
					Title
					<input required className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={form.title} onChange={(event) => update("title", event.target.value)} />
				</label>
				<label className="grid gap-2 text-sm font-medium text-white">
					Slug
					<input required className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={form.slug} onChange={(event) => update("slug", event.target.value)} />
				</label>
				<ImageField label="Poster" folder="tv-shows" value={form.poster_url} onChange={(value) => update("poster_url", value)} />
				<ImageField label="Backdrop" folder="tv-shows" value={form.backdrop_url} onChange={(value) => update("backdrop_url", value)} />
				<label className="grid gap-2 text-sm font-medium text-white md:col-span-2">
					Trailer URL
					<input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" placeholder="YouTube, Vimeo, or direct MP4 URL" value={form.trailer_url} onChange={(event) => update("trailer_url", event.target.value)} />
				</label>
				<label className="grid gap-2 text-sm font-medium text-white md:col-span-2">
					Description
					<textarea className="min-h-32 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={form.description} onChange={(event) => update("description", event.target.value)} />
				</label>
				<label className="grid gap-2 text-sm font-medium text-white">
					Release year
					<input inputMode="numeric" className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={form.release_year} onChange={(event) => update("release_year", event.target.value)} />
				</label>
				<label className="grid gap-2 text-sm font-medium text-white">
					Rating (0-10)
					<input inputMode="decimal" className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={form.rating} onChange={(event) => update("rating", event.target.value)} />
				</label>
				<label className="grid gap-2 text-sm font-medium text-white">
					Age rating
					<input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" placeholder="TV-MA, TV-14…" value={form.age_rating} onChange={(event) => update("age_rating", event.target.value)} />
				</label>
				<label className="grid gap-2 text-sm font-medium text-white">
					Director
					<input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={form.director} onChange={(event) => update("director", event.target.value)} />
				</label>
				<label className="grid gap-2 text-sm font-medium text-white">
					Quality badge
					<input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" placeholder="HD, LOW QUALITY, 4K…" value={form.quality} onChange={(event) => update("quality", event.target.value)} />
				</label>
				<label className="grid gap-2 text-sm font-medium text-white md:col-span-2">
					Cast (comma separated, shown on the detail page)
					<textarea className="min-h-20 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={form.cast_members} onChange={(event) => update("cast_members", event.target.value)} />
				</label>
				<label className="grid gap-2 text-sm font-medium text-white">
					Likes (display counter)
					<input inputMode="numeric" className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={form.likes} onChange={(event) => update("likes", event.target.value)} />
				</label>
				<label className="grid gap-2 text-sm font-medium text-white">
					Status
					<select className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={form.status} onChange={(event) => update("status", event.target.value)}>
						<option value="draft">Draft</option>
						<option value="published">Published</option>
						<option value="archived">Archived</option>
					</select>
				</label>
				<label className="flex items-center gap-3 self-end text-sm font-medium text-white">
					<input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} /> Feature on homepage
				</label>
				<div className="md:col-span-2 flex gap-4">
					<button type="submit" disabled={saving} className="rounded-button bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-500 disabled:opacity-60">
						{saving ? "Saving…" : "Save changes"}
					</button>
					<Link href="/admin/tv-shows" className="rounded-button border border-white/15 px-5 py-3 font-semibold text-white hover:bg-white/10">
						Cancel
					</Link>
				</div>
			</form>
			<SeasonEpisodeManager showId={Number(params.id)} />
		</main>
	);
}

