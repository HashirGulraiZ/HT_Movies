import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedMovieBySlug } from "@/lib/db/queries/movies";
import { getGenresForMovie } from "@/lib/db/queries/genres";
import { getCommentsForContent } from "@/lib/db/queries/comments";
import EmbedPlayer from "@/components/watch/EmbedPlayer";
import AZBar from "@/components/detail/AZBar";
import ShareButtons from "@/components/detail/ShareButtons";
import ExpandableText from "@/components/detail/ExpandableText";
import DetailSidebar from "@/components/detail/DetailSidebar";
import CommentSection from "@/components/detail/CommentSection";
import { formatRating, formatDuration } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const movie = await getPublishedMovieBySlug((await params).slug);
	if (!movie) notFound();

	const [genres, comments] = await Promise.all([
		getGenresForMovie(movie.id).catch(() => []),
		getCommentsForContent("movie", movie.id).catch(() => []),
	]);
	const rating = formatRating(movie.rating ?? null);
	const duration = formatDuration(movie.duration_minutes);
	const caption = [movie.title, movie.release_year ? `(${movie.release_year})` : "", movie.quality ?? ""].filter(Boolean).join(" ");

	return (
		<main>
			<section id="watch" className="scroll-mt-20 border-b border-white/10 bg-black">
				<div className="container-page py-5">
					<EmbedPlayer src={movie.video_url} title={movie.title} poster={movie.backdrop_url ?? movie.poster_url} />
					<p className="mt-3 truncate text-sm text-zinc-400">{caption}</p>
				</div>
			</section>

			<AZBar />

			<div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
				<article className="min-w-0">
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-3xl font-bold text-white lg:text-4xl">{movie.title}</h1>
						<ShareButtons title={movie.title} />
					</div>

					<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400">
						{rating && (
							<span className="inline-flex items-center gap-1 font-semibold text-brand-400">
								<svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M12 17.3 6.2 21l1.6-6.8L2.5 9.6l7-.6L12 2.5l2.5 6.5 7 .6-5.3 4.6L17.8 21z" /></svg>
								{rating}
							</span>
						)}
						<span>{movie.release_year ?? "—"}</span>
						{movie.quality && <span className="rounded-button bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">{movie.quality}</span>}
						{duration && <span>{duration}</span>}
						{movie.age_rating && <span className="border border-white/25 px-1.5 py-0.5 text-xs font-semibold">{movie.age_rating}</span>}
					</div>

					{movie.description && <p className="mt-4 leading-7 text-zinc-300">{movie.description}</p>}

					<div className="mt-5 grid gap-2 text-sm">
						<div className="flex gap-2">
							<span className="shrink-0 text-zinc-500">Director:</span>
							<span className="text-zinc-200">{movie.director || "N/A"}</span>
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
							<ExpandableText text={movie.cast_members} />
						</div>
					</div>

					<div className="mt-6 flex flex-wrap items-center gap-5">
						{movie.trailer_url && (
							<a href="#trailer" className="inline-flex items-center gap-2 rounded-button bg-brand-600 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-500">
								<svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
								Watch trailer
							</a>
						)}
						<span className="inline-flex items-center gap-1.5 text-sm text-zinc-400" title="Views">
							<svg viewBox="0 0 24 24" className="h-4 w-4 fill-brand-500" aria-hidden="true"><path d="M12 5c-5 0-9.3 3.1-11 7.5C2.7 16.9 7 20 12 20s9.3-3.1 11-7.5C21.3 8.1 17 5 12 5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /></svg>
							{Number(movie.views ?? 0).toLocaleString()}
						</span>
						<span className="inline-flex items-center gap-1.5 text-sm text-zinc-400" title="Likes">
							<svg viewBox="0 0 24 24" className="h-4 w-4 fill-brand-500" aria-hidden="true"><path d="M12 21s-7.5-4.7-10-9.3C.5 8.6 2.6 5 6.2 5c2.2 0 3.9 1.2 4.8 2.9h2c.9-1.7 2.6-2.9 4.8-2.9 3.6 0 5.7 3.6 4.2 6.7-2.5 4.6-10 9.3-10 9.3z" /></svg>
							{Number(movie.likes ?? 0).toLocaleString()}
						</span>
					</div>

					<section className="mt-12">
						<h2 className="flex items-center gap-2 text-xl font-bold text-white">
							<svg viewBox="0 0 24 24" className="h-5 w-5 fill-brand-500" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-6 4V6a2 2 0 0 1 2-2z" /></svg>
							Comments
						</h2>
						<div className="mt-5">
							<CommentSection contentType="movie" contentId={movie.id} initialComments={comments} />
						</div>
					</section>

					{movie.trailer_url && (
						<section id="trailer" className="mt-12 scroll-mt-24">
							<h2 className="text-xl font-bold text-white">Trailer</h2>
							<div className="mt-5">
								<EmbedPlayer src={movie.trailer_url} title={`${movie.title} — trailer`} poster={movie.backdrop_url} />
							</div>
						</section>
					)}

				</article>

				<DetailSidebar />
			</div>
		</main>
	);
}
