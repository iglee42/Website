function NotFound() {

    const image = process.env.REACT_APP_API_URL + "/image/logo_nocolor";
    return <div className="w-full max-w-screen-xl flex flex-col justify-center items-center mx-auto px-4 py-10 text-gray-800 dark:text-white">
        <img src={image} alt="404 Not Found" className="mb-6 size-48" />
        <h1 className="text-3xl font-bold text-center mb-6 ">404</h1>
        <h2 className="text-3xl text-center mb-6 ">
            Sorry we've failed to found the page you're looking for.
        </h2>
        <a href="/" className="mt-6 w-fit inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-300">
            Return to Home Page
        </a>
    </div>;
}

export default NotFound;
