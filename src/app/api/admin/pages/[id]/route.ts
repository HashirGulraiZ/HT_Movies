import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { deletePage, updatePage } from "@/lib/db/queries/pages";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const id = Number((await context.params).id);
	if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid page id" }, { status: 400 });
	try {
		await updatePage(id, await request.json());
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("Page update failed", error);
		return NextResponse.json({ error: "Unable to update page" }, { status: 500 });
	}
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const id = Number((await context.params).id);
	if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid page id" }, { status: 400 });
	try {
		await deletePage(id);
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("Page deletion failed", error);
		return NextResponse.json({ error: "Unable to delete page" }, { status: 500 });
	}
}
