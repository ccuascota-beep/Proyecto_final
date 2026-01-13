import { useEffect, useState } from "react";
import { ApiMovie } from "../service/api-movie.js";

export default function InformationMovie({ movieId, onBack }) {

    const [details, setDetails] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [actors, setActors] = useState([]);

    useEffect(() => {
        const fetchInfo = async () => {
            const movieDetails = await ApiMovie.getMovieDetails(movieId);
            const videos = await ApiMovie.getMovieVideos(movieId);
            const credits = await ApiMovie.getMovieCredits(movieId);

            setDetails(movieDetails);

            const trailerVideo = videos.results.find(
                v => v.type === "Trailer" && v.site === "YouTube"
            );
            setTrailer(trailerVideo);

            setActors(credits.cast.slice(0, 5));
        };

        fetchInfo();
    }, [movieId]);

    if (!details) return <p>Cargando información...</p>;

    return (
        <div>
            <button
                onClick={onBack}
                className="mb-4px-4 py-2text-sm text-white bg-black border border-white rounded hover:bg-gray-900"
            >
                Volver
            </button>


            <h2 className="text-xl font-bold mb-2">{details.title}</h2>
            <p className="text-sm mb-2">
                Año: {details.release_date?.split("-")[0]}
            </p>

            {trailer && (
                <iframe
                    className="w-full h-56 mb-4 rounded-xl"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Trailer"
                    allowFullScreen
                />
            )}

            <h3 className="font-semibold mb-2"> Actores</h3>
            <ul className="text-sm list-disc list-inside">
                {actors.map(actor => (
                    <li key={actor.id}>{actor.name}</li>
                ))}
            </ul>
        </div>
    );
}