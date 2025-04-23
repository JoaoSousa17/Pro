// app/file/[filename]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Papa from "papaparse";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function FilePage() {
  const { filename } = useParams();
  const supabase = createClient();
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
    const fetchFile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const path = `${user?.id}/${filename}`;
        const { data, error } = await supabase.storage
          .from("data-sources")
          .download(path);

        if (error || !data) {
          setError("File not found");
          return;
        }

        const text = await data.text();
        const parsed = Papa.parse(text, { header: true });
        setRows(parsed.data as any[]);
        setColumns(parsed.meta.fields || []);
      } catch (err) {
        setError("Failed to parse file");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [filename]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} className="h-6 w-full mb-2" />
        ))}
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-500">❌ {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📄 {filename}</h1>
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
                  <TableCell key={col}>{row[col]}</TableCell>
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
