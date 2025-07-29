export const Rights = () => {
    return (
        <footer className="w-full py-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
                &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-800 dark:text-white">Iglee42</span>. All rights reserved.
            </p>
            <p className="mt-1">
                Built with ❤️ by the modding community. Powered by CurseForge, Modrinth, and open APIs.
            </p>
            <div className="mt-2 space-x-4">
                <a href="/legal/privacy" className="hover:underline">Privacy Policy</a>
                <a href="/legal/terms" className="hover:underline">Terms of Use</a>
                <a href="mailto:contact@iglee.fr" className="hover:underline">Contact</a>
            </div>
        </footer>
    );
};
