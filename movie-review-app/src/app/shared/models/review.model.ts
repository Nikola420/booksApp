export interface Review {
    id?: string;
    movieName: string;
    movieRef: string;
    created: Date;
    owner: string;
    ownerId: string;
    rated: number;
    text: string;
}