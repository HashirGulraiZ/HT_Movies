import { db } from "@/lib/db/mysql";

export type SeasonSummary = { id: number; season_number: number; title: string | null };
export type EpisodeSummary = {
	id: number;
	season_id: number;
	episode_number: number;
	title: string;
	description: string | null;
	thumbnail_url: string | null;
	video_url: string | null;
	duration_minutes: number | null;
};

export async function getPublishedSeasonsForShow(showId: number): Promise<SeasonSummary[]> {
	const [rows] = await db.execute(`SELECT id, season_number, title FROM seasons WHERE tv_show_id = ? ORDER BY season_number ASC`, [showId]);
	return rows as SeasonSummary[];
}

export async function getPublishedEpisodesForShow(showId: number): Promise<EpisodeSummary[]> {
	const [rows] = await db.execute(
		`SELECT e.id, e.season_id, e.episode_number, e.title, e.description, e.thumbnail_url, e.video_url, e.duration_minutes
		 FROM episodes e INNER JOIN seasons s ON s.id = e.season_id
		 WHERE s.tv_show_id = ? AND e.status = 'published'
		 ORDER BY s.season_number ASC, e.episode_number ASC`,
		[showId],
	);
	return rows as EpisodeSummary[];
}

export type EpisodeAdmin = {
	id: number;
	season_id: number;
	episode_number: number;
	title: string;
	description: string | null;
	thumbnail_url: string | null;
	video_url: string | null;
	trailer_url: string | null;
	duration_minutes: number | null;
	release_date: string | null;
	status: "draft" | "published" | "archived";
	views: number;
};

const EPISODE_SELECT = `
	SELECT e.id, e.season_id, e.episode_number, e.title, e.description, e.thumbnail_url,
		e.video_url, e.trailer_url, e.duration_minutes, e.release_date, e.status, e.views
	FROM episodes e INNER JOIN seasons s ON s.id = e.season_id`;

export async function getAdminEpisodesForShow(showId: number): Promise<EpisodeAdmin[]> {
	const [rows] = await db.execute(
		`${EPISODE_SELECT} WHERE s.tv_show_id = ? ORDER BY s.season_number ASC, e.episode_number ASC`,
		[showId],
	);
	return rows as EpisodeAdmin[];
}

export async function createEpisode(input: Omit<EpisodeAdmin, "id" | "views">): Promise<number> {
	const [result] = await db.execute(
		`INSERT INTO episodes (season_id, episode_number, title, description, thumbnail_url, video_url, trailer_url, duration_minutes, release_date, status)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			input.season_id,
			input.episode_number,
			input.title,
			input.description,
			input.thumbnail_url,
			input.video_url,
			input.trailer_url,
			input.duration_minutes,
			input.release_date,
			input.status,
		],
	);
	return (result as { insertId: number }).insertId;
}

export async function updateEpisode(id: number, input: Partial<Omit<EpisodeAdmin, "id" | "views">>) {
	const allowed = [
		"season_id", "episode_number", "title", "description", "thumbnail_url",
		"video_url", "trailer_url", "duration_minutes", "release_date", "status",
	] as const;
	const entries = allowed.filter((key) => input[key] !== undefined).map((key) => [key, input[key]] as const);
	if (!entries.length) return;
	const [values, columns] = [entries.map(([, value]) => value), entries.map(([key]) => `\`${key}\` = ?`)];
	await db.query(`UPDATE episodes SET ${columns.join(", ")} WHERE id = ?`, [...values, id] as Array<string | number | null>);
}

export async function deleteEpisode(id: number) {
	await db.execute("DELETE FROM episodes WHERE id = ?", [id]);
}

