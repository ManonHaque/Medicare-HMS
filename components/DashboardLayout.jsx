"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useStore } from "@/lib/store"

export default function DashboardLayout({ children, role, title, navItems = [] }) {
  const { auth, logout, data, hydrated } = useStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!hydrated) return
    if (!auth || auth.role !== role) {
      router.replace("/login")
    }
  }, [auth, hydrated, role, router])

  if (!hydrated || !auth || auth.role !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    )
  }

  const userName =
    role === "doctor"
      ? data.doctors.find((d) => d.id === auth.userId)?.name
      : role === "nurse"
        ? data.nurses.find((n) => n.id === auth.userId)?.name
        : role === "patient"
          ? data.patients.find((p) => p.id === auth.userId)?.name
          : role === "company"
            ? data.companies.find((c) => c.id === auth.userId)?.name
            : role === "admin"
              ? "Hospital Admin"
              : "Super Admin"

  const handleLogout = () => {
    logout()
    router.replace("/")
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-slate-200">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <span className="font-bold text-slate-900">MediCare HMS</span>
        </div>
        <div className="px-5 py-4 border-b border-slate-200">
          <p className="text-xs uppercase tracking-wide text-slate-500">{role}</p>
          <p className="font-semibold text-slate-900 truncate">{userName}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="m-3 px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700"
        >
          Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          <div className="text-sm text-slate-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </div>
        </header>
        <main className="flex-1 p-6 overflow-x-auto">{children}</main>
      </div>
    </div>
  )
}
