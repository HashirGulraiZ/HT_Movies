import { db } from "@/lib/db/mysql";
import type { Movie } from "@/types/movie";

export type MovieFilters = {
	search?: string;
	year?: number;
	featured?: boolean;
	limit: number;
	offset: number;
};

export async function getPublishedMovies(filters: MovieFilters): Promise<Movie[]> {
	const conditions = ["status = 'published'"];
	const values: Array<string | number> = [];

	if (filters.search) {
		conditions.push("(title LIKE ? OR description LIKE ?)");
		const search = `%${filters.search}%`;
		values.push(search, search);
	}
	if (filters.year) {
		conditions.push("release_year = ?");
		values.push(filters.year);
	}
	if (filters.featured) {
		conditions.push("featured = 1");
	}

	values.push(filters.limit, filters.offset);
	const [rows] = await db.execute(
		`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url,
			video_url, duration_minutes, release_year, rating, age_rating, status, featured, views
		 FROM movies WHERE ${conditions.join(" AND ")}
		 ORDER BY featured DESC, release_year DESC, created_at DESC
		 LIMIT ? OFFSET ?`,
		values,
	);

	return rows as Movie[];
}
