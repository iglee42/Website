import { useEffect, useState, forwardRef } from "react";
import { getIconByStatus, getStatusByNumber, Idea } from "../types/idea";
import { Mod } from "../types/mod";
import reactStringReplace from "react-string-replace";
import moment from "moment";
import { getUserAvatarUrl, getAvatarUrl } from "../Utils";
import { IdeaPopup } from "./IdeaPopup";

export const IdeasTable = forwardRef((props, ref) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(0);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

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



  if (loading) {
    return <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading ideas…</div>;
  }

  const ideaPredicate = (i: Idea) =>
    statusFilter === 2 ? [2, 3].includes(i.status)
      : statusFilter === 1 ? [1, 4, 5].includes(i.status)
        : i.status === statusFilter;

  let filtered = ideas.filter(ideaPredicate);
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
                ? "bg-green-600 text-white border-green-600 shadow"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900"
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
        <div className="hidden sm:block overflow-x-auto overflow-y-visible rounded-lg shadow-lg">
          <table className="min-w-full table-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Mod</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"></th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"></th>
                {showCommentCol && (
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Comment</th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">By</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 w-1/6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map(idea => {
                const mod = mods.find(m => m.id === idea.mod_id);
                const ideaUser = idea.user;
                const formatted = moment(idea.created_at).format("L LT");
                return (
                  <tr
                    key={idea.id}
                    onClick={() => setSelectedIdea(idea)}
                    className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900 transition"
                  >
                    <td className="px-2 py-3 items-center w-12">
                      {mod?.logoUrl && <img src={mod.logoUrl} alt={mod.name || ""} className="w-10 rounded" />}
                    </td>
                    <td className="px-4 py-3 items-center gap-2 gap-y-64">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{mod?.name}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{idea.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-lg break-words">
                      {reactStringReplace(idea.description, "\n", (_, i) => <br key={i} />)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatted}</td>
                    <td className="px-6 py-3 items-center gap-2 w-12">
                      {getIconByStatus(idea.status, "w-4 h-4")}
                    </td>
                    <td className="px-2 py-3 items-center text-gray-900 dark:text-gray-100 w-12">
                      <span>{getStatusByNumber(idea.status)}</span>
                    </td>
                    {showCommentCol && (
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 break-words">
                        {reactStringReplace(idea.comment || "", "\n", (_, i) => <br key={i} />)}
                      </td>
                    )}
                    <td className="px-2 py-3 items-center w-12">
                      {ideaUser ? (
                        <img src={getUserAvatarUrl(ideaUser)} alt={ideaUser.username} className="w-10 rounded-full" />
                      ) : (
                        <img src={getAvatarUrl("", "")} alt={"Unknown"} className="w-10 rounded-full" />
                      )}
                    </td>
                    <td className="px-2 py-3 items-center w-12">
                      {ideaUser ? (
                        <span className="text-gray-900 dark:text-gray-100">{ideaUser.username}</span>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-500">Unknown</span>
                      )}
                    </td>
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