import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { MediaItem } from "./media";
import { BackdropCard } from "./BackdropCard";

export type MediaRowProps = {
	title: string;
	items: Array<MediaItem & { badge?: string | null; badgeHref?: string; rank?: number }>;
	exploreHref?: string;
	priority?: boolean;
};

export function MediaRow({ title, items, exploreHref, priority = false }: MediaRowProps) {
	if (!items.length) return null;
	return (
		<section className="section-sm !py-5 sm:!py-6">
			<div className="mb-3 flex items-baseline justify-between gap-4 px-4 sm:px-6 lg:px-10">
				<div className="flex items-baseline gap-3">
					<h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
					{exploreHref && (
						<Link className="inline-flex items-center gap-0.5 text-sm font-semibold text-sky-400 transition hover:text-sky-300" href={exploreHref}>
							Explore All <ChevronRight size={15} />
						</Link>
					)}
				</div>
				<div aria-hidden="true" className="hidden gap-1.5 md:flex">
					{items.slice(0, 4).map((item, index) => (
						<span className={`h-0.5 w-5 rounded-full ${index === 0 ? "bg-white" : "bg-white/30"}`} key={item.id} />
					))}
				</div>
				{exploreHref && (
					<Link className="text-sm font-semibold text-sky-400 md:hidden" href={exploreHref}>Explore All</Link>
				)}
			</div>
			<div className="scrollbar-hide flex snap-x gap-2.5 overflow-x-auto px-4 pb-2 sm:gap-3 sm:px-6 lg:px-10">
				{items.map((item, index) => (
					<div className="snap-start" key={item.id}>
						<BackdropCard badge={item.badge} item={item} priority={priority && index < 4} rank={item.rank} />
					</div>
				))}
			</div>
		</section>
	);
}
