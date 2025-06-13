interface Props {
    href: string;
}

export function Redirect({ href }: Props) {
    window.location.href = href;
    return null;
}