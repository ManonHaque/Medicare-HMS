"use client"

import Link from "next/link"
import DashboardLayout from "@/components/DashboardLayout"
import DoctorTopSection from "@/components/doctor/DoctorTopSection"
import { DOCTOR_NAV } from "@/components/doctor/doctor-nav"
import { useDoctorHospital } from "@/components/doctor/useDoctorHospital"
import { useStore } from "@/lib/store"
import { getDoctorById } from "@/data/doctors"
import { getPatientById } from "@/data/patients"

export default function DoctorWardsPage() {
  return (
    <DashboardLayout role="doctor" title="Wards" navItems={DOCTOR_NAV}>
      <WardsScreen />
    </DashboardLayout>
  )
}

function WardsScreen() {
  const { data, auth } = useStore()
  const storeDoctor = data.doctors.find((doctor) => doctor.id === auth.userId)
  const doctor = { ...storeDoctor, ...(getDoctorById(auth.userId) || {}) }

  const { hospitalId, setHospitalId } = useDoctorHospital({
    doctor: storeDoctor,
    hospitals: data.hospitals,
  })

  const assignedWardAdmissions = (data.wardPatients || [])
    .filter((admission) => admission.status !== "Discharged")
    .filter((admission) => isAssignedToDoctor(admission, auth.userId))
  const wardAdmissions = assignedWardAdmissions.filter(
    (admission) => !hospitalId || admission.hospitalId === hospitalId
  )

  return (
    <div className="space-y-4">
      <DoctorTopSection
        doctor={doctor}
        hospitals={data.hospitals}
        hospitalId={hospitalId}
        setHospitalId={setHospitalId}
        todayCount={wardAdmissions.length}
        navItems={DOCTOR_NAV}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Active Ward Patients ({wardAdmissions.length})
        </h2>
      </div>

      {wardAdmissions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
          No ward patients assigned to you.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {wardAdmissions.map((admission) => {
            const storePatient = data.patients.find((patient) => patient.id === admission.patientId)
            const patient = storePatient ? { ...storePatient, ...(getPatientById(storePatient.id) || {}) } : null
            const bed = data.beds.find((item) => item.id === admission.bedId)
            const hospital = data.hospitals.find((item) => item.id === admission.hospitalId)

            return (
              <Link
                key={admission.id}
                href={`/doctor/wards/${admission.id}`}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">{patient?.name || "Patient"}</h3>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded font-medium">
                    Ward
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {bed?.wardName || admission.wardName || "Ward"} - Bed {bed?.number || "-"} - {hospital?.name}
                </p>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <Info label="Age" value={patient?.age ? `${patient.age} yrs` : "-"} />
                  <Info label="Phone" value={patient?.phone || "-"} />
                  <Info label="Status" value={admission.status || "Active"} />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-50 rounded p-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900 truncate">{value}</p>
    </div>
  )
}

function isAssignedToDoctor(admission, doctorId) {
  return admission.doctorId === doctorId || (admission.doctorIds || []).includes(doctorId)
}
