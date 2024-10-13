export type Item = {
    id: string;
    display_name: string;
    image_link: string;
    tags: string;
    type: number;
}
export enum Types {
    INGOT = 0,
    BLOCK = 1,
    DUST = 2,
    PLATE = 3,
    NUGGET = 4,
    ORE = 5,
    MISC = 6,
}

export function getTypeByNumber(code: number) {
    return Types[code]
}