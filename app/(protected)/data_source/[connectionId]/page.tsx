// app/data_source/[connectionId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";


export default function DataSourcePage() {
  const { connectionId } = useParams();
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch("/api/fetch-tables", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ connection_id: Number(connectionId) }),
        });

        const data = await res.json();

        if (res.ok) {
          setTables(data.tables || []);
        } else {
          setError(data.error || "Unknown error");
        }
      } catch (err) {
        setError("Failed to load tables");
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (connectionId) fetchTables();
  }, [connectionId]);

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-32 w-full rounded-md" />
        ))}
      </div>
    );
  } 
  if (error) return <div className="p-6 text-red-500">❌ {error}</div>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tables.map((table) => (
        <Link href={`/data_source/${connectionId}/table/${table.table_name}`}>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">{table.table_name}</h3>
            <p className="text-sm text-muted-foreground">View table rows</p>
          </CardContent>
        </Card>
      </Link>
      ))}
    </div>
  );
}
