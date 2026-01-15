import { useEffect, useState } from "react";
import { ApiMovie } from "../service/api-movie.js";
import { buildUrlImage } from "../utils/buildUrlImage.js";
import Modal from "../components/Modal.jsx";
import SearchBar from "../components/SearchBar.jsx";
import InformationMovie from "../components/InformationMovie.jsx";
import { generateQr } from "../helper/generateQr.js";
import { getFavorites, saveFavorites } from "../helper/favorites.js";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

function Home() {
    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [hoveredMovieId, setHoveredMovieId] = useState(null);
    const [qrMap, setQrMap] = useState({});
    const [favorites, setFavorites] = useState([]);

    const navigate = useNavigate();

    // Cargar favoritos
    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    // Cargar películas (popular o búsqueda)
    useEffect(() => {
        const fetchMovies = async () => {
            let response;

            if (search.trim() === "") {
                response = await ApiMovie.getPopularMovies(page);
            } else {
                response = await ApiMovie.searchMovies(search, page);
            }

            setMovies(response.results);
            setTotalPages(response.total_pages);
        };

        fetchMovies();
    }, [search, page]);

    // Reset page cuando cambia búsqueda
    useEffect(() => {
        setPage(1);
    }, [search]);

    // QR
    const handleMouseEnter = async (id) => {
        setHoveredMovieId(id);

        if (!qrMap[id]) {
            const qr = await generateQr(id.toString());
            setQrMap(prev => ({ ...prev, [id]: qr }));
        }
    };

    // Favoritos
    const handleToggleFavorite = (id) => {
        let updated;

        if (favorites.includes(id)) {
            updated = favorites.filter(favId => favId !== id);
        } else {
            updated = [...favorites, id];
        }

        setFavorites(updated);
        saveFavorites(updated);
    };

    return (
        <>
            <div className="flex min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">

                {/* SIDEBAR */}
                <Sidebar />

                {/* CONTENIDO */}
                <main className="flex-1 px-6 py-10">

                    {/* BOTONES SUPERIORES */}
                    <div className="flex justify-end gap-4 mb-6">
                        <button
                            onClick={() => navigate("/favorites")}
                            className="px-5 py-2 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 transition font-semibold"
                        >
                            Favoritos
                        </button>

                        <button
                            onClick={() => navigate("/historial")}
                            className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold"
                        >
                            Historial
                        </button>
                    </div>

                    {/* SEARCH */}
                    <div className="mb-6 w-full max-w-md">
                        <SearchBar value={search} onChange={setSearch} />
                    </div>

                    {/* TÍTULO */}
                    <h1 className="text-4xl font-extrabold text-white mb-8">
                        🎬 Películas Top
                    </h1>

                    {/* GRID */}
                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {movies.map(movie => (
                            <li
                                key={movie.id}
                                className="relative group cursor-pointer"
                                onMouseEnter={() => handleMouseEnter(movie.id)}
                                onMouseLeave={() => setHoveredMovieId(null)}
                                onClick={() => {
                                    setSelectedMovieId(movie.id);
                                    setIsOpenModal(true);
                                }}
                            >
                                {/* FAVORITO */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleFavorite(movie.id);
                                    }}
                                    className="absolute top-2 right-2 z-30 bg-black/60 rounded-full px-2 text-2xl text-yellow-400"
                                >
                                    {favorites.includes(movie.id) ? "⭐" : "☆"}
                                </button>

                                {/* POSTER */}
                                <img
                                    src={buildUrlImage(movie.poster_path)}
                                    alt={movie.title}
                                    className="rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* OVERLAY */}
                                <div className="absolute inset-0 z-20 bg-black/80 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                    {hoveredMovieId === movie.id && qrMap[movie.id] && (
                                        <img src={qrMap[movie.id]} alt="QR" className="w-28 h-28 mb-3" />
                                    )}

                                    <p className="text-white text-sm font-semibold text-center px-3">
                                        {movie.title}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* PAGINACIÓN */}
                    <div className="flex justify-center items-center gap-6 mt-12">
                        <button
                            onClick={() => setPage(p => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-lg bg-zinc-700 text-white disabled:opacity-40 hover:bg-zinc-600 transition"
                        >
                            ⬅ Anterior
                        </button>

                        <span className="text-white text-sm">
                            Página {page} de {totalPages}
                        </span>

                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages}
                            className="px-4 py-2 rounded-lg bg-zinc-700 text-white disabled:opacity-40 hover:bg-zinc-600 transition"
                        >
                            Siguiente ➡
                        </button>
                    </div>

                </main>
            </div>

            {/* MODAL */}
            <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <InformationMovie
                    movieId={selectedMovieId}
                    onBack={() => setIsOpenModal(false)}
                />
            </Modal>
        </>
    );
}

export default Home;
