import { Mod } from "./mod";

export enum ModLoader {
    FORGE = "forge",
    NEOFORGE = "neoforge",
    QUILT = "quilt",
    CAULDRON = "cauldron",
    FABRIC = "fabric",
    LITELOADER = "liteloader",
}
export async function getModLoader(mod: Mod, type: string): Promise<ModLoader[]> {
    const resp = await fetch(process.env.REACT_APP_API_URL + "/mod-loaders?curseforgeId=" + mod.curseforgeId + "&modrinthId=" + mod.modrinthId)
    if (!resp.ok) return [];
    const data = await resp.json();
    if (data && data.versions) {
        const versions: string[] = [];
        if (type === "curseforge" || type === "both") {
            if (!data.versions.curseforge && type !== "both") return [];
            versions.push(...data.versions.curseforge);
        }
        if (type === "modrinth" || type === "both") {
            if (!data.versions.modrinth && type !== "both") return [];
            versions.push(...data.versions.modrinth.filter((v: string) => !versions.includes(v)));
        }
        return versions.length > 0
            ? versions
                .map(v => getEnumKeyByEnumValue(ModLoader, v))
                .filter((v): v is keyof typeof ModLoader => v !== null)
                .map(v => ModLoader[v])
            : [];
    }
    return [];
}

function getEnumKeyByEnumValue<T extends { [index: string]: string }>(myEnum: T, enumValue: string): keyof T | null {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
}
