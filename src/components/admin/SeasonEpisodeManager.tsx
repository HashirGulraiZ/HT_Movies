"use client";

import { useCallback, useEffect, useState } from "react";

type Season = { id: number; season_number: number; title: string | null };
type Episode = {
	id: number;
	season_id: number;
	episode_number: number;
	title: string;
	description: string | null;
	thumbnail_url: string | null;
	video_url: string | null;
	duration_minutes: number | null;
	status: string;
};

type EpisodeForm = {
	season_id: string;
	episode_number: string;
	title: string;
	description: string;
	thumbnail_url: string;
	video_url: string;
	duration_minutes: string;
	status: string;
};

const blankForm: EpisodeForm = { season_id: "", episode_number: "", title: "", description: "", thumbnail_url: "", video_url: "", duration_minutes: "", status: "published" };

export default function SeasonEpisodeManager({ showId }: { showId: number }) {
	const [seasons, setSeasons] = useState<Season[]>([]);
	const [episodes, setEpisodes] = useState<Episode[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [newSeasonTitle, setNewSeasonTitle] = useState("");
	const [form, setForm] = useState<EpisodeForm>(blankForm);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [openSeasonId, setOpenSeasonId] = useState<number | null>(null);
	const [saving, setSaving] = useState(false);

	const load = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const [seasonResponse, episodeResponse] = await Promise.all([
				fetch(`/api/admin/tv-shows/${showId}/seasons`),
				fetch(`/api/admin/tv-shows/${showId}/episodes`),
			]);
			const seasonBody = await seasonResponse.json();
			const episodeBody = await episodeResponse.json();
			if (!seasonResponse.ok || !episodeResponse.ok) throw new Error(seasonBody.error ?? episodeBody.error ?? "Unable to load seasons");
			setSeasons(seasonBody.data ?? []);
			setEpisodes(episodeBody.data ?? []);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Unable to load seasons");
		} finally {
			setLoading(false);
		}
	}, [showId]);

	useEffect(() => {
		load();
	}, [load]);

	async function addSeason() {
		setSaving(true);
		setError("");
		const nextNumber = seasons.reduce((max, season) => Math.max(max, season.season_number), 0) + 1;
		const response = await fetch(`/api/admin/tv-shows/${showId}/seasons`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ season_number: nextNumber, title: newSeasonTitle || null }),
		});
		setSaving(false);
		if (!response.ok) {
			const body = await response.json();
			setError(body.error ?? "Unable to add season");
			return;
		}
		setNewSeasonTitle("");
		await load();
	}

	async function removeSeason(id: number) {
		if (!window.confirm("Delete this season and all its episodes?")) return;
		const response = await fetch(`/api/admin/seasons/${id}`, { method: "DELETE" });
		if (!response.ok) {
			setError("Unable to delete season");
			return;
		}
		await load();
	}

	function startNewEpisode(seasonId: number) {
		const seasonEpisodes = episodes.filter((episode) => episode.season_id === seasonId);
		const nextNumber = seasonEpisodes.reduce((max, episode) => Math.max(max, episode.episode_number), 0) + 1;
		setEditingId(null);
		setForm({ ...blankForm, season_id: String(seasonId), episode_number: String(nextNumber) });
		setOpenSeasonId(seasonId);
	}

	function startEditEpisode(episode: Episode) {
		setEditingId(episode.id);
		setForm({
			season_id: String(episode.season_id),
			episode_number: String(episode.episode_number),
			title: episode.title,
			description: episode.description ?? "",
			thumbnail_url: episode.thumbnail_url ?? "",
			video_url: episode.video_url ?? "",
			duration_minutes: episode.duration_minutes != null ? String(episode.duration_minutes) : "",
			status: episode.status ?? "published",
		});
		setOpenSeasonId(episode.season_id);
	}

	function update(key: keyof EpisodeForm, value: string) {
		setForm((current) => ({ ...current, [key]: value }));
	}

	async function saveEpisode() {
		setSaving(true);
		setError("");
		const payload = {
			season_id: Number(form.season_id),
			episode_number: form.episode_number || 1,
			title: form.title,
			description: form.description || null,
			thumbnail_url: form.thumbnail_url || null,
			video_url: form.video_url || null,
			duration_minutes: form.duration_minutes || null,
			status: form.status,
		};
		const response = await fetch(editingId ? `/api/admin/episodes/${editingId}` : `/api/admin/tv-shows/${showId}/episodes`, {
			method: editingId ? "PUT" : "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		setSaving(false);
		if (!response.ok) {
			const body = await response.json();
			setError(body.error ?? "Unable to save episode");
			return;
		}
		setEditingId(null);
		setForm(blankForm);
		await load();
	}

	async function removeEpisode(id: number) {
		if (!window.confirm("Delete this episode?")) return;
		const response = await fetch(`/api/admin/episodes/${id}`, { method: "DELETE" });
		if (!response.ok) {
			setError("Unable to delete episode");
			return;
		}
		await load();
	}

	if (loading) return <p className="mt-10 text-sm text-muted">Loading seasons and episodes…</p>;

	return (
		<section className="mt-10">
			<div className="mb-4 flex flex-wrap items-end justify-between gap-4">
				<div>
					<h2 className="text-2xl font-semibold text-white">Seasons &amp; episodes</h2>
					<p className="mt-1 text-sm text-muted">Episodes added here appear in the season browser on the public detail page.</p>
				</div>
				<div className="flex gap-2">
					<input
						className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
						placeholder={`Season ${seasons.length + 1} title (optional)`}
						value={newSeasonTitle}
						onChange={(event) => setNewSeasonTitle(event.target.value)}
					/>
					<button type="button" onClick={addSeason} disabled={saving} className="rounded-button bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60">
						Add season
					</button>
				</div>
			</div>
			{error && <p className="mb-4 rounded-button border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

			<div className="grid gap-6">
				{seasons.map((season) => (
					<div key={season.id} className="rounded-card border border-white/10 bg-white/[0.02] p-4">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<h3 className="font-semibold text-white">
								Season {season.season_number}
								{season.title ? ` — ${season.title}` : ""}
								<span className="ml-2 text-xs text-muted">({episodes.filter((episode) => episode.season_id === season.id).length} episodes)</span>
							</h3>
							<div className="flex gap-3 text-sm">
								<button type="button" onClick={() => startNewEpisode(season.id)} className="text-brand-300 hover:text-white">
									+ Add episode
								</button>
								<button type="button" onClick={() => removeSeason(season.id)} className="text-red-300 hover:text-red-200">
									Delete season
								</button>
							</div>
						</div>

						<ul className="mt-3 grid gap-2">
							{episodes
								.filter((episode) => episode.season_id === season.id)
								.map((episode) => (
									<li key={episode.id} className="flex flex-wrap items-center justify-between gap-3 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-sm">
										<span className="min-w-0 flex-1 truncate text-white">
											<span className="mr-2 text-xs font-bold text-brand-400">E{episode.episode_number}</span>
											{episode.title}
											{!episode.video_url && <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase text-muted">No video</span>}
											{episode.status !== "published" && <span className="ml-2 rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] uppercase text-yellow-200">{episode.status}</span>}
										</span>
										<span className="flex gap-3">
											<button type="button" onClick={() => startEditEpisode(episode)} className="text-brand-300 hover:text-white">
												Edit
											</button>
											<button type="button" onClick={() => removeEpisode(episode.id)} className="text-red-300 hover:text-red-200">
												Delete
											</button>
										</span>
									</li>
								))}
							{!episodes.filter((episode) => episode.season_id === season.id).length && (
								<li className="px-3 py-2 text-sm text-muted">No episodes yet.</li>
							)}
						</ul>

						{openSeasonId === season.id && (
							<div className="mt-4 grid gap-3 rounded-card border border-brand-500/30 bg-brand-600/5 p-4 md:grid-cols-2">
								<label className="grid gap-1 text-xs font-medium text-white">
									Episode number *
									<input inputMode="numeric" className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" value={form.episode_number} onChange={(event) => update("episode_number", event.target.value)} />
								</label>
								<label className="grid gap-1 text-xs font-medium text-white">
									Title *
									<input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" value={form.title} onChange={(event) => update("title", event.target.value)} />
								</label>
								<label className="grid gap-1 text-xs font-medium text-white">
									Video / embed URL
									<input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" placeholder="YouTube, Vimeo, or MP4" value={form.video_url} onChange={(event) => update("video_url", event.target.value)} />
								</label>
								<label className="grid gap-1 text-xs font-medium text-white">
									Thumbnail URL
									<input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" value={form.thumbnail_url} onChange={(event) => update("thumbnail_url", event.target.value)} />
								</label>
								<label className="grid gap-1 text-xs font-medium text-white">
									Duration (minutes)
									<input inputMode="numeric" className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" value={form.duration_minutes} onChange={(event) => update("duration_minutes", event.target.value)} />
								</label>
								<label className="grid gap-1 text-xs font-medium text-white">
									Status
									<select className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" value={form.status} onChange={(event) => update("status", event.target.value)}>
										<option value="published">Published</option>
										<option value="draft">Draft</option>
										<option value="archived">Archived</option>
									</select>
								</label>
								<label className="grid gap-1 text-xs font-medium text-white md:col-span-2">
									Description
									<textarea className="min-h-16 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" value={form.description} onChange={(event) => update("description", event.target.value)} />
								</label>
								<div className="flex gap-3 md:col-span-2">
									<button type="button" onClick={saveEpisode} disabled={saving} className="rounded-button bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60">
										{editingId ? "Save episode" : "Add episode"}
									</button>
									<button type="button" onClick={() => { setOpenSeasonId(null); setEditingId(null); setForm(blankForm); }} className="rounded-button border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
										Cancel
									</button>
								</div>
							</div>
						)}
					</div>
				))}
				{!seasons.length && <p className="rounded-card border border-white/10 p-6 text-center text-sm text-muted">No seasons yet. Add the first season above.</p>}
			</div>
		</section>
	);
}

