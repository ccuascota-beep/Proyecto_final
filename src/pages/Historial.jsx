import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../service/api-history";
import { ApiMovie } from "../service/api-movie";
import { buildUrlImage } from "../utils/buildUrlImage";

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

        const enriched = await Promise.all(
            data.map(async (item) => {
                if (!item.movie_id) return item;

                try {
                    const movie = await ApiMovie.getMovieById(item.movie_id);
                    return {
                        ...item,
                        title: movie.title,
                        overview: movie.overview,
                        poster: movie.poster_path,
                    };
                } catch {
                    return item;
                }
            })
        );

        setHistory(enriched);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-white px-4 py-12">
            <div className="max-w-5xl mx-auto">

                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-black tracking-tight">
                        Historial de Escaneos
                    </h1>

                    <button
                        onClick={() => navigate("/")}
                        className="px-5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-all font-bold text-sm"
                    >← Home
                    </button>
                </div>

                {loading ? (
                    <p className="text-zinc-500">Cargando historial...</p>
                ) : history.length === 0 ? (
                    <p className="text-zinc-400 italic">No hay escaneos todavía.</p>
                ) : (
                    <ul className="space-y-6">
                        {history.map(item => (
                            <li
                                key={item.id}
                                className="flex gap-6 p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 hover:border-zinc-600 transition-all"
                            >
                                <div className="w-24 h-36 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                                    {item.poster ? (
                                        <img
                                            src={buildUrlImage(item.poster, "w185")}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-bold mb-1">
                                        {item.title || "Película desconocida"}
                                    </h3>

                                    <p className="text-sm text-zinc-400 line-clamp-3 mb-3">
                                        {item.overview || "Sin descripción disponible."}
                                    </p>

                                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                                        Escaneado el{" "}
                                        {new Date(item.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
