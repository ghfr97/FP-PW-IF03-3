import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import useCartStore from '../store/useCartStore'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const cartItemsCount = useCartStore(state => state.getTotalItems())
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/jasa', label: 'Jasa' },
    { to: '/profile', label: 'Profile' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-slate-800 no-underline">
        <span className="text-blue-600 text-2xl">❄</span>
        <span>SnowWash</span>
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex list-none gap-1">
        {links.map(l => (
          <li key={l.to}>
            <Link
              to={l.to}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all no-underline ${
                pathname === l.to
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Login btn */}
      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Link to="/checkout" className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            <Link to="/profile" className="flex items-center gap-2 no-underline text-slate-700 hover:text-blue-600 font-medium px-2 py-1 rounded-full hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white text-sm font-bold">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name[0].toUpperCase() : 'U'
                )}
              </div>
              <span className="max-w-[100px] truncate text-sm">{user?.name}</span>
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-all cursor-pointer">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-all no-underline">
            Masuk
          </Link>
        )}
      </div>

      {/* Hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        <span className={`block w-6 h-0.5 bg-slate-700 rounded transition-all ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-slate-700 rounded transition-all ${open ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-slate-700 rounded transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-blue-100 shadow-lg md:hidden px-6 py-4 flex flex-col gap-2">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                pathname === l.to ? 'text-blue-600 bg-blue-50' : 'text-slate-600'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button onClick={() => { handleLogout(); setOpen(false); }} className="mt-2 px-4 py-2.5 text-center text-sm font-semibold text-red-600 bg-red-50 rounded-xl border-none cursor-pointer">
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="mt-2 px-4 py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-xl no-underline">
              Masuk
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
