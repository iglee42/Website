import { FC, useState } from 'react';
import { getUpperName } from '../Utils';
import { Popup } from './Popup';

type ModFilterPopupProps = {
    mods: string[];
    onSelect: (mods: string[]) => void;
    onClose: () => void;
    alreadySelected?: string[];
};

export const ModFilterPopup: FC<ModFilterPopupProps> = ({ mods, onSelect, onClose, alreadySelected }) => {
    const [selectedMods, setSelectedMods] = useState<string[]>(alreadySelected? alreadySelected : []);

    const toggleModSelection = (mod: string) => {
        setSelectedMods(prev =>
            prev.includes(mod)
                ? prev.filter(m => m !== mod)
                : [...prev, mod]
        );
    };

    const applySelection = () => {
        onSelect(selectedMods);
        onClose();
    };

    return (
        <Popup onClose={onClose}>
            
            <div className='flex flex-col p-2 min-w-max max-w-full pr-2'>

                <h3 className="text-lg font-bold mb-2 mr-2">Mods</h3>
                {mods.map(mod => (
                    <button key={mod} className={`block w-full text-left p-2 mr-2 rounded mt-1 ${selectedMods.includes(mod) ? 'bg-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => toggleModSelection(mod)}>
                        {getUpperName(mod, '_')}
                    </button>
                ))}
                <div className="flex justify-between mt-4 ml-auto mr-2">
                    <button className="p-2 bg-green-500 text-white dark:text-black rounded hover:bg-green-600" onClick={applySelection}>
                        Save
                    </button>
                </div>
            </div>
        </Popup>
    );
};
