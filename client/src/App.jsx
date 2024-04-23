//import "./App.css";
import Layout from './components/navigation/Layout';
import Home from './pages/Home'
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes as RouteList, Route } from 'react-router-dom'
import { useEffect, useState } from 'react';
import OrganizationsPage from './pages/OrganizationsPage';
import Organization from './pages/Organization';

/**
 * TODO
 * 
 * @returns 
 */
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/check_session").then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      } 
    })
  }, [])

  console.log(`${user ? user.id : null} -- printed at ${new Date()}`);

  return (
    <BrowserRouter>
      <RouteList>
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<Home user={user}/>}/>
          <Route path="about" element={<About/>}/>
          <Route path="organizations/user/:id" element={<OrganizationsPage/>}/>
          <Route path="organizations/:orgId/users/:userId" element={<Organization />}/>
          <Route exact path="login" element={<Login onLogin={setUser}/>}/>
          <Route path="signup" element={<Signup/>}/>
        </Route>
      </RouteList>
    </BrowserRouter>
  );
}

export default App;
