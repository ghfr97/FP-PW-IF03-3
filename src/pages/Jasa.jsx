import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'
import useAuthStore from '../store/useAuthStore'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Toast, { showToast } from '../components/Toast.jsx'



import useCartStore from '../store/useCartStore'

function OrderModal({ service, onClose }) {
  const { user } = useAuthStore()
  const addToCart = useCartStore(state => state.addToCart)
  const [qty, setQty] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!service) return null

  const handleAddToCart = () => {
    if (!user) {
      showToast('Silakan login terlebih dahulu untuk memesan', 'error')
      return
    }
    
    addToCart(service, qty)
    setIsSuccess(true)
    showToast(`${service.name} ditambahkan ke keranjang`, 'success')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg bg-transparent border-none cursor-pointer">✕</button>
        
        {isSuccess ? (
          <>
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">Masuk Keranjang!</h3>
            <p className="text-slate-500 text-sm mb-4">Pesanan <strong>{service.name}</strong> berhasil ditambahkan.</p>
            <div className="bg-blue-50 rounded-2xl p-4 mb-4 text-left text-sm text-slate-600">
              <p>Lanjutkan ke halaman Checkout untuk memilih metode pembayaran.</p>
            </div>
            <button onClick={onClose} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none">
              Lanjut Pilih Jasa Lain
            </button>
          </>
        ) : (
          <>
            <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">Tambahkan ke Keranjang</h3>
            <p className="text-slate-500 text-sm mb-4">Layanan: <strong>{service.name}</strong></p>
            <div className="flex flex-col gap-3 text-left mb-6">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Estimasi Jumlah ({service.unit.replace('/','')})</label>
                <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400" />
              </div>
            </div>
            <button onClick={handleAddToCart} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none">
              Masukkan Keranjang
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function Jasa() {
  const [modal, setModal] = useState(null)
  const { data: services, isLoading: loading, isError } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await api.get('/services');
      return response.data.map(s => ({
        id: s.id,
        name: s.name,
        desc: s.description,
        price: s.price,
        unit: s.unit,
        icon: '🧺',
        features: s.description ? s.description.split(',').map(f => f.trim()) : [],
        highlight: s.name === 'Cuci + Setrika',
        badge: s.name === 'Express Laundry' ? 'KILAT' : null,
        badgeColor: 'bg-red-100 text-red-600'
      }));
    }
  })

  if (isError) {
    showToast('Gagal memuat layanan', 'error')
  }

  return (
    <div className="min-h-screen bg-[#f5f9ff]">
      <Navbar />
      <Toast />
      {modal && <OrderModal service={modal} onClose={() => setModal(null)} />}

      <section className="pt-28 pb-20 px-8 md:px-20">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-blue-600 tracking-widest uppercase">✦ Layanan Kami</span>
          <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 mt-2 mb-3">
            Pilih Jasa yang<br /><span className="text-blue-600">Kamu Butuhkan</span>
          </h2>
          <p className="text-slate-500">Semua layanan dikerjakan profesional dengan standar kebersihan tertinggi.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium animate-pulse">Memuat daftar layanan...</p>
            </div>
          ) : (
            services.map((s, i) => (
              <div
                key={i}
                className={`relative rounded-3xl p-7 flex flex-col border transition-all hover:-translate-y-1 hover:shadow-xl ${
                  s.highlight
                    ? 'bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-200'
                    : 'bg-white border-blue-50 shadow-sm'
                }`}
              >
                {s.badge && (
                  <span className={`absolute top-5 right-5 text-xs font-bold px-3 py-1 rounded-full ${
                    s.highlight ? 'bg-white/20 text-white' : s.badgeColor
                  }`}>
                    {s.badge}
                  </span>
                )}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 ${
                  s.highlight ? 'bg-white/20' : 'bg-blue-50'
                }`}>
                  {s.icon}
                </div>
                <h3 className={`font-display text-xl font-bold mb-2 ${s.highlight ? 'text-white' : 'text-slate-900'}`}>{s.name}</h3>
                <p className={`text-sm leading-relaxed mb-4 flex-1 ${s.highlight ? 'text-blue-100' : 'text-slate-500'}`}>{s.desc}</p>
                <ul className="space-y-1.5 mb-5">
                  {s.features.map((f, j) => (
                    <li key={j} className={`text-sm ${s.highlight ? 'text-blue-100' : 'text-slate-500'}`}>{f}</li>
                  ))}
                </ul>
                <div className="mb-5">
                  <div className={`text-xs mb-0.5 ${s.highlight ? 'text-blue-200' : 'text-slate-400'}`}>Mulai dari</div>
                  <div className={`font-display text-2xl font-black ${s.highlight ? 'text-white' : 'text-blue-600'}`}>
                    {s.price}<span className={`text-sm font-normal ${s.highlight ? 'text-blue-200' : 'text-slate-400'}`}>{s.unit}</span>
                  </div>
                </div>
                <button
                  onClick={() => setModal(s)}
                  className={`py-3 rounded-2xl font-semibold text-sm transition-all cursor-pointer border-none ${
                    s.highlight
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Pesan Sekarang
                </button>
              </div>
            ))
          )}
        </div>

        {/* CTA Banner */}
        <div className="mt-14 bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto shadow-xl shadow-blue-200">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-1">Ada pertanyaan soal layanan?</h3>
            <p className="text-blue-100 text-sm">Hubungi kami langsung via WhatsApp, kami siap membantu 24/7!</p>
          </div>
          <a
            href="https://wa.me/6281548329879"
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 px-7 py-3.5 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all no-underline shadow-lg"
          >
            💬 Chat WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
