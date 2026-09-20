import Link from "next/link";
import Image from "next/image";
import { Play, Star } from "lucide-react";
import type { MediaItem } from "./media";

export function PosterCard({ item, priority = false }: { item: MediaItem; priority?: boolean }) {
	return (
		<Link className="group block w-40 shrink-0 sm:w-44 lg:w-48" href={item.href}>
			<div className="media-poster relative">
				{item.posterUrl ? (
					<Image alt={item.title} className="object-cover transition duration-500 group-hover:scale-110" fill priority={priority} sizes="(min-width: 1024px) 192px, (min-width: 640px) 176px, 160px" src={item.posterUrl} />
				) : (
					<div className="absolute inset-0 grid place-items-center bg-linear-to-br from-background-elevated to-black p-4 text-center">
						<span className="font-serif text-lg leading-tight text-white">{item.title}</span>
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />
				{item.rating != null && (
					<span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-amber-300 backdrop-blur">
						<Star fill="currentColor" size={11} /> {Number(item.rating).toFixed(1)}
					</span>
				)}
				<div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
					<span className="grid h-12 w-12 place-items-center rounded-full bg-brand-600/95 text-white shadow-[0_8px_30px_rgba(225,29,72,0.45)] transition group-hover:scale-110">
						<Play fill="currentColor" size={20} />
					</span>
				</div>
				<div className="absolute inset-x-0 bottom-0 p-3">
					<p className="truncate text-sm font-semibold text-white">{item.title}</p>
					<p className="mt-1 text-[11px] text-zinc-400">{item.releaseYear ?? "—"} · {item.rating ?? "NR"}</p>
				</div>
			</div>
		</Link>
	);
}
