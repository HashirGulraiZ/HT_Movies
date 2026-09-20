import { db } from "@/lib/db/mysql";

export type WatchHistoryRow = {
	id: number;
	user_id: number;
	content_type: "movie" | "episode";
	content_id: number;
	progress_seconds: number;
	duration_seconds: number;
	completed: number;
	last_watched_at: string;
	title: string | null;
	slug: string | null;
	backdrop_url: string | null;
	poster_url: string | null;
};

export async function getWatchHistory(userId: number, limit = 20): Promise<WatchHistoryRow[]> {
	const [rows] = await db.query(
		`SELECT wh.id, wh.user_id, wh.content_type, wh.content_id, wh.progress_seconds,
			wh.duration_seconds, wh.completed, wh.last_watched_at,
			COALESCE(m.title, e.title) AS title,
			m.slug AS slug,
			COALESCE(m.backdrop_url, e.thumbnail_url) AS backdrop_url,
			m.poster_url AS poster_url
		 FROM watch_history wh
		 LEFT JOIN movies m ON wh.content_type = 'movie' AND m.id = wh.content_id
		 LEFT JOIN episodes e ON wh.content_type = 'episode' AND e.id = wh.content_id
		 WHERE wh.user_id = ?
		 ORDER BY wh.last_watched_at DESC
		 LIMIT ?`,
		[userId, limit],
	);
	return rows as WatchHistoryRow[];
}

