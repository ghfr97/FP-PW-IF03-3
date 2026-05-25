import { showToast } from '../../components/Toast.jsx'

const fields = [
  ['Nama Laundry',   'SnowWash Laundry Premium'],
  ['Email Bisnis',   'admin@snowwash.id'],
  ['Nomor WhatsApp', '+62 812-3456-7890'],
  ['Alamat',         'Jl. Melati No. 12, Yogyakarta'],
]

export default function Settings() {
  return (
    <div className="max-w-lg">
      <div className="bg-white rounded-3xl p-7 border border-blue-50 shadow-sm space-y-4">
        <h3 className="text-slate-900 font-semibold text-lg">Pengaturan Sistem</h3>
        {fields.map(([label, val]) => (
          <div key={label}>
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5 block">{label}</label>
            <input defaultValue={val}
              className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>
        ))}
        <button
          onClick={() => showToast('✅ Pengaturan disimpan!', 'success')}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none shadow-sm mt-2">
          Simpan Pengaturan
        </button>
      </div>
    </div>
  )
}
