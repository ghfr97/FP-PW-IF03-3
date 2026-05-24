import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Toast, { showToast } from '../components/Toast.jsx'

function InputField({ label, id, type = 'text', placeholder, icon, error, showToggle, onToggle }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative flex items-center">
        <span className="absolute left-4 text-lg">{icon}</span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`w-full pl-11 pr-${showToggle ? '11' : '4'} py-3 rounded-2xl border text-sm outline-none transition-all ${
            error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
          }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer text-lg"
          >
            👁️
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}

export default function Login() {
  const [tab, setTab] = useState('login')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function validate(fields) {
    const e = {}
    if (fields.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Email tidak valid.'
    if (fields.password !== undefined && !fields.password) e.password = 'Password wajib diisi.'
    if (fields.fname !== undefined && !fields.fname) e.fname = 'Nama depan wajib diisi.'
    if (fields.phone !== undefined && !fields.phone) e.phone = 'Nomor HP wajib diisi.'
    if (fields.regPw !== undefined && fields.regPw.length < 8) e.regPw = 'Password min. 8 karakter.'
    if (fields.regConfirm !== undefined && fields.regConfirm !== fields.regPw) e.regConfirm = 'Password tidak cocok.'
    return e
  }

  async function handleLogin() {
    const email = document.getElementById('login-email').value.trim()
    const password = document.getElementById('login-password').value
    const e = validate({ email, password })
    setErrors(e)
    if (Object.keys(e).length) return
    setLoading(true)

    try {
      // Simulasi HTTP POST request untuk login
      await axios.post('https://jsonplaceholder.typicode.com/posts', { email, password })
      showToast('✅ Login berhasil! Selamat datang kembali.', 'success')
      setTimeout(() => navigate('/'), 800)
    } catch (error) {
      showToast('❌ Gagal login. Periksa koneksi Anda.', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister() {
    const fname = document.getElementById('reg-fname').value.trim()
    const email = document.getElementById('reg-email').value.trim()
    const phone = document.getElementById('reg-phone').value.trim()
    const regPw = document.getElementById('reg-password').value
    const regConfirm = document.getElementById('reg-confirm').value
    const e = validate({ fname, email, phone, regPw, regConfirm })
    setErrors(e)
    if (Object.keys(e).length) return
    setLoading(true)

    try {
      // Simulasi HTTP POST request untuk pendaftaran
      await axios.post('https://jsonplaceholder.typicode.com/posts', { fname, email, phone, regPw })
      showToast('🎉 Akun berhasil dibuat! Silakan masuk.', 'success')
      setTimeout(() => setTab('login'), 800)
    } catch (error) {
      showToast('❌ Pendaftaran gagal. Coba lagi nanti.', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      <Toast />

      {/* Bubbles */}
      {[
        'w-64 h-64 top-[-60px] left-[-40px] bg-blue-300/20',
        'w-48 h-48 bottom-[-30px] right-[-20px] bg-teal-300/20',
        'w-32 h-32 top-1/2 right-1/4 bg-sky-200/20',
        'w-20 h-20 bottom-1/3 left-1/4 bg-blue-200/30',
      ].map((cls, i) => (
        <div key={i} className={`absolute rounded-full blur-2xl pointer-events-none float-bubble ${cls}`} style={{animationDelay:`${i*1.5}s`}}></div>
      ))}

      <div className={`relative z-10 bg-white rounded-3xl shadow-2xl w-full transition-all duration-300 ${tab === 'register' ? 'max-w-2xl' : 'max-w-md'}`}>
        {/* Header */}
        <div className="p-8 pb-0">
          <Link to="/" className="flex items-center justify-center gap-2 font-display text-2xl font-black text-slate-900 no-underline mb-6">
            <span className="text-blue-600 text-3xl">❄</span> SnowWash
          </Link>

          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
            {['login', 'register'].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setErrors({}) }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border-none ${
                  tab === t ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'login' ? 'Masuk' : 'Daftar'}
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* Login Form */}
          {tab === 'login' && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-display text-2xl font-black text-slate-900">Selamat Datang Kembali! 👋</h2>
                <p className="text-slate-500 text-sm mt-1">Masuk ke akun SnowWash kamu</p>
              </div>
              <InputField label="Email" id="login-email" type="email" placeholder="nama@email.com" icon="✉️" error={errors.email} />
              <InputField label="Password" id="login-password" type="password" placeholder="Masukkan password" icon="🔒" error={errors.password} showToggle />
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input type="checkbox" className="rounded" /> Ingat saya
                </label>
                <a href="#" className="text-blue-600 font-medium no-underline">Lupa password?</a>
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="py-3.5 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none disabled:opacity-60"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-400">atau lanjutkan dengan</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
              <button
                onClick={() => showToast('Fitur Google Login segera hadir!', 'error')}
                className="py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all cursor-pointer bg-white flex items-center justify-center gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-red-500 text-white text-xs flex items-center justify-center font-black">G</span>
                Masuk dengan Google
              </button>
            </div>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-display text-2xl font-black text-slate-900">Buat Akun Baru!</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Nama Depan" id="reg-fname" placeholder="Andi" icon="👤" error={errors.fname} />
                <InputField label="Nama Belakang" id="reg-lname" placeholder="Pratama" icon="👤" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Email" id="reg-email" type="email" placeholder="nama@email.com" icon="✉️" error={errors.email} />
                <InputField label="Nomor HP" id="reg-phone" type="tel" placeholder="08xxxxxxxxxx" icon="📱" error={errors.phone} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Password" id="reg-password" type="password" placeholder="Min. 8 karakter" icon="🔒" error={errors.regPw} showToggle />
                <InputField label="Konfirmasi Password" id="reg-confirm" type="password" placeholder="Ulangi password" icon="🔐" error={errors.regConfirm} showToggle />
              </div>
              <p className="text-xs text-slate-400">
                Dengan mendaftar, kamu menyetujui <a href="#" className="text-blue-600">Syarat & Ketentuan</a> dan <a href="#" className="text-blue-600">Kebijakan Privasi</a> SnowWash.
              </p>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="py-3.5 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all cursor-pointer border-none disabled:opacity-60"
              >
                {loading ? 'Membuat akun...' : 'Buat Akun'}
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-400">atau daftar dengan</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
              <button
                onClick={() => showToast('Fitur Google Sign Up segera hadir!', 'error')}
                className="py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all cursor-pointer bg-white flex items-center justify-center gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-red-500 text-white text-xs flex items-center justify-center font-black">G</span>
                Daftar dengan Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
