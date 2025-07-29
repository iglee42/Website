import { useState } from "react";
import { Item } from "../types/item";
import { Consumer } from "../types/consumer";

interface Props {
  item: Item;
  onClick: Consumer<Item>;
}

export const ModsInfoItems = (props: Props) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      className="w-24 h-24 m-2 perspective"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => props.onClick(props.item)}
      style={{ perspective: "600px" }}
      aria-label={`Details for ${props.item.display_name}`}
    >
      <div
        className={`relative w-full h-full duration-500 transition-transform`}
        style={{
          transformStyle: "preserve-3d",
          transform: hover ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Face avant */}
        <div
          className="absolute w-full h-full rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={props.item.image_link}
            alt={props.item.id}
            className="w-full h-full object-cover pixelated-image"
          />
        </div>

        {/* Face arrière */}
        <div
          className="absolute w-full h-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 flex flex-col justify-center items-center text-center px-2"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="text-sm font-semibold">{props.item.display_name}</p>
          <p className="text-gray-400 dark:text-gray-600 italic text-xs mt-1">
            Click for more details
          </p>
        </div>
      </div>
    </button>
  );
};
