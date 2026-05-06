"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/lib/store"

const PUBLIC_ROLES = [
  { id: "doctor", label: "Doctor", description: "Treat assigned patients" },
  { id: "patient", label: "Patient", description: "View your records" },
  { id: "nurse", label: "Nurse", description: "Execute care tasks" },
]

const HIDDEN_ROLES = [
  { id: "admin", label: "Admin Access" },
  { id: "company", label: "Company Login" },
  { id: "superadmin", label: "Super Admin" },
]

export default function LoginPage() {
  const { data, login, hydrated } = useStore()
  const router = useRouter()
  const [activeRole, setActiveRole] = useState(null)
  const [selectedUser, setSelectedUser] = useState("")

  if (!hydrated) return <div className="p-8 text-slate-500">Loading...</div>

  const getUsersForRole = (role) => {
    if (role === "doctor") return data.doctors
    if (role === "patient") return data.patients
    if (role === "nurse") return data.nurses
    if (role === "admin")
      return [{ id: "admin1", name: "Hospital Admin (Demo)" }]
    if (role === "company") return data.companies
    if (role === "superadmin")
      return [{ id: "super1", name: "Super Admin (Demo)" }]
    return []
  }

  const handleLogin = () => {
    if (!activeRole || !selectedUser) return
    login(activeRole, selectedUser)
    const routes = {
      doctor: "/doctor",
      patient: "/patient",
      nurse: "/nurse",
      admin: "/admin",
      company: "/company",
      superadmin: "/super-admin",
    }
    router.push(routes[activeRole])
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="font-bold text-xl text-slate-900">MediCare HMS</span>
          </Link>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-600 mb-6">Select your role to continue</p>

            {!activeRole ? (
              <div className="space-y-3">
                {PUBLIC_ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRole(r.id)}
                    className="w-full text-left px-4 py-3 border border-slate-200 rounded-md hover:border-blue-500 hover:bg-blue-50"
                  >
                    <div className="font-semibold text-slate-900">{r.label}</div>
                    <div className="text-sm text-slate-500">{r.description}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setActiveRole(null)
                    setSelectedUser("")
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  &larr; Back to roles
                </button>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Select user
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose...</option>
                    {getUsersForRole(activeRole).map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={!selectedUser}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  Login as {activeRole}
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
            {HIDDEN_ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRole(r.id)
                  setSelectedUser("")
                }}
                className="hover:text-blue-600"
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
