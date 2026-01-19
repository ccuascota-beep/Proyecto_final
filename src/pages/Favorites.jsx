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

    // 🔹 cargar favoritos desde localStorage
    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    // 🔹 generar QR (PROTEGIDO contra undefined)
    const handleMouseEnter = async (id) => {
        if (!id) return; // 👈 evita el error toString

        setHoveredMovieId(id);

        if (!qrMap[id]) {
            const qr = await generateQr(id.toString());
            setQrMap(prev => ({ ...prev, [id]: qr }));
        }
    };

    // 🔹 quitar de favoritos (misma lógica que Home)
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
                        <h1 className="text-3xl text-white font-bold">
                            ⭐ Mis Favoritos
                        </h1>

                        <button
                            onClick={() => navigate("/")}
                            className="px-5 py-2 bg-yellow-500 rounded-xl font-semibold">
                            Volver
                        </button>
                    </div>

                    {favorites.length === 0 ? (
                        <p className="text-white text-center mt-20">
                            No hay favoritos todavía
                        </p>
                    ) : (
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                            {favorites.map(fav => (
                                <li
                                    key={fav.id}
                                    className="relative group cursor-pointer"
                                    onMouseEnter={() => handleMouseEnter(fav.id)}
                                    onMouseLeave={() => setHoveredMovieId(null)}
                                    onClick={() => {
                                        setSelectedMovieId(fav.id);
                                        setIsOpenModal(true);
                                    }}
                                >
                                    {/* ⭐ estrella */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleFavorite(fav);
                                        }}
                                        className="absolute top-2 right-2 z-30 bg-black/60 rounded-full px-2 text-2xl text-yellow-400"
                                    >
                                        {isFavorite(favorites, fav.id) ? "⭐" : "☆"}
                                    </button>

                                    <img
                                        src={buildUrlImage(fav.poster_path)}
                                        alt={fav.title}
                                        className="rounded-xl shadow-lg group-hover:scale-105 transition"
                                    />

                                    {/* overlay */}
                                    <div className="absolute inset-0 bg-black/80 rounded-xl
                                        opacity-0 group-hover:opacity-100 flex flex-col
                                        items-center justify-center transition">

                                        {hoveredMovieId === fav.id && qrMap[fav.id] && (
                                            <img
                                                src={qrMap[fav.id]}
                                                alt="QR"
                                                className="w-28 mb-3"
                                            />
                                        )}

                                        <p className="text-white text-sm text-center font-semibold px-2">
                                            {fav.title}
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
