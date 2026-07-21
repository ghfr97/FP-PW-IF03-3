import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useOutletContext } from 'react-router-dom'
import api from '../../lib/axios'
import { showToast } from '../../components/Toast.jsx'

// ── Modal tambah Pelanggan ──────────────────────────────────────────
function ModalPelanggan({ onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-7 w-full max-w-md border border-blue-100 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-slate-900 font-display font-bold text-xl">Tambah Pelanggan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer text-lg leading-none">✕</button>
        </div>
        <form onSubmit={onSave} className="space-y-4">
          <Field label="Nama Pelanggan" name="customer" type="text"   placeholder="Ahmad Fauzan" />
          <Field label="Email"     name="email"   type="text" placeholder="name@email.com" />
          <Field label="Nomor HP" name="phone" type="tel"   placeholder="08123" />
          <Field label="Alamat" name="address" type="text"   placeholder="rumah no 12 rt 1 rw 2" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-blue-200 text-slate-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all cursor-pointer bg-white">Batal</button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal Edit Pelanggan ──────────────────────────────────────────
function ModalEdit({ customer, onClose, onSave }) {
  const [form, setForm] = useState({
    name:    customer.name,
    email:   customer.email,
    phone:   customer.phone,
    address: customer.address,
  })
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-7 w-full max-w-md border border-blue-100 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-slate-900 font-display font-bold text-xl">Edit Pelanggan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer text-lg leading-none">✕</button>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Nama Lengkap', key: 'name',    type: 'text' },
            { label: 'Email',        key: 'email',   type: 'email' },
            { label: 'Nomor HP',     key: 'phone',   type: 'tel' },
            { label: 'Alamat',       key: 'address', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 border border-blue-200 text-slate-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all cursor-pointer bg-white">Batal</button>
          <button onClick={() => onSave(form)} className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none">Simpan</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, name, type, placeholder }) {
  return (
    <div>
      <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">
        {label}</label>
         <input name={name} type={type} placeholder={placeholder} required
           className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
    </div>
  )
}

// ── Halaman Pelanggan ─────────────────────────────────────────────

export default function Customers() {
  const queryClient = useQueryClient()
  const { searchQuery } = useOutletContext() || { searchQuery: '' }
  const [showTambah, setShowTambah] = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const { data: rawCustomers = [] } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const response = await api.get('/users/customers')
      return response.data
    }
  })

  const customers = rawCustomers.map(c => {
    const init = c.name ? c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U'
    const ordersCount = c.orders ? c.orders.length : 0
    const totalAmount = c.orders ? c.orders.reduce((acc, o) => acc + (o.total_amount || 0), 0) : 0
    return {
      ...c,
      init,
      color: "bg-blue-100 text-blue-600",
      ordersCount,
      totalFormatted: "Rp " + totalAmount.toLocaleString('id-ID')
    }
  })

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const createUserMutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await api.post('/users', newUser)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] })
      setShowTambah(false)
      showToast('✅ Pelanggan berhasil ditambahkan!', 'success')
      api.post('/notifications', { message: 'Pelanggan baru telah ditambahkan' }).catch(() => {})
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Gagal menambahkan pelanggan.'
      showToast(`❌ ${msg}`, 'error')
    }
  })

  const updateUserMutation = useMutation({
    mutationFn: async (updatedUser) => {
      const { id, ...data } = updatedUser
      const response = await api.put(`/users/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] })
      showToast('✅ Data pelanggan berhasil diperbarui!', 'success')
      setEditTarget(null)
      api.post('/notifications', { message: 'Data pelanggan telah diperbarui' }).catch(() => {})
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Gagal memperbarui data pelanggan.'
      showToast(`❌ ${msg}`, 'error')
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/users/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] })
      showToast('✅ Pelanggan berhasil dihapus!', 'success')
      api.post('/notifications', { message: 'Seorang pelanggan telah dihapus' }).catch(() => {})
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Gagal menghapus pelanggan.'
      showToast(`❌ ${msg}`, 'error')
    }
  })

  function handlePelanggan(e) {
    e.preventDefault()
    const form = new FormData(e.target)
    const data = Object.fromEntries(form.entries())
    createUserMutation.mutate({ ...data, name: data.customer, role: 'CUSTOMER' })
  }

  function handleSave(form) {
    updateUserMutation.mutate({ ...editTarget, ...form })
  }

  function handleHapus(id, name) {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pelanggan "${name}"?`)) {
      deleteUserMutation.mutate(id)
    }
  }

  return (
    <div>
      {showTambah && <ModalPelanggan onClose={() => setShowTambah(false)} onSave={handlePelanggan} />}
      {editTarget && <ModalEdit customer={editTarget} onClose={() => setEditTarget(null)} onSave={handleSave} />}

      <div className="flex justify-between items-center mb-5">
        <p className="text-slate-500 text-sm">{filteredCustomers.length} pelanggan terdaftar</p>
        <button onClick={() => setShowTambah(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-all cursor-pointer border-none shadow-sm">
          + Tambah Pelanggan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCustomers.map(c => (
          <div key={c.id} className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${c.color}`}>{c.init}</div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-900 font-semibold truncate">{c.name}</div>
                <div className="text-slate-400 text-xs truncate">{c.email}</div>
                <div className="text-slate-400 text-xs">{c.phone}</div>
              </div>
              {/* Tombol aksi */}
              <div className="flex gap-1.5 flex-shrink-0">
                <button title="Edit" onClick={() => setEditTarget(c)}
                  className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer border border-blue-100 text-xs">✏️</button>
                <button title="Hapus" onClick={() => handleHapus(c.id, c.name)}
                  className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all cursor-pointer border border-red-100 text-xs">🗑️</button>
              </div>
            </div>
            <div className="text-slate-400 text-xs mb-4 truncate">📍 {c.address || 'Belum diatur'}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
                <div className="text-slate-900 font-bold">{c.ordersCount}</div>
                <div className="text-slate-400 text-xs">Pesanan</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
                <div className="text-slate-900 font-bold">{c.totalFormatted}</div>
                <div className="text-slate-400 text-xs">Total</div>
              </div>
            </div>
          </div>
        ))}
        {customers.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-10">Belum ada pelanggan terdaftar.</div>
        )}
      </div>
    </div>
  )
}
