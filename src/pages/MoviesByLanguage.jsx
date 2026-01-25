import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApiMovie } from "../service/api-movie.js";
import { buildUrlImage } from "../utils/buildUrlImage.js";
import Sidebar from "../components/Sidebar.jsx";
import Modal from "../components/Modal.jsx";
import InformationMovie from "../components/InformationMovie.jsx";
import { generateQr } from "../helper/generateQr.js";
import { getFavorites, saveFavorites, toggleFavorite, isFavorite } from "../helper/favorites.js";

function MoviesByLanguage() {
    const { lang } = useParams();
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [favorites, setFavorites] = useState([]);
    const [hoveredMovieId, setHoveredMovieId] = useState(null);
    const [qrMap, setQrMap] = useState({});
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    useEffect(() => {
        setPage(1);
    }, [lang]);

    useEffect(() => {
        fetchMovies();
    }, [lang, page]);

    const fetchMovies = async () => {
        const response = await ApiMovie.getMoviesByLanguage(lang, page);
        setMovies(response.results);
        setTotalPages(response.total_pages);
    };

    const handleMouseEnter = async (id) => {
        setHoveredMovieId(id);
        if (!qrMap[id]) {
            const qr = await generateQr(id.toString());
            setQrMap(prev => ({ ...prev, [id]: qr }));
        }
    };

    const handleToggleFavorite = (movie) => {
        const updated = toggleFavorite(favorites, movie);
        setFavorites(updated);
        saveFavorites(updated);
    };

    return (
        <>
            <div className="flex min-h-screen bg-[#0c0c0e] text-zinc-100">
                <Sidebar />

                <main className="flex-1 px-6 py-10 max-w-[1600px] mx-auto">
                    {/* Header optimizado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">
                            Idioma <span className="text-zinc-500 mx-2">/</span>
                            <span className="text-yellow-500 uppercase"> {lang}</span>
                        </h1>

                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700/50 hover:bg-zinc-700 hover:text-white transition-all active:scale-95 flex items-center gap-2 w-fit shadow-lg"
                        >
                            <span>🏠</span> Home
                        </button>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
                        {movies.map(movie => (
                            <li
                                key={movie.id}
                                className="
                                  relative group cursor-pointer rounded-2xl overflow-hidden
                                  bg-zinc-900 border border-zinc-800/50
                                  transition-all duration-500 ease-out
                                  hover:-translate-y-3 hover:border-yellow-500/50
                                  hover:shadow-[0_30px_60px_rgba(0,0,0,0.8)]
                                "
                                onMouseEnter={() => handleMouseEnter(movie.id)}
                                onMouseLeave={() => setHoveredMovieId(null)}
                                onClick={() => {
                                    setSelectedMovieId(movie.id);
                                    setIsOpenModal(true);
                                }}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleFavorite(movie);
                                    }}
                                    className="absolute top-4 right-4 z-30 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-yellow-500 hover:text-black shadow-2xl"
                                >
                                    {isFavorite(favorites, movie.id) ? "★" : "☆"}
                                </button>

                                <div className="aspect-[2/3] w-full overflow-hidden bg-zinc-800">
                                    <img
                                        src={buildUrlImage(movie.poster_path)}
                                        alt={movie.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-20 pb-6 px-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    {hoveredMovieId === movie.id && qrMap[movie.id] && (
                                        <div className="flex justify-center mb-4">
                                            <div className="p-2 bg-white rounded-xl shadow-2xl transform scale-110">
                                                <img src={qrMap[movie.id]} className="w-18 h-18" alt="QR" />
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-white text-base text-center font-bold drop-shadow-lg leading-tight">
                                        {movie.title}
                                    </p>
                                </div>

                                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                                    <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-1000"></div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-center items-center gap-8 mt-20 pb-10">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="w-14 h-14 flex items-center justify-center rounded-full bg-zinc-800 text-white border border-zinc-700 transition-all hover:bg-zinc-700 disabled:opacity-20 active:scale-90 shadow-xl"
                        >
                            ←
                        </button>

                        <div className="text-center min-w-[100px]">
                            <span className="block text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-1 font-medium">Página</span>
                            <span className="text-white font-bold text-2xl">
                                {page} <span className="text-zinc-700 mx-1">/</span> {totalPages}
                            </span>
                        </div>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 font-bold transition-all hover:bg-yellow-400 disabled:opacity-20 active:scale-90"
                        >
                            →
                        </button>
                    </div>
                </main>
            </div>

            <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <InformationMovie movieId={selectedMovieId} />
            </Modal>
        </>
    );
}

export default MoviesByLanguage;