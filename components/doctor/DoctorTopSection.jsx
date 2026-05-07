"use client"

import Link from "next/link"

export default function DoctorTopSection({
  doctor,
  hospitals,
  hospitalId,
  setHospitalId,
  todayCount,
  navItems,
}) {
  const activeHospital = hospitals?.find((h) => h.id === hospitalId)

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base font-semibold text-slate-900 truncate">
              {activeHospital?.name || "Select Hospital"}
            </h1>
            {activeHospital?.city ? (
              <span className="text-xs text-slate-500">• {activeHospital.city}</span>
            ) : null}
            <span className="ml-auto lg:ml-0 text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
              Today: {todayCount}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Doctor: <span className="font-medium text-slate-700">{doctor?.name || "—"}</span>
            {doctor?.specialty ? ` • ${doctor.specialty}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600">Hospital</label>
          <select
            value={hospitalId}
            onChange={(e) => setHospitalId(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {(doctor?.hospitalIds || []).map((hid) => {
              const h = hospitals?.find((x) => x.id === hid)
              return (
                <option key={hid} value={hid}>
                  {h?.name || hid}
                </option>
              )
            })}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        {navItems.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
