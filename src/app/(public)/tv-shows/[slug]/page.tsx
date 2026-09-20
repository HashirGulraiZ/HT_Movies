import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedTVShowBySlug } from "@/lib/db/queries/tvShows";
import { getGenresForTVShow } from "@/lib/db/queries/genres";
import { getPublishedSeasonsForShow, getPublishedEpisodesForShow } from "@/lib/db/queries/episodes";
import { getCommentsForContent } from "@/lib/db/queries/comments";
import EmbedPlayer from "@/components/watch/EmbedPlayer";
import AZBar from "@/components/detail/AZBar";
import ShareButtons from "@/components/detail/ShareButtons";
import ExpandableText from "@/components/detail/ExpandableText";
import DetailSidebar from "@/components/detail/DetailSidebar";
import CommentSection from "@/components/detail/CommentSection";
import TVShowEpisodes from "@/components/watch/TVShowEpisodes";
import { formatRating } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TVShowDetailPage({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ ep?: string; season?: string }>;
}) {
	const [{ slug }, query] = await Promise.all([params, searchParams]);
	const show = await getPublishedTVShowBySlug(slug);
	if (!show) notFound();

	const [genres, seasons, episodes, comments] = await Promise.all([
		getGenresForTVShow(show.id).catch(() => []),
		getPublishedSeasonsForShow(show.id).catch(() => []),
		getPublishedEpisodesForShow(show.id).catch(() => []),
		getCommentsForContent("tv_show", show.id).catch(() => []),
	]);
	const rating = formatRating(show.rating ?? null);
	const activeEpisode = (query.ep ? episodes.find((episode) => String(episode.id) === query.ep) : undefined) ?? episodes.find((episode) => episode.video_url) ?? null;
	const caption = activeEpisode
		? [`${show.title} — E${activeEpisode.episode_number} ${activeEpisode.title}`, show.quality ?? ""].filter(Boolean).join(" ")
		: [show.title, show.release_year ? `(${show.release_year})` : "", show.quality ?? ""].filter(Boolean).join(" ");

	return (
		<main>
			<section id="watch" className="scroll-mt-20 border-b border-white/10 bg-black">
				<div className="container-page py-5">
					<EmbedPlayer src={activeEpisode?.video_url ?? show.trailer_url} title={activeEpisode ? activeEpisode.title : show.title} poster={activeEpisode?.thumbnail_url ?? show.backdrop_url ?? show.poster_url} />
					<p className="mt-3 truncate text-sm text-zinc-400">{caption}</p>
				</div>
			</section>

			<AZBar />

			<div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
				<article className="min-w-0">
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-3xl font-bold text-white lg:text-4xl">{show.title}</h1>
						<ShareButtons title={show.title} />
					</div>

					<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400">
						{rating && (
							<span className="inline-flex items-center gap-1 font-semibold text-brand-400">
								<svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M12 17.3 6.2 21l1.6-6.8L2.5 9.6l7-.6L12 2.5l2.5 6.5 7 .6-5.3 4.6L17.8 21z" /></svg>
								{rating}
							</span>
						)}
						<span>{show.release_year ?? "—"}</span>
						{show.quality && <span className="rounded-button bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">{show.quality}</span>}
						{seasons.length > 0 && <span>{seasons.length} {seasons.length === 1 ? "Season" : "Seasons"} · {episodes.length} {episodes.length === 1 ? "Episode" : "Episodes"}</span>}
						{show.age_rating && <span className="border border-white/25 px-1.5 py-0.5 text-xs font-semibold">{show.age_rating}</span>}
					</div>

					{show.description && <p className="mt-4 leading-7 text-zinc-300">{show.description}</p>}

					<div className="mt-5 grid gap-2 text-sm">
						<div className="flex gap-2">
							<span className="shrink-0 text-zinc-500">Director:</span>
							<span className="text-zinc-200">{show.director || "N/A"}</span>
						</div>
						<div className="flex flex-wrap gap-2">
							<span className="shrink-0 text-zinc-500">Genre:</span>
							<span className="flex flex-wrap gap-x-1">
								{genres.map((genre, index) => (
									<Link key={genre.id} href={`/genres/${genre.slug}`} className="text-zinc-300 transition hover:text-brand-400">
										{genre.name}
										{index < genres.length - 1 ? "," : ""}
									</Link>
								))}
								{!genres.length && <span className="text-zinc-200">N/A</span>}
							</span>
						</div>
						<div className="flex flex-wrap gap-2">
							<span className="shrink-0 text-zinc-500">Cast:</span>
							<ExpandableText text={show.cast_members} />
						</div>
					</div>

					<div className="mt-6 flex flex-wrap items-center gap-5">
						<span className="inline-flex items-center gap-1.5 text-sm text-zinc-400" title="Views">
							<svg viewBox="0 0 24 24" className="h-4 w-4 fill-brand-500" aria-hidden="true"><path d="M12 5c-5 0-9.3 3.1-11 7.5C2.7 16.9 7 20 12 20s9.3-3.1 11-7.5C21.3 8.1 17 5 12 5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /></svg>
							{Number(show.views ?? 0).toLocaleString()}
						</span>
						<span className="inline-flex items-center gap-1.5 text-sm text-zinc-400" title="Likes">
							<svg viewBox="0 0 24 24" className="h-4 w-4 fill-brand-500" aria-hidden="true"><path d="M12 21s-7.5-4.7-10-9.3C.5 8.6 2.6 5 6.2 5c2.2 0 3.9 1.2 4.8 2.9h2c.9-1.7 2.6-2.9 4.8-2.9 3.6 0 5.7 3.6 4.2 6.7-2.5 4.6-10 9.3-10 9.3z" /></svg>
							{Number(show.likes ?? 0).toLocaleString()}
						</span>
					</div>

					<section id="episodes" className="mt-12 scroll-mt-24">
						<h2 className="flex items-center gap-2 text-xl font-bold text-white">Episodes</h2>
						<div className="mt-5">
							<TVShowEpisodes basePath={`/tv-shows/${show.slug}`} seasons={seasons} episodes={episodes} activeEpisodeId={activeEpisode?.id ?? null} activeSeasonNumber={query.season ? Number(query.season) : null} />
						</div>
					</section>

					<section className="mt-12">
						<h2 className="flex items-center gap-2 text-xl font-bold text-white">
							<svg viewBox="0 0 24 24" className="h-5 w-5 fill-brand-500" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-6 4V6a2 2 0 0 1 2-2z" /></svg>
							Comments
						</h2>
						<div className="mt-5">
							<CommentSection contentType="tv_show" contentId={show.id} initialComments={comments} />
						</div>
					</section>

					{show.trailer_url && (
						<section id="trailer" className="mt-12 scroll-mt-24">
							<h2 className="text-xl font-bold text-white">Trailer</h2>
							<div className="mt-5">
								<EmbedPlayer src={show.trailer_url} title={`${show.title} — trailer`} poster={show.backdrop_url} />
							</div>
						</section>
					)}

				</article>

				<DetailSidebar />
			</div>
		</main>
	);
}
