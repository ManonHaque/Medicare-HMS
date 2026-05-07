"use client"

import Link from "next/link"
import DashboardLayout from "@/components/DashboardLayout"
import { useStore } from "@/lib/store"
import DoctorTopSection from "@/components/doctor/DoctorTopSection"
import { DOCTOR_NAV } from "@/components/doctor/doctor-nav"
import { useDoctorHospital } from "@/components/doctor/useDoctorHospital"
import { getDoctorById } from "@/data/doctors"
import { getPatientById } from "@/data/patients"

export default function DoctorPage() {
  return (
    <DashboardLayout role="doctor" title="Doctor Dashboard" navItems={DOCTOR_NAV}>
      <DoctorDashboard />
    </DashboardLayout>
  )
}

function DoctorDashboard() {
  const { auth, data, updateItem } = useStore()
  const storeDoctor = data.doctors.find((d) => d.id === auth.userId)
  const mockDoctor = getDoctorById(auth.userId)
  const doctor = { ...storeDoctor, ...(mockDoctor || {}) }

  const { hospitalId, setHospitalId } = useDoctorHospital({
    doctor: storeDoctor,
    hospitals: data.hospitals,
  })

  const today = new Date().toISOString().split("T")[0]
  const myAppointments = data.appointments.filter(
    (a) =>
      a.doctorId === auth.userId &&
      a.date === today &&
      (!hospitalId || !a.hospitalId || a.hospitalId === hospitalId)
  )

  const openPatient = (appointment) => {
    if (appointment.status === "Scheduled" || appointment.status === "Waiting") {
      updateItem("appointments", appointment.id, { status: "In Progress" })
    }
  }

  return (
    <div className="space-y-6">
      <DoctorTopSection
        doctor={doctor}
        hospitals={data.hospitals}
        hospitalId={hospitalId}
        setHospitalId={setHospitalId}
        todayCount={myAppointments.length}
        navItems={DOCTOR_NAV}
      />

      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-2">Today's Appointments</h2>
        {myAppointments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No appointments for today.
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 text-left">
                <tr>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Appointment Time</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {myAppointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((a) => {
                    const storePatient = data.patients.find((p) => p.id === a.patientId)
                    const mockPatient = getPatientById(a.patientId)
                    const patient = { ...storePatient, ...(mockPatient || {}) }

                    const statusLabel =
                      a.status === "Scheduled" ? "Waiting" : a.status === "In Progress" ? "In Progress" : a.status

                    const statusClass =
                      statusLabel === "Completed"
                        ? "bg-green-50 text-green-700"
                        : statusLabel === "In Progress"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-blue-50 text-blue-700"

                    return (
                      <tr key={a.id} className="border-t border-slate-200">
                        <td className="p-3 font-medium">{patient?.name}</td>
                        <td className="p-3 text-slate-600">{patient?.age ?? "—"}</td>
                        <td className="p-3 font-mono">{a.time}</td>
                        <td className="p-3 text-slate-600">{a.department || doctor?.department || doctor?.specialty || "—"}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              statusClass
                            }`}
                          >
                            {statusLabel}
                          </span>
                        </td>
                        <td className="p-3">
                          <Link
                            href={`/doctor/consultation/${a.id}`}
                            onClick={() => openPatient(a)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
                          >
                            Open Patient
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
