import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getAdminSeasonsForShow, createSeason } from "@/lib/db/queries/seasons";

const createSchema = z.object({
	season_number: z.coerce.number().int().min(1).max(500),
	title: z.string().trim().max(255).nullable().optional(),
	description: z.string().trim().max(2000).nullable().optional(),
});

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const showId = Number((await context.params).id);
	if (!Number.isInteger(showId) || showId < 1) return NextResponse.json({ error: "Invalid TV show id" }, { status: 400 });
	return NextResponse.json({ data: await getAdminSeasonsForShow(showId) });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const showId = Number((await context.params).id);
	const parsed = createSchema.safeParse(await request.json());
	if (!Number.isInteger(showId) || showId < 1 || !parsed.success) return NextResponse.json({ error: "Invalid season data" }, { status: 400 });
	try {
		const id = await createSeason({
			tv_show_id: showId,
			season_number: parsed.data.season_number,
			title: parsed.data.title || null,
			description: parsed.data.description || null,
		});
		return NextResponse.json({ id }, { status: 201 });
	} catch (error) {
		console.error("Season creation failed", error);
		return NextResponse.json({ error: "Unable to create season" }, { status: 500 });
	}
}
