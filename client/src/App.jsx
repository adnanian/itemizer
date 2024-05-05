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
import ErrorPage from './pages/error-handling/ErrorPage';
import AccessBlocker from './pages/error-handling/AccessBlocker';

/**
 * Root for all components in this application.
 * 
 * @returns all the routes in this application.
 */
function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/check_session").then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      }
    })
  }, []);

  useEffect(() => {
    fetch('/api/items')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Currently not logged in");
        }
        return response.json();
      })
      .then((data) => {
        setItems(data);
      })
      .catch((error) => console.log(error));
  }, [user]);

  /**
   * Logs the user out of his/her account and redirects to Login page.
   */
  async function handleLogoutClick() {
    const response = await fetch("/api/logout", {
      method: "DELETE"
    });
    if (response.ok) {
      setUser(null);
    }
  }

  /**
   * Adds a new item to the items array.
   * 
   * @param {*} item the item to add.
   */
  function addItem(item) {
    setItems([...items, item]);
  }

  //console.log(`${user ? user.id : null} -- printed at ${new Date()}`);

  return (
    <BrowserRouter>
      <RouteList>
        <Route path="/" element={<Layout user={user} onLogout={handleLogoutClick} />}>
          <Route index element={<Home user={user} items={items} />} />
          <Route path="about" element={<About />} />
          <Route path="organizations" element={<OrganizationsPage user={user} setUser={setUser} />} />
          <Route path="organizations/:orgId/users/:userId" element={<Organization items={items} onAddItem={addItem}/>} />
          <Route path="settings" element={<ProfileSettings user={user} onLogout={handleLogoutClick} />} />
          <Route exact path="login" element={<Login onLogin={setUser} />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="unauthorized" element={<AccessBlocker />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </RouteList>
    </BrowserRouter>
  );
}

export default App;
