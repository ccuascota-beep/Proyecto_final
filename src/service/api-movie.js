import { movieInstance } from "../https/api-movie.instance.js";

export class ApiMovie {

    static async getPopularMovies(page = 1, language = "es-ES") {
        const response = await movieInstance.get("/movie/popular", {
            params: {page, language}
        });
        return response.data;
    }

    static async searchMovies(query, page = 1) {
        const response = await movieInstance.get("/search/movie", {
            params: {query, page, language: "es-ES"}
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
    static async getMoviesByLanguage(lang, page = 1) {
        const response = await movieInstance.get("/discover/movie", {
            params: {with_original_language: lang, page, language: "es-ES"}
        });

        return response.data;
    }
    static async getMoviesByGenre(genreId, page = 1) {
        const response = await movieInstance.get("/discover/movie", {
            params: {with_genres: genreId, page, language: "es-ES"}
        });
        return response.data;
    }
}
