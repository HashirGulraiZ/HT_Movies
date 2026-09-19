import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { deleteTVShow } from "@/lib/db/queries/tvShows";

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const id = Number((await context.params).id);
	if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid TV show id" }, { status: 400 });
	try { await deleteTVShow(id); return NextResponse.json({ ok: true }); }
	catch (error) { console.error("TV show deletion failed", error); return NextResponse.json({ error: "Unable to delete TV show" }, { status: 500 }); }
}
