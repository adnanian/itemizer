import { itemImagePlaceholder } from "../helpers";

export default function AssignedItemCard( {item, addedAt, lastUpdated, quantity, assignmentId, onUpdate} ) {
    const minusButtonClassName = "minus-button";
    const plusButtonClassName = "plus-button";
    
    function handleClick(e) {
        const newQuantity = e.target.className === minusButtonClassName ? (quantity - 1) : (quantity + 1);
        fetch(`/api/assignments/${assignmentId}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                count: newQuantity
            })
        })
        .then((response) => response.json())
        .then((data) => onUpdate(data));
    }
    
    return (
        <div className="assigned-item">
            <img src={item.image_url || itemImagePlaceholder} alt={item.name}/>
            <h4>{item.name}</h4>
            <h5>{item.partNumber}</h5>
            <p><b>{quantity}</b> Left</p>
            <p><b>Added at: </b>{addedAt}</p>
            <p><b>Last Updated: </b>{lastUpdated || "N/A"}</p>
            <textarea 
                readOnly
                rows="5"
                cols="20"
                value={item.description}
            >
            </textarea>
            <div className="item-button-group">
                <button 
                    className={minusButtonClassName} 
                    onClick={handleClick}
                    disabled={quantity === 0}
                >-</button>
                <button className={plusButtonClassName} onClick={handleClick}>+</button>
            </div>
        </div>
    )
}