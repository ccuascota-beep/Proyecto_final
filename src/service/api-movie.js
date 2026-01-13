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
                language: "es-ES",
                query
            }
        });
        return response.data;
    }

    static async getMovieDetails(id) {
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
        const response = await movieInstance.get(`/movie/${id}/credits`);
        return response.data;
    }
}