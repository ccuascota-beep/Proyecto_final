import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Modal from "../components/Modal.jsx";
import InformationMovie from "../components/InformationMovie.jsx";
import { buildUrlImage } from "../utils/buildUrlImage.js";
import { generateQr } from "../helper/generateQr.js";
import { getFavorites, saveFavorites, toggleFavorite, isFavorite } from "../helper/favorites.js";

function Favorites() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [hoveredMovieId, setHoveredMovieId] = useState(null);
    const [qrMap, setQrMap] = useState({});
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    const handleMouseEnter = async (id) => {
        if (!id) return;
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

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
                        <div>
                            <h1 className="text-5xl font-black text-white tracking-tighter">
                                Mis <span className="text-yellow-500">Favoritos</span>
                                <span className="ml-4 text-zinc-700 font-medium text-xl tracking-normal">
                                    {favorites.length}
                                </span>
                            </h1>
                        </div>

                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white transition-all font-bold text-sm flex items-center gap-2 w-fit shadow-xl"
                        >
                            <span>Home</span>
                        </button>
                    </div>

                    {favorites.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-zinc-900 rounded-3xl">
                            <h2 className="text-2xl font-bold text-zinc-400">Aún no tienes favoritos</h2>
                            <p className="text-zinc-600 mt-2 max-w-xs mx-auto">
                                Las películas que marques con una estrella aparecerán aquí.
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="mt-8 text-yellow-500 font-bold hover:underline"
                            >Ir a la cartelera
                            </button>
                        </div>
                    ) : (
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
                            {favorites.map(fav => (
                                <li
                                    key={fav.id}
                                    className="group cursor-pointer"
                                    onMouseEnter={() => handleMouseEnter(fav.id)}
                                    onMouseLeave={() => setHoveredMovieId(null)}
                                    onClick={() => {
                                        setSelectedMovieId(fav.id);
                                        setIsOpenModal(true);
                                    }}
                                >
                                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 mb-4 transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:-translate-y-2 ring-1 ring-white/5">

                                        {fav.vote_average && (
                                            <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                                                <span className="text-yellow-500 font-bold text-xs">
                                                    {fav.vote_average.toFixed(1)}
                                                </span>
                                            </div>
                                        )}

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleFavorite(fav);
                                            }}
                                            className="absolute top-3 right-3 z-20 p-2 rounded-xl transition-all duration-300 shadow-xl bg-yellow-500 text-black scale-110 hover:bg-red-500 hover:text-white group/btn"
                                        >
                                            <span className="group-hover/btn:hidden">★</span>
                                            <span className="hidden group-hover/btn:block text-xs font-bold">✕</span>
                                        </button>

                                        <img
                                            src={buildUrlImage(fav.poster_path)}
                                            alt={fav.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {hoveredMovieId === fav.id && qrMap[fav.id] && (
                                                <div className="p-3 bg-white rounded-xl transform scale-75 lg:scale-90">
                                                    <img src={qrMap[fav.id]} className="w-20 h-20" alt="QR" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="px-1">
                                        <h3 className="text-white font-semibold text-sm line-clamp-1 group-hover:text-yellow-500 transition-colors">
                                            {fav.title}
                                        </h3>
                                        <p className="text-zinc-500 text-xs font-medium mt-1 uppercase tracking-wider">
                                            {fav.release_date ? fav.release_date.split("-")[0] : "S/F"}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </main>
            </div>

            <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <InformationMovie movieId={selectedMovieId} />
            </Modal>
        </>
    );
}

export default Favorites;