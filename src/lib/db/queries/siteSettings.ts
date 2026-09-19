import { db } from "@/lib/db/mysql";

export type SiteSettings = {
	site_name: string;
	site_description: string;
	hero_title: string;
	hero_description: string;
	hero_image_url: string;
	hero_cta_label: string;
	hero_cta_url: string;
	featured_section_title: string;
	featured_section_description: string;
	header_logo_url: string;
	header_favicon_url: string;
	header_navigation: string;
	footer_text: string;
	footer_links: string;
};

export const defaultSiteSettings: SiteSettings = {
	site_name: "HTMovie",
	site_description: "A cinematic home for movies, series, live television, and games.",
	hero_title: "Stories worth staying up for.",
	hero_description: "Find a sharper kind of streaming: celebrated films, addictive series, live channels, and a little room for the unexpected.",
	hero_image_url: "",
	hero_cta_label: "Start watching",
	hero_cta_url: "/movies",
	featured_section_title: "Keep exploring",
	featured_section_description: "Curated for tonight",
	header_logo_url: "",
	header_favicon_url: "",
	header_navigation: "Movies,TV Shows,Genres,Live TV,Games",
	footer_text: "Stories worth staying up for.",
	footer_links: "About|/about",
};

async function ensureSiteSettingsTable() {
	await db.query(`
		CREATE TABLE IF NOT EXISTS site_settings (
			setting_key VARCHAR(100) PRIMARY KEY,
			setting_value TEXT NOT NULL,
			updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		) ENGINE=InnoDB
	`);

	for (const [key, value] of Object.entries(defaultSiteSettings)) {
		await db.query(
			`INSERT INTO site_settings (setting_key, setting_value)
			 VALUES (?, ?)
			 ON DUPLICATE KEY UPDATE setting_key = setting_key`,
			[key, value],
		);
	}
}

export async function getSiteSettings(): Promise<SiteSettings> {
	try {
		await ensureSiteSettingsTable();
		const [rows] = await db.query("SELECT setting_key, setting_value FROM site_settings");
		const values = Object.fromEntries(
			(rows as Array<{ setting_key: string; setting_value: string | null }>).map((row) => [
				row.setting_key,
				row.setting_value ?? "",
			]),
		);
		return { ...defaultSiteSettings, ...values };
	} catch (error) {
		console.error("Site settings query failed", error);
		return defaultSiteSettings;
	}
}

export async function updateSiteSettings(settings: Partial<SiteSettings>) {
	await ensureSiteSettingsTable();
	const connection = await db.getConnection();
	try {
		await connection.beginTransaction();
		for (const [key, value] of Object.entries(settings)) {
			if (!(key in defaultSiteSettings) || typeof value !== "string") continue;
			await connection.execute(
				`INSERT INTO site_settings (setting_key, setting_value)
				 VALUES (?, ?)
				 ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
				[key, value],
			);
		}
		await connection.commit();
	} catch (error) {
		await connection.rollback();
		console.error("Site settings update failed", error);
		throw error;
	} finally {
		connection.release();
	}
}
