import { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({
    children,
}: {
    children: ReactNode
}) {
    // Create a Supabase client for server-side authentication
    const supabase = await createClient()

    // Check if the user is authenticated
    const { data, error } = await supabase.auth.getUser()

    // If there's an error or no user data, redirect to login
    if (error || !data?.user) {
        // You can add the current URL as a redirect parameter to return after login
        redirect('auth/login')
    }

    // If authentication passes, render the children
    return <>{children}</>
}