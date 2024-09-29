export type Idea = {
    id: number;
    title: string;
    description: string;
    mod_id: number;
    created_at: Date;
    status: number;
}
export enum Status {
    WAITING = 0,
    ACCEPTED = 1,
    REFUSED = 2,
    DUPLICATE = 3
}

export function getStatusByNumber(statusCode: number) {
    return Status[statusCode]
}