import { useEffect, useState, forwardRef } from "react";
import { getIconByStatus, getStatusByNumber, Idea } from "../types/idea";
import { Mod } from "../types/mod";
import reactStringReplace from "react-string-replace";
import moment from "moment";
import { getUserAvatarUrl, getUserById, hasPermission } from "../Utils";
import { DiscordUser } from "../types/discordUser";
import { IdeaPopup } from "./IdeaPopup";
import { useUser } from "../UserProvider";

export const IdeasTable = forwardRef((props, ref) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [mods, setMods] = useState<Mod[]>([]);
  const [usersById, setUsersById] = useState<Record<string, DiscordUser>>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(0);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const user = useUser().user;

  useEffect(() => {
    void Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/suggestions`).then(r => (r.ok ? r.json() : Promise.reject())),
      fetch(`${process.env.REACT_APP_API_URL}/mods`).then(r => (r.ok ? r.json() : [])),
    ]).then(([ideasArr, modsArr]) => {
      setIdeas(ideasArr);
      setMods(modsArr || []);
      setLoading(false);
    }).catch(() => {
      setIdeas([]);
      setMods([]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const ids = Array.from(new Set(
      ideas
        .map(i => i.discord_id)
        .filter((id): id is string => Boolean(id))
    ));
    void Promise.all(ids.map(id => getUserById(id))).then(results => {
      const map: Record<string, DiscordUser> = {};
      results.forEach(u => u && (map[u.id] = u));
      setUsersById(map);
    });
  }, [ideas]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading ideas…</div>;
  }

  const predicate = (i: Idea) =>
    statusFilter === 2 ? [2, 3].includes(i.status)
      : statusFilter === 1 ? [1, 4, 5].includes(i.status)
        : i.status === statusFilter;

  let filtered = ideas.filter(predicate);
  filtered = filtered.sort((a, b) => a.status - b.status);
  const showCommentCol = filtered.some(i => i.comment && i.comment.trim() !== "");

  return (
    <div className="max-w-screen-2xl mx-auto p-6">
      {selectedIdea && <IdeaPopup idea={selectedIdea} mods={mods} onClose={() => setSelectedIdea(null)} />}

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[
          { label: "Waiting", val: 0 },
          { label: "Accepted / In Dev / Finished", val: 1 },
          { label: "Refused / Duplicated", val: 2 },
        ].map(({ label, val }) => (
          <button
            key={val}
            onClick={() => setStatusFilter(val)}
            className={`
              px-5 py-2 rounded-lg border transition
              ${statusFilter === val
                ? "bg-indigo-600 text-white border-indigo-600 shadow"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <h2 className="text-center text-gray-600 dark:text-gray-400 text-lg font-semibold">
          No ideas in this category.
        </h2>
      ) : (
        <div className="hidden sm:block overflow-x-auto overflow-y-visible">
          <table className="min-w-full table-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Mod</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"></th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Status</th>
                {showCommentCol && (
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Comment</th>
                )}
                {hasPermission(user, 1) && (
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 w-1/6"></th>
                )}
                {hasPermission(user, 1) && (
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 w-1/6">By</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map(idea => {
                const mod = mods.find(m => m.id === idea.mod_id);
                const ideaUser = idea.discord_id ? usersById[idea.discord_id] : null;
                const formatted = moment(idea.created_at).format("L LT");
                return (
                  <tr
                    key={idea.id}
                    onClick={() => setSelectedIdea(idea)}
                    className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
                  >
                    <td className="px-2 py-3 items-center w-16">
                      {mod?.logoUrl && <img src={mod.logoUrl} alt={mod.name || ""} className="w-auto rounded" />}
                    </td>
                    <td className="px-4 py-3 items-center gap-2 gap-y-64">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{mod?.name}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{idea.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-lg break-words">
                      {reactStringReplace(idea.description, "\n", (_, i) => <br key={i} />)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatted}</td>
                    <td className="px-4 py-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      {getIconByStatus(idea.status, "w-5 h-5")}
                      <span>{getStatusByNumber(idea.status)}</span>
                    </td>
                    {showCommentCol && (
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 break-words">
                        {reactStringReplace(idea.comment || "", "\n", (_, i) => <br key={i} />)}
                      </td>
                    )}
                    {hasPermission(user, 1) && (
                      <td className="px-4 py-3 flex items-center gap-2">
                        {ideaUser ? (
                          <>
                            <img src={getUserAvatarUrl(ideaUser)} alt={ideaUser.global_name} className="w-8 h-8 rounded-full" />
                            <span className="text-gray-900 dark:text-gray-100">{ideaUser.global_name}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-gray-600 dark:text-gray-500">Unknown</span>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});