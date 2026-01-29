import { useEffect, useState } from "react";
import { ApiMovie } from "../service/api-movie.js";
import { buildUrlImage } from "../utils/buildUrlImage.js";
import Modal from "../components/Modal.jsx";
import InformationSerie from "../components/InformationSerie.jsx";
import { generateQr } from "../helper/generateQr.js";
import { getFavorites, saveFavorites, toggleFavorite, isFavorite } from "../helper/favorites.js";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const GENRES = [
    { id: null, name: "Todas" },
    { id: 10759, name: "Acción" },
    { id: 35, name: "Comedia" },
    { id: 9648, name: "Terror" },
    { id: 16, name: "Anime" },
    { id: 10765, name: "Ciencia Ficción" },
    { id: 16, name: "Animación" },
];

function Series() {
    const [series, setSeries] = useState([]);
    const [genre, setGenre] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [favorites, setFavorites] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);
    const [qrMap, setQrMap] = useState({});
    const [selectedSerieId, setSelectedSerieId] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    useEffect(() => {
        fetchSeries();
    }, [genre, page]);

    const fetchSeries = async () => {
        const response = genre
            ? await ApiMovie.getSeriesByGenre(genre, page)
            : await ApiMovie.getPopularSeries(page);

        setSeries(response.results);
        setTotalPages(response.total_pages);
    };

    const handleMouseEnter = async (id) => {
        setHoveredId(id);
        if (!qrMap[id]) {
            const qr = await generateQr(id.toString());
            setQrMap(prev => ({ ...prev, [id]: qr }));
        }
    };

    const handleToggleFavorite = (serie) => {
        const updated = toggleFavorite(favorites, {
            ...serie,
            title: serie.name,
            release_date: serie.first_air_date
        });
        setFavorites(updated);
        saveFavorites(updated);
    };

    return (
        <>
            <div className="flex min-h-screen bg-[#08080a] text-zinc-100">
                <Sidebar />

                <main className="flex-1 px-4 md:px-10 py-12 max-w-[1600px] mx-auto">

                    <div className="flex flex-col gap-8 mb-16">

                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                            <div>
                                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">
                                    Explorar
                                </p>
                                <h1 className="text-5xl font-black tracking-tighter">
                                    Series
                                </h1>
                            </div>

                            <button
                                onClick={() => navigate("/")}
                                className="px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white transition-all font-bold text-sm flex items-center gap-2 w-fit shadow-xl shadow-black/40"
                            >
                                <span>←</span> Volver al Inicio
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {GENRES.map(g => (
                                <button
                                    key={g.name}
                                    onClick={() => {
                                        setGenre(g.id);
                                        setPage(1);
                                    }}
                                    className={`px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-wide transition-all backdrop-blur-md border
                                    ${genre === g.id
                                        ? "bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/20"
                                        : "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600"
                                    }`}
                                >
                                    {g.name}
                                </button>
                            ))}
                        </div>

                    </div>

                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
                        {series.map(serie => (
                            <li
                                key={serie.id}
                                className="group cursor-pointer"
                                onMouseEnter={() => handleMouseEnter(serie.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => {
                                    setSelectedSerieId(serie.id);
                                    setIsOpenModal(true);
                                }}
                            >
                                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 mb-4 transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:-translate-y-2 ring-1 ring-white/5">

                                    <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                                    <span className="text-yellow-500 font-bold text-xs">
                                        {serie.vote_average?.toFixed(1) || "N/A"}
                                    </span>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleFavorite(serie);
                                        }}
                                        className={`absolute top-3 right-3 z-20 p-2 rounded-xl transition-all duration-300 shadow-xl
                                        ${isFavorite(favorites, serie.id)
                                            ? "bg-yellow-500 text-black scale-110"
                                            : "bg-black/40 text-white opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10 hover:bg-white hover:text-black"
                                        }`}
                                    >★
                                    </button>

                                    <img
                                        src={buildUrlImage(serie.poster_path)}
                                        alt={serie.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />

                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {hoveredId === serie.id && qrMap[serie.id] && (
                                            <div className="p-3 bg-white rounded-xl transform scale-75 lg:scale-90">
                                                <img src={qrMap[serie.id]} className="w-20 h-20" alt="QR" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="px-1">
                                    <h3 className="text-white font-semibold text-sm line-clamp-1 group-hover:text-yellow-500 transition-colors">
                                        {serie.name}
                                    </h3>
                                    <p className="text-zinc-500 text-xs font-medium mt-1 uppercase tracking-wider">
                                        {serie.first_air_date?.split("-")[0] || "S/F"}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-center items-center gap-10 mt-24 mb-10">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="group flex items-center gap-2 text-zinc-500 hover:text-yellow-500 disabled:opacity-20 transition-all font-bold"
                        >
                            Anterior
                        </button>

                        <div className="flex flex-col items-center">
                            <span className="text-white text-lg font-black">{page}</span>
                            <div className="h-1 w-8 bg-yellow-500 rounded-full mt-1"></div>
                        </div>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="group flex items-center gap-2 text-zinc-500 hover:text-yellow-500 disabled:opacity-20 transition-all font-bold"
                        >
                            Siguiente
                        </button>
                    </div>

                </main>
            </div>

            <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <InformationSerie serieId={selectedSerieId} />
            </Modal>
        </>
    );
}

export default Series;
