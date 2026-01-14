import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiMovie } from "../service/api-movie.js";
import { buildUrlImage } from "../utils/buildUrlImage.js";
import { generateQr } from "../helper/generateQr.js";

import Modal from "../components/Modal.jsx";
import SearchBar from "../components/SearchBar.jsx";

function Home() {
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState("");

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [qrBase64, setQrBase64] = useState(null);

    // 🔹 Obtener películas populares
    const fetchPopularMovies = async () => {
        const response = await ApiMovie.getPopularMovies();
        setMovies(response.results);
    };

    // 🔹 Abrir modal con QR
    const openQrModal = async (id) => {
        const qrCode = await generateQr(id.toString());
        setQrBase64(qrCode);
        setIsOpenModal(true);
    };

    // 🔹 Ir a detalle de película
    const openMovieDetail = (id) => {
        navigate(`/movie/${id}`);
    };

    // 🔹 Cargar películas al iniciar
    useEffect(() => {
        fetchPopularMovies();
    }, []);

    // 🔹 Búsqueda con delay
    useEffect(() => {
        const delay = setTimeout(async () => {
            if (search.trim() === "") {
                fetchPopularMovies();
            } else {
                const response = await ApiMovie.searchMovies(search);
                setMovies(response.results);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [search]);

    return (
        <>
            {/* CONTENIDO PRINCIPAL */}
            <div className="min-h-screen bg-gradient-to-b from-white via-zinc-950 to-black px-6 py-10">

                {/* BOTONES SUPERIORES */}
                <div className="flex justify-center items-center gap-6 bg-black py-4 mb-8 rounded-xl">
                    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition">
                        Historial
                    </button>
                    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition">
                        Favoritos
                    </button>
                    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition">
                        Perfil
                    </button>
                </div>

                {/* TÍTULO */}
                <h1 className="text-4xl font-bold mb-6 text-white text-center">
                    Películas Top ⭐⭐⭐
                </h1>

                {/* BUSCADOR */}
                <SearchBar value={search} onChange={setSearch} />

                {/* CARTELERA */}
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {movies.map((movie) => (
                        <li
                            key={movie.id}
                            className="relative cursor-pointer group"
                            onClick={() => openMovieDetail(movie.id)}
                        >
                            {/* POSTER */}
                            <img
                                src={buildUrlImage(movie.poster_path)}
                                alt={movie.title}
                                className="rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* OVERLAY CON TÍTULO */}
                            <div
                                className="absolute inset-0 bg-black/70 rounded-xl
                           flex items-end justify-center pb-6
                           opacity-0 group-hover:opacity-100
                           transition-all duration-300
                           translate-y-4 group-hover:translate-y-0"
                            >
                                <p className="text-white text-center text-sm font-semibold px-3">
                                    {movie.title}
                                </p>
                            </div>

                            {/* BOTÓN QR */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openQrModal(movie.id);
                                }}
                                className="absolute top-2 right-2 bg-black/70 text-white text-xs px-3 py-1 rounded-lg hover:bg-black transition"
                            >
                                QR
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* MODAL QR */}
            <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <h2 className="text-lg font-bold text-center mb-4">
                    Código QR
                </h2>

                {qrBase64 && (
                    <img
                        src={qrBase64}
                        alt="QR"
                        className="mx-auto w-40 h-40 mb-4"
                    />
                )}
            </Modal>
        </>
    );
}

export default Home;
