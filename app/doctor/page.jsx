"use client"

import { useState } from "react"
import Link from "next/link"
import DashboardLayout from "@/components/DashboardLayout"
import { useStore } from "@/lib/store"

const NAV = [
  { href: "/doctor", label: "Today's Appointments" },
  { href: "/doctor/icu", label: "ICU Patients" },
]

export default function DoctorPage() {
  return (
    <DashboardLayout role="doctor" title="Doctor Dashboard" navItems={NAV}>
      <DoctorDashboard />
    </DashboardLayout>
  )
}

function DoctorDashboard() {
  const { auth, data } = useStore()
  const doctor = data.doctors.find((d) => d.id === auth.userId)
  const [hospitalId, setHospitalId] = useState(doctor?.hospitalIds?.[0] || "")

  const today = new Date().toISOString().split("T")[0]
  const myAppointments = data.appointments.filter(
    (a) =>
      a.doctorId === auth.userId &&
      a.date === today &&
      (!hospitalId || a.hospitalId === hospitalId)
  )

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <label className="text-sm font-medium text-slate-700 mb-1 block">Select Hospital</label>
        <select
          value={hospitalId}
          onChange={(e) => setHospitalId(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {doctor?.hospitalIds.map((hid) => {
            const h = data.hospitals.find((x) => x.id === hid)
            return (
              <option key={hid} value={hid}>
                {h?.name}
              </option>
            )
          })}
        </select>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Today's Appointments ({myAppointments.length})
        </h2>
        {myAppointments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No appointments for today.
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 text-left">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {myAppointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((a) => {
                    const patient = data.patients.find((p) => p.id === a.patientId)
                    return (
                      <tr key={a.id} className="border-t border-slate-200">
                        <td className="p-3 font-mono">{a.time}</td>
                        <td className="p-3 font-medium">{patient?.name}</td>
                        <td className="p-3 text-slate-500">{patient?.phone}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              a.status === "Completed"
                                ? "bg-green-50 text-green-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <Link
                            href={`/doctor/consultation/${a.id}`}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
                          >
                            Open
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
