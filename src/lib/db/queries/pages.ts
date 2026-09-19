import { db } from "@/lib/db/mysql";

export type CMSPage = {
	id: number;
	title: string;
	slug: string;
	description: string | null;
	status: "draft" | "published";
};

export async function getPages() {
	const [rows] = await db.query("SELECT id, title, slug, description, status FROM cms_pages ORDER BY title ASC");
	return rows as CMSPage[];
}

export async function getPageBySlug(slug: string, publishedOnly = false) {
	const [rows] = await db.execute(
		`SELECT id, title, slug, description, status FROM cms_pages
		 WHERE slug = ? ${publishedOnly ? "AND status = 'published'" : ""} LIMIT 1`,
		[slug],
	);
	return ((rows as CMSPage[])[0] ?? null);
}

export async function createPage(input: Pick<CMSPage, "title" | "slug" | "description" | "status">) {
	const [result] = await db.execute(
		"INSERT INTO cms_pages (title, slug, description, status) VALUES (?, ?, ?, ?)",
		[input.title, input.slug, input.description, input.status],
	);
	return (result as { insertId: number }).insertId;
}

export async function updatePage(id: number, input: Partial<Pick<CMSPage, "title" | "slug" | "description" | "status">>) {
	const entries = Object.entries(input).filter(([, value]) => value !== undefined);
	if (!entries.length) return;
	await db.query(
		`UPDATE cms_pages SET ${entries.map(([key]) => `\`${key}\` = ?`).join(", ")} WHERE id = ?`,
		[...entries.map(([, value]) => value), id] as Array<string | number | null>,
	);
}

export async function deletePage(id: number) {
	await db.execute("DELETE FROM cms_pages WHERE id = ? AND slug <> 'home'", [id]);
}
