"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PublicNavbar from "@/components/PublicNavbar"
import { useStore } from "@/lib/store"

export default function BookingPage() {
  const { data, auth, hydrated, addItem } = useStore()
  const router = useRouter()
  const [form, setForm] = useState({ doctorId: "", hospitalId: "", date: "", time: "" })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!hydrated) return
    if (!auth) router.replace("/login")
  }, [auth, hydrated, router])

  if (!hydrated || !auth) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNavbar />
        <div className="p-8 text-slate-500">Loading...</div>
      </div>
    )
  }

  const patient =
    auth.role === "patient" ? data.patients.find((p) => p.id === auth.userId) : null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!patient) return alert("Only patients can book here. Please login as a patient.")
    if (!form.doctorId || !form.hospitalId || !form.date || !form.time) return
    addItem("appointments", {
      patientId: patient.id,
      doctorId: form.doctorId,
      hospitalId: form.hospitalId,
      date: form.date,
      time: form.time,
      status: "Scheduled",
    })
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Book an Appointment</h1>

        {!patient && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6 text-sm text-yellow-800">
            You are logged in as <strong>{auth.role}</strong>. Booking is for patients only.
            Please login as a patient.
          </div>
        )}

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Appointment Booked</h2>
            <p className="text-green-700 mb-4">Your appointment has been scheduled.</p>
            <button
              onClick={() => router.push("/patient")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
          >
            <Select
              label="Hospital"
              value={form.hospitalId}
              onChange={(v) => setForm({ ...form, hospitalId: v })}
              options={data.hospitals.map((h) => ({ value: h.id, label: h.name }))}
            />
            <Select
              label="Doctor"
              value={form.doctorId}
              onChange={(v) => setForm({ ...form, doctorId: v })}
              options={data.doctors
                .filter((d) => !form.hospitalId || d.hospitalIds.includes(form.hospitalId))
                .map((d) => ({ value: d.id, label: `${d.name} - ${d.specialty}` }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                type="date"
                value={form.date}
                onChange={(v) => setForm({ ...form, date: v })}
              />
              <Input
                label="Time"
                type="time"
                value={form.time}
                onChange={(v) => setForm({ ...form, time: v })}
              />
            </div>
            <button
              type="submit"
              disabled={!patient}
              className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Confirm Booking
            </button>
          </form>
        )}
      </main>
    </div>
  )
}

function Input({ label, type = "text", value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 mb-1 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 mb-1 block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
