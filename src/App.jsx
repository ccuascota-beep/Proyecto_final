import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import Historial from "./pages/Historial.jsx";
import MoviesByLanguage from "./pages/MoviesByLanguage.jsx";
import MoviesByGenre from "./pages/MoviesByGenre.jsx";
import Series from "./pages/Series.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/series" element={<Series />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/language/:lang" element={<MoviesByLanguage />} />
            <Route path="/genre/:genreId/:genreName" element={<MoviesByGenre />} />
        </Routes>
    );
}

export default App;
