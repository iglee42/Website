import { useEffect, useState, forwardRef } from "react";
import { getIconByStatus, getStatusByNumber, Idea } from "../types/idea";
import { Mod } from "../types/mod";
import reactStringReplace from "react-string-replace";
import moment from "moment";
import { getUserAvatarUrl, getUserById, hasUserPermission } from "../Utils";
import { DiscordUser } from "../types/discordUser";
import { IdeaPopup } from "./IdeaPopup";

export const IdeasTable = forwardRef((props, ref) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [usersByDiscordId, setUsersByDiscordId] = useState<Record<string, DiscordUser>>({});

  useEffect(() => {
    Promise.all([
      fetch("https://api.iglee.fr/ideas").then(r => r.ok ? r.json() : []),
      fetch("https://api.iglee.fr/mods").then(r => r.ok ? r.json() : [])
    ]).then(([ideasData, modsData]) => {
      setIdeas(ideasData);
      setMods(modsData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const ids = Array.from(new Set(ideas.map(i => i.discord_id).filter((id): id is string => !!id)));
    Promise.all(ids.map(id => getUserById(id))).then(results => {
      const map: Record<string, DiscordUser> = {};
      results.forEach(u => u && (map[u.id] = u));
      setUsersByDiscordId(map);
    });
  }, [ideas]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading Ideas…</div>;
  }

  const ideaPredicate = (i: Idea) =>
    selectedStatus === 2 ? [2, 3].includes(i.status)
    : selectedStatus === 1 ? [1, 4, 5].includes(i.status)
    : i.status === selectedStatus;

  const filtered = ideas.filter(ideaPredicate);

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      {selectedIdea && <IdeaPopup idea={selectedIdea} mods={mods} onClose={() => setSelectedIdea(null)} />}

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[
          { label: "Waiting", val: 0 },
          { label: "Accepted / In Dev / Finished", val: 1 },
          { label: "Refused / Duplicated", val: 2 },
        ].map(({ label, val }) => (
          <button
            key={val}
            onClick={() => setSelectedStatus(val)}
            className={`px-5 py-2 rounded-lg border transition ${
              selectedStatus === val
                ? "bg-indigo-600 text-white border-indigo-600 shadow"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <h2 className="text-center text-gray-600 dark:text-gray-400 text-lg font-semibold">
          No ideas available in this category.
        </h2>
      ) : (
        <div>
          {/* Mobile card layout */}
          <div className="space-y-4 sm:hidden">
            {filtered.map(idea => {
              const mod = mods.find(m => m.id === idea.mod_id);
              const user = idea.discord_id ? usersByDiscordId[idea.discord_id] : null;
              const date = moment(idea.created_at).format("L LT");
              return (
                <div
                  key={idea.id}
                  onClick={() => setSelectedIdea(idea)}
                  className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow hover:bg-indigo-50 dark:hover:bg-indigo-900 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {mod?.logoUrl && (
                        <img src={mod.logoUrl} alt="" className="w-8 h-8 rounded" />
                      )}
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{mod?.name}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{date}</div>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-gray-100 mb-2">{idea.title}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-2 break-words">
                    {reactStringReplace(idea.description, "\n", (_, i) => <br key={i} />)}
                  </div>
                  <div className="flex items-center gap-2">
                    {getIconByStatus(idea.status, "w-5 h-5")}
                    <span className="text-gray-900 dark:text-gray-100">{getStatusByNumber(idea.status)}</span>
                  </div>
                  {idea.comment && (
                    <div className="mt-2 text-sm italic text-gray-600 dark:text-gray-400 break-words">
                      Comment: {reactStringReplace(idea.comment, "\n", (_, i) => <br key={i} />)}
                    </div>
                  )}
                  {hasUserPermission(1) && user && (
                    <div className="mt-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <img src={getUserAvatarUrl(user)} alt="" className="w-6 h-6 rounded-full" />
                      <span>{user.global_name}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop table layout */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full table-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mod</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  {filtered.some(i => i.comment) && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Comment</th>
                  )}
                  {hasUserPermission(1) && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">By</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map(idea => {
                  const mod = mods.find(m => m.id === idea.mod_id);
                  const user = idea.discord_id ? usersByDiscordId[idea.discord_id] : null;
                  const date = moment(idea.created_at).format("L LT");
                  return (
                    <tr
                      key={idea.id}
                      onClick={() => setSelectedIdea(idea)}
                      className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
                    >
                      <td className="px-4 py-3 flex items-center gap-2">
                        {mod?.logoUrl && <img src={mod.logoUrl} alt="" className="w-8 h-8 rounded" />}
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{mod?.name}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{idea.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-lg break-words">
                        {reactStringReplace(idea.description, "\n", (_, i) => <br key={i} />)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{date}</td>
                      <td className="px-4 py-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        {getIconByStatus(idea.status, "w-5 h-5")}
                        <span>{getStatusByNumber(idea.status)}</span>
                      </td>
                      {filtered.some(i => i.comment) && (
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-xs break-words">
                          {reactStringReplace(idea.comment || "", "\n", (_, i) => <br key={i} />)}
                        </td>
                      )}
                      {hasUserPermission(1) && (
                        <td className="px-4 py-3 flex items-center gap-2">
                          {user ? (
                            <>
                              <img src={getUserAvatarUrl(user)} alt="" className="w-8 h-8 rounded-full" />
                              <span className="dark:text-gray-100 text-gray-900">{user.global_name}</span>
                            </>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-600">Unknown</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});
