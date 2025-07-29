import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchUserFromToken } from "./Utils";
import { DiscordUser } from "./types/discordUser";

// 2. Contexte typé
interface UserContextType {
    user: DiscordUser | null;
    setUser: (user: DiscordUser | null) => void;
    loading: boolean;
    reloadUser: () => Promise<void>;
    logout: () => void;
}

// 3. Valeur par défaut (null forcé pour TS, mais ne sera jamais utilisée)
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<DiscordUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Méthode pour recharger les données utilisateur depuis le token
    const reloadUser = async () => {
        setLoading(true);
        const u = await fetchUserFromToken();
        setUser(u);
        setLoading(false);
    };

    // Méthode pour se déconnecter
    const logout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
    };

    useEffect(() => {
        reloadUser(); // chargement initial
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, reloadUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

// Hook pour accéder au contexte
export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}