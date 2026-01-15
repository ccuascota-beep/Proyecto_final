import { useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    return (
        <aside
            className="hidden lg:flex flex-col
                       w-72 min-h-screen
                       bg-zinc-950 text-white
                       border-r border-white/10"
        >
            <div className="flex-1 overflow-y-auto px-6 py-8">

                <h2
                    onClick={() => navigate("/")}
                    className="text-2xl font-extrabold mb-10 tracking-wide cursor-pointer hover:text-blue-400 transition"
                >
                    🎬 MovieApp
                </h2>

                <div className="mb-10">
                    <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                        Idiomas
                    </h3>

                    <ul className="space-y-2 text-sm">
                        <li onClick={() => navigate("/language/en")} className="cursor-pointer hover:text-white text-gray-300">🇺🇸 Inglés</li>
                        <li onClick={() => navigate("/language/es")} className="cursor-pointer hover:text-white text-gray-300">🇪🇸 Español</li>
                        <li onClick={() => navigate("/language/fr")} className="cursor-pointer hover:text-white text-gray-300">🇫🇷 Francés</li>
                        <li onClick={() => navigate("/language/ja")} className="cursor-pointer hover:text-white text-gray-300">🇯🇵 Japonés</li>
                        <li onClick={() => navigate("/language/ko")} className="cursor-pointer hover:text-white text-gray-300">🇰🇷 Coreano</li>
                    </ul>
                </div>

                <div className="mb-10">
                    <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                        Géneros
                    </h3>

                    <ul className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                        <li className="hover:text-white cursor-pointer">Acción</li>
                        <li className="hover:text-white cursor-pointer">Aventura</li>
                        <li className="hover:text-white cursor-pointer">Animación</li>
                        <li className="hover:text-white cursor-pointer">Comedia</li>
                        <li className="hover:text-white cursor-pointer">Crimen</li>
                        <li className="hover:text-white cursor-pointer">Documental</li>
                        <li className="hover:text-white cursor-pointer">Drama</li>
                        <li className="hover:text-white cursor-pointer">Fantasía</li>
                        <li className="hover:text-white cursor-pointer">Historia</li>
                        <li className="hover:text-white cursor-pointer">Misterio</li>
                        <li className="hover:text-white cursor-pointer">Romance</li>
                        <li className="hover:text-white cursor-pointer">Sci-Fi</li>
                        <li className="hover:text-white cursor-pointer">Suspenso</li>
                        <li className="hover:text-white cursor-pointer">Terror</li>
                        <li className="hover:text-white cursor-pointer">Western</li>
                    </ul>
                </div>

                <div className="mb-10">
                    <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                        Puntuación
                    </h3>

                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="hover:text-white cursor-pointer">⭐⭐⭐⭐⭐ (9–10)</li>
                        <li className="hover:text-white cursor-pointer">⭐⭐⭐⭐ (7–8)</li>
                        <li className="hover:text-white cursor-pointer">⭐⭐⭐ (5–6)</li>
                        <li className="hover:text-white cursor-pointer">⭐⭐ (3–4)</li>
                    </ul>
                </div>

                <div className="mb-10">
                    <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                        Año
                    </h3>

                    <ul className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                        <li className="hover:text-white cursor-pointer">2020s</li>
                        <li className="hover:text-white cursor-pointer">2010s</li>
                        <li className="hover:text-white cursor-pointer">2000s</li>
                        <li className="hover:text-white cursor-pointer">1990s</li>
                        <li className="hover:text-white cursor-pointer">Clásicos</li>
                    </ul>
                </div>

            </div>
        </aside>
    );
}

export default Sidebar;
