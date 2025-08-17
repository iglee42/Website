import { Item } from "../../types/item";
import { Popup } from "../Popup";

interface Props {
  onClose: () => void;
  item: Item;
}

export function ItemPopup({ onClose, item }: Props) {

  return (
    <Popup onClose={onClose} title={item.id}>
      
        <div>
          <p>ID : {item.id}</p>
          {/* Ajoutez d'autres détails selon votre modèle */}
        </div>
    </Popup>
  );
}
