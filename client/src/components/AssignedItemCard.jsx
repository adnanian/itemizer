export default function AssignedItemCard( {item, addedAt, lastUpdated, quantity, onUpdate} ) {
    // count
    // last updated
    // added at
    // item    
    function handleClick(e) {
        console.log(e.target.className);
    }
    
    return (
        <div className="assigned-item">
            <img src={item.image_url} alt={item.name}/>
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
                    className="minus-button" 
                    onClick={handleClick}
                    disabled={quantity === 0}
                >-</button>
                <button className="plust-button" onClick={handleClick}>+</button>
            </div>
        </div>
    )
}