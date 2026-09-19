import { NextResponse } from "next/server";

export function unavailable() {
  return NextResponse.json({ error: "This API endpoint is not configured yet." }, { status: 501 });
}

export const GET = unavailable;
export const POST = unavailable;
export const PUT = unavailable;
export const PATCH = unavailable;
export const DELETE = unavailable;