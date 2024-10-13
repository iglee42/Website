import { MouseEventHandler, useEffect, useState } from "react";
import { ModsInfoItems } from "../../components/ModsInfoItem"
import { getTypeByNumber, Item } from "../../types/item";
import { getUpperName, split } from "../../Utils";
import { Tag } from "../../components/Tag";
import { FaTimes } from "react-icons/fa";

interface Props {
    item: Item;
    onClose: MouseEventHandler<HTMLButtonElement>;
}

function convertStringToArray(input: string): string[] {
    try {
        // Utiliser JSON.parse pour convertir la chaîne en tableau
        const result = JSON.parse(input);

        // Vérifier si le résultat est un tableau de chaînes
        if (Array.isArray(result) && result.every(item => typeof item === 'string')) {
            return result;
        } else {
            throw new Error("Le format de la chaîne n'est pas un tableau de chaînes.");
        }
    } catch (error) {
        console.error("Erreur lors de la conversion :", error);
        return []; // Retourner un tableau vide en cas d'erreur
    }
}



export const HomeModsInfos = () => {

    function Popup(props: Props) {
        const handleCopy = async (tag: string) => {
            try {
                await navigator.clipboard.writeText(tag);
                setInfo("Copied to clipboard")
                setShowInfo(true)
                setTimeout(()=>setShowInfo(false),1500)
            } catch (error) {
                console.error('Unable to copy to clipboard:', error);
            }
        };
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 transi-all">
                <div className="bg-white rounded-lg shadow-lg w-1/3 max-w-full">
                    <div className="flex">
                        {/* Section gauche : Image */}
                        <div className="w-1/2 p-4 flex items-center justify-center">
                            <img src={props.item.image_link} alt={props.item.display_name} className="w-full h-full object-cover rounded-l-lg pixelated-image" />
                        </div>
                        {/* Section droite : Infos */}
                        <div className="relative w-1/2 p-4 flex flex-col justify-center items-center">
                            {/* Bouton de fermeture en haut à droite */}
                            <button
                                onClick={props.onClose}
                                className="absolute top-2 right-2 px-2 py-2 bg-gray-100 rounded hover:bg-gray-200 transi-all"
                            >
                                <FaTimes />
                            </button>

                            <h2 className="text-lg font-bold mb-2">{props.item.display_name}</h2>
                            <p className="text-gray-600">Mod : {getUpperName(split(props.item.id,':')[0],'_')}</p>
                            <p className="text-gray-600">ID : {props.item.id}</p>
                            <p className="text-gray-600">Tags : {convertStringToArray(props.item.tags).map(t => <Tag tag={t} onClick={handleCopy} />)}</p>
                            <p className="text-gray-600">Type : {getUpperName(getTypeByNumber(props.item.type), '_')}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }




    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentItem, setCurrent] = useState<Item | null>(null);
    const [info, setInfo] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        async function fetchItems() {
            const response = await fetch('https://iglee.fr:3000/items');
            if (response.ok) {
                const data = await response.json();
                setItems(data);
                setLoading(false);
            }
        }
        fetchItems();
    }, [])

    if (loading) {
        return <div>Loading Ideas...</div>;
    }

    return (
        <div>
            <div className="flex flex-wrap -mx-2">
                {
                    items.map(it => {
                        return <ModsInfoItems item={it} onClick={it => {
                            setCurrent(it)
                        }}/>
                    })
                }
                {currentItem && (
                    <Popup item={currentItem} onClose={()=>setCurrent(null)} />
                )}
                <div className='absolute left-0 z-50 w-full flex justify-center h-10 items-center transi-all' style={{ bottom: (showInfo ? '8px' : '-50px') }}>
                    <p className=' bg-white rounded-lg px-6 h-10 text-center lh-8'>{info}</p>
                </div>
            </div>

        </div>
    )
}