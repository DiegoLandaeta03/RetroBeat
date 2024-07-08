import Home from './Home'
import Create from './Create';
import SpotifyLogin from './SpotifyLogin';
import SpotifyCallback from './SpotifyCallback';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route path='/' element={<SpotifyLogin />} />
          <Route path='/auth/callback' element={<SpotifyCallback />} />
          <Route path='/:username' element={<Home />} />
          <Route path='/:username/create' element={<Create />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
