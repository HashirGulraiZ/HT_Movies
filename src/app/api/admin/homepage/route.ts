import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getContentSections, getHomepageBanners, saveContentSections, saveHomepageBanners } from "@/lib/db/queries/homepage";

export async function GET() {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	return NextResponse.json({ sections: await getContentSections(), banners: await getHomepageBanners() });
}

export async function PUT(request: Request) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	try {
		const body = await request.json();
		if (!Array.isArray(body.sections) || !Array.isArray(body.banners)) {
			return NextResponse.json({ error: "Sections and banners must be arrays" }, { status: 400 });
		}
		await saveContentSections("home", body.sections);
		await saveHomepageBanners(body.banners);
		return NextResponse.json({ sections: await getContentSections(), banners: await getHomepageBanners() });
	} catch (error) {
		console.error("Homepage CMS update failed", error);
		return NextResponse.json({ error: "Unable to save homepage content" }, { status: 500 });
	}
}
