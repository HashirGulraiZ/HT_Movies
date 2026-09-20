import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { deleteTVShow, getAdminTVShowById, updateTVShow } from "@/lib/db/queries/tvShows";

const updateSchema = z.record(z.string(), z.unknown());

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const id = Number((await context.params).id);
	if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid TV show id" }, { status: 400 });
	try {
		const show = await getAdminTVShowById(id);
		if (!show) return NextResponse.json({ error: "TV show not found" }, { status: 404 });
		return NextResponse.json({ data: show });
	} catch (error) {
		console.error("Admin TV show load failed", error);
		return NextResponse.json({ error: "Unable to load TV show" }, { status: 500 });
	}
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const parsed = updateSchema.safeParse(await request.json());
	const id = Number((await context.params).id);
	if (!Number.isInteger(id) || id < 1 || !parsed.success) return NextResponse.json({ error: "Invalid TV show request" }, { status: 400 });
	try {
		await updateTVShow(id, parsed.data);
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("Admin TV show update failed", error);
		return NextResponse.json({ error: "Unable to update TV show" }, { status: 500 });
	}
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const id = Number((await context.params).id);
	if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid TV show id" }, { status: 400 });
	try {
		await deleteTVShow(id);
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("TV show deletion failed", error);
		return NextResponse.json({ error: "Unable to delete TV show" }, { status: 500 });
	}
}
