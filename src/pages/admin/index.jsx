import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../../lib/axios'
import useAuthStore from '../../store/useAuthStore'
import Toast, { showToast } from '../../components/Toast.jsx'

const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'orders',    icon: '📦', label: 'Pesanan' },
  { id: 'customers', icon: '👥', label: 'Pelanggan' },
  { id: 'services',  icon: '🧺', label: 'Layanan' },
  { id: 'reports',   icon: '📈', label: 'Laporan' },
  { id: 'settings',  icon: '⚙️', label: 'Pengaturan' },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/login')
    }
  }, [isAuthenticated, user, navigate])

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/all')
      return response.data
    },
    enabled: isAuthenticated && user?.role === 'ADMIN'
  })

  const { data: notifications = [], refetch: refetchNotifications } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications')
      return response.data
    },
    enabled: isAuthenticated && user?.role === 'ADMIN',
    refetchInterval: 10000
  })

  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      await api.patch(`/notifications/${id}/read`)
    },
    onSuccess: () => {
      refetchNotifications()
    }
  })

  const antrian = orders.filter(o => o.status === 'MENUNGGU_PICKUP').length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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
          {navItems.map(item => {
            const isActive = item.id === 'dashboard' 
              ? location.pathname === '/admin' || location.pathname === '/admin/'
              : location.pathname.includes(`/admin/${item.id}`)

            return (
              <Link
                key={item.id}
                to={item.id === 'dashboard' ? '/admin' : `/admin/${item.id}`}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 cursor-pointer border-none text-left no-underline ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700 bg-transparent'
                }`}
              >
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.id === 'orders' && antrian > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/30 text-white' : 'bg-orange-100 text-orange-600'}`}>
                    {antrian}
                  </span>
                )}
              </Link>
            )
          })}

          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider px-3 mb-2 mt-5">Sistem</p>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 border-none bg-transparent cursor-pointer transition-all"
          >
            🚪 <span>Keluar</span>
          </button>
        </nav>

        <div className="px-3 py-4 border-t border-blue-100">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm uppercase">{user?.name ? user.name[0] : 'A'}</div>
            <div className="flex-1 min-w-0">
              <div className="text-slate-800 text-xs font-semibold truncate">{user?.name || 'Admin'}</div>
              <div className="text-slate-400 text-xs truncate">{user?.email || 'admin@snowwash.id'}</div>
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
            {navItems.find(n => (n.id === 'dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/')) || (n.id !== 'dashboard' && location.pathname.includes(`/admin/${n.id}`)))?.label ?? 'Dashboard'}
          </h1>
          <div className="hidden md:flex items-center gap-2 bg-blue-50 rounded-2xl px-4 py-2 flex-1 max-w-xs border border-blue-100">
            <span className="text-slate-400 text-sm">🔍</span>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari pesanan, pelanggan, layanan..." className="bg-transparent border-none text-sm text-slate-700 placeholder-slate-400 outline-none flex-1 w-full" />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg cursor-pointer border border-blue-100 hover:bg-blue-100 transition-all"
            >
              🔔
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 border border-white text-white text-[10px] font-bold flex items-center justify-center translate-x-1/4 -translate-y-1/4">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden z-50">
                <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800">Notifikasi ({notifications.length})</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer text-sm">✕</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">Tidak ada notifikasi baru.</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex justify-between items-start gap-3" onClick={() => markAsReadMutation.mutate(n.id)}>
                        <p className="text-sm text-slate-700 leading-tight m-0">{n.message}</p>
                        <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  )
}
