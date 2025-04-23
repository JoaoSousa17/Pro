// app/(protected)/mainpage/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DatabaseTypes } from "@/lib/database.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"
import {Table, TableBody, TableCell, TableHead, TableRow, TableHeader} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  UsersRound,
  FileText,
  Folder,
  Database,
  Plus,
  Settings,
  User,
  Github,
  LogOut,
  ArrowRight,
  UserPlus,
  Wrench,
  Hexagon,
  ChevronDown,
  LibraryBig,
  Library,
  FolderOpen, 
  LayoutDashboard
} from "lucide-react"


export default function MainPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const totalPages = Math.ceil(dashboards.length / itemsPerPage);
  const paginatedDashboards = dashboards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  
  // ✅ Fetch user and workspace
  useEffect(() => {
    const fetchData = async () => {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (!user) {
            console.log("❌ Not authenticated");
            return;
        }

        setUser(user);
        console.log("✅ User:", user);

        const { data: memberships } = await supabase
            .from("workspace_members")
            .select("workspace:workspace_id(*)")
            .eq("user_id", user.id);

        const workspaceList = memberships?.map((m) => m.workspace) ?? [];

        setWorkspaces(workspaceList);

        // Optional: auto-select first one
        if (workspaceList.length > 0) {
        setSelectedWorkspace(workspaceList[0]);
        }
    };

    fetchData();
  }, []);

  // ✅ Fetch folders for selected workspace
  useEffect(() => {
    if (!selectedWorkspace) return;

    const fetchFolders = async () => {
      const { data } = await supabase
        .from("folder")
        .select("*")
        .eq("workspace_id", selectedWorkspace.id);

      setFolders(data || []);
    };

    fetchFolders();
  }, [selectedWorkspace]);

  const handleWorkspaceChange = (ws: any) => {
    setSelectedWorkspace(ws);
    setIsWorkspaceOpen(false);
  };

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await fetch("/api/connections");
        const data = await res.json();
    
        if (Array.isArray(data)) {
          setConnections(data);
          console.log("✅ Connections:", data);
        } else {
          console.error("Unexpected response:", data);
        }
      } catch (err) {
        console.error("Error fetching connections:", err);
      }
    };
    
    fetchConnections();
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
  
      const { data, error } = await supabase.storage
        .from("data-sources")
        .list(user.id, { limit: 100 });
  
      if (error) {
        console.error("❌ Error fetching files:", error);
        return;
      }
  
      setFiles(data ?? []);
    };
  
    fetchFiles();
  }, []);

useEffect(() => {
  if (!selectedFolder) return;

  const fetchDashboards = async () => {
    const { data, error } = await supabase
      .from("dashboard")
      .select("*")
      .eq("folder_id", selectedFolder.id);

    if (error) {
      console.error("Error fetching dashboards:", error);
      return;
    }

    setDashboards(data || []);
  };

  fetchDashboards();
}, [selectedFolder]);

function DashboardPlaceholder({ type }: { type: "no-folder" | "empty-folder" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-2">
      {type === "no-folder" ? (
        <>
          <FolderOpen className="w-10 h-10" />
          <p className="text-sm">Select a folder to view dashboards</p>
        </>
      ) : (
        <>
          <LayoutDashboard className="w-10 h-10" />
          <p className="text-sm">No dashboards in this folder</p>
        </>
      )}
    </div>
  );
} 
  

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r px-4 py-6 flex flex-col">
      <Popover open={isWorkspaceOpen} onOpenChange={setIsWorkspaceOpen}>
        <PopoverTrigger asChild>
          <div className="w-full flex items-center justify-between px-2 py-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="border border-muted-foreground rounded-sm p-1">
                <LibraryBig className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {selectedWorkspace?.name || "Select Workspace"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedWorkspace?.is_personal ? "Personal Workspace" : "Enterprise Workspace"}
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-60">
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className="cursor-pointer px-2 py-2 hover:bg-muted rounded flex items-center gap-2"
              onClick={() => {
                setSelectedWorkspace(ws);
                setSelectedFolder(null);
                setIsWorkspaceOpen(false);
              }}
            >
              <div>
                <Library className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{ws.name}</span>
                <span className="text-xs text-muted-foreground">
                  {ws.is_personal ? "Personal Workspace" : "Enterprise Workspace"}
                </span>
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>



        {/* Divider */}
        <div className="my-4 border-t" />

        {/* Folders */}
        <div className="space-y-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground tracking-wide">
            Folders
          </h3>

          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium transition",
                selectedFolder?.id === folder.id
                  ? "bg-neutral-900/90 text-white" // Selected: no hover
                  : "text-foreground hover:bg-muted hover:text-foreground" // Normal hover behavior
              )}
            >
              <Folder className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{folder.name}</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 border-t" />

        {/* Data */}
        <div className="space-y-2">
          <h3 className="px-1.5 text-xs font-semibold text-muted-foreground tracking-wide">
            Data
          </h3>

          {connections.map((conn) => (
            <button
              key={`conn-${conn.id}`}
              onClick={() => router.push(`/data_source/${conn.id}`)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-transform duration-200 hover:scale-[1.03]",
                "hover:scale-[1.03]"
              )}
            >
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{conn.name}</span>
            </button>
          ))}

          {files
            .filter((file) => file.name !== ".emptyFolderPlaceholder")
            .map((file) => (
              <button
                key={`file-${file.name}`}
                onClick={() => router.push(`/file/${file.name}`)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-transform duration-200 hover:scale-[1.03]",
                  "hover:scale-[1.03]"
                )}
              >
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}
        </div>

        <Button className="mt-auto" variant="outline" onClick={() => router.push("/new_data_source")}>
          + Add Data Source
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          {/* Search */}
          <Input placeholder="Search..." className="w-[300px]" />
          {/* Top-right menu */}
          <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="ml-2">
                <Plus className="h-4 w-4" />
                New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="gap-2">
                <UsersRound className="h-4 w-4" />
                Query
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <FileText className="h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Folder className="h-4 w-4" />
                Folder
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Database className="h-4 w-4" />
                Data Source
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="border">
                <Hexagon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-muted-foreground">My account</DropdownMenuLabel>
              <DropdownMenuItem className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Wrench className="h-4 w-4" />
                More Tools
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <UserPlus className="h-4 w-4" />
                Invite Users
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Plus className="h-4 w-4" />
                New Workspace
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <Github className="h-4 w-4" />
                Github
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <ArrowRight className="h-4 w-4" />
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive">
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
        {/* Dashboards */}
        {!selectedFolder ? (
          <DashboardPlaceholder type="no-folder" />
        ) : dashboards.length === 0 ? (
          <DashboardPlaceholder type="empty-folder" />
        ) : (
          <div className="border border-muted rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDashboards.map((dashboard) => (
                  <TableRow key={dashboard.id}>
                    <TableCell className="font-medium">{dashboard.name}</TableCell>
                    <TableCell>{new Date(dashboard.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {dashboards.length > itemsPerPage && (
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
    </div>
  );
}
