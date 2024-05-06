import { useEffect, useState } from "react";
import StyledTitle from "../components/StyledTitle";
import ItemCard from "../components/ItemCard";
import ReportForm from "../components/ReportForm";
import "../styles/Home.css";

/**
 * The first page that a user sees, whether logged in or not.
 * If the user is logged in, the user will see all the items in the 
 * system and the ReportForm, along with all the navigational links.
 * 
 * Otherwise, a welcome message will be displayed on this page instead.
 * 
 * @param {Object} props 
 * @param {Object} props.user the current user
 * @param {Array} props.items the array of items.
 * @returns 
 */
function Home({ user, items }) {
    const welcomeTitle = user ? `Welcome, ${user.first_name}!` : "Welcome to Itemizer!";

    const itemList = items.map((item) => {
        return (
            <li key={item.id}><ItemCard item={item} /></li>
        )
    });

    return (
        <div id="home-page">
            <StyledTitle text={welcomeTitle} />
            {user ? (
                <>
                    <div id="item-list-container">
                        <h4 id="item-list-title">Items Being Used Worldwide</h4>
                        <ul id="item-list">
                            {itemList}
                        </ul>
                    </div>
                    <ReportForm/>
                </>
                ) : <h1>Log in to manage items and organizations!</h1>
            }
        </div>
    )
}

export default Home;