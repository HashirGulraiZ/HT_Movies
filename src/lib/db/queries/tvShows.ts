import { db } from "@/lib/db/mysql";
import type { TVShow } from "@/types/tvShow";
import { ensureDetailColumns } from "@/lib/db/ensureColumns";

export async function getPublishedTVShows(limit = 48) {
	const [rows] = await db.query(`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url, release_year, rating, age_rating, status, featured, views FROM tv_shows WHERE status = 'published' ORDER BY featured DESC, release_year DESC, created_at DESC LIMIT ?`, [limit]);
	return rows as TVShow[];
}
export async function getAdminTVShows() {
	const [rows] = await db.query(`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url, release_year, rating, age_rating, status, featured, views FROM tv_shows ORDER BY created_at DESC`);
	return rows as TVShow[];
}
export async function getPublishedTVShowBySlug(slug: string) {
	await ensureDetailColumns();
	const [rows] = await db.execute(`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url, release_year, rating, age_rating, director, cast_members, quality, status, featured, views, likes FROM tv_shows WHERE slug = ? AND status = 'published' LIMIT 1`, [slug]);
	return ((rows as TVShow[])[0] ?? null);
}
export async function createTVShow(input: Omit<TVShow, "id" | "views" | "featured" | "likes"> & { featured: boolean; likes?: number }) {
	await ensureDetailColumns();
	const [result] = await db.execute(`INSERT INTO tv_shows (title, slug, description, poster_url, backdrop_url, trailer_url, release_year, rating, age_rating, director, cast_members, quality, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [input.title, input.slug, input.description, input.poster_url, input.backdrop_url, input.trailer_url, input.release_year, input.rating, input.age_rating, input.director ?? null, input.cast_members ?? null, input.quality ?? null, input.status, input.featured ? 1 : 0]);
	return (result as { insertId: number }).insertId;
}
export async function getAdminTVShowById(id: number) {
	await ensureDetailColumns();
	const [rows] = await db.execute(`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url, release_year, rating, age_rating, director, cast_members, quality, status, featured, views, likes FROM tv_shows WHERE id = ? LIMIT 1`, [id]);
	return ((rows as TVShow[])[0] ?? null);
}
export async function updateTVShow(id: number, input: Partial<Omit<TVShow, "id" | "views">>) {
	await ensureDetailColumns();
	const allowed = [
		"title", "slug", "description", "poster_url", "backdrop_url", "trailer_url",
		"release_year", "rating", "age_rating", "director", "cast_members", "quality",
		"status", "featured", "likes",
	] as const;
	const entries = allowed
		.filter((key) => input[key] !== undefined)
		.map((key) => {
			const value = input[key];
			return [key, typeof value === "boolean" ? (value ? 1 : 0) : value] as const;
		});
	if (!entries.length) return;
	const [values, columns] = [entries.map(([, value]) => value), entries.map(([key]) => `\`${key}\` = ?`)];
	await db.query(`UPDATE tv_shows SET ${columns.join(", ")} WHERE id = ?`, [...values, id] as Array<string | number | null>);
}
export async function deleteTVShow(id: number) {
	await db.execute("DELETE FROM tv_shows WHERE id = ?", [id]);
}