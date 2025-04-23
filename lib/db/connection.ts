import { createClient } from '@/lib/supabase/server'

export async function insertEncryptedConnection({
    type,
    host,
    port,
    name,
    username,
    password,
}: {
    type: string
    host: string
    port: string
    name: string
    username: string
    password: string
}) {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        throw new Error('Unauthorized');
    }
    
    const encryptionKey = process.env.ENCRYPTION_KEY

    const { error } = await supabase.rpc("insert_connection_encrypted", {
        p_host: host,
        p_port: port,
        p_type: type,
        p_name: name,
        p_username: username,
        p_password: password,
        p_key: encryptionKey,
    })

    if (error) {
        console.error('Error inserting connection:', error);
        throw new Error(error.message || 'Failed to insert connection');
    }

    return { success: true }
}

export async function getConnectionsMinimal() {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('Unauthorized');
    }

    // Use the encryption key from environment variables
    const encryptionKey = process.env.ENCRYPTION_KEY;

    // Call the RPC function to get connections with decrypted name and type
    const { data, error } = await supabase.rpc('get_connections_minimal', {
        p_key: encryptionKey,
    });

    if (error) {
        console.error('Error retrieving connections:', error);
    }

    return data;
}