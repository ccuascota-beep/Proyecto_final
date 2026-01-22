import {supabase} from "../supabase/client.js";

export async function getHistory() {
    const { data, error } = await supabase
        .from('scan_logs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error cargando historial:', error);
        return [];
    }

    return data;
}
