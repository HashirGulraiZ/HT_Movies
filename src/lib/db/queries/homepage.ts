import { db } from "@/lib/db/mysql";

export type HomepageBanner = {
	id: number;
	title: string;
	slug: string;
	description: string | null;
	image_url: string;
	cta_label: string;
	display_order: number;
	status: "draft" | "published";
	movie_id: number | null;
};

export type ContentSection = {
	id: number;
	page_key: string;
	section_type: "hero" | "media_row" | "rich_text" | "spacer";
	title: string;
	content: string;
	display_order: number;
	enabled: number;
};

export async function getPublishedHomepageBanners() {
	const [rows] = await db.query(
		`SELECT id, title, slug, description, image_url, cta_label, display_order, status, movie_id
		 FROM homepage_banners WHERE status = 'published' ORDER BY display_order ASC, id ASC`,
	);
	return rows as HomepageBanner[];
}

export async function getHomepageBanners() {
	const [rows] = await db.query(
		`SELECT id, title, slug, description, image_url, cta_label, display_order, status, movie_id
		 FROM homepage_banners ORDER BY display_order ASC, id ASC`,
	);
	return rows as HomepageBanner[];
}

export async function getContentSections(pageKey = "home") {
	const [rows] = await db.query(
		`SELECT id, page_key, section_type, title, content, display_order, enabled
		 FROM content_sections WHERE page_key = ? ORDER BY display_order ASC, id ASC`,
		[pageKey],
	);
	return rows as ContentSection[];
}

export async function getPublicContentSections(pageKey: string) {
	const sections = await getContentSections(pageKey);
	return sections.filter((section) => section.enabled);
}

export async function saveContentSections(pageKey: string, sections: Array<Partial<ContentSection>>) {
	const connection = await db.getConnection();
	try {
		await connection.beginTransaction();
		await connection.execute("DELETE FROM content_sections WHERE page_key = ?", [pageKey]);
		for (const [index, section] of sections.entries()) {
			await connection.execute(
				`INSERT INTO content_sections
				 (page_key, section_type, title, content, display_order, enabled)
				 VALUES (?, ?, ?, ?, ?, ?)`,
				[
					pageKey,
					section.section_type ?? "rich_text",
					section.title ?? "",
					section.content ?? "",
					index,
					section.enabled === undefined ? 1 : section.enabled ? 1 : 0,
				],
			);
		}
		await connection.commit();
	} catch (error) {
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
}

export async function saveHomepageBanners(banners: Array<Partial<HomepageBanner>>) {
	const connection = await db.getConnection();
	try {
		await connection.beginTransaction();
		await connection.execute("DELETE FROM homepage_banners");
		for (const [index, banner] of banners.entries()) {
			await connection.execute(
				`INSERT INTO homepage_banners
				 (title, slug, description, image_url, cta_label, display_order, status, movie_id)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					banner.title ?? "",
					banner.slug ?? "",
					banner.description ?? null,
					banner.image_url ?? "",
					banner.cta_label ?? "Watch now",
					index,
					banner.status ?? "draft",
					banner.movie_id ?? null,
				],
			);
		}
		await connection.commit();
	} catch (error) {
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
}
