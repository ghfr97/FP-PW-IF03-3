import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Toast, { showToast } from '../components/Toast.jsx'



const services = [
  { icon: '👕', name: 'Cuci Pakaian', desc: 'Detergen premium, front-load', price: 'Rp 6.000/kg', time: '1 Hari', status: 'Aktif' },
  { icon: '🔥', name: 'Setrika Pakaian', desc: 'Setrika uap, rapi sempurna', price: 'Rp 4.000/kg', time: '6 Jam', status: 'Aktif' },
  { icon: '✨', name: 'Cuci + Setrika', desc: 'Paket lengkap hemat', price: 'Rp 9.000/kg', time: '1 Hari', status: 'Aktif' },
  { icon: '⚡', name: 'Express Laundry', desc: 'Prioritas antrian, 3 jam', price: 'Rp 15.000/kg', time: '3 Jam', status: 'Aktif' },
]

const customers = [
  { init: 'AF', name: 'Ahmad Fauzan', email: 'ahmad@email.com', orders: 24, total: 'Rp 420K', color: 'bg-blue-100 text-blue-700' },
  { init: 'SW', name: 'Sari Wulandari', email: 'sari@email.com', orders: 12, total: 'Rp 180K', color: 'bg-teal-100 text-teal-700' },
  { init: 'BS', name: 'Budi Santoso', email: 'budi@email.com', orders: 8, total: 'Rp 120K', color: 'bg-orange-100 text-orange-700' },
  { init: 'DR', name: 'Dewi Rahayu', email: 'dewi@email.com', orders: 18, total: 'Rp 270K', color: 'bg-rose-100 text-rose-700' },
  { init: 'RH', name: 'Rudi Hermawan', email: 'rudi@email.com', orders: 6, total: 'Rp 90K', color: 'bg-purple-100 text-purple-700' },
  { init: 'LN', name: 'Lisa Novita', email: 'lisa@email.com', orders: 30, total: 'Rp 520K', color: 'bg-yellow-100 text-yellow-700' },
]

const statusMap = {
  selesai: 'bg-emerald-100 text-emerald-700',
  proses:  'bg-amber-100 text-amber-700',
  antrian: 'bg-slate-100 text-slate-500',
}

