import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { updateSeason, deleteSeason } from "@/lib/db/queries/seasons";

const updateSchema = z.object({
	season_number: z.coerce.number().int().min(1).max(500).optional(),
	title: z.string().trim().max(255).nullable().optional(),
	description: z.string().trim().max(2000).nullable().optional(),
});

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const id = Number((await context.params).id);
	const parsed = updateSchema.safeParse(await request.json());
	if (!Number.isInteger(id) || id < 1 || !parsed.success) return NextResponse.json({ error: "Invalid season request" }, { status: 400 });
	try {
		await updateSeason(id, {
			season_number: parsed.data.season_number,
			title: parsed.data.title ?? undefined,
			description: parsed.data.description ?? undefined,
		});
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("Season update failed", error);
		return NextResponse.json({ error: "Unable to update season" }, { status: 500 });
	}
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const id = Number((await context.params).id);
	if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid season id" }, { status: 400 });
	try {
		await deleteSeason(id);
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("Season deletion failed", error);
		return NextResponse.json({ error: "Unable to delete season" }, { status: 500 });
	}
}
