"use client"

import { useMemo, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import DoctorTopSection from "@/components/doctor/DoctorTopSection"
import { DOCTOR_NAV } from "@/components/doctor/doctor-nav"
import { useDoctorHospital } from "@/components/doctor/useDoctorHospital"
import { useStore } from "@/lib/store"
import { getDoctorById } from "@/data/doctors"
import { getPatientById } from "@/data/patients"

const WARDS = [
  {
    hospitalId: "h1",
    wards: [
      {
        id: "w1-med",
        name: "Medicine Ward",
        beds: [
          { bedNo: "M-01", patientId: "p1" },
          { bedNo: "M-02", patientId: null },
          { bedNo: "M-03", patientId: null },
          { bedNo: "M-04", patientId: null },
        ],
      },
      {
        id: "w1-surg",
        name: "Surgery Ward",
        beds: [
          { bedNo: "S-01", patientId: null },
          { bedNo: "S-02", patientId: null },
          { bedNo: "S-03", patientId: null },
          { bedNo: "S-04", patientId: null },
        ],
      },
    ],
  },
  {
    hospitalId: "h2",
    wards: [
      {
        id: "w2-med",
        name: "General Ward",
        beds: [
          { bedNo: "G-01", patientId: "p2" },
          { bedNo: "G-02", patientId: null },
          { bedNo: "G-03", patientId: null },
          { bedNo: "G-04", patientId: null },
        ],
      },
      {
        id: "w2-obg",
        name: "Gynae & Obs Ward",
        beds: [
          { bedNo: "O-01", patientId: null },
          { bedNo: "O-02", patientId: null },
          { bedNo: "O-03", patientId: null },
          { bedNo: "O-04", patientId: null },
        ],
      },
    ],
  },
]

export default function DoctorWardsPage() {
  return (
    <DashboardLayout role="doctor" title="Wards" navItems={DOCTOR_NAV}>
      <WardsScreen />
    </DashboardLayout>
  )
}

function WardsScreen() {
  const { data, auth } = useStore()
  const storeDoctor = data.doctors.find((d) => d.id === auth.userId)
  const doctor = { ...storeDoctor, ...(getDoctorById(auth.userId) || {}) }

  const { hospitalId, setHospitalId } = useDoctorHospital({
    doctor: storeDoctor,
    hospitals: data.hospitals,
  })

  const wardsForHospital = useMemo(() => {
    const entry = WARDS.find((w) => w.hospitalId === hospitalId)
    return entry?.wards || []
  }, [hospitalId])

  const [wardId, setWardId] = useState("")
  const activeWard = wardsForHospital.find((w) => w.id === wardId) || wardsForHospital[0] || null

  return (
    <div className="space-y-4">
      <DoctorTopSection
        doctor={doctor}
        hospitals={data.hospitals}
        hospitalId={hospitalId}
        setHospitalId={setHospitalId}
        todayCount={0}
        navItems={DOCTOR_NAV}
      />

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Ward View</h2>
            <p className="text-xs text-slate-500">Ward dropdown + bed-based layout (initial structure)</p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600">Ward</label>
            <select
              value={wardId || activeWard?.id || ""}
              onChange={(e) => setWardId(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md bg-white text-sm"
            >
              {wardsForHospital.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!activeWard ? (
          <div className="mt-6 text-sm text-slate-500">No ward data for this hospital.</div>
        ) : (
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeWard.beds.map((bed) => {
              const storePatient = bed.patientId ? data.patients.find((p) => p.id === bed.patientId) : null
              const patient = storePatient ? { ...storePatient, ...(getPatientById(storePatient.id) || {}) } : null

              return (
                <div key={bed.bedNo} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-xs text-slate-600">Bed {bed.bedNo}</div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                        patient ? "bg-blue-50 text-blue-700" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {patient ? "Occupied" : "Free"}
                    </span>
                  </div>
                  <div className="mt-2">
                    {patient ? (
                      <div className="leading-tight">
                        <div className="text-sm font-semibold text-slate-900">{patient.name}</div>
                        <div className="text-xs text-slate-500">{patient.age ?? "—"} yrs • {patient.phone || "—"}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500">No patient assigned</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
