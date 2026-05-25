import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

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
        <Link to="/login" className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-all no-underline">
          Masuk
        </Link>
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
          <Link to="/login" onClick={() => setOpen(false)} className="mt-2 px-4 py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-xl no-underline">
            Masuk
          </Link>
        </div>
      )}
    </nav>
  )
}
