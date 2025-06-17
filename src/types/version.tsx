import { Mod } from "./mod";

export enum Version {
    V1215 = "1.21.5",
    V1214 = "1.21.4",
    V1213 = "1.21.3",
    V1212 = "1.21.2",
    V1211 = "1.21.1",
    V121 = "1.21",
    V1206 = "1.20.6",
    V1205 = "1.20.5",
    V1204 = "1.20.4",
    V1203 = "1.20.3",
    V1202 = "1.20.2",
    V1201 = "1.20.1",
    V120 = "1.20",
    V1194 = "1.19.4",
    V1193 = "1.19.3",
    V1192 = "1.19.2",
    V1191 = "1.19.1",
    V119 = "1.19",
    V1182 = "1.18.2",
    V1181 = "1.18.1",
    V118 = "1.18",
    V1171 = "1.17.1",
    V117 = "1.17",
    V1165 = "1.16.5",
    V1164 = "1.16.4",
    V1163 = "1.16.3",
    V1162 = "1.16.2",
    V1161 = "1.16.1",
    V116 = "1.16",
    V1152 = "1.15.2",
    V1151 = "1.15.1",
    V115 = "1.15",
    V1144 = "1.14.4",
    V1143 = "1.14.3",
    V1142 = "1.14.2",
    V1141 = "1.14.1",
    V114 = "1.14",
    V1132 = "1.13.2",
    V1131 = "1.13.1",
    V113 = "1.13",
    V1122 = "1.12.2",
    V1121 = "1.12.1",
    V112 = "1.12",
    V1112 = "1.11.2",
    V1111 = "1.11.1",
    V111 = "1.11",
    V1102 = "1.10.2",
    V1101 = "1.10.1",
    V110 = "1.10",
    V194 = "1.9.4",
    V193 = "1.9.3",
    V192 = "1.9.2",
    V191 = "1.9.1",
    V19 = "1.9",
    V189 = "1.8.9",
    V188 = "1.8.8",
    V187 = "1.8.7",
    V186 = "1.8.6",
    V185 = "1.8.5",
    V184 = "1.8.4",
    V183 = "1.8.3",
    V182 = "1.8.2",
    V181 = "1.8.1",
    V18 = "1.8",
    V1710 = "1.7.10",
    V179 = "1.7.9",
    V178 = "1.7.8",
    V177 = "1.7.7",
    V176 = "1.7.6",
    V175 = "1.7.5",
    V174 = "1.7.4",
    V173 = "1.7.3",
    V172 = "1.7.2",
    V164 = "1.6.4"
}

export async function getMinecraftVersion(mod: Mod, type: string): Promise<Version[]> {
    const resp = await fetch("https://api.iglee.fr/mod-versions?curseforgeId=" + mod.curseforgeId + "&modrinthId=" + mod.modrinthId)
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
            versions.push(...data.versions.modrinth.filter((v: string)=>!versions.includes(v)));
        }
        return versions.length > 0
            ? versions
                .map(v => getEnumKeyByEnumValue(Version, v))
                .filter((v): v is keyof typeof Version => v !== null)
                .map(v => Version[v])
            : [];
    }
    return [];
}

function getEnumKeyByEnumValue<T extends { [index: string]: string }>(myEnum: T, enumValue: string): keyof T | null {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
}
  