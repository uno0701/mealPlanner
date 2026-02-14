"use client"

import { useState, useEffect } from "react"

interface Invitation {
  id: string
  role: string
  weekPlan: {
    id: string
    weekStart: string
    owner: { name?: string | null; email: string }
  }
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvitations()
  }, [])

  async function fetchInvitations() {
    const res = await fetch("/api/invitations")
    if (res.ok) {
      setInvitations(await res.json())
    }
    setLoading(false)
  }

  async function respond(membershipId: string, action: "accept" | "reject") {
    await fetch("/api/invitations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ membershipId, action }),
    })
    fetchInvitations()
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Invitations</h1>
      {invitations.length === 0 ? (
        <p className="text-gray-500">No pending invitations.</p>
      ) : (
        <div className="space-y-4">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="rounded-lg border border-gray-200 bg-white p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {inv.weekPlan.owner.name || inv.weekPlan.owner.email} invited you
                </p>
                <p className="text-xs text-gray-500">
                  Week of {new Date(inv.weekPlan.weekStart).toLocaleDateString()} - Role: {inv.role}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => respond(inv.id, "accept")}
                  className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => respond(inv.id, "reject")}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
