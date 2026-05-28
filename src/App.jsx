import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Jasa from './pages/Jasa.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import AdminLayout from './pages/admin/index.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import Orders from './pages/admin/Orders.jsx'
import Customers from './pages/admin/Customers.jsx'
import Services from './pages/admin/Services.jsx'
import Reports from './pages/admin/Reports.jsx'
import Settings from './pages/admin/Settings.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jasa" element={<Jasa />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="services" element={<Services />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
