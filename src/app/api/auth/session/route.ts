import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
	return NextResponse.json({ data: await getCurrentUser() });
}
