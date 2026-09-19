import { db } from "@/lib/db/mysql";
import type { TVShow } from "@/types/tvShow";

export async function getPublishedTVShows(limit = 48) {
	const [rows] = await db.query(`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url, release_year, rating, age_rating, status, featured, views FROM tv_shows WHERE status = 'published' ORDER BY featured DESC, release_year DESC, created_at DESC LIMIT ?`, [limit]);
	return rows as TVShow[];
}
export async function getAdminTVShows() {
	const [rows] = await db.query(`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url, release_year, rating, age_rating, status, featured, views FROM tv_shows ORDER BY created_at DESC`);
	return rows as TVShow[];
}
export async function getPublishedTVShowBySlug(slug: string) {
	const [rows] = await db.execute(`SELECT id, title, slug, description, poster_url, backdrop_url, trailer_url, release_year, rating, age_rating, status, featured, views FROM tv_shows WHERE slug = ? AND status = 'published' LIMIT 1`, [slug]);
	return ((rows as TVShow[])[0] ?? null);
}
export async function createTVShow(input: Omit<TVShow, "id" | "views" | "featured"> & { featured: boolean }) {
	const [result] = await db.execute(`INSERT INTO tv_shows (title, slug, description, poster_url, backdrop_url, trailer_url, release_year, rating, age_rating, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [input.title, input.slug, input.description, input.poster_url, input.backdrop_url, input.trailer_url, input.release_year, input.rating, input.age_rating, input.status, input.featured ? 1 : 0]);
	return (result as { insertId: number }).insertId;
}
export async function deleteTVShow(id: number) {
	await db.execute("DELETE FROM tv_shows WHERE id = ?", [id]);
}