function StatCard({ icon, label, value, sub, bg, text, accent }) {
  return (
    <div className={`rounded-3xl p-6 flex gap-4 items-start border ${bg} ${text}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${accent}`}>{icon}</div>
      <div>
        <div className="text-2xl font-display font-black">{value}</div>
        <div className="text-sm font-semibold opacity-75">{label}</div>
        {sub && <div className="text-xs opacity-50 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

export default function Admin() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddOrder, setShowAddOrder] = useState(false)
  const [filter, setFilter] = useState('semua')

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await axios.get('/api/orders.json')
      return response.data
    }
  })

  const filteredOrders = filter === 'semua' ? orders : orders.filter(o => o.status === filter)

  const addOrderMutation = useMutation({
    mutationFn: async (newOrder) => {
      const res = await axios.post('https://jsonplaceholder.typicode.com/posts', newOrder)
      return { ...res.data, ...newOrder }
    },
    onSuccess: (savedOrder) => {
      // In a real app we might just invalidate, but since it's mock we update cache
      queryClient.setQueryData(['admin-orders'], old => [savedOrder, ...old])
      setShowAddOrder(false)
      showToast('✅ Pesanan ' + savedOrder.id + ' berhasil ditambahkan!', 'success')
    },
    onError: (error) => {
      showToast('❌ Gagal menambahkan pesanan', 'error')
      console.error(error)
    }
  })

  function addOrder(e) {
    e.preventDefault()
    const f = e.target
    const id = '#FW-' + String(Math.floor(Math.random() * 900) + 100)
    
    const newOrder = {
      id,
      customer: f.customer.value,
      service: f.service.value,
      weight: f.weight.value + ' kg',
      total: 'Rp ' + (parseFloat(f.weight.value) * 6000).toLocaleString('id-ID'),
      date: f.date.value,
      status: 'antrian',
    }

    addOrderMutation.mutate(newOrder)
  }

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'orders',    icon: '📦', label: 'Pesanan', badge: orders.filter(o => o.status === 'antrian').length },
    { id: 'customers', icon: '👥', label: 'Pelanggan' },
    { id: 'services',  icon: '🧺', label: 'Layanan' },
    { id: 'reports',   icon: '📈', label: 'Laporan' },
    { id: 'settings',  icon: '⚙️', label: 'Pengaturan' },
  ]

  return (
    <div className="flex min-h-screen bg-[#f5f9ff]">
      <Toast />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`fixed top-0 left-0 bottom-0 z-40 w-60 bg-white border-r border-blue-100 flex flex-col shadow-sm transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>

        {/* Brand */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-blue-100">
          <span className="text-blue-600 text-2xl">❄</span>
          <div>
            <div className="font-display font-bold text-slate-900 text-base leading-tight">SnowWash</div>
            <div className="text-xs text-slate-400 font-medium">Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider px-3 mb-2">Menu Utama</p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 cursor-pointer border-none text-left ${
                page === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700 bg-transparent'
              }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${page === item.id ? 'bg-white/30 text-white' : 'bg-orange-100 text-orange-600'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider px-3 mb-2 mt-5">Sistem</p>
          <Link
            to="/login"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 no-underline transition-all"
          >
            🚪 <span>Keluar</span>
          </Link>
        </nav>

        {/* Admin profile footer */}
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

      {/* ===== MAIN ===== */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm flex items-center px-6 gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-slate-500 hover:text-blue-600 bg-transparent border-none cursor-pointer text-xl p-1"
          >
            ☰
          </button>
          <h1 className="font-display font-black text-slate-900 text-lg flex-1 capitalize">
            {navItems.find(n => n.id === page)?.label ?? 'Dashboard'}
          </h1>
          <div className="hidden md:flex items-center gap-2 bg-blue-50 rounded-2xl px-4 py-2 flex-1 max-w-xs border border-blue-100">
            <span className="text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Cari pesanan, pelanggan..."
              className="bg-transparent border-none text-sm text-slate-700 placeholder-slate-400 outline-none flex-1 w-full"
            />
          </div>
          <button
            onClick={() => showToast('📬 Kamu punya 3 notifikasi baru!')}
            className="relative w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg cursor-pointer border border-blue-100 hover:bg-blue-100 transition-all"
          >
            🔔
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">

          {/* ── DASHBOARD ── */}
          {page === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-2xl font-black text-slate-900 mb-0.5">Selamat Datang, Admin! 👋</h2>
                <p className="text-slate-400 text-sm">Rabu, 2 April 2026 · Berikut ringkasan operasional hari ini</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard icon="📦" label="Total Pesanan"        value="128"     sub="+5 hari ini"         bg="bg-blue-50 border-blue-100"    text="text-blue-900"   accent="bg-blue-100" />
                <StatCard icon="👥" label="Pelanggan Aktif"      value="74"      sub="+2 minggu ini"       bg="bg-teal-50 border-teal-100"    text="text-teal-900"   accent="bg-teal-100" />
                <StatCard icon="💰" label="Pendapatan Bulan Ini" value="Rp 4.2Jt" sub="+12% dari kemarin"  bg="bg-emerald-50 border-emerald-100" text="text-emerald-900" accent="bg-emerald-100" />
                <StatCard icon="⏳" label="Menunggu Proses"      value="5"       sub="Butuh perhatian"     bg="bg-orange-50 border-orange-100" text="text-orange-900" accent="bg-orange-100" />
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-slate-900">Pesanan Terbaru</h3>
                  <button onClick={() => setPage('orders')} className="text-blue-600 text-sm font-medium hover:underline bg-transparent border-none cursor-pointer">
                    Lihat Semua →
                  </button>
                </div>
                <div className="space-y-2">
                  {orders.slice(0, 4).map((o, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                      <div className="text-blue-500 text-xs font-mono font-bold w-24 flex-shrink-0">{o.id}</div>
                      <div className="flex-1 text-slate-800 text-sm font-medium">{o.customer}</div>
                      <div className="text-slate-400 text-sm hidden md:block flex-1">{o.service}</div>
                      <div className="text-slate-800 text-sm font-semibold">{o.total}</div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusMap[o.status]}`}>{o.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {page === 'orders' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2 flex-wrap">
                  {['semua', 'antrian', 'proses', 'selesai'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer border ${
                        filter === f
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-500 border-blue-100 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowAddOrder(true)}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-all cursor-pointer border-none shadow-sm"
                >
                  + Tambah Pesanan
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-blue-50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-blue-50 bg-blue-50/50">
                        {['ID', 'Pelanggan', 'Layanan', 'Berat', 'Total', 'Tanggal', 'Status', 'Aksi'].map(h => (
                          <th key={h} className="text-left px-4 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors">
                          <td className="px-4 py-3.5 text-blue-600 font-mono text-xs font-bold">{o.id}</td>
                          <td className="px-4 py-3.5 text-slate-800 font-medium">{o.customer}</td>
                          <td className="px-4 py-3.5 text-slate-500">{o.service}</td>
                          <td className="px-4 py-3.5 text-slate-500">{o.weight}</td>
                          <td className="px-4 py-3.5 text-slate-800 font-semibold">{o.total}</td>
                          <td className="px-4 py-3.5 text-slate-400">{o.date}</td>
                          <td className="px-4 py-3.5">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusMap[o.status]}`}>{o.status}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex gap-2">
                              <button onClick={() => showToast('✏️ Edit pesanan ' + o.id)} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer border border-blue-100 text-xs">✏️</button>
                              <button onClick={() => { setOrders(prev => prev.filter((_, j) => j !== orders.indexOf(o))); showToast('🗑️ Pesanan dihapus.') }} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all cursor-pointer border border-red-100 text-xs">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── CUSTOMERS ── */}
          {page === 'customers' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-5">
                <p className="text-slate-500 text-sm">{customers.length} pelanggan terdaftar</p>
                <button onClick={() => showToast('+ Fitur tambah pelanggan coming soon!')} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-all cursor-pointer border-none">
                  + Tambah Pelanggan
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {customers.map((c, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center gap-4 mb-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm ${c.color}`}>{c.init}</div>
                      <div>
                        <div className="text-slate-900 font-semibold">{c.name}</div>
                        <div className="text-slate-400 text-xs">{c.email}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
                        <div className="text-slate-900 font-bold">{c.orders}</div>
                        <div className="text-slate-400 text-xs">Pesanan</div>
                      </div>
                      <div className="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
                        <div className="text-slate-900 font-bold">{c.total}</div>
                        <div className="text-slate-400 text-xs">Total</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SERVICES ── */}
          {page === 'services' && (
            <div className="animate-fade-in space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 text-sm">{services.length} layanan aktif</p>
                <button onClick={() => showToast('+ Fitur tambah layanan coming soon!')} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-all cursor-pointer border-none">
                  + Tambah Layanan
                </button>
              </div>
              <div className="bg-white rounded-3xl border border-blue-50 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-50 bg-blue-50/50">
                      {['Layanan', 'Deskripsi', 'Harga', 'Est. Waktu', 'Status', 'Aksi'].map(h => (
                        <th key={h} className="text-left px-4 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors">
                        <td className="px-4 py-4 text-slate-800 font-semibold">{s.icon} {s.name}</td>
                        <td className="px-4 py-4 text-slate-400">{s.desc}</td>
                        <td className="px-4 py-4 text-blue-600 font-semibold">{s.price}</td>
                        <td className="px-4 py-4 text-slate-500">{s.time}</td>
                        <td className="px-4 py-4">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">{s.status}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => showToast('✏️ Edit layanan ' + s.name)} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer border border-blue-100 text-xs">✏️</button>
                            <button onClick={() => showToast('🗑️ Hapus layanan ' + s.name)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all cursor-pointer border border-red-100 text-xs">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── REPORTS ── */}
          {page === 'reports' && (
            <div className="animate-fade-in space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon="📈" label="Pendapatan Bulan Ini" value="Rp 4.2Jt" bg="bg-blue-50 border-blue-100"    text="text-blue-900"   accent="bg-blue-100" />
                <StatCard icon="📦" label="Total Pesanan"        value="38"       bg="bg-teal-50 border-teal-100"    text="text-teal-900"   accent="bg-teal-100" />
                <StatCard icon="⭐" label="Rating Rata-rata"     value="4.9/5.0"  bg="bg-yellow-50 border-yellow-100" text="text-yellow-900" accent="bg-yellow-100" />
              </div>
              <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm">
                <h3 className="text-slate-900 font-semibold mb-5">Layanan Terpopuler</h3>
                {[['Cuci + Setrika', 42, 'bg-blue-500'], ['Cuci Pakaian', 30, 'bg-teal-500'], ['Express Laundry', 18, 'bg-orange-400'], ['Setrika Pakaian', 10, 'bg-purple-400']].map(([name, pct, bar], i) => (
                  <div key={i} className="flex items-center gap-4 mb-4">
                    <div className="text-slate-600 text-sm w-36 flex-shrink-0">{name}</div>
                    <div className="flex-1 h-2.5 bg-blue-50 rounded-full overflow-hidden border border-blue-100">
                      <div className={`h-full rounded-full ${bar} transition-all`} style={{ width: `${pct}%` }}></div>
                    </div>
                    <div className="text-slate-400 text-sm w-10 text-right font-medium">{pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {page === 'settings' && (
            <div className="animate-fade-in max-w-lg">
              <div className="bg-white rounded-3xl p-7 border border-blue-50 shadow-sm space-y-4">
                <h3 className="text-slate-900 font-semibold text-lg">Pengaturan Sistem</h3>
                {[
                  ['Nama Laundry',    'SnowWash Laundry Premium'],
                  ['Email Bisnis',    'admin@snowwash.id'],
                  ['Nomor WhatsApp',  '+62 812-3456-7890'],
                  ['Alamat',          'Jl. Melati No. 12, Yogyakarta'],
                ].map(([label, val], i) => (
                  <div key={i}>
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5 block">{label}</label>
                    <input
                      defaultValue={val}
                      className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                ))}
                <button
                  onClick={() => showToast('✅ Pengaturan disimpan!', 'success')}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none shadow-sm mt-2"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MODAL TAMBAH PESANAN ── */}
      {showAddOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-7 w-full max-w-md border border-blue-100 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-slate-900 font-display font-bold text-xl">Tambah Pesanan</h3>
              <button onClick={() => setShowAddOrder(false)} className="text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer text-lg">✕</button>
            </div>
            <form onSubmit={addOrder} className="space-y-4">
              {[
                { label: 'Nama Pelanggan', name: 'customer', type: 'text',   placeholder: 'Ahmad Fauzan' },
                { label: 'Berat (kg)',     name: 'weight',   type: 'number', placeholder: '5' },
                { label: 'Tanggal',        name: 'date',     type: 'date' },
              ].map(f => (
                <div key={f.name}>
                  <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">{f.label}</label>
                  <input
                    name={f.name} type={f.type} placeholder={f.placeholder} required
                    className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Layanan</label>
                <select name="service" required className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
                  <option>Cuci Pakaian</option>
                  <option>Setrika Pakaian</option>
                  <option>Cuci + Setrika</option>
                  <option>Express Laundry</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddOrder(false)} className="flex-1 py-3 border border-blue-200 text-slate-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all cursor-pointer bg-white">Batal</button>
                <button type="submit" disabled={addOrderMutation.isPending} className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none disabled:opacity-50">
                  {addOrderMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
