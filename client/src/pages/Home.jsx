import StyledTitle from "../components/StyledTitle";

function Home( {user} ) {

    const welcomeTitle = user ? `Welcome, ${user.first_name}!` : "Welcome to Itemizer!";

    return (
        <StyledTitle text={welcomeTitle}/>
    )
}

export default Home;