import Link from "next/link";

export type SeasonTab = { id: number; season_number: number; title: string | null };
export type EpisodeRow = {
	id: number;
	season_id: number;
	episode_number: number;
	title: string;
	description: string | null;
	thumbnail_url: string | null;
	video_url: string | null;
	duration_minutes: number | null;
};

type TVShowEpisodesProps = {
	basePath: string;
	seasons: SeasonTab[];
	episodes: EpisodeRow[];
	activeEpisodeId: number | null;
	activeSeasonNumber?: number | null;
};

export default function TVShowEpisodes({ basePath, seasons, episodes, activeEpisodeId, activeSeasonNumber }: TVShowEpisodesProps) {
	if (!seasons.length) {
		return (
			<div className="rounded-card border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-muted">
				Episodes for this series have not been added yet. Check back soon.
			</div>
		);
	}

	const activeEpisode = episodes.find((episode) => episode.id === activeEpisodeId) ?? null;
	const seasonByNumber = activeSeasonNumber ? seasons.find((season) => season.season_number === activeSeasonNumber) : undefined;
	const activeSeasonId = seasonByNumber?.id ?? activeEpisode?.season_id ?? seasons[0].id;

	return (
		<div className="grid gap-5">
			{seasons.length > 1 && (
				<div className="flex flex-wrap gap-2">
					{seasons.map((season) => (
						<Link
							key={season.id}
							href={`${basePath}?season=${season.season_number}#episodes`}
							className={`rounded-button px-4 py-2 text-sm font-semibold transition ${
								season.id === activeSeasonId ? "bg-brand-600 text-white" : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
							}`}
						>
							{season.title ? season.title : `Season ${season.season_number}`}
						</Link>
					))}
				</div>
			)}

			<ul className="grid gap-2">
				{episodes
					.filter((episode) => episode.season_id === activeSeasonId)
					.map((episode) => {
						const isActive = episode.id === activeEpisodeId;
						return (
							<li key={episode.id}>
								<Link
									href={`${basePath}?ep=${episode.id}#watch`}
									className={`flex items-center gap-4 rounded-card border p-3 transition ${
										isActive ? "border-brand-500/60 bg-brand-600/10" : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
									}`}
								>
									<span className="relative h-14 w-24 shrink-0 overflow-hidden rounded-button bg-black/50">
										{episode.thumbnail_url ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img src={episode.thumbnail_url} alt="" className="h-full w-full object-cover" />
										) : (
											<span className="grid h-full w-full place-items-center text-[10px] text-muted">No preview</span>
										)}
										{episode.video_url && (
											<span className="absolute inset-0 grid place-items-center bg-black/30">
												<svg viewBox="0 0 24 24" className="h-5 w-5 fill-white/90" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
											</span>
										)}
									</span>
									<span className="min-w-0 flex-1">
										<span className="flex flex-wrap items-center gap-2">
											<span className="text-xs font-bold uppercase tracking-wider text-brand-400">E{episode.episode_number}</span>
											<span className="truncate font-semibold text-white">{episode.title}</span>
											{episode.duration_minutes ? <span className="text-xs text-muted">{episode.duration_minutes} min</span> : null}
											{!episode.video_url ? <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">No video</span> : null}
										</span>
										{episode.description && <span className="mt-1 line-clamp-1 block text-sm text-zinc-400">{episode.description}</span>}
									</span>
								</Link>
							</li>
						);
					})}
				{!episodes.filter((episode) => episode.season_id === activeSeasonId).length && (
					<li className="rounded-card border border-white/10 p-5 text-center text-sm text-muted">No episodes in this season yet.</li>
				)}
			</ul>
		</div>
	);
}
