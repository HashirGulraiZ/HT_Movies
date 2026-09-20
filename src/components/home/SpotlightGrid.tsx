import Link from "next/link";
import { Play, Star } from "lucide-react";
import { formatRating } from "./BackdropCard";
import type { Movie } from "@/types/movie";

/** Total titles rendered: one large lead tile plus `SPOTLIGHT_LIMIT - 1` side cards. */
const SPOTLIGHT_LIMIT = 5;

export type SpotlightGridProps = {
	/** Movies to feature. The first entry becomes the large lead tile; the rest fill the side grid. */
	movies: Movie[];
	/** Small uppercase label rendered above the section title. */
	eyebrow?: string;
	/** Section heading. */
	title: string;
};

function formatRuntime(minutes: number | null): string | null {
	if (minutes == null || minutes <= 0) return null;
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}

/** Returns the first non-empty URL, or null when every candidate is missing/blank. */
function pickImage(...candidates: Array<string | null>): string | null {
	return candidates.find((url): url is string => typeof url === "string" && url.trim().length > 0) ?? null;
}

export function SpotlightGrid({ movies, eyebrow, title }: SpotlightGridProps) {
	if (movies.length === 0) return null;

	const [lead, ...rest] = movies.slice(0, SPOTLIGHT_LIMIT);
	const leadImage = pickImage(lead.backdrop_url, lead.poster_url);
	const leadRating = formatRating(lead.rating);
	const leadRuntime = formatRuntime(lead.duration_minutes);
	const leadMeta = [lead.release_year?.toString(), leadRuntime, lead.age_rating].filter((part): part is string => Boolean(part));

	return (
		<section aria-label={title} className="section-sm !py-5 sm:!py-6">
			<div className="px-4 sm:px-6 lg:px-10">
				<div className="mb-5">
					{eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">{eyebrow}</p>}
					<h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
				</div>
				<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
					<Link className="group relative col-span-2 block overflow-hidden rounded-xl border border-white/10 bg-background-card shadow-card lg:row-span-2" href={`/movies/${lead.slug}`}>
						<div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[420px]">
							{leadImage ? (
								<img alt={lead.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="eager" src={leadImage} />
							) : (
								<div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-background-elevated to-black p-6 text-center">
									<span className="font-serif text-3xl font-bold text-white">{lead.title}</span>
								</div>
							)}
							<div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
							{leadRating && (
								<span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-white backdrop-blur sm:right-4 sm:top-4">
									<Star aria-hidden="true" className="text-brand-400" fill="currentColor" size={13} />
									{leadRating}
								</span>
							)}
							<div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
								{lead.quality && (
									<span className="mb-2 inline-block rounded border border-white/40 bg-black/50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
										{lead.quality}
									</span>
								)}
								<h3 className="font-serif text-2xl font-bold leading-tight text-white sm:text-4xl">{lead.title}</h3>
								{leadMeta.length > 0 && <p className="mt-2 text-sm font-medium text-zinc-300">{leadMeta.join(" · ")}</p>}
								{lead.description && <p className="mt-2 line-clamp-2 max-w-xl text-sm text-muted sm:line-clamp-3">{lead.description}</p>}
								<span className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white transition group-hover:bg-brand-500">
									<Play aria-hidden="true" fill="currentColor" size={15} />
									Watch now
								</span>
							</div>
							<p className="sr-only">{leadRating ? `${lead.title} — rated ${leadRating}` : lead.title}</p>
						</div>
					</Link>
					{rest.map((movie) => {
						const imageSrc = pickImage(movie.poster_url, movie.backdrop_url);
						const rating = formatRating(movie.rating);
						const meta = [movie.release_year?.toString(), rating].filter((part): part is string => Boolean(part));
						return (
							<Link className="group relative block overflow-hidden rounded-lg border border-white/10 bg-background-card" href={`/movies/${movie.slug}`} key={movie.id}>
								<div className="relative aspect-[4/3] sm:aspect-[3/4]">
									{imageSrc ? (
										<img alt={movie.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" src={imageSrc} />
									) : (
										<div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-background-elevated to-black p-4 text-center">
											<span className="text-lg font-bold leading-tight text-white">{movie.title}</span>
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
									<div className="absolute inset-x-0 bottom-0 p-3">
										<p className="truncate text-sm font-semibold text-white">{movie.title}</p>
										{meta.length > 0 && <p className="mt-0.5 text-xs text-zinc-400">{meta.join(" · ")}</p>}
									</div>
									<div className="absolute inset-0 grid place-items-center opacity-0 transition duration-300 group-hover:opacity-100">
										<span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-black shadow-lg transition group-hover:scale-110">
											<Play aria-hidden="true" fill="currentColor" size={16} />
										</span>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}
