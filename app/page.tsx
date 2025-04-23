import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Welcome to PE18</h1>
        <p className="text-muted-foreground">Please login to continue</p>
        <Link href="/auth/login">
          <Button>Login</Button>
        </Link>
      </div>
    </div>
  )
}
