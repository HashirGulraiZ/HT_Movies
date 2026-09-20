import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteMovie, getAdminMovieById, updateMovie } from "@/lib/db/queries/movies";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const updateSchema = z.record(z.string(), z.unknown());

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const id = Number((await context.params).id);
	if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
	try {
		const movie = await getAdminMovieById(id);
		if (!movie) return NextResponse.json({ error: "Movie not found" }, { status: 404 });
		return NextResponse.json({ data: movie });
	} catch (error) {
		console.error("Admin movie load failed", error);
		return NextResponse.json({ error: "Unable to load movie" }, { status: 500 });
	}
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const parsed = updateSchema.safeParse(await request.json());
	const id = Number((await context.params).id);
	if (!Number.isInteger(id) || id < 1 || !parsed.success) return NextResponse.json({ error: "Invalid movie request" }, { status: 400 });
	try {
		await updateMovie(id, parsed.data);
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("Admin movie update failed", error);
		return NextResponse.json({ error: "Unable to update movie" }, { status: 500 });
	}
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const id = Number((await context.params).id);
	if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
	try {
		await deleteMovie(id);
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("Admin movie deletion failed", error);
		return NextResponse.json({ error: "Unable to delete movie" }, { status: 500 });
	}
}
