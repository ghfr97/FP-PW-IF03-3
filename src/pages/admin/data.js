// Shared initial data untuk semua halaman admin

export const initialOrders = [
  { id: '#FW-001', customer: 'Ahmad Fauzan',  service: 'Cuci + Setrika',  weight: '5 kg', total: 'Rp 45.000', date: '2026-03-28', status: 'selesai' },
  { id: '#FW-002', customer: 'Sari Wulandari', service: 'Express Laundry', weight: '3 kg', total: 'Rp 45.000', date: '2026-03-29', status: 'proses'  },
  { id: '#FW-003', customer: 'Budi Santoso',   service: 'Cuci Pakaian',    weight: '8 kg', total: 'Rp 48.000', date: '2026-03-30', status: 'antrian' },
  { id: '#FW-004', customer: 'Dewi Rahayu',    service: 'Setrika Pakaian', weight: '4 kg', total: 'Rp 16.000', date: '2026-03-31', status: 'selesai' },
  { id: '#FW-005', customer: 'Rudi Hermawan',  service: 'Cuci + Setrika',  weight: '6 kg', total: 'Rp 54.000', date: '2026-04-01', status: 'proses'  },
]

export const initialServices = [
  { id: 1, icon: '👕', name: 'Cuci Pakaian',    desc: 'Detergen premium, front-load', price: 6000,  priceLabel: 'Rp 6.000/kg',  time: '1 Hari', status: 'Aktif' },
  { id: 2, icon: '🔥', name: 'Setrika Pakaian', desc: 'Setrika uap, rapi sempurna',   price: 4000,  priceLabel: 'Rp 4.000/kg',  time: '6 Jam',  status: 'Aktif' },
  { id: 3, icon: '✨', name: 'Cuci + Setrika',  desc: 'Paket lengkap hemat',          price: 9000,  priceLabel: 'Rp 9.000/kg',  time: '1 Hari', status: 'Aktif' },
  { id: 4, icon: '⚡', name: 'Express Laundry', desc: 'Prioritas antrian, 3 jam',     price: 15000, priceLabel: 'Rp 15.000/kg', time: '3 Jam',  status: 'Aktif' },
]

export const initialCustomers = [
  { id: 1, init: 'AF', name: 'Ahmad Fauzan',  email: 'ahmad@email.com', phone: '08111111111', address: 'Jl. Melati 12, Yogyakarta', orders: 24, total: 'Rp 420K', color: 'bg-blue-100 text-blue-700' },
  { id: 2, init: 'SW', name: 'Sari Wulandari',email: 'sari@email.com',  phone: '08222222222', address: 'Jl. Mawar 5, Yogyakarta',   orders: 12, total: 'Rp 180K', color: 'bg-teal-100 text-teal-700' },
  { id: 3, init: 'BS', name: 'Budi Santoso',  email: 'budi@email.com',  phone: '08333333333', address: 'Jl. Anggrek 8, Sleman',     orders: 8,  total: 'Rp 120K', color: 'bg-orange-100 text-orange-700' },
  { id: 4, init: 'DR', name: 'Dewi Rahayu',   email: 'dewi@email.com',  phone: '08444444444', address: 'Jl. Dahlia 3, Bantul',      orders: 18, total: 'Rp 270K', color: 'bg-rose-100 text-rose-700' },
  { id: 5, init: 'RH', name: 'Rudi Hermawan', email: 'rudi@email.com',  phone: '08555555555', address: 'Jl. Kenanga 7, Sleman',     orders: 6,  total: 'Rp 90K',  color: 'bg-purple-100 text-purple-700' },
  { id: 6, init: 'LN', name: 'Lisa Novita',   email: 'lisa@email.com',  phone: '08666666666', address: 'Jl. Tulip 1, Yogyakarta',   orders: 30, total: 'Rp 520K', color: 'bg-yellow-100 text-yellow-700' },
]

export const serviceOptions = ['Cuci Pakaian', 'Setrika Pakaian', 'Cuci + Setrika', 'Express Laundry']

export const statusMap = {
  selesai: 'bg-emerald-100 text-emerald-700',
  proses:  'bg-amber-100 text-amber-700',
  antrian: 'bg-slate-100 text-slate-500',
}
