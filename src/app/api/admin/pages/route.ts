import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createPage, getPages } from "@/lib/db/queries/pages";

const pageSchema = z.object({
	title: z.string().trim().min(1).max(255),
	slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(280),
	description: z.string().nullable().optional(),
	status: z.enum(["draft", "published"]).default("draft"),
});

export async function GET() {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	try {
		return NextResponse.json({ data: await getPages() });
	} catch (error) {
		console.error("Page listing failed", error);
		return NextResponse.json({ error: "Unable to load pages" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const parsed = pageSchema.safeParse(await request.json());
	if (!parsed.success) return NextResponse.json({ error: "Invalid page data", details: parsed.error.flatten() }, { status: 400 });
	try {
		const id = await createPage({ ...parsed.data, description: parsed.data.description ?? null });
		return NextResponse.json({ id }, { status: 201 });
	} catch (error) {
		console.error("Page creation failed", error);
		return NextResponse.json({ error: "Unable to create page" }, { status: 500 });
	}
}
