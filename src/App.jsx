import { useEffect, useState } from "react";
import { ApiMovie } from "./service/api-movie.js";
import { buildUrlImage } from "./utils/buildUrlImage.js";
import Modal from "./components/Modal.jsx";
import SearchBar from "./components/SearchBar.jsx";
import InformationMovie from "./components/InformationMovie.jsx";
import { generateQr } from "./helper/generateQr.js";

function App() {

    const [movies, setMovies] = useState([]);

    const [qrBase64, setQrBase64] = useState(null);

    const [isOpenModal, setIsOpenModal] = useState(false);

    const [search, setSearch] = useState("");

    const [selectedMovieId, setSelectedMovieId] = useState(null);

    const [showInfo, setShowInfo] = useState(false);

    const fetchPopularMovies = async () => {

        const response = await ApiMovie.getPopularMovies();
        setMovies(response.results);
    };

    const openMovieModal = async (id) => {

        const qrCode = await generateQr(id.toString());
        setQrBase64(qrCode);
        setSelectedMovieId(id);
        setShowInfo(false);
        setIsOpenModal(true);
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

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-white via-zinc-500 to-black px-6 py-10">

                <h1 className="text-4xl font-bold mb-6">
                    🎬 Películas
                </h1>

                <SearchBar value={search} onChange={setSearch} />

                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {movies.map(movie => (
                        <li
                            key={movie.id}
                            className="cursor-pointer"
                            onClick={() => openMovieModal(movie.id)}
                        >
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

                {!showInfo ? (
                    <>
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

                        <button
                            onClick={() => setShowInfo(true)}
                            className="w-full bg-black text-white py-2 rounded-xl"
                        >
                            Ver información
                        </button>
                    </>
                ) : (
                    <InformationMovie
                        movieId={selectedMovieId}
                        onBack={() => setShowInfo(false)}
                    />
                )}

            </Modal>
        </>
    );
}

export default App;
