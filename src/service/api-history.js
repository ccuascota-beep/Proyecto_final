import { supabase } from "../supabase/client";

export const getHistory = async () => {
    const { data, error } = await supabase
        .from("acam_logs")           // nombre correcto de la tabla
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error cargando historial:", error);
        return [];
    }

    return data;
};
