import { db } from "@/lib/db/mysql";

export type GenreSummary = { id: number; name: string; slug: string };

export async function getGenresForMovie(movieId: number): Promise<GenreSummary[]> {
	const [rows] = await db.execute(
		`SELECT g.id, g.name, g.slug FROM genres g INNER JOIN movie_genres mg ON mg.genre_id = g.id WHERE mg.movie_id = ? ORDER BY g.name ASC`,
		[movieId],
	);
	return rows as GenreSummary[];
}

export async function getGenresForTVShow(showId: number): Promise<GenreSummary[]> {
	const [rows] = await db.execute(
		`SELECT g.id, g.name, g.slug FROM genres g INNER JOIN tv_show_genres tsg ON tsg.genre_id = g.id WHERE tsg.tv_show_id = ? ORDER BY g.name ASC`,
		[showId],
	);
	return rows as GenreSummary[];
}

export type GenreWithCount = GenreSummary & { movie_count: number };

export async function getGenresWithMovieCounts(limit = 10): Promise<GenreWithCount[]> {
	const [rows] = await db.query(
		`SELECT g.id, g.name, g.slug, COUNT(mg.movie_id) AS movie_count
		 FROM genres g LEFT JOIN movie_genres mg ON mg.genre_id = g.id
		 GROUP BY g.id, g.name, g.slug
		 ORDER BY movie_count DESC, g.name ASC
		 LIMIT ?`,
		[limit],
	);
	return rows as GenreWithCount[];
}

