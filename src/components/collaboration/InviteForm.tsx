"use client"

import { useState } from "react"

interface Props {
  weekPlanId: string
  onInvited: () => void
}

export default function InviteForm({ weekPlanId, onInvited }: Props) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("member")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch(`/api/planner/${weekPlanId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Failed to invite")
    } else {
      setEmail("")
      onInvited()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
      >
        <option value="member">Member</option>
        <option value="editor">Editor</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Invite
      </button>
    </form>
  )
}
