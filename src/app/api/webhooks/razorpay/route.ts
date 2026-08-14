import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
