import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import Historial from "./pages/Historial.jsx";
import MoviesByLanguage from "./pages/MoviesByLanguage.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/language/:lang" element={<MoviesByLanguage />} />
        </Routes>
    );
}

export default App;
