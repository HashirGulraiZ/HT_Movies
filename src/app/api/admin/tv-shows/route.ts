import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createTVShow, getAdminTVShows } from "@/lib/db/queries/tvShows";

const schema = z.object({
	title: z.string().trim().min(1).max(255), slug: z.string().trim().min(1).max(280),
	description: z.string().nullable().optional(), poster_url: z.string().url().or(z.literal("")).nullable().optional(),
	backdrop_url: z.string().url().or(z.literal("")).nullable().optional(), trailer_url: z.string().url().or(z.literal("")).nullable().optional(),
	release_year: z.coerce.number().int().min(1888).max(2200).nullable().optional(), rating: z.coerce.number().min(0).max(10).nullable().optional(),
	age_rating: z.string().max(20).nullable().optional(), status: z.enum(["draft", "published", "archived"]).default("draft"), featured: z.coerce.boolean().default(false),
});
export async function GET() {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	return NextResponse.json({ data: await getAdminTVShows() });
}
export async function POST(request: Request) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const parsed = schema.safeParse(await request.json());
	if (!parsed.success) return NextResponse.json({ error: "Invalid TV show data", details: parsed.error.flatten() }, { status: 400 });
	try {
		const id = await createTVShow({ ...parsed.data, description: parsed.data.description ?? null, poster_url: parsed.data.poster_url || null, backdrop_url: parsed.data.backdrop_url || null, trailer_url: parsed.data.trailer_url || null, release_year: parsed.data.release_year ?? null, rating: parsed.data.rating ?? null, age_rating: parsed.data.age_rating ?? null });
		return NextResponse.json({ id }, { status: 201 });
	} catch (error) {
		console.error("TV show creation failed", error);
		return NextResponse.json({ error: "Unable to create TV show" }, { status: 500 });
	}
}
