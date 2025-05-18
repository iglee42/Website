import { DiscordUser, parseDiscordUser } from "./types/discordUser";
import { setGlobalState } from "./Vars";

export function split(base: string, separator: string): string[] {
    const st = base.split(separator);
    const finale: string[] = new Array(st.length);

    let i = 0;
    for (let s of st) {
        let fi = s;
        if (s.endsWith(separator)) {
            fi = s.substring(0, s.length - 1);
        }
        finale[i] = fi;
        i += 1;
    }
    return finale;
}

export function getUpperName(name: string, wordSeparator: string): string {
    const nm = split(name, wordSeparator);
    let end = "";

    nm.forEach((n, index) => {
        const fc = n.charAt(0).toUpperCase();
        const fs = fc + n.substring(1).toLowerCase();
        end += fs + (index === nm.length - 1 ? "" : " ");
    });

    return end;
}

export function convertStringToArray(input: string): string[] {
    try {
        // Utiliser JSON.parse pour convertir la chaîne en tableau
        const result = JSON.parse(input);

        // Vérifier si le résultat est un tableau de chaînes
        if (Array.isArray(result) && result.every(item => typeof item === 'string')) {
            return result;
        } else {
            throw new Error("Le format de la chaîne n'est pas un tableau de chaînes.");
        }
    } catch (error) {
        console.error("Erreur lors de la conversion :", error);
        return []; // Retourner un tableau vide en cas d'erreur
    }
}

export function showInfo(info: string) {
    setGlobalState('info', info);
    setGlobalState('showInfo', true);
    setTimeout(() => {
        setGlobalState('showInfo', false)
    }, 3000);
}
export function showError(info: string) {
    setGlobalState('isInfoError', true);
    setTimeout(() => setGlobalState('isInfoError', false), 3200);
    showInfo(info);
}

export function isLogged(): boolean {
   return getUser() !== null;
}

export function getUser(): DiscordUser | null {
    let user = localStorage.getItem("user");
    if (user) {
        return parseDiscordUser(JSON.parse(user));
    }
    return null;
}

export function getCachedUsers(): DiscordUser[] {
    let users = localStorage.getItem("cachedUsers");
    if (users) {
        return JSON.parse(users);
    }
    return [];
}

export function getCachedUserById(id: string): DiscordUser | null {
    let users = getCachedUsers();
    for (let user of users) {
        if (user.id === id) {
            return user;
        }
    }
    return null;
}

export function isUserCached(id: string): boolean {
    let users = getCachedUsers();
    for (let user of users) {
        if (user.id === id) {
            return true;
        }
    }
    return false;
}

export function cacheUser(user: DiscordUser): void {
    let users = getCachedUsers();
    if (!isUserCached(user.id)) {
        users.push(user);
        localStorage.setItem("cachedUsers", JSON.stringify(users));
    }
}

export async function getUserById(id: string): Promise<DiscordUser | null> {
    if (isUserCached(id)) {
        return getCachedUserById(id);
    } else {
        const response = await fetch('https://api.iglee.fr/discordUser?id=' + id);
        if (response.ok) {
            const data = await response.json();
            const user = parseDiscordUser(data);
            cacheUser(user);
            return user;
        }
        console.warn("Failed to fetch user by ID");
        return null;
    }
}

export function getUserAvatarUrl(user: DiscordUser): string {
    if (user.avatar === null || user.avatar === undefined) {
        return "https://cdn.discordapp.com/embed/avatars/0.png";
    }
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
}

export function hasUserPermission(permission: number): boolean {
    let user = getUser();
    if (user) {
        return user.permission >= permission;
    }
    return false;
}