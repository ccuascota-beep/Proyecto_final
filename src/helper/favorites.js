const KEY = "favorite_movies";

export const getFavorites = () => {
    return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const saveFavorites = (favorites) => {
    localStorage.setItem(KEY, JSON.stringify(favorites));
};

export const toggleFavorite = (favorites, movie) => {
    if (!movie?.id || !movie?.poster_path) return favorites;

    const exists = favorites.some(fav => fav.id === movie.id);

    if (exists) {
        return favorites.filter(fav => fav.id !== movie.id);
    }

    return [
        ...favorites,
        {id: movie.id, title: movie.title, poster_path: movie.poster_path}
    ];
};

export const isFavorite = (favorites, movieId) => {
    return favorites.some(fav => fav.id === movieId);
};
