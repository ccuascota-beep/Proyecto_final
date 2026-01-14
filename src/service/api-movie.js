import { movieInstance } from "../https/api-movie.instance.js";

export class ApiMovie {

    static async getPopularMovies() {
        const response = await movieInstance.get("/movie/popular", {
            params: { language: "es-ES" }
        });
        return response.data;
    }

    static async searchMovies(query) {
        const response = await movieInstance.get("/search/movie", {
            params: {
                query,
                language: "es-ES"
            }
        });
        return response.data;
    }

    static async getMovieById(id) {
        const response = await movieInstance.get(`/movie/${id}`, {
            params: { language: "es-ES" }
        });
        return response.data;
    }

    static async getMovieVideos(id) {
        const response = await movieInstance.get(`/movie/${id}/videos`, {
            params: { language: "es-ES" }
        });
        return response.data;
    }

    static async getMovieCredits(id) {
        const response = await movieInstance.get(`/movie/${id}/credits`, {
            params: { language: "es-ES" }
        });
        return response.data;
    }
}
