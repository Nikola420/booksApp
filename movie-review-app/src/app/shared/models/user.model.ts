export interface User {
    watchlist: {movieRef: string, watched: boolean}[];
    reviews: string[];
}