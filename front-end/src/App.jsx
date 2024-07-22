import Home from './Home'
import Create from './Create';
import SpotifyLogin from './SpotifyLogin';
import SpotifyCallback from './SpotifyCallback';
import Visualization from './visualization/Visualization';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route path='/' element={<SpotifyLogin />} />
          <Route path='/auth/callback' element={<SpotifyCallback />} />
          <Route path='/:username' element={<Home />} />
          <Route path='/:username/create' element={<Create />} />
          <Route path='/:username/visualization' element={<Visualization />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
