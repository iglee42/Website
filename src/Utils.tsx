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