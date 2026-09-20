import { db } from "@/lib/db/mysql";
import type { Movie } from "@/types/movie";
import { ensureDetailColumns } from "@/lib/db/ensureColumns";

export type MovieFilters = {
	search?: string;
	year?: number;
	featured?: boolean;
	limit: number;
	offset: number;
};

export function normalizeMovieSlug(slug: string): string {
	return slug.trim().replace(/^\/+/, "").replace(/^movies\//i, "");
}

function normalizeMovieRows(rows: Movie[]): Movie[] {
	return rows.map((movie) => ({ ...movie, slug: normalizeMovieSlug(movie.slug) }));
}

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

	return normalizeMovieRows(rows as Movie[]);
}

export async function getPublishedMovieBySlug(slug: string): Promise<Movie | null> {
	await ensureDetailColumns();
	const normalizedSlug = normalizeMovieSlug(slug);
	const [rows] = await db.execute(
		`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url,
			video_url, duration_minutes, release_year, rating, age_rating, director, cast_members, quality, status, featured, views, likes
		 FROM movies WHERE slug IN (?, ?) AND status = 'published' LIMIT 1`,
		[normalizedSlug, `movies/${normalizedSlug}`],
	);
	return normalizeMovieRows(rows as Movie[])[0] ?? null;
}

export async function getPublishedMovieById(id: number): Promise<Movie | null> {
	const [rows] = await db.execute(
		`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url,
			video_url, duration_minutes, release_year, rating, age_rating, status, featured, views
		 FROM movies WHERE id = ? AND status = 'published' LIMIT 1`,
		[id],
	);
	return normalizeMovieRows(rows as Movie[])[0] ?? null;
}

export async function getAdminMovies(): Promise<Movie[]> {
	const [rows] = await db.query(
		`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url,
			video_url, duration_minutes, release_year, rating, age_rating, status, featured, views
		 FROM movies ORDER BY created_at DESC`,
	);
	return normalizeMovieRows(rows as Movie[]);
}

export async function getAdminMovieById(id: number): Promise<Movie | null> {
	await ensureDetailColumns();
	const [rows] = await db.execute(
		`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url,
			video_url, duration_minutes, release_year, rating, age_rating, director, cast_members, quality, status, featured, views, likes
		 FROM movies WHERE id = ? LIMIT 1`,
		[id],
	);
	return normalizeMovieRows(rows as Movie[])[0] ?? null;
}

export type MovieInput = Omit<Movie, "id" | "views" | "featured" | "likes"> & { featured: boolean; likes?: number };


export async function createMovie(input: MovieInput) {
	await ensureDetailColumns();
	const [result] = await db.execute(
		`INSERT INTO movies
			(title, slug, description, poster_url, backdrop_url, trailer_url, video_url,
			 duration_minutes, release_year, rating, age_rating, director, cast_members, quality, status, featured)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			input.title,
			normalizeMovieSlug(input.slug),
			input.description,
			input.poster_url,
			input.backdrop_url,
			input.trailer_url,
			input.video_url,
			input.duration_minutes,
			input.release_year,
			input.rating,
			input.age_rating,
			input.director ?? null,
			input.cast_members ?? null,
			input.quality ?? null,
			input.status,
			input.featured ? 1 : 0,
		],
	);
	return (result as { insertId: number }).insertId;
}

export async function updateMovie(id: number, input: Partial<MovieInput> & { likes?: number }) {
	await ensureDetailColumns();
	const allowed = [
		"title", "slug", "description", "poster_url", "backdrop_url", "trailer_url",
		"video_url", "duration_minutes", "release_year", "rating", "age_rating",
		"director", "cast_members", "quality", "status", "featured", "likes",
	] as const;
	const entries = allowed
		.filter((key) => input[key] !== undefined)
		.map((key) => {
			const value = key === "slug" && typeof input[key] === "string" ? normalizeMovieSlug(input[key]) : input[key];
			return [key, typeof value === "boolean" ? (value ? 1 : 0) : value] as const;
		});
	if (!entries.length) return;

	const [values, columns] = [entries.map(([, value]) => value), entries.map(([key]) => `\`${key}\` = ?`)];
	await db.query(`UPDATE movies SET ${columns.join(", ")} WHERE id = ?`, [...values, id] as Array<string | number | null | boolean>);
}

export async function deleteMovie(id: number) {
	await db.execute("DELETE FROM movies WHERE id = ?", [id]);
}
