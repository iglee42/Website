export const Rights = () => {
    return (
        <footer className="w-full py-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
                &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-800 dark:text-white">Iglee42</span>. All rights reserved.
            </p>
            <p className="mt-1">
                Built with ❤️ by WoXayZ. Powered by open APIs.
            </p>
            <div className="mt-2 space-x-4">
                <a href="/legals" className="hover:underline">Terms of Use/Privacy Policy</a>
                <a href="mailto:contact@iglee.fr" className="hover:underline">Contact</a>
                
            </div>
            <p className="mt-2">NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.</p>

        </footer>
    );
};
