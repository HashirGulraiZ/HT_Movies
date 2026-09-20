import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getContentSections, getHomepageBanners, saveContentSections, saveHomepageBanners } from "@/lib/db/queries/homepage";
import { z } from "zod";

const sectionSchema = z.object({
	id: z.number().optional(),
	section_type: z.enum(["hero", "media_row", "rich_text", "spacer"]),
	title: z.string().max(255),
	content: z.string().max(20000),
	enabled: z.union([z.boolean(), z.number()]),
});
const bannerSchema = z.object({
	id: z.number().optional(),
	title: z.string().max(255),
	slug: z.string().max(280),
	description: z.string().max(20000).nullable(),
	image_url: z.string().max(2000),
	cta_label: z.string().max(80),
	status: z.enum(["draft", "published"]),
	movie_id: z.number().nullable(),
});

export async function GET() {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	return NextResponse.json({ sections: await getContentSections(), banners: await getHomepageBanners() });
}

export async function PUT(request: Request) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	try {
		const parsed = z.object({ sections: z.array(sectionSchema).max(100), banners: z.array(bannerSchema).max(100) }).safeParse(await request.json());
		if (!parsed.success) return NextResponse.json({ error: "Invalid homepage content", details: parsed.error.flatten() }, { status: 400 });
		await saveContentSections("home", parsed.data.sections.map((section) => ({ ...section, enabled: Boolean(section.enabled) ? 1 : 0 })));
		await saveHomepageBanners(parsed.data.banners);
		return NextResponse.json({ sections: await getContentSections(), banners: await getHomepageBanners() });
	} catch (error) {
		console.error("Homepage CMS update failed", error);
		return NextResponse.json({ error: "Unable to save homepage content" }, { status: 500 });
	}
}
