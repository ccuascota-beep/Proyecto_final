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
            <div className="flex min-h-screen bg-[#08080a] text-zinc-100">
                <Sidebar />

                <main className="flex-1 px-4 md:px-10 py-12 max-w-[1600px] mx-auto">

                    <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
                        <div className="flex flex-col gap-6 w-full lg:max-w-2xl">
                            <h1 className="text-6xl font-black tracking-tighter italic">
                                POPCORN<span className="text-yellow-500">3</span>
                            </h1>
                            <div className="w-full relative">
                                <SearchBar value={search} onChange={setSearch} />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate("/historial")}
                                className="px-6 py-3 rounded-2xl bg-yellow-500 text-black hover:bg-yellow-400 transition-all text-sm font-bold flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                            >Historial
                            </button>
                            <button
                                className="px-6 py-3 rounded-2xl bg-yellow-500 text-black hover:bg-yellow-400 transition-all text-sm font-bold flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                            >Series
                            </button>
                            <button
                                onClick={() => navigate("/favoritos")}
                                className="px-6 py-3 rounded-2xl bg-yellow-500 text-black hover:bg-yellow-400 transition-all text-sm font-bold flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                            >★ Favoritos <span className="bg-black/10 px-2 py-0.5 rounded-full">{favorites.length}</span>
                            </button>
                        </div>
                    </div>

                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
                        {movies.map(movie => (
                            <li
                                key={movie.id}
                                className="group cursor-pointer"
                                onMouseEnter={() => handleMouseEnter(movie.id)}
                                onMouseLeave={() => setHoveredMovieId(null)}
                                onClick={() => {
                                    setSelectedMovieId(movie.id);
                                    setIsOpenModal(true);
                                }}
                            >
                                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 mb-4 transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:-translate-y-2 ring-1 ring-white/5">

                                    <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                                        <span className="text-yellow-500 font-bold text-xs">
                                            {movie.vote_average?.toFixed(1) || "N/A"}
                                        </span>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleFavorite(movie);
                                        }}
                                        className={`absolute top-3 right-3 z-20 p-2 rounded-xl transition-all duration-300 shadow-xl
                                            ${isFavorite(favorites, movie.id)
                                            ? "bg-yellow-500 text-black scale-110"
                                            : "bg-black/40 text-white opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10 hover:bg-white hover:text-black"}`}
                                    >★
                                    </button>

                                    <img
                                        src={buildUrlImage(movie.poster_path)}
                                        alt={movie.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />

                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {hoveredMovieId === movie.id && qrMap[movie.id] && (
                                            <div className="p-3 bg-white rounded-xl transform scale-75 lg:scale-90">
                                                <img src={qrMap[movie.id]} className="w-20 h-20" alt="QR" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="px-1">
                                    <h3 className="text-white font-semibold text-sm line-clamp-1 group-hover:text-yellow-500 transition-colors">
                                        {movie.title}
                                    </h3>
                                    <p className="text-zinc-500 text-xs font-medium mt-1 uppercase tracking-wider">
                                        {movie.release_date ? movie.release_date.split("-")[0] : "S/F"}
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
                        >Anterior
                        </button>

                        <div className="flex flex-col items-center">
                            <span className="text-white text-lg font-black">{page}</span>
                            <div className="h-1 w-8 bg-yellow-500 rounded-full mt-1"></div>
                        </div>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="group flex items-center gap-2 text-zinc-500 hover:text-yellow-500 disabled:opacity-20 transition-all font-bold"
                        >Siguiente
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