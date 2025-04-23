"use server"

import { insertEncryptedConnection } from "@/lib/db/connection"

export async function insertConnection(data: {
  type: string
  host: string
  port: string
  name: string
  username: string
  password: string
}) {
  // Import pg only when needed
  // @ts-expect-error: CommonJS module
  const { Client } = await import("pg")

  const client = new Client({
    host: data.host,
    port: parseInt(data.port),
    database: data.name,
    user: data.username,
    password: data.password,
  })

  try {
    await client.connect()
    await client.end()
  } catch (err: any) {
    return { success: false, error: "Connection failed: " + err.message }
  }

  // If connection is OK, insert into Supabase (userId is resolved inside connection.ts)
  try {
    const result = await insertEncryptedConnection(data)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save connection" }
  }
}
