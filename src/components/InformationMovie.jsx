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

                setActors(creditsData.cast.slice(0, 12));
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
            <button
                onClick={onBack}
                className="mb-4 px-4 py-2 bg-blue-600 rounded-lg"
            >
                ⬅ Volver
            </button>

            {/* POSTER + INFO */}
            <div className="flex flex-col md:flex-row gap-8">
                <img
                    src={buildUrlImage(movie.poster_path)}
                    alt={movie.title}
                    className="w-64 rounded-xl shadow-lg"
                />

                <div>
                    <h2 className="text-3xl font-bold mb-2">
                        {movie.title}
                    </h2>

                    <p className="text-gray-300 mb-2">
                        📅 Año: {movie.release_date?.split("-")[0]}
                    </p>

                    <p className="text-gray-300 mb-2">
                        🎭 Géneros: {movie.genres.map(g => g.name).join(", ")}
                    </p>

                    <p className="mt-4 text-sm leading-relaxed">
                        {movie.overview}
                    </p>
                </div>
            </div>

            {/* TRAILER */}
            {trailer && (
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-4">
                        🎬 Trailer
                    </h3>

                    <div className="aspect-video">
                        <iframe
                            className="w-full h-full rounded-xl"
                            src={`https://www.youtube.com/embed/${trailer}`}
                            title="Trailer"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

            {/* ACTORES */}
            <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">
                    🎭 Actores
                </h3>

                <div className="flex flex-wrap gap-6">
                    {actors.map(actor => (
                        <div
                            key={actor.id}
                            className="flex flex-col items-center w-24"
                        >
                            <img
                                src={
                                    actor.profile_path
                                        ? buildUrlImage(actor.profile_path)
                                        : "https://via.placeholder.com/150"
                                }
                                alt={actor.name}
                                className="w-20 h-20 rounded-full object-cover mb-2"
                            />
                            <p className="text-xs text-center">
                                {actor.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default InformationMovie;
