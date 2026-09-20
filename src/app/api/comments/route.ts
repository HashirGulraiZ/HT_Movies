import { NextResponse } from "next/server";
import { z } from "zod";
import { addComment } from "@/lib/db/queries/comments";

const schema = z.object({
	content_type: z.enum(["movie", "tv_show"]),
	content_id: z.coerce.number().int().min(1),
	name: z.string().trim().min(1).max(120),
	email: z.string().trim().email().max(255),
	website: z.string().trim().max(500).or(z.literal("")).nullable().optional(),
	body: z.string().trim().min(1).max(2000),
});

export async function POST(request: Request) {
	const parsed = schema.safeParse(await request.json());
	if (!parsed.success) return NextResponse.json({ error: "Invalid comment" }, { status: 400 });
	try {
		const id = await addComment({
			content_type: parsed.data.content_type,
			content_id: parsed.data.content_id,
			name: parsed.data.name,
			email: parsed.data.email,
			website: parsed.data.website || null,
			body: parsed.data.body,
		});
		return NextResponse.json({ id }, { status: 201 });
	} catch (error) {
		console.error("Comment submission failed", error);
		return NextResponse.json({ error: "Unable to post comment" }, { status: 500 });
	}
}
