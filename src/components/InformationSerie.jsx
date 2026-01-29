import { useEffect, useState } from "react";
import { ApiMovie } from "../service/api-movie.js";
import { buildUrlImage } from "../utils/buildUrlImage.js";

function InformationSerie({ serieId }) {
    const [serie, setSerie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [actors, setActors] = useState([]);
    const [creator, setCreator] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!serieId) return;

        const loadData = async () => {
            try {
                setLoading(true);

                const [serieData, videoData, creditsData] = await Promise.all([
                    ApiMovie.getSerieById(serieId),
                    ApiMovie.getSerieVideos(serieId),
                    ApiMovie.getSerieCredits(serieId)
                ]);

                setSerie(serieData);

                const creatorName =
                    serieData.created_by?.length > 0
                        ? serieData.created_by.map(c => c.name).join(", ")
                        : "No disponible";

                setCreator(creatorName);

                const yt = videoData.results.find(
                    v => v.site === "YouTube" && ["Trailer", "Teaser"].includes(v.type)
                );
                setTrailer(yt?.key || null);

                setActors(creditsData.cast.slice(0, 12));
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [serieId]);

    if (!serieId || loading)
        return <div className="p-20 text-center text-zinc-500 italic">Cargando detalles de la serie...</div>;

    return (
        <div className="bg-[#0c0c0e] text-white rounded-3xl overflow-hidden max-w-6xl mx-auto shadow-2xl border border-zinc-800/50 animate-in fade-in duration-500">

            <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-12 bg-gradient-to-b from-zinc-900/20 to-transparent">

                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/20">
                        <img
                            src={buildUrlImage(serie.poster_path)}
                            alt={serie.name}
                            className="w-full h-auto"
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <h1 className="text-4xl font-black mb-2 tracking-tight">
                        {serie.name}
                        <span className="text-zinc-600 font-light ml-2">
                            ({serie.first_air_date?.split("-")[0]})
                        </span>
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-6 font-medium uppercase tracking-wider">
                        <span>{serie.first_air_date}</span>
                        <span>•</span>
                        <span>{serie.genres.map(g => g.name).join(", ")}</span>
                        <span>•</span>
                        <span>{serie.number_of_seasons} Temp.</span>
                        <span>•</span>
                        <span>{serie.number_of_episodes} Ep.</span>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-full border-[3px] border-green-500 flex items-center justify-center bg-black">
                            <span className="text-lg font-black text-green-400">
                                {Math.round(serie.vote_average * 10)}%
                            </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 leading-tight">
                            Puntuación <br /> de usuarios
                        </span>
                    </div>

                    <h3 className="text-sm font-bold mb-2 text-zinc-400 uppercase tracking-widest">
                        Vista general
                    </h3>
                    <p className="text-zinc-300 leading-relaxed text-sm mb-8 max-w-3xl font-light">
                        {serie.overview}
                    </p>

                    <div>
                        <p className="font-bold text-white text-base tracking-tight">
                            {creator}
                        </p>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-semibold">
                            Creador
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-8 md:px-12 py-10 bg-[#0c0c0e] border-t border-zinc-900/50">
                <h3 className="text-xs font-bold mb-8 uppercase tracking-[0.3em] text-zinc-500">
                    Reparto principal
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-y-8 gap-x-4">
                    {actors.map(actor => (
                        <div key={actor.id} className="group flex flex-col items-center text-center">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-lg border border-zinc-800 transition-all duration-300 group-hover:border-zinc-600 group-hover:-translate-y-1">
                                <img
                                    src={
                                        actor.profile_path
                                            ? buildUrlImage(actor.profile_path, "w185")
                                            : "https://via.placeholder.com/150x150?text=N/A"
                                    }
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    alt={actor.name}
                                />
                            </div>
                            <div className="mt-3 w-full">
                                <p className="font-bold text-[11px] leading-tight text-zinc-200 group-hover:text-white transition-colors truncate">
                                    {actor.name}
                                </p>
                                <p className="text-[9px] text-zinc-500 leading-tight mt-1 truncate italic">
                                    {actor.character}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {trailer && (
                <div className="bg-black border-t border-zinc-900 p-10 md:p-14">
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-center text-zinc-600 uppercase tracking-[0.5em] text-[9px] mb-10 font-bold">
                            Multimedia / Tráiler Oficial
                        </h3>
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.7)] border border-zinc-800">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${trailer}?rel=0&modestbranding=1`}
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InformationSerie;
