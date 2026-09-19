import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getContentSections, saveContentSections } from "@/lib/db/queries/homepage";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	return NextResponse.json({ data: await getContentSections((await context.params).id) });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const body = await request.json();
	if (!Array.isArray(body.sections)) return NextResponse.json({ error: "Sections must be an array" }, { status: 400 });
	try {
		await saveContentSections((await context.params).id, body.sections);
		return NextResponse.json({ data: await getContentSections((await context.params).id) });
	} catch (error) {
		console.error("Page sections update failed", error);
		return NextResponse.json({ error: "Unable to save page sections" }, { status: 500 });
	}
}
