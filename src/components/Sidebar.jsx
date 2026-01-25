import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <aside
            className="hidden lg:flex flex-col
                       w-64 min-h-screen
                       bg-[#0c0c0e] text-zinc-100
                       border-r border-zinc-800/40 sticky top-0"
        >
            <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">

                {/* Título Menú Simple */}
                <h2
                    onClick={() => navigate("/")}
                    className="text-lg font-medium mb-12 tracking-[0.2em] uppercase text-white cursor-pointer hover:text-yellow-500 transition-colors"
                >
                    Menú
                </h2>

                {/* SECCIÓN IDIOMAS */}
                <div className="mb-12">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-6 font-bold">
                        Idiomas
                    </h3>

                    <ul className="space-y-1">
                        {[
                            { code: "en", label: "Inglés", flag: "🇺🇸" },
                            { code: "es", label: "Español", flag: "🇪🇸" },
                            { code: "fr", label: "Francés", flag: "🇫🇷" },
                            { code: "ja", label: "Japonés", flag: "🇯🇵" },
                            { code: "ko", label: "Coreano", flag: "🇰🇷" },
                        ].map((lang) => (
                            <li
                                key={lang.code}
                                onClick={() => navigate(`/language/${lang.code}`)}
                                className={`
                                    flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
                                    ${isActive(`/language/${lang.code}`)
                                    ? "text-yellow-500 font-semibold bg-yellow-500/5"
                                    : "text-zinc-500 hover:text-zinc-200"
                                }
                                `}
                            >
                                <span className="text-base grayscale-[0.5]">{lang.flag}</span>
                                <span className="text-sm">{lang.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* SECCIÓN GÉNEROS */}
                <div className="mb-10">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-6 font-bold">
                        Géneros
                    </h3>

                    <ul className="flex flex-col gap-1">
                        {[
                            { id: 28, name: "Acción" },
                            { id: 12, name: "Aventura" },
                            { id: 16, name: "Animación" },
                            { id: 35, name: "Comedia" },
                            { id: 80, name: "Crimen" },
                            { id: 18, name: "Drama" },
                            { id: 27, name: "Terror" },
                            { id: 878, name: "Sci-Fi" },
                        ].map((genre) => (
                            <li
                                key={genre.id}
                                onClick={() => navigate(`/genre/${genre.id}/${genre.name}`)}
                                className={`
                                    px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all duration-200
                                    ${isActive(`/genre/${genre.id}/${genre.name}`)
                                    ? "text-yellow-500 font-semibold"
                                    : "text-zinc-500 hover:text-zinc-200"
                                }
                                `}
                            >
                                {genre.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;