import { useEffect, useState } from "react";
import { ApiMovie } from "../service/api-movie.js";
import { buildUrlImage } from "../utils/buildUrlImage.js";

function InformationMovie({ movieId, onBack }) {
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!movieId) return;

        const loadData = async () => {
            try {
                setLoading(true);

                const [movieData, videoData, creditsData] =
                    await Promise.all([
                        ApiMovie.getMovieById(movieId),
                        ApiMovie.getMovieVideos(movieId),
                        ApiMovie.getMovieCredits(movieId)
                    ]);

                setMovie(movieData);

                const yt = videoData.results.find(
                    v => v.type === "Trailer" && v.site === "YouTube"
                );
                setTrailer(yt?.key || null);

                setActors(creditsData.cast.slice(0, 10));
            } catch (error) {
                console.error("Error cargando información", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [movieId]);

    if (!movieId) return null;

    if (loading) {
        return (
            <div className="text-white text-center py-10">
                Cargando información...
            </div>
        );
    }

    return (
        <div className="text-white max-w-5xl mx-auto">
            {/* Botón volver */}
            <button
                onClick={onBack}
                className="mb-6 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
                Volver
            </button>

            {/* Info principal */}
            <div className="flex flex-col md:flex-row gap-8">
                <img
                    src={buildUrlImage(movie.poster_path)}
                    alt={movie.title}
                    className="w-64 rounded-xl shadow-lg mx-auto md:mx-0"
                />

                <div>
                    <h2 className="text-3xl font-bold mb-2">
                        {movie.title}
                    </h2>

                    <p className="text-gray-300 mb-1">
                        Año: {movie.release_date?.split("-")[0]}
                    </p>

                    <p className="text-gray-300 mb-3">
                        Géneros: {movie.genres.map(g => g.name).join(", ")}
                    </p>

                    {/* Descripción */}
                    <p className="mt-4 text-sm leading-relaxed text-gray-200">
                        {movie.overview}
                    </p>
                </div>
            </div>

            {/* 🎭 ACTORES DEBAJO DE LA DESCRIPCIÓN */}
            {actors.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-2xl font-semibold mb-4">
                        Reparto
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {actors.map(actor => (
                            <div
                                key={actor.id}
                                className="text-center"
                            >
                                <img
                                    src={
                                        actor.profile_path
                                            ? buildUrlImage(actor.profile_path, "w185")
                                            : "https://via.placeholder.com/185x278?text=No+Image"
                                    }
                                    alt={actor.name}
                                    className="w-full h-48 object-cover rounded-xl mb-2"
                                />
                                <p className="text-sm text-gray-300">
                                    {actor.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 🎬 Trailer más pequeño */}
            {trailer && (
                <div className="mt-10">
                    <h3 className="text-2xl font-semibold mb-4">
                        Trailer
                    </h3>

                    <div className="w-full max-w-3xl mx-auto">
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${trailer}`}
                                title="Trailer"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InformationMovie;
