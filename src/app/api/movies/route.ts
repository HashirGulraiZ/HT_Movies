import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublishedMovies } from "@/lib/db/queries/movies";

const filtersSchema = z.object({
	search: z.string().trim().max(120).optional(),
	year: z.coerce.number().int().min(1888).max(2200).optional(),
	featured: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
	limit: z.coerce.number().int().min(1).max(48).default(24),
	page: z.coerce.number().int().min(1).default(1),
});

export async function GET(request: Request) {
	const params = Object.fromEntries(new URL(request.url).searchParams.entries());
	const parsed = filtersSchema.safeParse(params);
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid movie filters" }, { status: 400 });
	}

	try {
		const { page, limit, ...filters } = parsed.data;
		const movies = await getPublishedMovies({ ...filters, limit, offset: (page - 1) * limit });
		return NextResponse.json({ data: movies, page, limit });
	} catch (error) {
		console.error("Movie catalog query failed", error);
		return NextResponse.json({ error: "Unable to load movies" }, { status: 503 });
	}
}
