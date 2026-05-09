'use client'

import { useState, type FormEvent } from 'react'

export function LoginFormClient() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        setError('Invalid password')
        return
      }

      window.location.reload()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        className="w-full h-[52px] rounded-xl bg-white/5 border border-white/20 text-white text-[16px] px-4 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D5FFD5] focus:border-[#D5FFD5]"
      />

      {error && (
        <p className="text-red-400 text-[14px]">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="w-full h-[52px] rounded-xl bg-[#D5FFD5] text-[#1a1a1a] text-[16px] font-bold hover:bg-[#c0f0c0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
