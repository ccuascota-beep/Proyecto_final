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
            setLoading(true);
            const response = await ApiMovie.getMoviesByLanguage(lang, page);
            setMovies(response.results);
            setTotalPages(response.total_pages);
            setLoading(false);
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
            <div className="flex min-h-screen bg-black">
                <Sidebar />
                <main className="flex-1 px-6 py-10">
                    <div className="flex justify-between mb-8">
                        <h1 className="text-3xl text-white font-bold">
                            Idioma: {lang.toUpperCase()}
                        </h1>
                        <button onClick={() => navigate("/")}
                                className="px-5 py-2 bg-yellow-500 rounded-xl font-semibold">
                            Home
                        </button>
                    </div>

                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {movies.map(movie => (
                            <li key={movie.id}
                                onMouseEnter={() => handleMouseEnter(movie.id)}
                                onMouseLeave={() => setHoveredMovieId(null)}
                                onClick={() => {
                                    setSelectedMovieId(movie.id);
                                    setIsOpenModal(true);
                                }}
                                className="relative group cursor-pointer">

                                <img
                                    src={buildUrlImage(movie.poster_path)}
                                    className="rounded-xl shadow-lg group-hover:scale-105 transition"
                                />

                                <div className="absolute inset-0 bg-black/80 rounded-xl
                                    opacity-0 group-hover:opacity-100 flex flex-col
                                    items-center justify-center transition">
                                    {hoveredMovieId === movie.id && qrMap[movie.id] && (
                                        <img src={qrMap[movie.id]} className="w-28 mb-3" />
                                    )}
                                    <p className="text-white text-sm text-center">{movie.title}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-center gap-6 mt-10 text-white">
                        <button disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 bg-zinc-700 rounded">
                            Atrás
                        </button>

                        <span>Página {page} de {totalPages}</span>

                        <button disabled={page >= totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 bg-zinc-700 rounded">
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

export default MoviesByLanguage;
