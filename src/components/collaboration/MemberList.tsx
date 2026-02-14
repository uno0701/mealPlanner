"use client"

import { useState, useEffect } from "react"

interface Member {
  id: string
  email: string
  role: string
  status: string
  user?: { name?: string | null; email: string } | null
}

interface Props {
  weekPlanId: string
}

export default function MemberList({ weekPlanId }: Props) {
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    fetchMembers()
  }, [weekPlanId])

  async function fetchMembers() {
    const res = await fetch(`/api/planner/${weekPlanId}/members`)
    if (res.ok) {
      setMembers(await res.json())
    }
  }

  async function removeMember(id: string) {
    await fetch(`/api/planner/${weekPlanId}/members?id=${id}`, {
      method: "DELETE",
    })
    fetchMembers()
  }

  if (members.length === 0) {
    return <p className="text-sm text-gray-500">No members yet.</p>
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between py-2">
          <div>
            <span className="text-sm text-gray-700">
              {member.user?.name || member.email}
            </span>
            <span className="ml-2 text-xs text-gray-400 capitalize">{member.role}</span>
            <span
              className={`ml-2 text-xs ${
                member.status === "accepted"
                  ? "text-green-600"
                  : member.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {member.status}
            </span>
          </div>
          <button
            onClick={() => removeMember(member.id)}
            className="text-xs text-red-400 hover:text-red-600"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}
