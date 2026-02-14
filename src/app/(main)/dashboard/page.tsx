import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome{session?.user?.name ? `, ${session.user.name}` : ""}!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/recipes"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Recipes</h2>
          <p className="text-sm text-gray-500">Create and manage your recipe collection</p>
        </Link>
        <Link
          href="/planner"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Meal Planner</h2>
          <p className="text-sm text-gray-500">Plan your meals for the week</p>
        </Link>
        <Link
          href="/grocery"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Grocery List</h2>
          <p className="text-sm text-gray-500">Auto-generated shopping lists</p>
        </Link>
      </div>
    </div>
  )
}
