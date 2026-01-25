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
                    className="text-2xl font-extrabold mb-10 tracking-wide cursor-pointer hover:text-blue-400 transition">Menu
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
                        <li onClick={() => navigate("/genre/28/Acción")} className="hover:text-white cursor-pointer">Acción</li>

                        <li onClick={() => navigate("/genre/12/Aventura")} className="hover:text-white cursor-pointer">Aventura</li>

                        <li onClick={() => navigate("/genre/16/Animación")} className="hover:text-white cursor-pointer">Animación</li>

                        <li onClick={() => navigate("/genre/35/Comedia")} className="hover:text-white cursor-pointer">Comedia</li>

                        <li onClick={() => navigate("/genre/80/Crimen")} className="hover:text-white cursor-pointer">Crimen</li>

                        <li onClick={() => navigate("/genre/99/Documental")} className="hover:text-white cursor-pointer">Documental</li>

                        <li onClick={() => navigate("/genre/18/Drama")} className="hover:text-white cursor-pointer">Drama</li>

                        <li onClick={() => navigate("/genre/14/Fantasía")} className="hover:text-white cursor-pointer">Fantasía</li>

                        <li onClick={() => navigate("/genre/36/Historia")} className="hover:text-white cursor-pointer">Historia</li>

                        <li onClick={() => navigate("/genre/9648/Misterio")} className="hover:text-white cursor-pointer">Misterio</li>

                        <li onClick={() => navigate("/genre/53/Suspenso")} className="hover:text-white cursor-pointer">Suspenso</li>

                        <li onClick={() => navigate("/genre/27/Terror")} className="hover:text-white cursor-pointer">Terror</li>

                        <li onClick={() => navigate("/genre/878/Ciencia%20Ficción")} className="hover:text-white cursor-pointer">Sci-Fi</li>

                        <li onClick={() => navigate("/genre/10749/Romance")} className="hover:text-white cursor-pointer">Romance</li>

                    </ul>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;
