import { db } from "./mysql";

/**
 * Runtime guard that adds the detail-page columns (director, cast_members,
 * quality, likes) to movies and tv_shows when they are missing. Cached per
 * server process so the information_schema check only runs once.
 */
let ensured: Promise<void> | null = null;

async function columnExists(table: string, column: string): Promise<boolean> {
	const [rows] = await db.query(
		`SELECT COUNT(*) AS count FROM information_schema.COLUMNS
		 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
		[table, column],
	);
	return ((rows as Array<{ count: number }>)[0]?.count ?? 0) > 0;
}

async function addColumnIfMissing(table: string, column: string, definition: string) {
	if (!(await columnExists(table, column))) {
		await db.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
	}
}

async function ensure(): Promise<void> {
	const detailColumns: Array<[string, string]> = [
		["director", "VARCHAR(255) NULL"],
		["cast_members", "TEXT NULL"],
		["quality", "VARCHAR(50) NULL"],
	];
	for (const table of ["movies", "tv_shows"]) {
		for (const [column, definition] of detailColumns) {
			await addColumnIfMissing(table, column, definition);
		}
		await addColumnIfMissing(table, "likes", "INT UNSIGNED NOT NULL DEFAULT 0");
	}
}

export function ensureDetailColumns(): Promise<void> {
	ensured ??= ensure().catch((error) => {
		ensured = null;
		throw error;
	});
	return ensured;
}
