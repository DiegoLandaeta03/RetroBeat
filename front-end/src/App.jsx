import './App.css'
import Login from './Login'
import Home from './Home'
import Create from './Create';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/:username' element={<Home />} />
            <Route path='/:username/create' element={<Create />}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
