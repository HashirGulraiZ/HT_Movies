import { NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/db/queries/siteSettings";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET() {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	return NextResponse.json({ data: await getSiteSettings() });
}

export async function PUT(request: Request) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	try {
		await updateSiteSettings(await request.json());
		return NextResponse.json({ data: await getSiteSettings() });
	} catch (error) {
		console.error("Admin settings update failed", error);
		return NextResponse.json({ error: "Unable to update settings" }, { status: 500 });
	}
}
