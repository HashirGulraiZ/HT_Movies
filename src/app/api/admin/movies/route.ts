import { NextResponse } from "next/server";
import { z } from "zod";
import { createMovie, getAdminMovies } from "@/lib/db/queries/movies";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const movieSchema = z.object({
	title: z.string().trim().min(1).max(255),
	slug: z.string().trim().min(1).max(280),
	description: z.string().nullable().optional(),
	poster_url: z.string().url().or(z.literal("")).nullable().optional(),
	backdrop_url: z.string().url().or(z.literal("")).nullable().optional(),
	trailer_url: z.string().url().or(z.literal("")).nullable().optional(),
	video_url: z.string().url().or(z.literal("")).nullable().optional(),
	duration_minutes: z.coerce.number().int().min(0).nullable().optional(),
	release_year: z.coerce.number().int().min(1888).max(2200).nullable().optional(),
	rating: z.coerce.number().min(0).max(10).nullable().optional(),
	age_rating: z.string().max(20).nullable().optional(),
	status: z.enum(["draft", "published", "archived"]).default("draft"),
	featured: z.coerce.boolean().default(false),
});

export async function GET() {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	try {
		return NextResponse.json({ data: await getAdminMovies() });
	} catch (error) {
		console.error("Admin movie query failed", error);
		return NextResponse.json({ error: "Unable to load movies" }, { status: 503 });
	}
}

export async function POST(request: Request) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const parsed = movieSchema.safeParse(await request.json());
	if (!parsed.success) return NextResponse.json({ error: "Invalid movie data", details: parsed.error.flatten() }, { status: 400 });
	try {
		const id = await createMovie({
			...parsed.data,
			description: parsed.data.description ?? null,
			poster_url: parsed.data.poster_url || null,
			backdrop_url: parsed.data.backdrop_url || null,
			trailer_url: parsed.data.trailer_url || null,
			video_url: parsed.data.video_url || null,
			duration_minutes: parsed.data.duration_minutes ?? null,
			release_year: parsed.data.release_year ?? null,
			rating: parsed.data.rating ?? null,
			age_rating: parsed.data.age_rating ?? null,
		});
		return NextResponse.json({ id }, { status: 201 });
	} catch (error) {
		console.error("Admin movie creation failed", error);
		return NextResponse.json({ error: "Unable to create movie" }, { status: 500 });
	}
}
