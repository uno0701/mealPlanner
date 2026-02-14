"use client"

interface Props {
  weekPlanId: string
  shared: boolean
  onUpdate: () => void
}

export default function ShareButton({ weekPlanId, shared, onUpdate }: Props) {
  async function toggleShare() {
    await fetch(`/api/planner/${weekPlanId}/grocery/share`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shared: !shared }),
    })
    onUpdate()
  }

  return (
    <button
      onClick={toggleShare}
      className={`rounded-md px-3 py-2 text-sm font-medium ${
        shared
          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {shared ? "Shared" : "Share List"}
    </button>
  )
}
