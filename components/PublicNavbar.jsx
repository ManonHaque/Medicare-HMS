"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function PublicNavbar() {
  const pathname = usePathname()
  const links = [
    { href: "/", label: "Home" },
    { href: "/medicines", label: "Medicines" },
    { href: "/doctors", label: "Doctors" },
    { href: "/booking", label: "Booking" },
  ]

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="font-bold text-lg text-slate-900">MediCare HMS</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Login
          </Link>
        </nav>

        <div className="md:hidden">
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}
