import { NextResponse } from "next/server";
import { getConnectionsMinimal } from "@/lib/db/connection";

export async function GET() {
  try {
    const data = await getConnectionsMinimal();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
