import { useEffect, useState } from "react";
import { ApiMovie } from "../service/api-movie.js";
import {buildUrlImage} from "./buildUrlImage.js";
import Modal from "../components/Modal.jsx";
import InformationMovie from "../components/InformationMovie.jsx";
import { generateQr } from "../helper/generateQr.js";
import { getFavorites, isFavorite, toggleFavorite } from "../utils/favorites.js";

function Favorites() {
    const [movies, setMovies] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [hoveredMovieId, setHoveredMovieId] = useState(null);
    const [qrMap, setQrMap] = useState({});

    useEffect(() => {
        const loadFavorites = async () => {
            const ids = getFavorites();
            const requests = ids.map(id => ApiMovie.getMovieById(id));
            const results = await Promise.all(requests);
            setMovies(results);
        };
        loadFavorites();
    }, []);

    const handleMouseEnter = async (id) => {
        setHoveredMovieId(id);
        if (!qrMap[id]) {
            const qr = await generateQr(id.toString());
            setQrMap(prev => ({ ...prev, [id]: qr }));
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 px-6 py-10">
                <h1 className="text-4xl font-bold mb-8 text-white text-center">Mis Favoritos</h1>

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
                                    toggleFavorite(movie.id);
                                    setMovies(prev => prev.filter(m => m.id !== movie.id));
                                }}
                                className="absolute top-2 right-2 z-20
                                           bg-black/60 rounded-full px-2
                                           text-2xl"
                            >
                                {isFavorite(movie.id) ? "⭐" : "☆"}
                            </button>

                            <img
                                src={buildUrlImage(movie.poster_path)}
                                alt={movie.title}
                                className="rounded-xl shadow-lg"
                            />
                        </li>
                    ))}
                </ul>
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

export default Favorites;
