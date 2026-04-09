import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchUserFromToken } from "./Utils";
import { DiscordUser } from "./types/discordUser";

interface UserContextType {
    user: DiscordUser | null;
    setUser: (user: DiscordUser | null) => void;
    loading: boolean;
    reloadUser: (silent?: boolean) => Promise<void>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<DiscordUser | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
    };

    const reloadUser = async (silent = false) => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        // 🔥 IMPORTANT
        if (!silent && !user) {
            setLoading(true);
        }

        const u = await fetchUserFromToken();

        if (u === null) {
            console.log("Invalid Token");
            logout();
            setLoading(false);
            return;
        }

        setUser(u);
        setLoading(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            setLoading(false);
            return;
        }

        // Si pas encore d'utilisateur → vrai loading
        if (!user) {
            reloadUser(false);
        } else {
            // Si déjà un user → refresh silencieux
            reloadUser(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, reloadUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}