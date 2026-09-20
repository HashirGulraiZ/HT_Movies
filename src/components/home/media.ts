import type { Movie } from "@/types/movie";
import type { TVShow } from "@/types/tvShow";

export type MediaItem = {
	id: number;
	title: string;
	href: string;
	posterUrl: string | null;
	backdropUrl: string | null;
	rating: number | string | null;
	releaseYear: number | null;
};

export function movieToMediaItem(movie: Movie): MediaItem {
	return {
		id: movie.id,
		title: movie.title,
		href: `/movies/${movie.slug}`,
		posterUrl: movie.poster_url,
		backdropUrl: movie.backdrop_url,
		rating: movie.rating,
		releaseYear: movie.release_year,
	};
}

export function tvShowToMediaItem(show: TVShow): MediaItem {
	return {
		id: show.id,
		title: show.title,
		href: `/tv-shows/${show.slug}`,
		posterUrl: show.poster_url,
		backdropUrl: show.backdrop_url,
		rating: show.rating,
		releaseYear: show.release_year,
	};
}
