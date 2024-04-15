//import "./App.css";
import Layout from './components/navigation/Layout';
import Home from './pages/Home'
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes as RouteList, Route } from 'react-router-dom'
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/check_session").then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      } 
    })
  }, [])

  function handleLogin(user) {
    setUser(user);
  }

  function handleLogout(user) {
    setUser(null);
  }

  console.log(user);

  return (
    <BrowserRouter>
      <RouteList>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="about" element={<About/>}/>
          <Route exact path="login" element={<Login onLogin={handleLogin}/>}/>
          <Route path="signup" element={<Signup/>}/>
        </Route>
      </RouteList>
    </BrowserRouter>
  );
}

export default App;
