"use client"

import DashboardLayout from "@/components/DashboardLayout"
import DoctorTopSection from "@/components/doctor/DoctorTopSection"
import { DOCTOR_NAV } from "@/components/doctor/doctor-nav"
import { useDoctorHospital } from "@/components/doctor/useDoctorHospital"
import { useStore } from "@/lib/store"
import { getDoctorById } from "@/data/doctors"
import { getPatientById } from "@/data/patients"

const CABINS = [
  { id: "cabin-101", hospitalId: "h1", cabinNo: "C-101", patientId: "p1", doctorId: "d1", status: "Admitted" },
  { id: "cabin-102", hospitalId: "h1", cabinNo: "C-102", patientId: null, doctorId: null, status: "Available" },
  { id: "cabin-201", hospitalId: "h2", cabinNo: "C-201", patientId: "p2", doctorId: "d1", status: "Admitted" },
  { id: "cabin-202", hospitalId: "h2", cabinNo: "C-202", patientId: null, doctorId: null, status: "Available" },
]

export default function DoctorCabinsPage() {
  return (
    <DashboardLayout role="doctor" title="Cabins" navItems={DOCTOR_NAV}>
      <CabinsScreen />
    </DashboardLayout>
  )
}

function CabinsScreen() {
  const { data, auth } = useStore()
  const storeDoctor = data.doctors.find((d) => d.id === auth.userId)
  const doctor = { ...storeDoctor, ...(getDoctorById(auth.userId) || {}) }

  const { hospitalId, setHospitalId } = useDoctorHospital({
    doctor: storeDoctor,
    hospitals: data.hospitals,
  })

  const list = CABINS.filter((c) => !hospitalId || c.hospitalId === hospitalId)

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

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Cabin Patients</h2>
          <p className="text-xs text-slate-500">Compact ward round view (demo data)</p>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="p-3">Cabin No</th>
              <th className="p-3">Assigned Patient</th>
              <th className="p-3">Assigned Doctor</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => {
              const storePatient = c.patientId ? data.patients.find((p) => p.id === c.patientId) : null
              const patient = storePatient ? { ...storePatient, ...(getPatientById(storePatient.id) || {}) } : null

              const storeAssignedDoctor = c.doctorId ? data.doctors.find((d) => d.id === c.doctorId) : null
              const assignedDoctor = storeAssignedDoctor
                ? { ...storeAssignedDoctor, ...(getDoctorById(storeAssignedDoctor.id) || {}) }
                : null

              return (
                <tr key={c.id} className="border-t border-slate-200">
                  <td className="p-3 font-mono">{c.cabinNo}</td>
                  <td className="p-3">
                    {patient ? (
                      <div className="leading-tight">
                        <div className="font-medium text-slate-900">{patient.name}</div>
                        <div className="text-xs text-slate-500">{patient.age ?? "—"} yrs • {patient.phone || "—"}</div>
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="p-3">{assignedDoctor?.name || <span className="text-slate-500">—</span>}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        c.status === "Admitted" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
