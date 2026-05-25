import { useState } from 'react'
import { Link } from 'react-router-dom'
import Toast, { showToast } from '../../components/Toast.jsx'
import Dashboard from './Dashboard.jsx'
import Orders from './Orders.jsx'
import Customers from './Customers.jsx'
import Services from './Services.jsx'
import Reports from './Reports.jsx'
import Settings from './Settings.jsx'
import { initialOrders, initialServices, initialCustomers } from './data.js'

const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'orders',    icon: '📦', label: 'Pesanan' },
  { id: 'customers', icon: '👥', label: 'Pelanggan' },
  { id: 'services',  icon: '🧺', label: 'Layanan' },
  { id: 'reports',   icon: '📈', label: 'Laporan' },
  { id: 'settings',  icon: '⚙️', label: 'Pengaturan' },
]

export default function AdminLayout() {
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Global state — dioper ke masing-masing halaman
  const [orders,    setOrders]    = useState(initialOrders)
  const [services,  setServices]  = useState(initialServices)
  const [customers, setCustomers] = useState(initialCustomers)

  const antrian = orders.filter(o => o.status === 'antrian').length

  function navigate(id) {
    setPage(id)
    setSidebarOpen(false)
  }

  const pageProps = { orders, setOrders, services, setServices, customers, setCustomers, navigate }

  return (
    <div className="flex min-h-screen bg-[#f5f9ff]">
      <Toast />

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`fixed top-0 left-0 bottom-0 z-40 w-60 bg-white border-r border-blue-100 flex flex-col shadow-sm transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>

        <div className="flex items-center gap-3 px-6 h-16 border-b border-blue-100">
          <span className="text-blue-600 text-2xl">❄</span>
          <div>
            <div className="font-display font-bold text-slate-900 text-base leading-tight">SnowWash</div>
            <div className="text-xs text-slate-400 font-medium">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider px-3 mb-2">Menu Utama</p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 cursor-pointer border-none text-left ${
                page === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700 bg-transparent'
              }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.id === 'orders' && antrian > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${page === item.id ? 'bg-white/30 text-white' : 'bg-orange-100 text-orange-600'}`}>
                  {antrian}
                </span>
              )}
            </button>
          ))}

          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider px-3 mb-2 mt-5">Sistem</p>
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 no-underline transition-all"
          >
            🚪 <span>Keluar</span>
          </Link>
        </nav>

        <div className="px-3 py-4 border-t border-blue-100">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm">A</div>
            <div className="flex-1 min-w-0">
              <div className="text-slate-800 text-xs font-semibold truncate">Admin Utama</div>
              <div className="text-slate-400 text-xs truncate">admin@snowwash.id</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm flex items-center px-6 gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-slate-500 hover:text-blue-600 bg-transparent border-none cursor-pointer text-xl p-1"
          >☰</button>
          <h1 className="font-display font-black text-slate-900 text-lg flex-1">
            {navItems.find(n => n.id === page)?.label ?? 'Dashboard'}
          </h1>
          <div className="hidden md:flex items-center gap-2 bg-blue-50 rounded-2xl px-4 py-2 flex-1 max-w-xs border border-blue-100">
            <span className="text-slate-400 text-sm">🔍</span>
            <input type="text" placeholder="Cari pesanan, pelanggan..." className="bg-transparent border-none text-sm text-slate-700 placeholder-slate-400 outline-none flex-1 w-full" />
          </div>
          <button
            onClick={() => showToast('📬 Kamu punya 3 notifikasi baru!')}
            className="relative w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg cursor-pointer border border-blue-100 hover:bg-blue-100 transition-all"
          >
            🔔
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
          </button>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {page === 'dashboard' && <Dashboard {...pageProps} />}
          {page === 'orders'    && <Orders    {...pageProps} />}
          {page === 'customers' && <Customers {...pageProps} />}
          {page === 'services'  && <Services  {...pageProps} />}
          {page === 'reports'   && <Reports   {...pageProps} />}
          {page === 'settings'  && <Settings  {...pageProps} />}
        </main>
      </div>
    </div>
  )
}
