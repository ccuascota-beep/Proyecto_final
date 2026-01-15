import { supabase } from "../supabase/client";

export const getHistory = async () => {
    const { data, error } = await supabase
        .from("scam_logs")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error cargando historial:", error);
        return [];
    }

    return data;
};
