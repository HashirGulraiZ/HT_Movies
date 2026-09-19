import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const allowedFolders = new Set(["movies", "tv-shows", "episodes", "actors", "games", "live-tv", "general", "branding"]);
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml", "video/mp4", "video/webm"]);

export async function POST(request: Request) {
	if (!(await requireAdmin())) return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
	const form = await request.formData();
	const file = form.get("file");
	const folderValue = String(form.get("folder") ?? "general");
	if (!(file instanceof File) || !allowedFolders.has(folderValue)) return NextResponse.json({ error: "A valid file and folder are required" }, { status: 400 });
	if (!allowedTypes.has(file.type) || file.size > 100 * 1024 * 1024) return NextResponse.json({ error: "Unsupported file type or file is too large" }, { status: 400 });
	const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
	const fileName = `${Date.now()}-${safeName}`;
	const directory = path.join(process.cwd(), "public", "uploads", folderValue);
	await mkdir(directory, { recursive: true });
	await writeFile(path.join(directory, fileName), Buffer.from(await file.arrayBuffer()));
	return NextResponse.json({ url: `/uploads/${folderValue}/${fileName}` }, { status: 201 });
}
