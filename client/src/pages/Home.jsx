function Home( {user} ) {
    function handleClick(){
        fetch("http://127.0.0.1:5555/api/check_session")
        .then((response) => response.json())
        .then((data) => console.log(data));
    }

    function currentUser() {
        alert(user.username);
    }

    return (
        <>
            <h1>Welcome to Itemizer</h1>
            <button onClick={handleClick}>Check if still logged in!</button>
            <button onClick={currentUser}>Click user's name</button>
        </>
    )
}

export default Home;