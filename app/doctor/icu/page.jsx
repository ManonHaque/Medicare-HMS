"use client"

import Link from "next/link"
import DashboardLayout from "@/components/DashboardLayout"
import { useStore } from "@/lib/store"

const NAV = [
  { href: "/doctor", label: "Today's Appointments" },
  { href: "/doctor/icu", label: "ICU Patients" },
]

export default function ICUListPage() {
  return (
    <DashboardLayout role="doctor" title="ICU Patients" navItems={NAV}>
      <ICUList />
    </DashboardLayout>
  )
}

function ICUList() {
  const { data, auth } = useStore()
  const myICU = data.icuPatients.filter((ip) => ip.doctorId === auth.userId)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Active ICU Patients ({myICU.length})
      </h2>
      {myICU.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
          No ICU patients assigned to you.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {myICU.map((ip) => {
            const patient = data.patients.find((p) => p.id === ip.patientId)
            const bed = data.beds.find((b) => b.id === ip.bedId)
            return (
              <Link
                key={ip.id}
                href={`/doctor/icu/${ip.id}`}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">{patient?.name}</h3>
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded font-medium">
                    ICU
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Bed {bed?.number} ·{" "}
                  {data.hospitals.find((h) => h.id === ip.hospitalId)?.name}
                </p>
                <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                  <Vital label="HR" value={ip.vitals?.hr} />
                  <Vital label="BP" value={ip.vitals?.bp} />
                  <Vital label="SpO2" value={`${ip.vitals?.spo2}%`} />
                  <Vital label="Temp" value={ip.vitals?.temp} />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Vital({ label, value }) {
  return (
    <div className="bg-slate-50 rounded p-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}
