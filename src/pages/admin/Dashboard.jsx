import { statusMap } from './data.js'

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

import { useOutletContext, useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { orders } = useOutletContext()
  const navigate = useNavigate()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-black text-slate-900 mb-0.5">Selamat Datang, Admin! 👋</h2>
        <p className="text-slate-400 text-sm">Rabu, 2 April 2026 · Berikut ringkasan operasional hari ini</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="📦" label="Total Pesanan"        value="128"      sub="+5 hari ini"         bg="bg-blue-50 border-blue-100"     text="text-blue-900"    accent="bg-blue-100" />
        <StatCard icon="👥" label="Pelanggan Aktif"      value="74"       sub="+2 minggu ini"       bg="bg-teal-50 border-teal-100"     text="text-teal-900"    accent="bg-teal-100" />
        <StatCard icon="💰" label="Pendapatan Bulan Ini" value="Rp 4.2Jt" sub="+12% dari kemarin"   bg="bg-emerald-50 border-emerald-100" text="text-emerald-900" accent="bg-emerald-100" />
        <StatCard icon="⏳" label="Menunggu Proses"      value={orders.filter(o=>o.status==='antrian').length} sub="Butuh perhatian" bg="bg-orange-50 border-orange-100" text="text-orange-900" accent="bg-orange-100" />
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
  )
}
