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
    setTimeout(() => setGlobalState('showInfo', false), 1500);
}
export function showError(info: string) {
    setGlobalState('isInfoError', true);
    setTimeout(() => setGlobalState('isInfoError', false), 1750);
    showInfo(info);
}