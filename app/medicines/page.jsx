"use client"

import { useState } from "react"
import PublicNavbar from "@/components/PublicNavbar"
import { useStore } from "@/lib/store"

export default function MedicinesPage() {
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

  const approved = data.medicines.filter((m) => m.status === "Approved")
  const filtered = approved.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.generic.toLowerCase().includes(query.toLowerCase()) ||
      m.usage.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Medicines</h1>
        <p className="text-slate-600 mb-6">Browse our directory of approved medicines.</p>

        <input
          type="text"
          placeholder="Search by name, generic, or usage..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg text-slate-900">{m.name}</h3>
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md font-medium">
                  Approved
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-3">
                {m.type} · {m.generic}
              </p>
              <div className="space-y-2 text-sm">
                <Field label="Usage" value={m.usage} />
                <Field label="Dosage" value={m.dosage} />
                <Field label="Side Effects" value={m.sideEffects} />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-slate-500 col-span-full text-center py-8">No medicines found.</p>
          )}
        </div>
      </main>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <span className="text-slate-500">{label}: </span>
      <span className="text-slate-900">{value}</span>
    </div>
  )
}
