import { DiscordUser, parseDiscordUser } from "./types/discordUser";
import { Files } from "./types/files";
import { Mod } from "./types/mod";
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
export function formatDownloads(num: number): string {
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
}

export async function getFiles(mod: Mod, version: string | null, loader: string | null): Promise<Files | null> {
    if (localStorage.getItem(mod.id + "") !== null) {
        let storage: string = localStorage.getItem(mod.id + "") as string
        let objects: Map<string, any> = new Map(Object.entries(JSON.parse(storage)))
        let key: string = "v" + (version ? version + "-" : "") + (loader ? loader : "");
        if (!objects.has(key)) {
            await saveNewIntoCache(mod, version,loader,objects)
        } else {
            let files: Files = objects.get(key) as Files;
            if (!files.expiration || files.expiration <= Date.now()) {
                return await saveNewIntoCache(mod, version, loader, objects);
            } else {
                return objects.get(key) as Files
            }
        }
    } else {
        return await saveNewIntoCache(mod,version,loader,new Map());
    }


    async function saveNewIntoCache(mod: Mod, version: string | null, loader: string | null, old: Map<string, any>): Promise<Files | null> {
        let response = await fetch("https://api.iglee.fr/mod-files?curseforgeId=" + mod.curseforgeId + "&modrinthId=" + mod.modrinthId + (version ? "&version=" + version : "") + (loader ? "&loader=" + loader : ""));
        if (response.ok) {
            let data = await response.json()
            let ver: Files = JSON.parse(JSON.stringify(data.versions)) as Files
            ver.expiration = Date.now() + 3_600_000 // 1H
            let key: string = "v" + (version ? version + "-" : "") + (loader ? loader : "");
            let toStore: Map<string, any> = old
            toStore.set(key, ver)
            const mapToObj = (m: Map<any, any>) => {
                return Array.from(m).reduce((obj: any, [key, value]) => {
                    obj[key] = value;
                    return obj;
                }, {});
            };
            localStorage.setItem(mod.id + "", JSON.stringify(mapToObj(toStore)))
            return ver
        }
        return null
    }

    return null;
}
