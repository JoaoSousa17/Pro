import { getConnectionsMinimal } from "@/lib/db/connection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react"; // Import the arrow icon

export default async function Dashboard() {
  // Fetch all connections for the current user
  const connections = await getConnectionsMinimal();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Connections</CardTitle>
        </CardHeader>
        <CardContent>
          {connections && connections.length > 0 ? (
            <div className="space-y-3">
              {connections.map((connection : any) => (
                <div 
                  key={connection.id} 
                  className="p-3 border rounded-md hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="font-medium">{connection.type}</span>
                    <ArrowRight className="mx-2 h-4 w-4 text-slate-400" />
                    <span>{connection.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-6 text-slate-500">
              You don't have any connections yet. 
              <a href="/new_data_source" className="text-blue-600 hover:underline ml-1">
                Create one now
              </a>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}