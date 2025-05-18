export type DiscordUser = {
    id: string; // L'identifiant unique de l'utilisateur
    username: string; // Le nom d'utilisateur
    discriminator: string; // Le tag de l'utilisateur (ex: "1234")
    avatar: string | null; // L'avatar de l'utilisateur (peut être null)
    bot?: boolean; // Indique si l'utilisateur est un bot (optionnel)
    system?: boolean; // Indique si l'utilisateur est un compte système Discord (optionnel)
    mfa_enabled?: boolean; // Indique si l'utilisateur a activé l'authentification à deux facteurs (optionnel)
    banner?: string | null; // L'ID de la bannière de l'utilisateur (optionnel)
    accent_color?: number | null; // La couleur d'accentuation de l'utilisateur (optionnel)
    locale?: string; // La langue de l'utilisateur (optionnel)
    verified?: boolean; // Indique si l'utilisateur a vérifié son email (optionnel)
    email?: string | null; // L'email de l'utilisateur (optionnel)
    flags?: number; // Les flags de l'utilisateur (optionnel)
    premium_type?: number; // Le type d'abonnement Nitro de l'utilisateur (optionnel)
    public_flags?: number; // Les flags publics de l'utilisateur (optionnel)
    global_name: string;
    permission: number;
};

export const parseDiscordUser = (json: any): DiscordUser => {
    return {
        id: json.id,
        username: json.username,
        discriminator: json.discriminator,
        avatar: json.avatar ?? null,
        bot: json.bot ?? false,
        system: json.system ?? false,
        mfa_enabled: json.mfa_enabled ?? false,
        banner: json.banner ?? null,
        accent_color: json.accent_color ?? null,
        locale: json.locale ?? "en-US", // Par défaut, "en-US"
        verified: json.verified ?? false,
        email: json.email ?? null,
        flags: json.flags ?? 0,
        premium_type: json.premium_type ?? 0,
        public_flags: json.public_flags ?? 0,
        global_name: json.global_name ?? json.username, 
        permission: json.permission ?? 0, 
    };
};