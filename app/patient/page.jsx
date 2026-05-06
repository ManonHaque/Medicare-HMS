"use client"

import { useState } from "react"
import Link from "next/link"
import DashboardLayout from "@/components/DashboardLayout"
import { useStore } from "@/lib/store"

const NAV = [
  { href: "/patient", label: "Overview" },
  { href: "/booking", label: "Book Appointment" },
]

export default function PatientPage() {
  return (
    <DashboardLayout role="patient" title="My Health Dashboard" navItems={NAV}>
      <PatientContent />
    </DashboardLayout>
  )
}

function PatientContent() {
  const { auth, data, addItem } = useStore()
  const me = data.patients.find((p) => p.id === auth.userId)
  const [tab, setTab] = useState("overview")

  const myAppts = data.appointments.filter((a) => a.patientId === auth.userId)
  const myPresc = data.prescriptions.filter((p) => p.patientId === auth.userId)
  const myReports = data.reports.filter((r) => r.patientId === auth.userId)

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    addItem("reports", {
      patientId: auth.userId,
      name: file.name,
      uploadedAt: new Date().toISOString(),
    })
    alert(`Report "${file.name}" uploaded`)
    e.target.value = ""
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
        <p className="text-blue-100 text-sm">Welcome back,</p>
        <h2 className="text-2xl font-bold">{me?.name}</h2>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Stat label="Appointments" value={myAppts.length} />
          <Stat label="Prescriptions" value={myPresc.length} />
          <Stat label="Reports" value={myReports.length} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {[
          ["overview", "Timeline"],
          ["appointments", "Appointments"],
          ["prescriptions", "Prescriptions"],
          ["reports", "Reports"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === id
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && <Timeline appts={myAppts} presc={myPresc} reports={myReports} data={data} />}
      {tab === "appointments" && (
        <div className="space-y-2">
          <Link
            href="/booking"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            + Book Appointment
          </Link>
          {myAppts.length === 0 ? (
            <p className="text-sm text-slate-500">No appointments yet.</p>
          ) : (
            myAppts.map((a) => (
              <div key={a.id} className="bg-white border border-slate-200 rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {data.doctors.find((d) => d.id === a.doctorId)?.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {a.date} at {a.time} ·{" "}
                      {data.hospitals.find((h) => h.id === a.hospitalId)?.name}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded font-medium">
                    {a.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {tab === "prescriptions" && (
        <div className="space-y-2">
          {myPresc.length === 0 ? (
            <p className="text-sm text-slate-500">No prescriptions yet.</p>
          ) : (
            myPresc.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-md p-4">
                <p className="text-xs text-slate-500">
                  {new Date(p.createdAt).toLocaleDateString()} - by{" "}
                  {data.doctors.find((d) => d.id === p.doctorId)?.name}
                </p>
                <p className="font-medium mt-1">{p.symptoms}</p>
                {p.medicines?.length > 0 && (
                  <ul className="mt-2 text-sm text-slate-700 list-disc list-inside">
                    {p.medicines.map((m) => (
                      <li key={m.id}>
                        {m.name} {m.dosage} - {m.frequency} ({m.meal} meal) - {m.duration}
                      </li>
                    ))}
                  </ul>
                )}
                {p.followUp && p.followUp !== "None" && (
                  <p className="text-sm text-slate-600 mt-2">Follow-up in {p.followUp}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
      {tab === "reports" && (
        <div className="space-y-3">
          <label className="block bg-white border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400">
            <input type="file" onChange={handleUpload} className="hidden" />
            <p className="font-medium text-slate-700">Upload Report</p>
            <p className="text-xs text-slate-500 mt-1">Click to select a file</p>
          </label>
          {myReports.map((r) => (
            <div key={r.id} className="bg-white border border-slate-200 rounded-md p-4">
              <p className="font-medium">{r.name}</p>
              <p className="text-xs text-slate-500">
                Uploaded {new Date(r.uploadedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-white/15 rounded-md p-3">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-blue-100">{label}</p>
    </div>
  )
}

function Timeline({ appts, presc, reports, data }) {
  const events = [
    ...appts.map((a) => ({
      type: "Appointment",
      date: `${a.date}T${a.time || "00:00"}`,
      label: `Appointment with ${data.doctors.find((d) => d.id === a.doctorId)?.name}`,
    })),
    ...presc.map((p) => ({
      type: "Prescription",
      date: p.createdAt,
      label: `Prescription: ${p.symptoms}`,
    })),
    ...reports.map((r) => ({
      type: "Report",
      date: r.uploadedAt,
      label: `Report uploaded: ${r.name}`,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date))

  if (events.length === 0)
    return <p className="text-sm text-slate-500">No medical history yet.</p>

  return (
    <div className="space-y-3">
      {events.map((e, i) => (
        <div key={i} className="flex gap-3 bg-white border border-slate-200 rounded-md p-4">
          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 uppercase tracking-wide">{e.type}</span>
              <span className="text-xs text-slate-400">
                {new Date(e.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-slate-900 mt-1">{e.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
