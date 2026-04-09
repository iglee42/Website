export type DiscordUser = {
    id: string; // L'identifiant unique de l'utilisateur
    username: string; // Le nom d'utilisateur
    discriminator: string; // Le tag de l'utilisateur (ex: "1234")
    avatar: string | null; // L'avatar de l'utilisateur (peut être null)
    permission: number | 0;
};

export const parseDiscordUser = (json: any): DiscordUser => {
    return {
        id: json.id,
        username: json.username,
        discriminator: json.discriminator,
        avatar: json.avatar ?? null,
        permission: json.permission ?? 0, 
    };
};