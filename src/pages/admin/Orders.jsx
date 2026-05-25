import { useState } from 'react'
import { showToast } from '../../components/Toast.jsx'
import { serviceOptions, statusMap } from './data.js'

// ── Modal tambah pesanan ──────────────────────────────────────────
function ModalTambah({ onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-7 w-full max-w-md border border-blue-100 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-slate-900 font-display font-bold text-xl">Tambah Pesanan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer text-lg leading-none">✕</button>
        </div>
        <form onSubmit={onSave} className="space-y-4">
          <Field label="Nama Pelanggan" name="customer" type="text"   placeholder="Ahmad Fauzan" />
          <Field label="Berat (kg)"     name="weight"   type="number" placeholder="5" />
          <Field label="Tanggal"        name="date"     type="date" />
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Layanan</label>
            <select name="service" required className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
              {serviceOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-blue-200 text-slate-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all cursor-pointer bg-white">Batal</button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal edit pesanan ────────────────────────────────────────────
function ModalEdit({ order, onClose, onSave }) {
  const [form, setForm] = useState({
    customer: order.customer,
    service:  order.service,
    weight:   order.weight.replace(' kg', ''),
    date:     order.date,
    status:   order.status,
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-7 w-full max-w-md border border-blue-100 shadow-2xl">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-slate-900 font-display font-bold text-xl">Edit Pesanan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer text-lg leading-none">✕</button>
        </div>
        <p className="text-blue-500 text-xs font-mono font-bold mb-5">{order.id}</p>

        <div className="space-y-4">
          {/* Pelanggan */}
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Nama Pelanggan</label>
            <input value={form.customer} onChange={e => set('customer', e.target.value)}
              className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>
          {/* Layanan */}
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Layanan</label>
            <select value={form.service} onChange={e => set('service', e.target.value)}
              className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
              {serviceOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {/* Berat & Tanggal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Berat (kg)</label>
              <input type="number" value={form.weight} onChange={e => set('weight', e.target.value)}
                className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Tanggal</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          </div>
          {/* Status pills */}
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2 block">Status</label>
            <div className="flex gap-2">
              {['antrian', 'proses', 'selesai'].map(s => (
                <button key={s} type="button" onClick={() => set('status', s)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer border ${
                    form.status === s
                      ? s === 'selesai' ? 'bg-emerald-500 text-white border-emerald-500'
                        : s === 'proses' ? 'bg-amber-400 text-white border-amber-400'
                        : 'bg-slate-500 text-white border-slate-500'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:bg-blue-50'
                  }`}>
                  {s === 'antrian' ? '⏳' : s === 'proses' ? '🔄' : '✅'} {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 border border-blue-200 text-slate-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all cursor-pointer bg-white">Batal</button>
          <button onClick={() => onSave(form)} className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  )
}

// ── Helper input field ────────────────────────────────────────────
function Field({ label, name, type, placeholder }) {
  return (
    <div>
      <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">{label}</label>
      <input name={name} type={type} placeholder={placeholder} required
        className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
    </div>
  )
}

// ── Halaman Pesanan ───────────────────────────────────────────────
export default function Orders({ orders, setOrders }) {
  const [filter,      setFilter]      = useState('semua')
  const [showTambah,  setShowTambah]  = useState(false)
  const [editTarget,  setEditTarget]  = useState(null)   // order yg sedang diedit

  const filtered = filter === 'semua' ? orders : orders.filter(o => o.status === filter)

  function handleTambah(e) {
    e.preventDefault()
    const f = e.target
    const id = '#FW-' + String(Math.floor(Math.random() * 900) + 100)
    const weight = parseFloat(f.weight.value)
    setOrders(prev => [{
      id,
      customer: f.customer.value,
      service:  f.service.value,
      weight:   weight + ' kg',
      total:    'Rp ' + (weight * 6000).toLocaleString('id-ID'),
      date:     f.date.value,
      status:   'antrian',
    }, ...prev])
    setShowTambah(false)
    showToast('✅ Pesanan ' + id + ' berhasil ditambahkan!', 'success')
  }

  function handleEdit(form) {
    const weight = parseFloat(form.weight)
    setOrders(prev => prev.map(o =>
      o.id === editTarget.id
        ? { ...o, customer: form.customer, service: form.service, weight: weight + ' kg', total: 'Rp ' + (weight * 6000).toLocaleString('id-ID'), date: form.date, status: form.status }
        : o
    ))
    setEditTarget(null)
    showToast('✏️ Pesanan ' + editTarget.id + ' berhasil diperbarui!', 'success')
  }

  function handleHapus(id) {
    setOrders(prev => prev.filter(o => o.id !== id))
    showToast('🗑️ Pesanan ' + id + ' dihapus.')
  }

  return (
    <div className="space-y-5">
      {showTambah && <ModalTambah onClose={() => setShowTambah(false)} onSave={handleTambah} />}
      {editTarget  && <ModalEdit  order={editTarget} onClose={() => setEditTarget(null)} onSave={handleEdit} />}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          {['semua', 'antrian', 'proses', 'selesai'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer border ${
                filter === f
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-500 border-blue-100 hover:bg-blue-50 hover:text-blue-700'
              }`}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => setShowTambah(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-all cursor-pointer border-none shadow-sm">
          + Tambah Pesanan
        </button>
      </div>

      {/* Tabel */}
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
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center text-slate-400 py-10 text-sm">Tidak ada pesanan.</td></tr>
              )}
              {filtered.map((o, i) => (
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
                      <button title="Edit" onClick={() => setEditTarget(o)}
                        className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer border border-blue-100 text-xs">✏️</button>
                      <button title="Hapus" onClick={() => handleHapus(o.id)}
                        className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all cursor-pointer border border-red-100 text-xs">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
