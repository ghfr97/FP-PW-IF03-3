import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useOutletContext } from 'react-router-dom'
import api from '../../lib/axios'
import { showToast } from '../../components/Toast.jsx'

const statusMap = {
  SELESAI: 'bg-emerald-100 text-emerald-700',
  DICUCI:  'bg-amber-100 text-amber-700',
  MENUNGGU_PICKUP: 'bg-slate-100 text-slate-500',
}

// ── Modal tambah pesanan ──────────────────────────────────────────
function ModalTambah({ onClose, onSave, customers, services }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-7 w-full max-w-md border border-blue-100 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-slate-900 font-display font-bold text-xl">Tambah Pesanan</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer text-lg leading-none">✕</button>
        </div>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Pelanggan</label>
            <select name="user_id" required className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
              <option value="">Pilih Pelanggan...</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Layanan</label>
            <select name="service_id" required className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
              <option value="">Pilih Layanan...</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name} - Rp {s.price.toLocaleString('id-ID')}{s.unit}</option>)}
            </select>
          </div>
          <Field label="Kuantitas / Berat" name="qty" type="number" placeholder="Misal: 5" />
          <Field label="Catatan" name="notes" type="text" placeholder="Catatan tambahan (opsional)" />
          
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
function ModalEdit({ order, onClose, onSave, isPending }) {
  const [form, setForm] = useState({
    status:   order.status,
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-7 w-full max-w-md border border-blue-100 shadow-2xl">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-slate-900 font-display font-bold text-xl">Edit Pesanan</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer text-lg leading-none">✕</button>
        </div>
        <p className="text-blue-500 text-xs font-mono font-bold mb-5">{order.id}</p>

        <div className="space-y-4">
          <div className="text-sm text-slate-600 space-y-2 mb-4 bg-slate-50 p-4 rounded-xl">
            <p><strong>Pelanggan:</strong> {order.user?.name || 'Unknown'}</p>
            <p><strong>Layanan:</strong> {order.items?.[0]?.service?.name || '-'}</p>
            <p><strong>Total:</strong> Rp {(order.total_amount || 0).toLocaleString('id-ID')}</p>
          </div>
          {/* Status pills */}
          <div>
            <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2 block">Status</label>
            <div className="flex gap-2">
              {['MENUNGGU_PICKUP', 'DICUCI', 'SELESAI'].map(s => (
                <button key={s} type="button" onClick={() => set('status', s)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer border ${
                    form.status === s
                      ? s === 'SELESAI' ? 'bg-emerald-500 text-white border-emerald-500'
                        : s === 'DICUCI' ? 'bg-amber-400 text-white border-amber-400'
                        : 'bg-slate-500 text-white border-slate-500'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:bg-blue-50'
                  }`}>
                  {s === 'MENUNGGU_PICKUP' ? '⏳' : s === 'DICUCI' ? '🔄' : '✅'} {s.toLowerCase().replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} disabled={isPending} className="flex-1 py-3 border border-blue-200 text-slate-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all cursor-pointer bg-white">Batal</button>
          <button type="button" onClick={() => onSave(form)} disabled={isPending} className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none">{isPending ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
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
      <input name={name} type={type} placeholder={placeholder} required={name !== 'notes'}
        className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
    </div>
  )
}

export default function Orders() {
  const queryClient = useQueryClient()
  const { searchQuery } = useOutletContext() || { searchQuery: '' }
  const [filter,      setFilter]      = useState('SEMUA')
  const [showTambah,  setShowTambah]  = useState(false)
  const [editTarget,  setEditTarget]  = useState(null)   // order yg sedang diedit

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/all')
      return response.data
    }
  })

  const { data: customers = [] } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const response = await api.get('/users/customers')
      return response.data
    }
  })

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await api.get('/services')
      return response.data
    }
  })

  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const response = await api.post('/orders/admin', orderData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      showToast('✅ Pesanan berhasil ditambahkan!', 'success')
      setShowTambah(false)
      api.post('/notifications', { message: 'Pesanan baru telah ditambahkan' }).catch(() => {})
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Gagal menambahkan pesanan.'
      showToast(`❌ ${msg}`, 'error')
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.put(`/orders/${id}/status`, { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      showToast('✅ Status pesanan berhasil diperbarui!', 'success')
      setEditTarget(null)
      api.post('/notifications', { message: 'Status pesanan telah diperbarui' }).catch(() => {})
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Gagal memperbarui status.'
      showToast(`❌ ${msg}`, 'error')
    }
  })

  const filtered = (filter === 'SEMUA' ? orders : orders.filter(o => o.status === filter))
    .filter(o => 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (o.user && o.user.name && o.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )

  function handleTambah(e) {
    e.preventDefault()
    const form = new FormData(e.target)
    const payload = {
      user_id: form.get('user_id'),
      items: [{
        service_id: parseInt(form.get('service_id')),
        qty: parseInt(form.get('qty'))
      }],
      notes: form.get('notes')
    }
    createOrderMutation.mutate(payload)
  }

  function handleEdit(form) {
    updateStatusMutation.mutate({ id: editTarget.id, status: form.status })
  }

  const deleteOrderMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/orders/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      showToast('✅ Pesanan berhasil dihapus/dibatalkan!', 'success')
      api.post('/notifications', { message: 'Pesanan telah dihapus' }).catch(() => {})
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Gagal menghapus pesanan.'
      showToast(`❌ ${msg}`, 'error')
    }
  })

  function handleHapus(id) {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pesanan ${id}?`)) {
      deleteOrderMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-5">
      {showTambah && <ModalTambah onClose={() => setShowTambah(false)} onSave={handleTambah} customers={customers} services={services} />}
      {editTarget  && <ModalEdit  order={editTarget} onClose={() => setEditTarget(null)} onSave={handleEdit} isPending={updateStatusMutation.isPending} />}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          {['SEMUA', 'MENUNGGU_PICKUP', 'DICUCI', 'SELESAI'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all cursor-pointer border ${
                filter === f
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-500 border-blue-100 hover:bg-blue-50 hover:text-blue-700'
              }`}>
              {f.toLowerCase().replace('_', ' ')}
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
                <tr key={o.id} className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors">
                  <td className="px-4 py-3.5 text-blue-600 font-mono text-xs font-bold truncate max-w-[80px]">{o.id}</td>
                  <td className="px-4 py-3.5 text-slate-800 font-medium truncate max-w-[120px]">{o.user?.name || 'Unknown'}</td>
                  <td className="px-4 py-3.5 text-slate-500 truncate max-w-[150px]">{o.items?.[0]?.service?.name || '-'}</td>
                  <td className="px-4 py-3.5 text-slate-500">{o.items?.length > 0 ? o.items.reduce((acc, item) => acc + item.quantity, 0) + ' item' : '-'}</td>
                  <td className="px-4 py-3.5 text-slate-800 font-semibold">Rp {(o.total_amount || 0).toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3.5 text-slate-400">{new Date(o.order_date).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusMap[o.status] || 'bg-slate-100 text-slate-500'}`}>{o.status.toLowerCase().replace('_', ' ')}</span>
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
