import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { updateEpisode, deleteEpisode } from "@/lib/db/queries/episodes";

const urlField = z.string().trim().max(2000).or(z.literal("")).nullable().optional();

const updateSchema = z.object({
	season_id: z.coerce.number().int().min(1).optional(),
	episode_number: z.coerce.number().int().min(1).max(5000).optional(),
	title: z.string().trim().min(1).max(255).optional(),
	description: z.string().trim().max(2000).nullable().optional(),
	thumbnail_url: urlField,
	video_url: urlField,
	trailer_url: urlField,
	duration_minutes: z.coerce.number().int().min(0).max(600).nullable().optional(),
	release_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
	status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const id = Number((await context.params).id);
	const parsed = updateSchema.safeParse(await request.json());
	if (!Number.isInteger(id) || id < 1 || !parsed.success) return NextResponse.json({ error: "Invalid episode request" }, { status: 400 });
	try {
		await updateEpisode(id, {
			season_id: parsed.data.season_id,
			episode_number: parsed.data.episode_number,
			title: parsed.data.title,
			description: parsed.data.description ?? undefined,
			thumbnail_url: parsed.data.thumbnail_url,
			video_url: parsed.data.video_url,
			trailer_url: parsed.data.trailer_url,
			duration_minutes: parsed.data.duration_minutes ?? undefined,
			release_date: parsed.data.release_date ?? undefined,
			status: parsed.data.status,
		});
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("Episode update failed", error);
		return NextResponse.json({ error: "Unable to update episode" }, { status: 500 });
	}
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const id = Number((await context.params).id);
	if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid episode id" }, { status: 400 });
	try {
		await deleteEpisode(id);
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("Episode deletion failed", error);
		return NextResponse.json({ error: "Unable to delete episode" }, { status: 500 });
	}
}
