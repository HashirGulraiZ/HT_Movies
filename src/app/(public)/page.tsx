import { getPublishedMovies } from "@/lib/db/queries/movies";
import { getPublishedTVShows } from "@/lib/db/queries/tvShows";
import { getSiteSettings } from "@/lib/db/queries/siteSettings";
import { getContentSections, getPublishedHomepageBanners } from "@/lib/db/queries/homepage";
import { HomeBannerSlider } from "@/components/hero/HomeBannerSlider";
import { ContentSectionRenderer } from "@/components/cms/ContentSectionRenderer";
import { ContinueWatchingRow } from "@/components/home/ContinueWatchingRow";
import { MediaRow } from "@/components/home/MediaRow";
import { movieToMediaItem, tvShowToMediaItem } from "@/components/home/media";
import type { ContentSection, HomepageBanner } from "@/lib/db/queries/homepage";
import type { Movie } from "@/types/movie";
import type { TVShow } from "@/types/tvShow";

export const dynamic = "force-dynamic";

export default async function HomePage() {
	const settings = await getSiteSettings();
	let movies: Movie[] = [];
	let shows: TVShow[] = [];
	let banners: HomepageBanner[] = [];
	let sections: ContentSection[] = [];
	try {
		movies = await getPublishedMovies({ featured: true, limit: 12, offset: 0 });
		if (!movies.length) movies = await getPublishedMovies({ limit: 12, offset: 0 });
		banners = await getPublishedHomepageBanners();
		sections = await getContentSections();
		try {
			shows = await getPublishedTVShows(12);
		} catch (error) {
			console.error("TV show catalog query failed", error);
		}
	} catch (error) {
		console.error("Homepage catalog query failed", error);
	}

	const byViews = [...movies].sort((a, b) => b.views - a.views);
	const trendingItems = movies.map((movie, index) => ({
		...movieToMediaItem(movie),
		rank: index + 1,
		badge: index % 3 === 0 ? "Recently added" : null,
	}));
	const popularItems = byViews.map((movie, index) => ({
		...movieToMediaItem(movie),
		rank: index + 1,
		badge: index === 0 ? "Recently added" : null,
	}));
	const showItems = shows.map((show, index) => ({
		...tvShowToMediaItem(show),
		rank: index + 1,
		badge: index === 0 ? "New Episode" : null,
	}));

	return (
		<main className="bg-[#0b0b0f]">
			{banners.length > 0 ? <HomeBannerSlider banners={banners} /> : null}
			<ContinueWatchingRow />
			<MediaRow exploreHref="/movies" items={trendingItems} priority title="Trending Now" />
			<MediaRow exploreHref="/movies" items={popularItems} title="Popular Movies" />
			<MediaRow exploreHref="/tv-shows" items={showItems} title="Popular TV Shows" />
			{sections.filter((section) => section.enabled).map((section) => (
				<div className="px-4 sm:px-6 lg:px-10" key={section.id}>
					<ContentSectionRenderer movies={movies} section={section} />
				</div>
			))}
			<p className="px-4 pb-10 pt-4 text-sm text-zinc-500 sm:px-6 lg:px-10">{settings.site_description}</p>
		</main>
	);
}


