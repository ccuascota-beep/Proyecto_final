import { useEffect, useState } from "react";
import { ApiMovie } from "../service/api-movie.js";
import { buildUrlImage } from "../utils/buildUrlImage.js";
import Modal from "../components/Modal.jsx";
import SearchBar from "../components/SearchBar.jsx";
import InformationMovie from "../components/InformationMovie.jsx";
import { generateQr } from "../helper/generateQr.js";
import {getFavorites, saveFavorites, toggleFavorite, isFavorite} from "../helper/favorites.js";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

function Home() {
    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [favorites, setFavorites] = useState([]);
    const [hoveredMovieId, setHoveredMovieId] = useState(null);
    const [qrMap, setQrMap] = useState({});
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    useEffect(() => {
        fetchMovies();
    }, [search, page]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const fetchMovies = async () => {
        const response =
            search.trim() === ""
                ? await ApiMovie.getPopularMovies(page)
                : await ApiMovie.searchMovies(search, page);

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
            <div className="flex min-h-screen bg-black">
                <Sidebar />

                <main className="flex-1 px-6 py-10">
                    <SearchBar value={search} onChange={setSearch} />

                    <div className="flex justify-end gap-4 mb-6">
                        <button
                            onClick={() => navigate("/historial")}
                            className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition">Historial
                        </button>

                        <button
                            onClick={() => navigate("/favoritos")}
                            className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition">Favoritos ({favorites.length})
                        </button>
                    </div>

                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mt-8">
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
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleFavorite(movie);
                                    }}
                                    className="absolute top-2 right-2 z-30 bg-black/60 rounded-full px-2 text-2xl text-yellow-400"
                                >
                                    {isFavorite(favorites, movie.id) ? "⭐" : "☆"}
                                </button>

                                <img
                                    src={buildUrlImage(movie.poster_path)}
                                    className="rounded-xl shadow-lg group-hover:scale-105 transition"
                                />

                                <div className="absolute inset-0 bg-black/80 rounded-xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition">
                                    {hoveredMovieId === movie.id && qrMap[movie.id] && (
                                        <img src={qrMap[movie.id]} className="w-28 mb-3" />
                                    )}
                                    <p className="text-white text-sm text-center font-semibold">
                                        {movie.title}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-center gap-4 mt-10">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 bg-yellow-500 rounded disabled:opacity-40"
                        >
                            Anterior
                        </button>

                        <span className="text-white font-semibold">
                            {page} / {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 bg-yellow-500 rounded disabled:opacity-40"
                        >
                            Siguiente
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

export default Home;
