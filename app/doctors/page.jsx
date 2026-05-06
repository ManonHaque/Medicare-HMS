"use client"

import { useState } from "react"
import PublicNavbar from "@/components/PublicNavbar"
import { useStore } from "@/lib/store"

export default function DoctorsPage() {
  const { data, hydrated } = useStore()
  const [query, setQuery] = useState("")

  if (!hydrated) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNavbar />
        <div className="p-8 text-slate-500">Loading...</div>
      </div>
    )
  }

  const filtered = data.doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.specialty.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Find a Doctor</h1>
        <p className="text-slate-600 mb-6">Browse our network of specialists.</p>

        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <div key={d.id} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl mb-3">
                {d.name
                  .split(" ")
                  .slice(-1)[0]
                  .charAt(0)}
              </div>
              <h3 className="font-semibold text-lg text-slate-900">{d.name}</h3>
              <p className="text-sm text-blue-600 font-medium mb-3">{d.specialty}</p>
              <div className="text-sm text-slate-600 space-y-1">
                <p>
                  <span className="text-slate-500">Hospitals:</span>{" "}
                  {d.hospitalIds
                    .map((hid) => data.hospitals.find((h) => h.id === hid)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p>
                  <span className="text-slate-500">Phone:</span> {d.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
