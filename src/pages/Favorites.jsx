import { useEffect, useState } from "react";
import { getFavorites, saveFavorites } from "../helper/favorites.js";
import { ApiMovie } from "../service/api-movie.js";
import { buildUrlImage } from "../utils/buildUrlImage.js";
import { useNavigate } from "react-router-dom";

function Favorites() {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadFavorites = async () => {
            const ids = getFavorites();
            const responses = await Promise.all(
                ids.map(id => ApiMovie.getMovieById(id))
            );
            setMovies(responses);
        };

        loadFavorites();
    }, []);

    const removeFavorite = (id) => {
        const updated = getFavorites().filter(favId => favId !== id);
        saveFavorites(updated);
        setMovies(prev => prev.filter(movie => movie.id !== id));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 px-6 py-10">
            <button
                onClick={() => navigate("/")}
                className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg">Volver
            </button>

            <h1 className="text-4xl font-bold text-white text-center mb-8">Mis Favoritos</h1>

            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {movies.map(movie => (
                    <li key={movie.id} className="relative">
                        <button
                            onClick={() => removeFavorite(movie.id)}
                            className="absolute top-2 right-2 z-20
                                       bg-black/60 rounded-full px-2
                                       text-2xl text-yellow-400">⭐
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
    );
}

export default Favorites;
