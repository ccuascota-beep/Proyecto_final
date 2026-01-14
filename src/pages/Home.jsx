import { useEffect, useState } from "react";
import {ApiMovie} from "../service/api-movie.js";
import {buildUrlImage} from "../utils/buildUrlImage.js";
import Modal from "../components/Modal.jsx";
import SearchBar from "../components/SearchBar.jsx";
import InformationMovie from "../components/InformationMovie.jsx";
import {generateQr} from "../helper/generateQr.js";

function Home() {
    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    const [hoveredMovieId, setHoveredMovieId] = useState(null);
    const [qrMap, setQrMap] = useState({});

    const fetchPopularMovies = async () => {
        const response = await ApiMovie.getPopularMovies();
        setMovies(response.results);
    };

    useEffect(() => {
        fetchPopularMovies();
    }, []);

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

    const handleMouseEnter = async (id) => {
        setHoveredMovieId(id);

        if (!qrMap[id]) {
            const qr = await generateQr(id.toString());
            setQrMap(prev => ({ ...prev, [id]: qr }));
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-white via-zinc-950 to-black px-6 py-10">

                <div className="flex justify-center gap-6 mb-8">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                        Historial
                    </button>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                        Favoritos
                    </button>
                </div>

                <h1 className="text-4xl font-bold mb-6 text-white text-center">
                    🎬 Películas Top
                </h1>

                <SearchBar value={search} onChange={setSearch} />

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
                            <img
                                src={buildUrlImage(movie.poster_path)}
                                alt={movie.title}
                                className="rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-black/80 rounded-xl
                                flex flex-col items-center justify-center
                                opacity-0 group-hover:opacity-100
                                transition-all duration-300">

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

export default Home;
