import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Jasa from './pages/Jasa.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Admin from './pages/admin/index.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jasa" element={<Jasa />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
