import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/axios'
import { showToast } from '../../components/Toast.jsx'

// ── Modal Edit Layanan ────────────────────────────────────────────
function ModalEdit({ service, onClose, onSave, isPending }) {
  const [form, setForm] = useState({
    name: service.name,
    description: service.description || '',
    price: service.price,
    unit: service.unit,
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
        <p className="text-slate-400 text-sm mb-5"> {service.name}</p>

        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Nama Layanan</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Deskripsi</label>
            <input value={form.description} onChange={e => set('description', e.target.value)}
              className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Harga (Rp)</label>
              <input type="number" value={form.price} onChange={e => set('price', Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Satuan (Unit)</label>
              <input value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="Contoh: kg"
                className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2 block">Status</label>
            <div className="flex gap-2">
              {['ACTIVE', 'INACTIVE'].map(s => (
                <button key={s} type="button" onClick={() => set('status', s)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${form.status === s
                      ? s === 'ACTIVE' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-red-400 text-white border-red-400'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:bg-blue-50'
                    }`}>
                  {s === 'ACTIVE' ? '✅' : '❌'} {s === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} disabled={isPending} className="flex-1 py-3 border border-blue-200 text-slate-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all cursor-pointer bg-white">Batal</button>
          <button onClick={() => onSave(form)} disabled={isPending} className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none">{isPending ? 'Menyimpan...' : 'Simpan'}</button>
        </div>
      </div>
    </div>
  )
}

function ModalTambah({ onClose, onSave, isPending }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', unit: 'kg' })

  function handleSubmit(e) {
    e.preventDefault()
    onSave({ ...form, price: Number(form.price) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-7 w-full max-w-md border border-blue-100 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-slate-900 font-display font-bold text-xl">Tambah Layanan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg border-none bg-transparent cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nama layanan" className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl outline-none focus:border-blue-400" required />
          <input name="description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Deskripsi layanan" className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl outline-none focus:border-blue-400" required />

          <div className="grid grid-cols-2 gap-4">
            <input name="price" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Harga" className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl outline-none focus:border-blue-400" required />
            <input name="unit" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} placeholder="Satuan (Contoh: kg)" className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl outline-none focus:border-blue-400" required />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isPending} className="flex-1 py-3 border border-blue-200 rounded-2xl bg-white text-slate-600 font-semibold cursor-pointer">Batal</button>
            <button type="submit" disabled={isPending} className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-semibold border-none cursor-pointer">{isPending ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Services() {
  const queryClient = useQueryClient()
  const [editTarget, setEditTarget] = useState(null)
  const [showTambah, setShowTambah] = useState(false)

  const { data: services = [] } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const response = await api.get('/services')
      return response.data
    }
  })

  const createServiceMutation = useMutation({
    mutationFn: async (newService) => {
      const response = await api.post('/services', newService)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      setShowTambah(false)
      showToast('✅ Layanan berhasil ditambahkan!', 'success')
    },
    onError: () => {
      showToast('❌ Gagal menambahkan layanan.', 'error')
    }
  })

  const updateServiceMutation = useMutation({
    mutationFn: async (updatedService) => {
      const { id, ...data } = updatedService
      const response = await api.put(`/services/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      showToast('✅ Layanan berhasil diperbarui!', 'success')
      setEditTarget(null)
    },
    onError: () => {
      showToast('❌ Gagal memperbarui layanan.', 'error')
    }
  })

  const deleteServiceMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/services/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      showToast('✅ Layanan berhasil dihapus!', 'success')
    },
    onError: () => {
      showToast('❌ Gagal menghapus layanan.', 'error')
    }
  })

  function handleTambah(data) {
    createServiceMutation.mutate(data)
  }

  function handleSave(form) {
    updateServiceMutation.mutate({ ...editTarget, ...form })
  }

  function handleHapus(id, name) {
    if (window.confirm(`Apakah Anda yakin ingin menghapus layanan "${name}"?`)) {
      deleteServiceMutation.mutate(id)
    }
  }

  const formatRp = (num) => 'Rp ' + (num || 0).toLocaleString('id-ID')

  return (
    <div className="space-y-4">
      {editTarget && <ModalEdit service={editTarget} onClose={() => setEditTarget(null)} onSave={handleSave} isPending={updateServiceMutation.isPending} />}
      {showTambah && <ModalTambah onClose={() => setShowTambah(false)} onSave={handleTambah} isPending={createServiceMutation.isPending} />}

      <div className="flex justify-between items-center">
        <p className="text-slate-500 text-sm">{services.length} layanan terdaftar</p>
        <button onClick={() => setShowTambah(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-all cursor-pointer border-none shadow-sm">
          + Tambah Layanan
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-blue-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-50 bg-blue-50/50">
                {['Layanan', 'Deskripsi', 'Harga', 'Satuan', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors">
                  <td className="px-4 py-4 text-slate-800 font-semibold">{s.name}</td>
                  <td className="px-4 py-4 text-slate-400">{s.description || '-'}</td>
                  <td className="px-4 py-4 text-blue-600 font-semibold">{formatRp(s.price)}</td>
                  <td className="px-4 py-4 text-slate-500">{s.unit || '-'}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                      {s.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                    </span>
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
              {services.length === 0 && (
                <tr><td colSpan={6} className="text-center text-slate-400 py-10 text-sm">Belum ada layanan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
