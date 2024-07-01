import './App.css'
import Login from './Login'
import Home from './Home'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/:username' element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
