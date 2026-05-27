import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Toast, { showToast } from '../components/Toast.jsx'

const orders = [
  { icon: '✨', name: 'Cuci + Setrika', date: '28 Maret 2026 · 5 kg', price: 'Rp 45.000', status: 'Selesai', statusClass: 'bg-emerald-100 text-emerald-700' },
  { icon: '⚡', name: 'Express Laundry', date: '22 Maret 2026 · 3 kg', price: 'Rp 45.000', status: 'Selesai', statusClass: 'bg-emerald-100 text-emerald-700' },
  { icon: '👕', name: 'Cuci Pakaian', date: '31 Maret 2026 · 4 kg', price: 'Rp 24.000', status: 'Diproses', statusClass: 'bg-amber-100 text-amber-700', active: true },
  { icon: '🔥', name: 'Setrika Pakaian', date: '15 Maret 2026 · 6 kg', price: 'Rp 24.000', status: 'Selesai', statusClass: 'bg-emerald-100 text-emerald-700' },
]

export default function Profile() {
  const navigate = useNavigate()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      navigate('/login')
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#f5f9ff]">
      <Navbar />
      <Toast />

      <section className="pt-28 pb-20 px-8 md:px-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-blue-600 tracking-widest uppercase">✦ Akun Saya</span>
          <h2 className="font-display text-4xl font-black text-slate-900 mt-2">
            Profil <span className="text-blue-600">Pengguna</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-7">

          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-50 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-display text-3xl font-black shadow-lg">
                A
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping opacity-20 scale-110"></div>
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-1">Ahmad Fauzan</h3>
            <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-700 rounded-full mb-6">Member Premium ⭐</span>

            <div className="w-full space-y-3 text-left mb-6">
              {[
                { icon: '📧', label: 'Email', value: 'ahmad.fauzan@email.com' },
                { icon: '📱', label: 'Nomor HP', value: '+62 812-3456-7890' },
                { icon: '📍', label: 'Alamat', value: 'Jl. Melati No. 12, Yogyakarta' },
                { icon: '📅', label: 'Bergabung', value: 'Januari 2023' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">{item.label}</div>
                    <div className="text-sm text-slate-700 font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => showToast('✏️ Fitur edit profil segera hadir!', 'success')}
              className="w-full py-3 border-2 border-blue-200 text-blue-700 font-semibold rounded-2xl hover:bg-blue-50 transition-all cursor-pointer bg-transparent"
            >
              ✏️ Edit Profil
            </button>
          </div>

          {/* Dashboard Right */}
          <div className="flex flex-col gap-6">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[['24', 'Total Order'], ['186 kg', 'Total Cucian'], ['Rp 420K', 'Total Bayar']].map(([num, lbl], i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50 text-center">
                  <div className="font-display text-2xl font-black text-blue-600 mb-1">{num}</div>
                  <div className="text-xs text-slate-400 font-medium">{lbl}</div>
                </div>
              ))}
            </div>

            {/* Order History */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-blue-50">
              <h3 className="font-display text-xl font-bold text-slate-900 mb-5">Riwayat Pesanan</h3>
              <div className="space-y-3">
                {orders.map((o, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    o.active ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent'
                  }`}>
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg flex-shrink-0">
                      {o.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-800">{o.name}</div>
                      <div className="text-xs text-slate-400">{o.date}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-sm text-slate-800 mb-1">{o.price}</div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${o.statusClass}`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
