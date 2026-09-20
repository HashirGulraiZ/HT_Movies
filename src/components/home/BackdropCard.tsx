import Link from "next/link";
import { Play } from "lucide-react";
import type { MediaItem } from "./media";

export function formatRating(rating: number | string | null): string | null {
	if (rating == null || rating === "") return null;
	const value = Number(rating);
	return Number.isFinite(value) ? value.toFixed(1) : null;
}

export type BackdropCardProps = {
	item: MediaItem;
	rank?: number;
	badge?: string | null;
	priority?: boolean;
};

export function BackdropCard({ item, rank, badge, priority = false }: BackdropCardProps) {
	const ratingLabel = formatRating(item.rating);
	const imageSrc = [item.backdropUrl, item.posterUrl].find((url): url is string => typeof url === "string" && url.trim().length > 0) ?? null;
	return (
		<Link className="group relative block w-[280px] shrink-0 sm:w-[320px] lg:w-[340px]" href={item.href}>
			<div className="relative aspect-video overflow-hidden rounded-md bg-background-card sm:rounded-lg">
				{imageSrc ? (
					<img alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" loading={priority ? "eager" : "lazy"} src={imageSrc} />
				) : (
					<div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-background-elevated to-black p-4 text-center">
						<span className="text-lg font-bold leading-tight text-white">{item.title}</span>
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
				{rank != null && rank <= 10 && (
					<span className="absolute left-2 top-2 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-extrabold leading-tight text-white">
						TOP<br />{rank}
					</span>
				)}
				<div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
					<span className="grid h-12 w-12 place-items-center rounded-full bg-white text-black shadow-xl transition group-hover:scale-110">
						<Play fill="currentColor" size={20} />
					</span>
				</div>
				{badge && (
					<span className="absolute inset-x-0 bottom-2 mx-auto w-fit rounded bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white">
						{badge}
					</span>
				)}
			</div>
			<p className="sr-only">{ratingLabel ? `${item.title} — rated ${ratingLabel}` : item.title}</p>
		</Link>
	);
}
