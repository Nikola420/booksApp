export interface Review {
    id?: string;
    movie: string;
    created: Date;
    owner: string;
    ownerId: string;
    rated: number;
    text: string;
}