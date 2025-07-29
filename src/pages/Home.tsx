import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaDownload, FaLightbulb, FaUsers, FaPuzzlePiece, FaSpinner } from "react-icons/fa";
import { Mod } from "../types/mod";
import { ModInfo } from "../components/ModInfo";
import { DownloadPopup } from "../components/DownloadPopup";
import { formatDownloads } from "../Utils";

export const Home = () => {
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMod, setCurrentMod] = useState<Mod | null>(null);
  const [stats, setStats] = useState({ mods: 0, downloads: 0, contributors: 0 });

  useEffect(() => {
    //showInfo("Loading...");
    fetch(process.env.REACT_APP_API_URL + "/mods?featured=true")
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data: Mod[]) => {
        setMods(data);
        setStats({
          mods: data.length,
          downloads: data.reduce((sum, m) => sum + m.downloads, 0),
          contributors: 128,
        });
      })
      .catch(() => setMods([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] bg-white dark:bg-black text-center px-4 py-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">Unleash Your Minecraft Creativity</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Browse, download, and contribute amazing mods built by our vibrant community.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg transition"
        >
          Explore Projects
        </Link>
      </section>

      {/* Main Content */}
      <div className="flex-grow">
        {/* Stats */}
        <section className="py-12">
          <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-around items-center space-y-6 sm:space-y-0 px-4">
            <div className="text-center">
              <FaPuzzlePiece className="mx-auto text-indigo-600 text-4xl mb-2" />
              <p className="text-3xl font-bold">{stats.mods}</p>
              <p className="text-gray-600 dark:text-gray-400">Featured Mods</p>
            </div>
            <div className="text-center">
              <FaDownload className="mx-auto text-green-600 text-4xl mb-2" />
              <p className="text-3xl font-bold">{formatDownloads(stats.downloads)}+</p>
              <p className="text-gray-600 dark:text-gray-400">Downloads</p>
            </div>
            <div className="text-center">
              <FaUsers className="mx-auto text-yellow-500 text-4xl mb-2" />
              <p className="text-3xl font-bold">{stats.contributors}+</p>
              <p className="text-gray-600 dark:text-gray-400">Contributors</p>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-16 px-4">
          <div className="max-w-screen-xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-semibold">Why Choose Our Platform?</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              We empower you with tools and community support to create and enjoy the best Minecraft mods.
            </p>
          </div>
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <FaLightbulb className="text-indigo-600 text-3xl mb-4" />
              <h3 className="text-xl font-medium mb-2">Innovative Ideas</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Suggest and vote on mod ideas to shape our roadmap.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <FaUsers className="text-yellow-500 text-3xl mb-4" />
              <h3 className="text-xl font-medium mb-2">Collaborative Community</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with modders and share feedback.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <FaDownload className="text-green-600 text-3xl mb-4" />
              <h3 className="text-xl font-medium mb-2">Easy Downloads</h3>
              <p className="text-gray-600 dark:text-gray-400">
                One-click install from CurseForge or Modrinth.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Mods */}
        <section id="projects" className="py-16 px-4 bg-white dark:bg-black">
          <div className="max-w-screen-xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
              Featured Mods
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Our community's top picks, updated regularly.
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-40 text-gray-600 dark:text-gray-400">
              <FaSpinner className="animate-spin mr-2" />
              <span>Loading featured mods…</span>
            </div>
          ) : (
            <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {mods.sort((a, b) => b.downloads - a.downloads).map(mod => (
                <ModInfo key={mod.id} mod={mod} onClick={() => setCurrentMod(mod)} />
              ))}
            </div>
          )}
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="max-w-screen-xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-semibold">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Get started in just a few clicks.</p>
          </div>
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-block p-4 bg-indigo-600 text-white rounded-full mb-4">
                <FaDownload className="text-2xl" />
              </div>
              <h3 className="text-xl font-medium mb-2">Find a Mod</h3>
              <p className="text-gray-600 dark:text-gray-400">Browse or search for mods that match your style.</p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-green-600 text-white rounded-full mb-4">
                <FaDownload className="text-2xl" />
              </div>
              <h3 className="text-xl font-medium mb-2">Download & Install</h3>
              <p className="text-gray-600 dark:text-gray-400">One-click install via your favorite platform.</p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-yellow-500 text-white rounded-full mb-4">
                <FaUsers className="text-2xl" />
              </div>
              <h3 className="text-xl font-medium mb-2">Join the Community</h3>
              <p className="text-gray-600 dark:text-gray-400">Share feedback, suggest improvements, and collaborate.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Download Popup */}
      {currentMod && (
        <DownloadPopup mod={currentMod} onClose={() => setCurrentMod(null)} />
      )}
    </div>
  );
};