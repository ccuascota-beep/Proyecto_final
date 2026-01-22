import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../service/api-history";

export default function Historial() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoading(true);
        const data = await getHistory();
        console.log("Historial desde Supabase:", data);
        setHistory(data);
        setLoading(false);
    };

    return (
        <div className="text-white max-w-4xl mx-auto p-4">
            <button
                className="mb-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                onClick={() => navigate("/")}
            >
                Home
            </button>

            <h1 className="text-3xl font-bold mb-4">Historial de QR</h1>

            {loading ? (
                <p>Cargando...</p>
            ) : history.length === 0 ? (
                <p className="text-white">No hay escaneos todavía.</p>
            ) : (
                <ul className="space-y-2">
                    {history.map((item) => (
                        <li
                            key={item.id}
                            className="p-2 bg-gray-800 rounded flex flex-col sm:flex-row sm:justify-between"
                        >
                            <div>
                                <strong>QR:</strong> {item.source}
                            </div>
                            <div>
                                <strong>Película ID:</strong> {item.movie_id || "N/A"}
                            </div>
                            <div className="text-gray-400">
                                {new Date(item.created_at).toLocaleString()}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
