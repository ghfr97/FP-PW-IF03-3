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

const bars = [
  ['Cuci + Setrika',   42, 'bg-blue-500'],
  ['Cuci Pakaian',     30, 'bg-teal-500'],
  ['Express Laundry',  18, 'bg-orange-400'],
  ['Setrika Pakaian',  10, 'bg-purple-400'],
]

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon="📈" label="Pendapatan Bulan Ini" value="Rp 4.2Jt" bg="bg-blue-50 border-blue-100"     text="text-blue-900"   accent="bg-blue-100" />
        <StatCard icon="📦" label="Total Pesanan"        value="38"       bg="bg-teal-50 border-teal-100"     text="text-teal-900"   accent="bg-teal-100" />
        <StatCard icon="⭐" label="Rating Rata-rata"     value="4.9/5.0"  bg="bg-yellow-50 border-yellow-100" text="text-yellow-900" accent="bg-yellow-100" />
      </div>

      <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm">
        <h3 className="text-slate-900 font-semibold mb-5">Layanan Terpopuler</h3>
        {bars.map(([name, pct, bar]) => (
          <div key={name} className="flex items-center gap-4 mb-4">
            <div className="text-slate-600 text-sm w-36 flex-shrink-0">{name}</div>
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
