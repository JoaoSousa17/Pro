// app/data_source/[connectionId]/table/[tableName]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";


export default function TablePage() {
  const { connectionId, tableName } = useParams();
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const paginatedRows = rows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchTableRows = async () => {
      try {
        const res = await fetch("/api/fetch-rows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            connection_id: Number(connectionId),
            table_name: tableName,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setRows(data.rows || []);
          setColumns(data.columns || []);
        } else {
          setError(data.error || "Unknown error");
        }
      } catch (err) {
        console.error("Error fetching rows:", err);
        setError("Failed to fetch table data.");
      } finally {
        setLoading(false);
      }
    };

    if (connectionId && tableName) fetchTableRows();
  }, [connectionId, tableName]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="border rounded">
          <div className="p-4 space-y-2">
            {Array.from({ length: 7 }).map((_, idx) => (
              <Skeleton key={idx} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }
   
  if (error) return <div className="p-6 text-red-500">❌ {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Table: {tableName}</h1>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
          {paginatedRows.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell key={col}>{String(row[col])}</TableCell>
              ))}
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </div>
      {rows.length > itemsPerPage && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
