import { itemImagePlaceholder } from "../helpers";

/**
 * TODO
 * 
 * @param {*} param0 
 * @returns 
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