import './App.css'
import Signup from './pages/Signup'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorPage from './pages/ErrorPage'

function App() {
  console.log("Rendering App");
  return (
    <BrowserRouter>
      <header>
        <NavBar />
      </header>
      <main>
        <Routes errorFallback={<ErrorPage />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
