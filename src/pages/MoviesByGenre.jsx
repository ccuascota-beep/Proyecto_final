import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApiMovie } from "../service/api-movie.js";
import { buildUrlImage } from "../utils/buildUrlImage.js";
import Sidebar from "../components/Sidebar.jsx";
import Modal from "../components/Modal.jsx";
import InformationMovie from "../components/InformationMovie.jsx";
import { generateQr } from "../helper/generateQr.js";
import {
    getFavorites,
    saveFavorites,
    toggleFavorite,
    isFavorite
} from "../helper/favorites.js";

function MoviesByGenre() {
    const { genreId, genreName } = useParams();
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [favorites, setFavorites] = useState([]);
    const [hoveredMovieId, setHoveredMovieId] = useState(null);
    const [qrMap, setQrMap] = useState({});
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);

    // cargar favoritos
    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    // reset página al cambiar género
    useEffect(() => {
        setPage(1);
    }, [genreId]);

    // cargar películas por género + página
    useEffect(() => {
        fetchMovies();
    }, [genreId, page]);

    const fetchMovies = async () => {
        const response = await ApiMovie.getMoviesByGenre(genreId, page);
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
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            Género: {genreName}
                        </h1>

                        <button
                            onClick={() => navigate("/")}
                            className="px-5 py-2 bg-yellow-500 rounded-xl font-semibold"
                        >
                            Home
                        </button>
                    </div>

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
                                    alt={movie.title}
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

                    {/* PAGINADO */}
                    <div className="flex justify-center gap-4 mt-10 text-white">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 bg-yellow-500 rounded disabled:opacity-40"
                        >
                            Atrás
                        </button>

                        <span className="font-semibold">
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

export default MoviesByGenre;
