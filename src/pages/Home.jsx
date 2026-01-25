import { useEffect, useState } from "react";
import { ApiMovie } from "../service/api-movie.js";
import { buildUrlImage } from "../utils/buildUrlImage.js";
import Modal from "../components/Modal.jsx";
import SearchBar from "../components/SearchBar.jsx";
import InformationMovie from "../components/InformationMovie.jsx";
import { generateQr } from "../helper/generateQr.js";
import { getFavorites, saveFavorites, toggleFavorite, isFavorite } from "../helper/favorites.js";
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
            <div className="flex min-h-screen bg-[#0c0c0e] text-black">
                <Sidebar />

                <main className="flex-1 px-8 py-10 max-w-[1600px] mx-auto">

                    {/* --- HEADER PRINCIPAL --- */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-14">

                        {/* BLOQUE IZQUIERDO: Título + Buscador */}
                        <div className="flex flex-col gap-6 w-full max-w-xl">
                            <h1 className="text-5xl font-black tracking-tighter text-white">
                                Popcorn <span className="text-yellow-500">3</span>
                            </h1>

                            <div className="w-full">
                                <SearchBar value={search} onChange={setSearch} />
                            </div>
                        </div>

                        {/* BLOQUE DERECHO: Acciones */}
                        <div className="flex gap-3 flex-shrink-0">
                            <button
                                onClick={() => navigate("/historial")}
                                className="px-5 py-2.5 rounded-xl bg-zinc-900/50 text-zinc-400 border border-zinc-800/50 hover:text-white hover:bg-zinc-800 transition-all text-sm font-semibold"
                            >
                                Historial
                            </button>

                            <button
                                onClick={() => navigate("/favoritos")}
                                className="px-5 py-2.5 rounded-xl bg-zinc-900/50 text-zinc-400 border border-zinc-800/50 hover:text-yellow-500 hover:bg-zinc-800 transition-all text-sm font-semibold flex items-center gap-2"
                            >
                                <span>★</span> Favoritos ({favorites.length})
                            </button>
                        </div>
                    </div>

                    {/* --- GRID DE PELÍCULAS --- */}
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
                        {movies.map(movie => (
                            <li
                                key={movie.id}
                                className="relative group cursor-pointer rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/50 transition-all duration-500 ease-out hover:-translate-y-3 hover:border-yellow-500/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
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
                                    className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-yellow-500 hover:text-black shadow-2xl text-yellow-500"
                                >
                                    {isFavorite(favorites, movie.id) ? "★" : "☆"}
                                </button>

                                <div className="aspect-[2/3] w-full overflow-hidden bg-zinc-800">
                                    <img
                                        src={buildUrlImage(movie.poster_path)}
                                        alt={movie.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-24 pb-6 px-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-center">
                                    {hoveredMovieId === movie.id && qrMap[movie.id] && (
                                        <div className="flex justify-center mb-4 scale-90">
                                            <div className="p-2 bg-white rounded-lg shadow-2xl">
                                                <img src={qrMap[movie.id]} className="w-16 h-16" alt="QR" />
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-white text-sm font-bold tracking-tight">
                                        {movie.title}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* --- PAGINACIÓN --- */}
                    <div className="flex justify-center items-center gap-8 mt-20 pb-10">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900 text-white border border-zinc-800 transition-all hover:bg-zinc-800 disabled:opacity-10"
                        >
                            ←
                        </button>

                        <div className="text-center">
                            <span className="text-zinc-500 font-bold text-sm tracking-widest uppercase text-[10px] block mb-1">Página</span>
                            <span className="text-white font-black text-xl">{page} / {totalPages}</span>
                        </div>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 text-black font-bold transition-all hover:bg-yellow-400 disabled:opacity-10 shadow-lg shadow-yellow-500/10"
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

export default Home;