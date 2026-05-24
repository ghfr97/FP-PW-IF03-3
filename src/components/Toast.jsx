import { useState, useEffect } from 'react'

let toastDispatch = null
export function showToast(msg, type = 'success') {
  if (toastDispatch) toastDispatch({ msg, type })
}

export default function Toast() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    toastDispatch = ({ msg, type }) => {
      setToast({ msg, type })
      setTimeout(() => setToast(null), 3000)
    }
    return () => { toastDispatch = null }
  }, [])

  if (!toast) return null
  return (
    <div className={`fixed bottom-6 right-6 z-[200] px-5 py-3 rounded-2xl shadow-xl text-sm font-medium text-white transition-all animate-slide-up ${
      toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-600'
    }`}>
      {toast.msg}
    </div>
  )
}
