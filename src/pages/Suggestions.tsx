import { FormEvent, useRef, useState } from "react";
import { ModSelect } from "../components/ModSelect";
import { FaPaperPlane } from "react-icons/fa";
import { IdeasTable } from "../components/IdeasTable";
import { showError } from "../Utils";

export const Suggestions = () => {
  const [animationClass, setAnimationClass] = useState("");
  const modSelectRef = useRef<any>();

  function setError(error: string) {
    showError(error);
  }

  function triggerAnimation(success: boolean) {
    setAnimationClass(`animate-${success ? "pulse" : "shake"}`);
    if (!success) setTimeout(() => setAnimationClass(""), 500);
  }

  function sendForm(event: FormEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const titleField = form.querySelector("#title") as HTMLInputElement;
    const descField = form.querySelector("#description") as HTMLTextAreaElement;
    const selectedMod = modSelectRef.current?.getSelectedMod();

    if (!selectedMod) {
      triggerAnimation(false);
      return setError("Please choose a mod");
    }
    if (!titleField.value.trim()) {
      triggerAnimation(false);
      return setError("Please enter a title");
    }
    if (!descField.value.trim()) {
      triggerAnimation(false);
      return setError("Please enter a description");
    }

    fetch(process.env.REACT_APP_API_URL + "/suggestion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modID: selectedMod.id,
        title: titleField.value,
        description: descField.value
      }),
    })
      .then((res) => {
        if (res.status === 201) {
          triggerAnimation(true);
          setTimeout(() => window.location.reload(), 1000);
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        setError("Internal Error, Try Later");
        triggerAnimation(false);
      });
  }

  return (
    <div className=" mt-12 px-4">
      <form
        onSubmit={sendForm}
        id="suggest-form"
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Submit a Suggestion
        </h2>

        <div className="space-y-4">
          <ModSelect ref={modSelectRef} />

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter a short title"
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Describe your idea in detail"
              className="w-full mt-1 px-4 py-2 border rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="text-sm text-center text-gray-500 dark:text-gray-400 italic space-y-1">
          <p>No markdown formatting supported.</p>
          <p>You can login to be notified of your suggestion’s status.</p>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            id="send-suggest"
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow ${animationClass}`}
          >
            <FaPaperPlane />
            <span>Send</span>
          </button>
        </div>
      </form>

      <div className="mt-14 mx-auto">
        <IdeasTable />
      </div>
    </div>
  );
};
