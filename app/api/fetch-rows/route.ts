// app/api/fetch-rows/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { connection_id, table_name } = await req.json();

    const supabase = await createClient();
    const encryptionKey = process.env.ENCRYPTION_KEY!;
    const { data, error } = await supabase.rpc("get_connection_credentials", {
      conn_id: connection_id,
      p_key: encryptionKey,
    });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 500 });
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

    const result = await client.query(`SELECT * FROM "${table_name}" LIMIT 100`);
    await client.end();

    const rows = result.rows;
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    return NextResponse.json({ rows, columns });
  } catch (err: any) {
    console.error("Error fetching rows:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
