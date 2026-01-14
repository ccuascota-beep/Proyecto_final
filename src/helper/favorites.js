const KEY = "favorite_movies";

export const getFavorites = () => {
    return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const saveFavorites = (favorites) => {
    localStorage.setItem(KEY, JSON.stringify(favorites));
};
