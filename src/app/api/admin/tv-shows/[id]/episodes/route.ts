import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getAdminEpisodesForShow, createEpisode } from "@/lib/db/queries/episodes";
import { getAdminSeasonsForShow } from "@/lib/db/queries/seasons";

const urlField = z.string().trim().max(2000).or(z.literal("")).nullable().optional();

const createSchema = z.object({
	season_id: z.coerce.number().int().min(1),
	episode_number: z.coerce.number().int().min(1).max(5000),
	title: z.string().trim().min(1).max(255),
	description: z.string().trim().max(2000).nullable().optional(),
	thumbnail_url: urlField,
	video_url: urlField,
	trailer_url: urlField,
	duration_minutes: z.coerce.number().int().min(0).max(600).nullable().optional(),
	release_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
	status: z.enum(["draft", "published", "archived"]).default("published"),
});

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const showId = Number((await context.params).id);
	if (!Number.isInteger(showId) || showId < 1) return NextResponse.json({ error: "Invalid TV show id" }, { status: 400 });
	return NextResponse.json({ data: await getAdminEpisodesForShow(showId) });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const showId = Number((await context.params).id);
	const parsed = createSchema.safeParse(await request.json());
	if (!Number.isInteger(showId) || showId < 1 || !parsed.success) return NextResponse.json({ error: "Invalid episode data" }, { status: 400 });
	const seasons = await getAdminSeasonsForShow(showId);
	if (!seasons.some((season) => season.id === parsed.data.season_id)) return NextResponse.json({ error: "Season does not belong to this TV show" }, { status: 400 });
	try {
		const id = await createEpisode({
			season_id: parsed.data.season_id,
			episode_number: parsed.data.episode_number,
			title: parsed.data.title,
			description: parsed.data.description || null,
			thumbnail_url: parsed.data.thumbnail_url || null,
			video_url: parsed.data.video_url || null,
			trailer_url: parsed.data.trailer_url || null,
			duration_minutes: parsed.data.duration_minutes ?? null,
			release_date: parsed.data.release_date || null,
			status: parsed.data.status,
		});
		return NextResponse.json({ id }, { status: 201 });
	} catch (error) {
		console.error("Episode creation failed", error);
		return NextResponse.json({ error: "Unable to create episode" }, { status: 500 });
	}
}
