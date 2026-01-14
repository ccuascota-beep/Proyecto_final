export default function Modal({
                                  isOpen,
                                  onClose,
                                  children,
                                  trailerKey,
                                  cast = [],
                              }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
                       bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl max-h-[90vh]
                           bg-zinc-900 text-white rounded-2xl
                           shadow-2xl p-8 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-5
                               text-white/70 hover:text-red-500
                               text-3xl font-bold transition-colors"
                >
                    ✕
                </button>

                {/* Trailer */}
                {trailerKey && (
                    <div className="w-full max-w-3xl mx-auto mb-6">
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${trailerKey}`}
                                title="Trailer"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}

                {/* Contenido principal (título + descripción) */}
                {children}

                {/* Actores debajo de la descripción */}
                {cast.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">
                            Reparto
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {cast.slice(0, 10).map((actor) => (
                                <div
                                    key={actor.id}
                                    className="text-center"
                                >
                                    <img
                                        src={
                                            actor.profile_path
                                                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
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
            </div>
        </div>
    );
}
