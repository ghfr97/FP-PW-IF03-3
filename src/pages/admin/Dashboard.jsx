import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/axios'

const statusMap = {
  SELESAI: 'bg-emerald-100 text-emerald-700',
  DICUCI:  'bg-amber-100 text-amber-700',
  MENUNGGU_PICKUP: 'bg-slate-100 text-slate-500',
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

export default function Dashboard() {
  const navigate = useNavigate()

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/all')
      return response.data
    }
  })

  const totalPesanan = orders.length
  const pelangganAktif = new Set(orders.map(o => o.user_id)).size
  const totalPendapatan = orders.reduce((acc, o) => acc + (o.total_amount || 0), 0)
  const pendingOrders = orders.filter(o => o.status === 'MENUNGGU_PICKUP').length
  const formatRp = (num) => 'Rp ' + (num || 0).toLocaleString('id-ID')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-black text-slate-900 mb-0.5">Selamat Datang, Admin! 👋</h2>
        <p className="text-slate-400 text-sm">Berikut ringkasan operasional hari ini</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="📦" label="Total Pesanan"        value={totalPesanan}      sub="Keseluruhan"         bg="bg-blue-50 border-blue-100"     text="text-blue-900"    accent="bg-blue-100" />
        <StatCard icon="👥" label="Pelanggan Aktif"      value={pelangganAktif}       sub="Unik"       bg="bg-teal-50 border-teal-100"     text="text-teal-900"    accent="bg-teal-100" />
        <StatCard icon="💰" label="Total Pendapatan" value={formatRp(totalPendapatan)} sub="Keseluruhan"   bg="bg-emerald-50 border-emerald-100" text="text-emerald-900" accent="bg-emerald-100" />
        <StatCard icon="⏳" label="Menunggu Proses"      value={pendingOrders} sub="Butuh perhatian" bg="bg-orange-50 border-orange-100" text="text-orange-900" accent="bg-orange-100" />
      </div>

      <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-900">Pesanan Terbaru</h3>
          <button onClick={() => navigate('/admin/orders')} className="text-blue-600 text-sm font-medium hover:underline bg-transparent border-none cursor-pointer">
            Lihat Semua →
          </button>
        </div>
        <div className="space-y-1">
          {orders.slice(0, 5).map((o, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
              <div className="text-blue-500 text-xs font-mono font-bold w-24 flex-shrink-0 truncate">{o.id}</div>
              <div className="flex-1 text-slate-800 text-sm font-medium truncate">{o.user?.name || 'Unknown'}</div>
              <div className="text-slate-400 text-sm hidden md:block flex-1 truncate">{o.items?.[0]?.service?.name || '-'}</div>
              <div className="text-slate-800 text-sm font-semibold flex-shrink-0">{formatRp(o.total_amount)}</div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusMap[o.status] || 'bg-slate-100 text-slate-500'}`}>{o.status.toLowerCase().replace('_', ' ')}</span>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center text-slate-500 py-4 text-sm">Belum ada pesanan</div>
          )}
        </div>
      </div>
    </div>
  )
}
