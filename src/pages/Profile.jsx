import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'
import useAuthStore from '../store/useAuthStore'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Toast, { showToast } from '../components/Toast.jsx'

// Helper function to format currency
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

export default function Profile() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const user = useAuthStore(state => state.user)

  // Fetch orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/me')
      return response.data
    },
    enabled: !!isAuthenticated
  })

  // Compute stats
  const stats = useMemo(() => {
    let totalOrder = orders.length;
    let totalCucian = 0;
    let totalBayar = 0;

    orders.forEach(order => {
      totalBayar += order.total_amount;
      if (order.items) {
        order.items.forEach(item => {
          totalCucian += Number(item.qty_or_weight);
        });
      }
    });

    return [
      [totalOrder.toString(), 'Total Order'],
      [`${totalCucian} unit/kg`, 'Total Cucian'],
      [formatRupiah(totalBayar), 'Total Bayar']
    ];
  }, [orders]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

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
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-display text-3xl font-black shadow-lg uppercase">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping opacity-20 scale-110"></div>
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-1">{user?.name || 'Pelanggan'}</h3>
            <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-700 rounded-full mb-6">Member Premium ⭐</span>

            <div className="w-full space-y-3 text-left mb-6">
              {[
                { icon: '📧', label: 'Email', value: user?.email || '-' },
                { icon: '📱', label: 'Nomor HP', value: user?.phone || '-' },
                { icon: '📍', label: 'Alamat', value: user?.address || '-' },
                { icon: '📅', label: 'Bergabung', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-' },
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
              {stats.map(([num, lbl], i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50 text-center">
                  <div className="font-display text-2xl font-black text-blue-600 mb-1">{num}</div>
                  <div className="text-xs text-slate-400 font-medium">{lbl}</div>
                </div>
              ))}
            </div>

            {/* Order History */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-blue-50">
              <h3 className="font-display text-xl font-bold text-slate-900 mb-5">Riwayat Pesanan</h3>
              {isLoading ? (
                <p className="text-center text-slate-400 text-sm py-4">Memuat riwayat...</p>
              ) : orders.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-4">Belum ada pesanan.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => {
                    // Helper to determine status styling
                    let statusClass = 'bg-slate-100 text-slate-700';
                    let icon = '📦';
                    if (o.status === 'SELESAI') { statusClass = 'bg-emerald-100 text-emerald-700'; icon = '✨'; }
                    else if (o.status === 'BATAL') { statusClass = 'bg-red-100 text-red-700'; icon = '❌'; }
                    else { statusClass = 'bg-amber-100 text-amber-700'; icon = '👕'; }

                    const itemName = o.items && o.items.length > 0 ? o.items[0].service?.name + (o.items.length > 1 ? ` (+${o.items.length - 1} item)` : '') : 'Layanan';
                    const qty = o.items && o.items.length > 0 ? o.items.reduce((sum, i) => sum + Number(i.qty_or_weight), 0) : 0;
                    
                    return (
                      <div key={o.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                        o.status !== 'SELESAI' && o.status !== 'BATAL' ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent'
                      }`}>
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg flex-shrink-0">
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-slate-800">{itemName}</div>
                          <div className="text-xs text-slate-400">{new Date(o.order_date).toLocaleDateString('id-ID')} · {qty} unit/kg</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-semibold text-sm text-slate-800 mb-1">{formatRupiah(o.total_amount)}</div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass}`}>
                            {o.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
