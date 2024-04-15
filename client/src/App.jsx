//import "./App.css";
import Layout from './components/navigation/Layout';
import Home from './pages/Home'
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes as RouteList, Route } from 'react-router-dom'

function App() {
  console.log("Rendering App");
  return (
    <BrowserRouter>
      <RouteList>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="about" element={<About/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="signup" element={<Signup/>}/>
        </Route>
      </RouteList>
    </BrowserRouter>
  );
}

export default App;
