import { HashRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import BrowsePage from './pages/BrowsePage'
import './App.css'

function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  )
}

export default App
