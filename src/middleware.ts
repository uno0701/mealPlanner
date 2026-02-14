export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/recipes/:path*",
    "/planner/:path*",
    "/grocery/:path*",
    "/invitations/:path*",
  ],
}
