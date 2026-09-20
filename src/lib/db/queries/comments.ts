import { db } from "@/lib/db/mysql";

export type CommentRow = {
	id: number;
	name: string;
	website: string | null;
	body: string;
	created_at: string | Date;
};

let tablesEnsured = false;

async function ensureCommentsTable() {
	if (tablesEnsured) return;
	tablesEnsured = true;
	await db.query(`
		CREATE TABLE IF NOT EXISTS comments (
			id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			content_type ENUM('movie', 'tv_show') NOT NULL,
			content_id BIGINT UNSIGNED NOT NULL,
			name VARCHAR(120) NOT NULL,
			email VARCHAR(255) NOT NULL,
			website VARCHAR(500) NULL,
			body TEXT NOT NULL,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			INDEX idx_comment_content (content_type, content_id)
		) ENGINE=InnoDB
	`);
}

export async function getCommentsForContent(contentType: "movie" | "tv_show", contentId: number, limit = 50): Promise<CommentRow[]> {
	await ensureCommentsTable();
	const [rows] = await db.execute(
		`SELECT id, name, website, body, created_at FROM comments WHERE content_type = ? AND content_id = ? ORDER BY created_at DESC LIMIT ?`,
		[contentType, contentId, limit],
	);
	return rows as CommentRow[];
}

export async function addComment(input: { content_type: "movie" | "tv_show"; content_id: number; name: string; email: string; website: string | null; body: string }): Promise<number> {
	await ensureCommentsTable();
	const [result] = await db.execute(
		`INSERT INTO comments (content_type, content_id, name, email, website, body) VALUES (?, ?, ?, ?, ?, ?)`,
		[input.content_type, input.content_id, input.name, input.email, input.website, input.body],
	);
	return (result as { insertId: number }).insertId;
}
