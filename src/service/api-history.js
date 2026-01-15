import { supabase } from "../supabase/client";

export const getHistory = async () => {
    const { data, error } = await supabase
        .from("history") // 🔹 la tabla donde tu app móvil guarda los QR
        .select("*")
        .order("scanned_at", { ascending: false });

    if (error) {
        console.error("Error cargando historial:", error);
        return [];
    }
    return data;
};
