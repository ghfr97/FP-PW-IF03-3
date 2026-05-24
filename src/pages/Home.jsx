import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Toast from '../components/Toast.jsx'

function WashingMachine() {
  return (
    <div className="relative flex justify-center items-center">
      {/* Glow */}
      <div className="absolute w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="relative w-56 h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl shadow-2xl border-4 border-white flex flex-col items-center justify-center gap-4">
        {/* Door */}
        <div className="w-36 h-36 rounded-full border-8 border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50 shadow-inner flex items-center justify-center overflow-hidden">
          <div className="w-20 h-20 rounded-full border-4 border-dashed border-blue-300 machine-door-spin opacity-70"></div>
        </div>
        {/* Panel */}
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
          <div className="w-3 h-3 rounded-full bg-slate-300"></div>
          <div className="w-3 h-3 rounded-full bg-slate-300"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500 rounded-b-3xl opacity-60"></div>
      </div>
    </div>
  )
}

const features = [
  { icon: '🧼', title: 'Cuci Ultra Bersih', desc: 'Mesin front-load terbaru dengan detergen premium hypoallergenic aman untuk semua jenis kain.' },
  { icon: '⚡', title: 'Express 3 Jam', desc: 'Layanan kilat untuk kebutuhan mendesak. Pakaian bersih dan rapi siap dalam waktu 3 jam.' },
  { icon: '🚚', title: 'Antar-Jemput Gratis', desc: 'Gratis antar-jemput dalam radius 5 km. Order lewat WhatsApp, tim kami langsung datang.' },
  { icon: '🌿', title: 'Ramah Lingkungan', desc: 'Detergen bio-degradable dan program hemat air untuk menjaga kelestarian lingkungan.' },
]

const testimonials = [
  { init: 'S', name: 'Sari Wulandari', role: 'Pelanggan Setia 2 Tahun', text: 'SnowWash luar biasa! Baju putih saya yang sudah kusam jadi kinclong lagi. Wanginya tahan sampai 2 hari.', featured: false },
  { init: 'B', name: 'Budi Santoso', role: 'Karyawan Swasta', text: 'Layanan express-nya keren banget. Baju kondangan pukul 7 pagi sudah bisa diambil pukul 10. Bersih, rapi, harum!', featured: true },
  { init: 'D', name: 'Dewi Rahayu', role: 'Ibu Rumah Tangga', text: 'Antar-jemput tepat waktu, harga terjangkau, hasil memuaskan. Seragam anak saya selalu rapi berkat SnowWash!', featured: false },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f9ff]">
      <Navbar />
      <Toast />

      {/* Hero */}
      <section className="min-h-screen flex items-center gap-16 px-8 md:px-20 pt-16 overflow-hidden bg-gradient-to-br from-[#f0f7ff] via-[#e8f4fd] to-[#f5f9ff] relative">
        {/* Bubbles */}
        <div className="absolute top-[-80px] right-[-60px] w-80 h-80 rounded-full bg-gradient-radial from-blue-500/10 to-transparent float-bubble pointer-events-none"></div>
        <div className="absolute bottom-16 left-[8%] w-48 h-48 rounded-full bg-gradient-radial from-teal/10 to-transparent float-bubble pointer-events-none" style={{animationDelay:'3s'}}></div>

        <div className="flex-1 max-w-xl animate-slide-up">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-5 tracking-wide">✦ Laundry Premium #1 di Kota</span>
          <h1 className="font-display text-5xl md:text-6xl font-black leading-tight text-slate-900 mb-4">
            Bersih <em className="text-blue-600 not-italic">Sempurna,</em><br />Wangi Tahan Lama
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed mb-8">
            Kami merawat pakaian Anda dengan teknologi cuci terkini dan detergen premium. Cepat, bersih, dan terpercaya sejak 2018.
          </p>
          <div className="flex gap-3 mb-10 flex-wrap">
            <Link to="/jasa" className="px-7 py-3.5 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-0.5 no-underline">
              Lihat Layanan
            </Link>
            <Link to="/profile" className="px-7 py-3.5 border-2 border-blue-200 text-blue-700 font-semibold rounded-2xl hover:bg-blue-50 transition-all no-underline">
              Profil Saya
            </Link>
          </div>
          <div className="flex items-center gap-6">
            {[['5K+', 'Pelanggan'], ['98%', 'Kepuasan'], ['6 Thn', 'Pengalaman']].map(([num, lbl], i) => (
              <div key={i} className={`flex items-center gap-6 ${i > 0 ? 'border-l border-blue-100 pl-6' : ''}`}>
                <div>
                  <div className="font-display text-2xl font-black text-blue-600">{num}</div>
                  <div className="text-xs text-slate-400 font-medium">{lbl}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-1 justify-center items-center">
          <WashingMachine />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-8 md:px-20">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-blue-600 tracking-widest uppercase">✦ Tentang Kami</span>
          <h2 className="font-display text-4xl font-black text-slate-900 mt-2">
            Mengapa Memilih<br /><span className="text-blue-600">SnowWash?</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-3xl p-7 shadow-sm border border-blue-50 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-slate-800 text-lg mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-8 md:px-20 bg-gradient-to-b from-blue-50/40 to-white">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-blue-600 tracking-widest uppercase">✦ Ulasan Pelanggan</span>
          <h2 className="font-display text-4xl font-black text-slate-900 mt-2">
            Kata Mereka<br /><span className="text-blue-600">Tentang Kami</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className={`relative rounded-3xl p-7 border transition-all hover:-translate-y-1 ${
              t.featured
                ? 'bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-200'
                : 'bg-white border-blue-50 shadow-sm'
            }`}>
              <div className={`font-display text-6xl font-black leading-none mb-4 ${t.featured ? 'text-blue-300' : 'text-blue-200'}`}>"</div>
              <p className={`text-sm leading-relaxed mb-5 ${t.featured ? 'text-blue-100' : 'text-slate-600'}`}>{t.text}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${t.featured ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}>
                  {t.init}
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${t.featured ? 'text-white' : 'text-slate-800'}`}>{t.name}</div>
                  <div className={`text-xs ${t.featured ? 'text-blue-200' : 'text-slate-400'}`}>{t.role}</div>
                </div>
                <div className="text-yellow-400 text-xs">★★★★★</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
