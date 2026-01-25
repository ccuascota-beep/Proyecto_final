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
            <div className="flex min-h-screen bg-[#0c0c0e] text-zinc-100">
                <Sidebar />

                <main className="flex-1 px-6 py-10 max-w-[1600px] mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">
                            Mis <span className="text-yellow-500">Favoritos</span>
                            <span className="ml-4 text-zinc-600 font-medium text-lg tracking-normal">
                                {favorites.length} {favorites.length === 1 ? 'película' : 'películas'}
                            </span>
                        </h1>

                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700/50 hover:bg-zinc-700 hover:text-white transition-all active:scale-95 flex items-center gap-2 w-fit shadow-lg"
                        >
                            <span>🏠</span> Volver
                        </button>
                    </div>

                    {favorites.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mt-32 text-center">
                            <div className="text-6xl mb-4 opacity-20">⭐</div>
                            <h2 className="text-2xl font-semibold text-zinc-500">Tu lista está vacía</h2>
                            <p className="text-zinc-600 mt-2 max-w-xs">
                                Explora la cartelera y guarda tus películas favoritas para verlas aquí.
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="mt-8 px-8 py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/10"
                            >
                                Explorar Películas
                            </button>
                        </div>
                    ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
                            {favorites.map(fav => (
                                <li
                                    key={fav.id}
                                    className="
                                      relative group cursor-pointer rounded-2xl overflow-hidden
                                      bg-zinc-900 border border-zinc-800/50
                                      transition-all duration-500 ease-out
                                      hover:-translate-y-3 hover:border-yellow-500/50
                                      hover:shadow-[0_30px_60px_rgba(0,0,0,0.8)]
                                    "
                                    onMouseEnter={() => handleMouseEnter(fav.id)}
                                    onMouseLeave={() => setHoveredMovieId(null)}
                                    onClick={() => {
                                        setSelectedMovieId(fav.id);
                                        setIsOpenModal(true);
                                    }}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleFavorite(fav);
                                        }}
                                        className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black shadow-2xl"
                                    >
                                        ★
                                    </button>

                                    <div className="aspect-[2/3] w-full overflow-hidden bg-zinc-800">
                                        <img
                                            src={buildUrlImage(fav.poster_path)}
                                            alt={fav.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-20 pb-6 px-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        {hoveredMovieId === fav.id && qrMap[fav.id] && (
                                            <div className="flex justify-center mb-4">
                                                <div className="p-2 bg-white rounded-xl shadow-2xl transform scale-110">
                                                    <img src={qrMap[fav.id]} className="w-18 h-18" alt="QR" />
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-white text-base text-center font-bold drop-shadow-lg leading-tight">
                                            {fav.title}
                                        </p>
                                    </div>

                                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                                        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-1000"></div>
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