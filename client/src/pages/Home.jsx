function Home( {user} ) {

    const welcomeTitle = user ? `Welcome, ${user.first_name}!` : "Welcome to Itemizer!";

    return (
        <>
            <h1>{welcomeTitle}</h1>
        </>
    )
}

export default Home;