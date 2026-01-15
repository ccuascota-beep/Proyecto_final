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
            </div>
        </aside>
    );
}

export default Sidebar;
