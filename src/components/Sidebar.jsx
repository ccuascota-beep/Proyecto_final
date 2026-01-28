import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => decodeURIComponent(location.pathname) === path;

    return (
        <aside
            className="hidden lg:flex flex-col
                       w-64 min-h-screen
                       bg-black text-white
                       border-r border-zinc-500 sticky top-0"
        >
            <div className="flex-1 overflow-y-auto px-6 py-12 custom-scrollbar">

                <div className="px-3 mb-10">
                    <h2 className="text-2xl font-black tracking-tighter text-white italic">
                        Menu
                    </h2>
                    <div className="h-1 w-8 bg-yellow-500 rounded-full mt-2"></div>
                </div>

                <nav className="space-y-10">

                    <div>
                        <h3 className="px-3 text-[10px] uppercase tracking-[0.25em] text-zinc-400 mb-6 font-black">
                            Idiomas
                        </h3>

                        <ul className="space-y-1">
                            {[
                                { code: "en", label: "Inglés", flag: "🇺🇸" },
                                { code: "es", label: "Español", flag: "🇪🇸" },
                                { code: "fr", label: "Francés", flag: "🇫🇷" },
                                { code: "ja", label: "Japonés", flag: "🇯🇵" },
                                { code: "ko", label: "Coreano", flag: "🇰🇷" },
                            ].map((lang) => {
                                const path = `/language/${lang.code}`;
                                return (
                                    <li
                                        key={lang.code}
                                        onClick={() => navigate(path)}
                                        className={`
                                            flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-300 group
                                            ${isActive(path)
                                            ? "text-yellow-500 bg-yellow-500/10 font-bold"
                                            : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-100"
                                        }
                                        `}
                                    >
                                        <span className={`text-base transition-transform duration-300 group-hover:scale-125 ${isActive(path) ? "grayscale-0" : "grayscale"}`}>
                                            {lang.flag}
                                        </span>
                                        <span className="text-sm tracking-wide">{lang.label}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="border-t border-zinc-500 mx-0"></div>

                    <div>
                        <h3 className="px-3 text-[10px] uppercase tracking-[0.25em] text-zinc-400 mb-6 font-black">
                            Géneros
                        </h3>

                        <ul className="grid grid-cols-1 gap-1">
                            {[
                                { id: 28, name: "Acción" },
                                { id: 12, name: "Aventura" },
                                { id: 16, name: "Animación" },
                                { id: 35, name: "Comedia" },
                                { id: 80, name: "Crimen" },
                                { id: 18, name: "Drama" },
                                { id: 27, name: "Terror" },
                                { id: 878, name: "Sci-Fi" },
                            ].map((genre) => {
                                const path = `/genre/${genre.id}/${genre.name}`;
                                return (
                                    <li
                                        key={genre.id}
                                        onClick={() => navigate(path)}
                                        className={`
                                            px-4 py-2 rounded-xl text-sm cursor-pointer transition-all duration-300
                                            ${isActive(path)
                                            ? "text-yellow-500 bg-yellow-500/10 font-bold ring-1 ring-yellow-500/20"
                                            : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-100"
                                        }
                                        `}
                                    >
                                        {genre.name}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>
            </div>

        </aside>
    );
}

export default Sidebar;