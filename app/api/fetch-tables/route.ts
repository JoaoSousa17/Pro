import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { connection_id } = await req.json();
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const encryptionKey = process.env.ENCRYPTION_KEY!;
    const { data, error } = await supabase.rpc("get_connection_credentials", {
      conn_id: connection_id,
      p_key: encryptionKey,
    });

    if (error || !data || data.length === 0) {
      console.error("❌ RPC error:", error);
      return NextResponse.json({ error: "Failed to decrypt connection details" }, { status: 500 });
    }

    const { host, port, username, password, name } = data[0];

    // Import pg only when needed
    // @ts-expect-error: CommonJS module
    const { Client } = await import("pg")
    const client = new Client({
      host,
      port: parseInt(port),
      user: username,
      password,
      database: name,
    });

    await client.connect();

    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    await client.end();

    return NextResponse.json({ tables: result.rows }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Server error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}