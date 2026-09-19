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

export async function getPublishedMovieBySlug(slug: string): Promise<Movie | null> {
	const [rows] = await db.execute(
		`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url,
			video_url, duration_minutes, release_year, rating, age_rating, status, featured, views
		 FROM movies WHERE slug = ? AND status = 'published' LIMIT 1`,
		[slug],
	);
	return ((rows as Movie[])[0] ?? null);
}

export async function getPublishedMovieById(id: number): Promise<Movie | null> {
	const [rows] = await db.execute(
		`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url,
			video_url, duration_minutes, release_year, rating, age_rating, status, featured, views
		 FROM movies WHERE id = ? AND status = 'published' LIMIT 1`,
		[id],
	);
	return ((rows as Movie[])[0] ?? null);
}

export async function getAdminMovies(): Promise<Movie[]> {
	const [rows] = await db.query(
		`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url,
			video_url, duration_minutes, release_year, rating, age_rating, status, featured, views
		 FROM movies ORDER BY created_at DESC`,
	);
	return rows as Movie[];
}

export type MovieInput = Omit<Movie, "id" | "views" | "featured"> & { featured: boolean };

export async function createMovie(input: MovieInput) {
	const [result] = await db.execute(
		`INSERT INTO movies
			(title, slug, description, poster_url, backdrop_url, trailer_url, video_url,
			 duration_minutes, release_year, rating, age_rating, status, featured)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			input.title,
			input.slug,
			input.description,
			input.poster_url,
			input.backdrop_url,
			input.trailer_url,
			input.video_url,
			input.duration_minutes,
			input.release_year,
			input.rating,
			input.age_rating,
			input.status,
			input.featured ? 1 : 0,
		],
	);
	return (result as { insertId: number }).insertId;
}

export async function updateMovie(id: number, input: Partial<MovieInput>) {
	const allowed = [
		"title", "slug", "description", "poster_url", "backdrop_url", "trailer_url",
		"video_url", "duration_minutes", "release_year", "rating", "age_rating", "status", "featured",
	] as const;
	const entries = allowed.filter((key) => input[key] !== undefined).map((key) => [key, input[key]] as const);
	if (!entries.length) return;
	const [values, columns] = [entries.map(([, value]) => value), entries.map(([key]) => `\`${key}\` = ?`)];
	await db.query(`UPDATE movies SET ${columns.join(", ")} WHERE id = ?`, [...values, id] as Array<string | number | null | boolean>);
}

export async function deleteMovie(id: number) {
	await db.execute("DELETE FROM movies WHERE id = ?", [id]);
}
