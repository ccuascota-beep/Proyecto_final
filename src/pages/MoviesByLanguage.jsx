import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApiMovie } from "../service/api-movie.js";
import { buildUrlImage } from "../utils/buildUrlImage.js";
import Sidebar from "../components/Sidebar.jsx";
import Modal from "../components/Modal.jsx";
import InformationMovie from "../components/InformationMovie.jsx";
import { generateQr } from "../helper/generateQr.js";

function MoviesByLanguage() {
    const { lang } = useParams();
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [hoveredMovieId, setHoveredMovieId] = useState(null);
    const [qrMap, setQrMap] = useState({});

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);

                const response = await ApiMovie.getMoviesByLanguage(lang, page);

                setMovies(response.results);
                setTotalPages(response.total_pages);
            } catch (error) {
                console.error("Error cargando películas", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [lang, page]);

    const handleMouseEnter = async (id) => {
        setHoveredMovieId(id);

        if (!qrMap[id]) {
            const qr = await generateQr(id.toString());
            setQrMap(prev => ({ ...prev, [id]: qr }));
        }
    };

    return (
        <>
            <div className="flex min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
                <Sidebar />

                <main className="flex-1 px-6 py-10">

                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            Idioma: {lang.toUpperCase()}
                        </h1>

                        <button
                            onClick={() => navigate("/")}
                            className="px-5 py-2 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 transition font-semibold">
                            Home
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-white text-center mt-20">
                            Cargando películas...
                        </p>
                    ) : (
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
                                    }}>

                                    <img
                                        src={buildUrlImage(movie.poster_path)}
                                        alt={movie.title}
                                        className="rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                                    />

                                    <div
                                        className="absolute inset-0 z-20
                                        bg-black/80 rounded-xl
                                        flex flex-col items-center justify-center
                                        opacity-0 group-hover:opacity-100
                                        transition-all duration-300
                                        pointer-events-none"
                                    >
                                        {hoveredMovieId === movie.id && qrMap[movie.id] && (
                                            <img
                                                src={qrMap[movie.id]}
                                                alt="QR"
                                                className="w-28 h-28 mb-3"
                                            />
                                        )}

                                        <p className="text-white text-sm font-semibold text-center px-3">
                                            {movie.title}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* PAGINACIÓN */}
                    <div className="flex justify-center items-center gap-6 mt-12">
                        <button
                            onClick={() => setPage(p => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-lg bg-zinc-700 text-white disabled:opacity-40 hover:bg-zinc-600 transition">
                            Atrás
                        </button>

                        <span className="text-white text-sm">
                            Página {page} de {totalPages}
                        </span>

                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages}
                            className="px-4 py-2 rounded-lg bg-zinc-700 text-white disabled:opacity-40 hover:bg-zinc-600 transition">
                            Siguiente
                        </button>
                    </div>

                </main>
            </div>

            <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <InformationMovie
                    movieId={selectedMovieId}
                    onBack={() => setIsOpenModal(false)}
                />
            </Modal>
        </>
    );
}

export default MoviesByLanguage;
