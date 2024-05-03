//import "./App.css";
import Layout from './components/navigation/Layout';
import Home from './pages/Home'
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes as RouteList, Route } from 'react-router-dom'
import { useEffect, useState } from 'react';
import OrganizationsPage from './pages/org-page-components/OrganizationsPage';
import Organization from './pages/org-page-components/Organization';
import ProfileSettings from './pages/ProfileSettings';
import ForgotPassword from './pages/ForgotPassword';
import ErrorPage from './pages/ErrorPage';

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

  /**
     * TODO
     */
  async function handleLogoutClick() {
    const response = await fetch("/api/logout", {
        method: "DELETE"
    });
    if (response.ok) {
        setUser(null);
    }
}

  //console.log(`${user ? user.id : null} -- printed at ${new Date()}`);

  return (
    <BrowserRouter>
      <RouteList>
        <Route path="/" element={<Layout user={user} onLogout={handleLogoutClick} />} errorElement={<ErrorPage/>}>
          <Route index element={<Home user={user}/>}/>
          <Route path="about" element={<About/>}/>
          <Route path="organizations" element={<OrganizationsPage user={user} setUser={setUser}/>}/>
          <Route path="organizations/:orgId/users/:userId" element={<Organization />}/>
          <Route path="settings" element={<ProfileSettings user={user} onLogout={handleLogoutClick}/>}/>
          <Route exact path="login" element={<Login onLogin={setUser}/>}/>
          <Route path="signup" element={<Signup/>}/>
          <Route path="forgot-password" element={<ForgotPassword/>}/>
        </Route>
      </RouteList>
    </BrowserRouter>
  );
}

export default App;
