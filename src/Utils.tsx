import { DiscordUser, parseDiscordUser } from "./types/discordUser";
import { Files } from "./types/files";
import { Mod } from "./types/mod";
import { setGlobalState } from "./Vars";

// String utilities
export function split(str: string, sep = ":"): string[] {
  return str
    .split(sep)
    .map(s => s.endsWith(sep) ? s.slice(0, -sep.length) : s);
}

export function getUpperName(input: string, sep = "_"): string {
  return split(input, sep)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function convertStringToArray(str: string): string[] {
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed) && parsed.every(item => typeof item === "string")) {
      return parsed;
    }
  } catch {}
  console.error("convertStringToArray: invalid input", str);
  return [];
}

// Download formatting
export function formatDownloads(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

// Discord user utilities
export function getUser(): DiscordUser | null {
  const data = localStorage.getItem("user");
  return data ? parseDiscordUser(JSON.parse(data)) : null;
}

export function isLogged(): boolean {
  return getUser() !== null;
}

export function hasUserPermission(level: number): boolean {
  const user = getUser();
  return user ? user.permission >= level : false;
}

export function showInfo(message: string): void {
  setGlobalState("info", message);
  setGlobalState("showInfo", true);
  setTimeout(() => setGlobalState("showInfo", false), 3000);
}

export function showError(message: string): void {
  setGlobalState("isInfoError", true);
  showInfo(message);
  setTimeout(() => setGlobalState("isInfoError", false), 3200);
}

// User caching & fetch
export function getCachedUsers(): DiscordUser[] {
  const raw = localStorage.getItem("cachedUsers");
  return raw ? JSON.parse(raw) : [];
}

export function cacheUser(user: DiscordUser): void {
  const users = getCachedUsers();
  if (!users.find(u => u.id === user.id)) {
    users.push(user);
    localStorage.setItem("cachedUsers", JSON.stringify(users));
  }
}

export async function getUserById(id: string): Promise<DiscordUser | null> {
  const cached = getCachedUsers().find(u => u.id === id);
  if (cached) {
    return cached;
  }
  const res = await fetch(`https://api.iglee.fr/discordUser?id=${id}`);
  if (res.ok) {
    const user = parseDiscordUser(await res.json());
    cacheUser(user);
    return user;
  }
  console.warn("getUserById failed for id:", id);
  return null;
}

export function getUserAvatarUrl(user: DiscordUser): string {
  return user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
    : "https://cdn.discordapp.com/embed/avatars/0.png";
}

// File fetching with localStorage cache
interface CachedFilesMap {
  [key: string]: Files & { expiration: number };
}

async function saveFilesToStore(
  mod: Mod,
  key: string,
  storage: CachedFilesMap,
  data: Files
): Promise<Files> {
  const expiration = Date.now() + 3600000; // 1h
  storage[key] = { ...data, expiration };
  localStorage.setItem(mod.id.toString(), JSON.stringify(storage));
  return data;
}

export async function getFiles(
  mod: Mod,
  version: string | null,
  loader: string | null
): Promise<Files | null> {
  const key = `v${version ?? ""}-${loader ?? ""}`;
  const raw = localStorage.getItem(mod.id.toString());
  const store: CachedFilesMap = raw ? JSON.parse(raw) : {};

  const cached = store[key];
  if (cached && cached.expiration > Date.now()) {
    return cached;
  }

  const params = new URLSearchParams({
    curseforgeId: mod.curseforgeId.toString(),
    modrinthId: mod.modrinthId || "",
    ...(version ? { version } : {}),
    ...(loader ? { loader } : {}),
  });

  const res = await fetch(`https://api.iglee.fr/mod-files?${params.toString()}`);
  if (!res.ok) return null;

  const data = (await res.json()).versions as Files;
  return await saveFilesToStore(mod, key, store, data);
}
