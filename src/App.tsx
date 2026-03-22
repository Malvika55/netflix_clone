import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import BrowsePage from './pages/BrowsePage'
import './App.css'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<BrowsePage section="home" />} />
          <Route path="/tv-shows" element={<BrowsePage section="tv" />} />
          <Route path="/movies" element={<BrowsePage section="movies" />} />
          <Route path="/my-list" element={<BrowsePage section="my-list" />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
