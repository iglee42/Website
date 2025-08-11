import { useEffect, useState, MouseEvent } from "react";
import {
  getUserById,
  getUserAvatarUrl,
  showInfo,
  showError,
  getUpperName,
  hasPermission,
} from "../Utils";
import { Idea, getStatusByNumber, getIconByStatus, Status } from "../types/idea";
import { DiscordUser } from "../types/discordUser";
import { Mod } from "../types/mod";
import StatusSelect from "./StatusSelect";
import { Popup } from "./Popup";
import reactStringReplace from "react-string-replace";
import { useUser } from "../UserProvider";

interface Props {
  idea: Idea;
  mods: Mod[];
  onClose: () => void;
}

export function IdeaPopup({ idea, mods, onClose }: Props) {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [status, setStatus] = useState(idea.status);
  const [comment, setComment] = useState(idea.comment || "");
  const siteUser = useUser().user;

  useEffect(() => {
    if (!user) getUserById(idea.discord_id).then(setUser);
  }, [user,idea.discord_id]);

  const mod = mods.find((m) => m.id === idea.mod_id);
  const statusEntries = Object.entries(Status).filter(
    ([, v]) => typeof v === "number"
  ) as [keyof typeof Status, number][];

  const handleStatusUpdate = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await fetch(process.env.REACT_APP_API_URL + "/suggestion/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      },
      body: JSON.stringify({
        suggestionId: idea.id,
        status
      }),
    });

    if (res.ok) {
      idea.status = status;
      showInfo("Status updated");
      onClose();
    } else {
      showError("Failed to update status");
    }
  };

  const handleCommentUpdate = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await fetch(process.env.REACT_APP_API_URL + "/suggestion/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      },
      body: JSON.stringify({
        suggestionId: idea.id,
        comment
      }),
    });

    if (res.ok) {
      idea.comment = comment;
      showInfo("Comment updated");
      onClose();
    } else {
      showError("Failed to update comment");
    }
  };

  return (
    <Popup onClose={onClose} title={idea.title}>
          {/* Mod info + Author */}
          <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            {mod && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Mod:</span>
                <img src={mod.logoUrl} alt="" className="w-6 h-6" />
                <span>{mod.name}</span>
              </div>
            )}
            {hasPermission(siteUser, 1) && user && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Author:</span>
                <img src={getUserAvatarUrl(user)} alt="" className="w-6 h-6 rounded-full" />
                <span>{user.global_name}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none text-sm px-2">
            {reactStringReplace(idea.description, "\n", (_, i) => <br key={i} />)}
          </div>

          {/* Status */}
          <div className="space-y-4 border-t pt-4 border-gray-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Actual status:</span>
              {getIconByStatus(idea.status, "w-5 h-5")}
              <span>{getStatusByNumber(idea.status)}</span>
            </div>

            {hasPermission(siteUser, 1) && (
              <div className="flex items-center gap-4">
                <StatusSelect
                  currentIdea={idea}
                  statusEntries={statusEntries}
                  onChange={(option) => option && setStatus(option.value)}
                />
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition text-sm"
                >
                  Update the status
                </button>
              </div>
            )}
          </div>

          {/* Comment */}
          {hasPermission(siteUser, 1) && (
            <div className="space-y-3 border-t pt-4 border-gray-200 dark:border-zinc-700">
              <p className="text-xs text-gray-500 italic">
                Hint: modify the comment <strong>before</strong> the status (no Discord message sent)
              </p>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-28 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-gray-800 resize-none"
                placeholder="Add a comment..."
              />

              <div className="flex justify-end">
                <button
                  onClick={handleCommentUpdate}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition text-sm"
                >
                  Update the comment
                </button>
              </div>
            </div>
          )}
    </Popup>
  );
}
