import { useQuery } from '@tanstack/react-query'
import api from '../../lib/axios'

function StatCard({ icon, label, value, bg, text, accent }) {
  return (
    <div className={`rounded-3xl p-6 flex gap-4 items-start border ${bg} ${text}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${accent}`}>{icon}</div>
    <div>
      <div className="text-2xl font-display font-black">{value}</div>
      <div className="text-sm font-semibold opacity-75">{label}</div>
    </div>
  </div>
  )
}

export default function Reports() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders-reports'],
    queryFn: async () => {
      const response = await api.get('/orders/all')
      return response.data
    }
  })

  // 1. Pendapatan (Berdasarkan total pesanan yang selesai, atau bisa semua)
  const totalPendapatan = orders
    .filter(o => o.status === 'SELESAI')
    .reduce((acc, o) => acc + (o.total_amount || 0), 0)

  const formatRp = (num) => 'Rp ' + (num / 1000000).toFixed(1) + 'Jt'
  const displayPendapatan = totalPendapatan > 0 ? formatRp(totalPendapatan) : 'Rp 0'

  // 2. Total Pesanan
  const totalPesanan = orders.length

  // 3. Layanan Terpopuler
  const serviceCounts = {}
  let totalServices = 0
  orders.forEach(o => {
    if (o.items && Array.isArray(o.items)) {
      o.items.forEach(item => {
        const name = item.service?.name || 'Lainnya'
        serviceCounts[name] = (serviceCounts[name] || 0) + 1
        totalServices++
      })
    }
  })

  const colors = ['bg-blue-500', 'bg-teal-500', 'bg-orange-400', 'bg-purple-400', 'bg-pink-400', 'bg-emerald-500']
  const bars = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count], index) => {
      const pct = totalServices > 0 ? Math.round((count / totalServices) * 100) : 0
      return [name, pct, colors[index % colors.length]]
    })

  if (bars.length === 0) {
    bars.push(['Belum ada data', 0, 'bg-slate-300'])
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon="📈" label="Pendapatan (Selesai)" value={displayPendapatan} bg="bg-blue-50 border-blue-100" text="text-blue-900" accent="bg-blue-100" />
        <StatCard icon="📦" label="Total Pesanan" value={totalPesanan} bg="bg-teal-50 border-teal-100" text="text-teal-900" accent="bg-teal-100" />
        <StatCard icon="⭐" label="Rating Rata-rata" value="4.9/5.0" bg="bg-yellow-50 border-yellow-100" text="text-yellow-900" accent="bg-yellow-100" />
      </div>

      <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm">
        <h3 className="text-slate-900 font-semibold mb-5">Layanan Terpopuler</h3>
        {bars.map(([name, pct, bar], i) => (
          <div key={i} className="flex items-center gap-4 mb-4 last:mb-0">
            <div className="text-slate-600 text-sm w-40 flex-shrink-0 truncate" title={name}>{name}</div>
            <div className="flex-1 h-2.5 bg-blue-50 rounded-full overflow-hidden border border-blue-100">
              <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="text-slate-400 text-sm w-10 text-right font-medium">{pct}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
