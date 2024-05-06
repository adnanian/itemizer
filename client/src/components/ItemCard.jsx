import { itemImagePlaceholder } from "../helpers";

/**
 * Displays all the information of an item in the form of a card.
 * 
 * WARNING: THIS COMPONENT IS MEANT TO RENDER UNDER THE Home PAGE. DO NOT CONFUSE THIS
 * WITH AssignedItemCard, WHICH IS MEANT TO BE RENDERED UNDER THE Organization PAGE.
 * 
 * @param {Object} props 
 * @param {Object} props.item the item.
 * @returns an item card consisting of its information.
 */
export default function ItemCard( {item} ) {
    return (
        <div className="item-card">
            <img className="item-image" src={item.image_url || itemImagePlaceholder} alt={item.name}/>
            <p><b>{item.name}</b></p>
            <p>{item.part_number}</p>
            <p className="item-desc">{item.description}</p>
        </div>
    )
}