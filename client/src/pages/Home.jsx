import { useEffect, useState } from "react";
import StyledTitle from "../components/StyledTitle";
import ItemCard from "../components/ItemCard";

function Home( {user} ) {
    const [items, setItems] = useState([])
    const welcomeTitle = user ? `Welcome, ${user.first_name}!` : "Welcome to Itemizer!";

    useEffect(() => {
        fetch('/api/items')
        .then((response) => response.json())
        .then((data) => setItems(data))
    }, [])

    const itemList = items.map((item) => {
        return (
            <li key={item.id}><ItemCard item={item}/></li>
        )
    });

    return (
        <div>
            <StyledTitle text={welcomeTitle}/>
            <div id="item-list-container">
                <h4 id="item-list-title">Items Being Used Worldwide</h4>
                <ul id="item-list">
                    {itemList}
                </ul>
            </div>
        </div>
    )
}

export default Home;