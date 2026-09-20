import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { getWatchHistory } from "@/lib/db/queries/watchHistory";
import { Play } from "lucide-react";

export type ContinueWatchingItem = {
	id: number;
	title: string;
	href: string;
	backdropUrl: string | null;
	posterUrl: string | null;
	progressPercent: number;
};

type RawHistoryRow = {
	id: number;
	content_type: "movie" | "episode";
	content_id: number;
	progress_seconds: number;
	duration_seconds: number;
	completed: number;
	title?: string | null;
	slug?: string | null;
	backdrop_url?: string | null;
	poster_url?: string | null;
};

async function loadContinueWatching(): Promise<ContinueWatchingItem[]> {
	const user = await getCurrentUser();
	if (!user) return [];
	try {
		const rows = (await getWatchHistory(user.id, 12)) as RawHistoryRow[];
		return rows
			.filter((row) => row.duration_seconds > 0 && !row.completed)
			.map((row) => ({
				id: row.id,
				title: row.title ?? "Untitled",
				href: row.content_type === "movie" ? `/watch/movie-${row.content_id}` : `/watch/episode-${row.content_id}`,
				backdropUrl: row.backdrop_url ?? null,
				posterUrl: row.poster_url ?? null,
				progressPercent: Math.min(100, Math.round((row.progress_seconds / row.duration_seconds) * 100)),
			}));
	} catch (error) {
		console.error("Continue watching query failed", error);
		return [];
	}
}

export async function ContinueWatchingRow() {
	const items = await loadContinueWatching();
	if (!items.length) return null;
	return (
		<section className="section-sm !py-5 sm:!py-6">
			<h2 className="mb-3 px-4 text-xl font-bold text-white sm:px-6 sm:text-2xl lg:px-10">Continue Watching</h2>
			<div className="scrollbar-hide flex snap-x gap-2.5 overflow-x-auto px-4 pb-2 sm:gap-3 sm:px-6 lg:px-10">
				{items.map((item) => (
					<Link className="group relative block w-[280px] shrink-0 sm:w-[320px] lg:w-[340px]" href={item.href} key={item.id}>
						<div className="relative aspect-video overflow-hidden rounded-md bg-background-card sm:rounded-lg">
							{[item.backdropUrl, item.posterUrl].some((url) => typeof url === "string" && url.trim().length > 0) ? (
								<img alt={item.title} className="absolute inset-0 h-full w-full object-cover" src={[item.backdropUrl, item.posterUrl].find((url): url is string => typeof url === "string" && url.trim().length > 0)} />
							) : (
								<div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-background-elevated to-black p-4 text-center">
									<span className="text-lg font-bold text-white">{item.title}</span>
								</div>
							)}
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
							<div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
								<span className="grid h-12 w-12 place-items-center rounded-full bg-white text-black"><Play fill="currentColor" size={20} /></span>
							</div>
							<p className="absolute inset-x-0 bottom-3 truncate px-3 text-center font-serif text-lg tracking-wide text-white/90">{item.title}</p>
							<div className="absolute inset-x-3 bottom-1.5 h-[3px] rounded-full bg-white/25">
								<div className="h-full rounded-full bg-brand-600" style={{ width: `${item.progressPercent}%` }} />
							</div>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
