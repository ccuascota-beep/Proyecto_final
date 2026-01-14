import { useParams, useNavigate } from "react-router-dom";
import InformationMovie from "../components/InformationMovie.jsx";

export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 px-6 py-10">
            <InformationMovie
                movieId={id}
                onBack={() => navigate(-1)}
            />
        </div>
    );
}
