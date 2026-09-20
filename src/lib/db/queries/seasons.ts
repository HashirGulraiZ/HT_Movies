import { db } from "@/lib/db/mysql";

export type SeasonAdmin = {
	id: number;
	tv_show_id: number;
	season_number: number;
	title: string | null;
	description: string | null;
};

export async function getAdminSeasonsForShow(showId: number): Promise<SeasonAdmin[]> {
	const [rows] = await db.execute(
		`SELECT id, tv_show_id, season_number, title, description FROM seasons WHERE tv_show_id = ? ORDER BY season_number ASC`,
		[showId],
	);
	return rows as SeasonAdmin[];
}

export async function createSeason(input: { tv_show_id: number; season_number: number; title: string | null; description: string | null }): Promise<number> {
	const [result] = await db.execute(
		`INSERT INTO seasons (tv_show_id, season_number, title, description) VALUES (?, ?, ?, ?)`,
		[input.tv_show_id, input.season_number, input.title, input.description],
	);
	return (result as { insertId: number }).insertId;
}

export async function updateSeason(id: number, input: Partial<Omit<SeasonAdmin, "id" | "tv_show_id">>) {
	const allowed = ["season_number", "title", "description"] as const;
	const entries = allowed.filter((key) => input[key] !== undefined).map((key) => [key, input[key]] as const);
	if (!entries.length) return;
	const [values, columns] = [entries.map(([, value]) => value), entries.map(([key]) => `\`${key}\` = ?`)];
	await db.query(`UPDATE seasons SET ${columns.join(", ")} WHERE id = ?`, [...values, id] as Array<string | number | null>);
}

export async function deleteSeason(id: number) {
	await db.execute("DELETE FROM seasons WHERE id = ?", [id]);
}
