import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import useCartStore from '../store/useCartStore'
import useAuthStore from '../store/useAuthStore'
import api from '../lib/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { showToast } from '../components/Toast'

export default function Checkout() {
  const { cartItems, getTotalPrice, removeFromCart, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  
  const [paymentMethod, setPaymentMethod] = useState('TRANSFER')
  const [notes, setNotes] = useState('')

  // Load Midtrans Snap JS dynamically
  useEffect(() => {
    // We can use a client key from env, or a placeholder if env is not set
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-XXXXX' // Fallback for safety
    const scriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js'
    
    // Check if script already exists
    if (document.querySelector(`script[src="${scriptUrl}"]`)) return

    const script = document.createElement('script')
    script.src = scriptUrl
    script.setAttribute('data-client-key', clientKey)
    script.async = true
    document.head.appendChild(script)

    return () => {
      // document.head.removeChild(script) // Opsional: Hapus script jika komponen unmount
    }
  }, [])

  const checkoutMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/orders/checkout', payload)
      return res.data
    },
    onSuccess: (data) => {
      if (paymentMethod === 'TRANSFER' && data.token) {
        // Panggil Midtrans Snap
        window.snap.pay(data.token, {
          onSuccess: function(result){
            showToast('Pembayaran berhasil!', 'success')
            clearCart()
            navigate('/profile') // Atau halaman history order
          },
          onPending: function(result){
            showToast('Menunggu pembayaran...', 'info')
            clearCart()
            navigate('/profile')
          },
          onError: function(result){
            showToast('Pembayaran gagal!', 'error')
          },
          onClose: function(){
            showToast('Popup ditutup, silakan selesaikan pembayaran nanti', 'info')
            clearCart()
            navigate('/profile')
          }
        })
      } else {
        // COD
        showToast('Pesanan COD berhasil dibuat!', 'success')
        clearCart()
        navigate('/profile')
      }
    },
    onError: (error) => {
      console.error(error)
      showToast(error.response?.data?.message || 'Gagal membuat pesanan', 'error')
    }
  });

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    if (!user) {
      showToast('Silakan login terlebih dahulu', 'error')
      navigate('/login')
      return
    }

    const payload = {
      items: cartItems.map(item => ({ service_id: item.id, qty: item.qty })),
      notes,
      payment_method: paymentMethod
    }

    checkoutMutation.mutate(payload)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-slate-900 mb-8">Checkout Pesanan</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-slate-100">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Keranjang Kosong</h2>
            <p className="text-slate-500 mb-6">Anda belum memilih layanan apapun.</p>
            <button onClick={() => navigate('/jasa')} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700">
              Lihat Layanan Kami
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="font-bold text-lg mb-4">Ringkasan Layanan</h2>
                <div className="space-y-4">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                      <div>
                        <h3 className="font-bold text-slate-800">{item.name}</h3>
                        <p className="text-sm text-slate-500">
                          {item.qty} {item.unit.replace('/','')} x Rp {item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-900">
                          Rp {(item.qty * item.price).toLocaleString()}
                        </span>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Hapus</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Catatan Tambahan (Opsional)</label>
                  <textarea rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Contoh: Baju putih tolong dipisah" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400"></textarea>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="font-bold text-lg mb-4">Metode Pembayaran</h2>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'TRANSFER' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input type="radio" name="payment" value="TRANSFER" checked={paymentMethod === 'TRANSFER'} onChange={() => setPaymentMethod('TRANSFER')} className="mr-3" />
                    <div>
                      <span className="block font-bold text-slate-800">Transfer / E-Money (Midtrans)</span>
                      <span className="text-xs text-slate-500">Bayar instan via BCA, Mandiri, Gopay, QRIS dll.</span>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="mr-3" />
                    <div>
                      <span className="block font-bold text-slate-800">Bayar di Tempat (COD)</span>
                      <span className="text-xs text-slate-500">Bayar tunai saat kurir mengantar pakaian.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
                <h2 className="font-bold text-lg mb-4">Total Tagihan</h2>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>Rp {getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Biaya Antar-Jemput</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between font-display text-xl font-bold text-slate-900 mb-6">
                  <span>Total</span>
                  <span className="text-blue-600">Rp {getTotalPrice().toLocaleString()}</span>
                </div>
                
                <button 
                  onClick={handleCheckout} 
                  disabled={checkoutMutation.isPending}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {checkoutMutation.isPending ? 'Memproses...' : (paymentMethod === 'TRANSFER' ? 'Bayar Sekarang' : 'Buat Pesanan')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
