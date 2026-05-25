import { useState } from 'react'
import { showToast } from '../../components/Toast.jsx'

// ── Modal Edit Layanan ────────────────────────────────────────────
function ModalEdit({ service, onClose, onSave }) {
  const [form, setForm] = useState({
    name: service.name,
    desc: service.desc,
    price: service.price,
    time: service.time,
    status: service.status,
  })
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-7 w-full max-w-md border border-blue-100 shadow-2xl">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-slate-900 font-display font-bold text-xl">Edit Layanan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer text-lg leading-none">✕</button>
        </div>
        <p className="text-slate-400 text-sm mb-5">{service.icon} {service.name}</p>

        <div className="space-y-4">
          {/* Nama */}
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Nama Layanan</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>
          {/* Deskripsi */}
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Deskripsi</label>
            <input value={form.desc} onChange={e => set('desc', e.target.value)}
              className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>
          {/* Harga & Waktu */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Harga per kg (Rp)</label>
              <input type="number" value={form.price} onChange={e => set('price', Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Est. Waktu</label>
              <input value={form.time} onChange={e => set('time', e.target.value)}
                className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          </div>
          {/* Status pills */}
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2 block">Status</label>
            <div className="flex gap-2">
              {['Aktif', 'Nonaktif'].map(s => (
                <button key={s} type="button" onClick={() => set('status', s)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${form.status === s
                      ? s === 'Aktif' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-red-400 text-white border-red-400'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:bg-blue-50'
                    }`}>
                  {s === 'Aktif' ? '✅' : '❌'} {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 border border-blue-200 text-slate-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all cursor-pointer bg-white">Batal</button>
          <button onClick={() => onSave(form)} className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none">Simpan</button>
        </div>
      </div>
    </div>
  )
}

function ModalTambah({ onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-7 w-full max-w-md border border-blue-100 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-slate-900 font-display font-bold text-xl">
            Tambah Layanan
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">

          <input
            name="name"
            placeholder="Nama layanan"
            className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl"
            required
          />

          <input
            name="desc"
            placeholder="Deskripsi layanan"
            className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="price"
              type="number"
              placeholder="Harga"
              className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl"
              required
            />

            <input
              name="time"
              placeholder="1 Hari"
              className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-blue-200 rounded-2xl"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-2xl"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Halaman Layanan ───────────────────────────────────────────────
export default function Services({ services, setServices }) {
  const [editTarget, setEditTarget] = useState(null)
  const [showTambah, setShowTambah] = useState(false)


  function handleTambah(e) {
    e.preventDefault()

    const f = e.target

    const newService = {
      id: Date.now(),
      name: f.name.value,
      desc: f.desc.value,
      price: Number(f.price.value),
      priceLabel:
        'Rp ' +
        Number(f.price.value).toLocaleString('id-ID') +
        '/kg',
      time: f.time.value,
      status: 'Aktif',
    }

    setServices(prev => [newService, ...prev])

    setShowTambah(false)

    showToast(
      `✅ Layanan ${newService.name} berhasil ditambahkan!`,
      'success'
    )
  }

  function handleSave(form) {
    setServices(prev => prev.map(s =>
      s.id === editTarget.id
        ? { ...s, ...form, priceLabel: 'Rp ' + form.price.toLocaleString('id-ID') + '/kg' }
        : s
    ))
    setEditTarget(null)
    showToast('✏️ Layanan berhasil diperbarui!', 'success')
  }

  function handleHapus(id, name) {
    setServices(prev => prev.filter(s => s.id !== id))
    showToast('🗑️ Layanan ' + name + ' dihapus.')
  }

  return (
    <div className="space-y-4">
      {editTarget && <ModalEdit service={editTarget} onClose={() => setEditTarget(null)} onSave={handleSave} />}

      {showTambah && (
        <ModalTambah
          onClose={() => setShowTambah(false)}
          onSave={handleTambah}
        />
      )}

      <div className="flex justify-between items-center">
        <p className="text-slate-500 text-sm">{services.length} layanan terdaftar</p>
        <button onClick={() => setShowTambah(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-all cursor-pointer border-none">
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
            {services.map(s => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors">
                <td className="px-4 py-4 text-slate-800 font-semibold">{s.name}</td>
                <td className="px-4 py-4 text-slate-400">{s.desc}</td>
                <td className="px-4 py-4 text-blue-600 font-semibold">{s.priceLabel}</td>
                <td className="px-4 py-4 text-slate-500">{s.time}</td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                    }`}>{s.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button title="Edit" onClick={() => setEditTarget(s)}
                      className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer border border-blue-100 text-xs">✏️</button>
                    <button title="Hapus" onClick={() => handleHapus(s.id, s.name)}
                      className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all cursor-pointer border border-red-100 text-xs">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
