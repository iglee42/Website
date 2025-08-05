import { useNavigate } from "react-router-dom";
import { DiscordUser, parseDiscordUser } from "./types/discordUser";
import { Files } from "./types/files";
import { Mod } from "./types/mod";
import { getGlobalState, setGlobalState } from "./Vars";

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
  } catch { }
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
export function isLogged(): boolean {
  return localStorage.getItem("authToken") !== null;
}

export function hasPermission(user: DiscordUser | null, level: number): boolean {
  if (!user) return false;
  return user ? user.permission >= level : false;
}

export function showInfo(message: string): void {
  setGlobalState("isInfoError", false);
  setGlobalState("info", message);
  setGlobalState("showInfo", true);
  setTimeout(() => setGlobalState("showInfo", false), 3000);
}

export function showError(message: string): void {
  showInfo(message);
  setGlobalState("isInfoError", true);
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
  const res = await fetch(`${process.env.REACT_APP_API_URL}/discordUser?id=${id}`);
  if (res.ok) {
    const user = parseDiscordUser(await res.json());
    cacheUser(user);
    return user;
  }
  console.warn("getUserById failed for id:", id);
  return null;
}

export function getUserAvatarUrl(user: DiscordUser): string {
  return getAvatarUrl(user.id,user.avatar);
}

export function getAvatarUrl(id: string, avatar: string | null): string {
  return avatar && id
    ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/${Math.ceil(Math.random() * 5)}.png?size=64`;
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

  const res = await fetch(`${process.env.REACT_APP_API_URL}/mod-files?${params.toString()}`);
  if (!res.ok) return null;

  const data = (await res.json()).versions as Files;
  return await saveFilesToStore(mod, key, store, data);
}

export async function fetchUserFromToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    console.log(process.env)
    const res = await fetch(process.env.REACT_APP_API_URL + "/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Unauthorized");

    const user = await res.json();
    return user;
  } catch (err) {
    console.error("Erreur lors de la récupération des infos utilisateur :", err);
    return null;
  }
}

export async function logUser(navigate: ReturnType<typeof useNavigate>) {
  try {

    let user = await fetchUserFromToken();
    if (!user) {
      navigate("/");
      return;
    }
    setGlobalState('user', user);
    showInfo("Logged as " + user.username);
    navigate("/");
  } catch (err) {
    showError("Token Error");
    navigate("/");
  }
}

export async function getUserPermission(userId: string) {
  const res = await fetch(process.env.REACT_APP_API_URL+`/permission?id=${encodeURIComponent(userId)}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`, // si c'est une route sécurisée
    },
  });

  if (!res.ok) {
    throw new Error(`Error while retrieving permission for user ${userId}`);
  }

  return res.json();
}


