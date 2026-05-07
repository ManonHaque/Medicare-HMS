"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { useStore } from "@/lib/store"

const NAV = [
  { href: "/admin", label: "Patient Search" },
  { href: "/admin?tab=doctors", label: "Doctors" },
  { href: "/admin?tab=nurses", label: "Nurses" },
  { href: "/admin?tab=appointments", label: "Appointments" },
  { href: "/admin?tab=icu", label: "ICU" },
  { href: "/admin?tab=cabins", label: "Cabins" },
  { href: "/admin?tab=wards", label: "Wards" },
]

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
  "12:00 AM",
]

const WARD_LABELS = ["Ward A", "Ward B", "Ward C", "Ward D", "Ward E"]

export default function AdminPage() {
  return (
    <DashboardLayout role="admin" title="Hospital Admin" navItems={NAV}>
      <AdminContent />
    </DashboardLayout>
  )
}

function AdminContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "search"
  const [appointmentSeed, setAppointmentSeed] = useState(null)
  const [appointmentAutoOpen, setAppointmentAutoOpen] = useState(false)
  const [icuSeed, setIcuSeed] = useState(null)
  const [icuAutoOpen, setIcuAutoOpen] = useState(false)
  const { data } = useStore()
  const [hospitalId, setHospitalId] = useState("")

  useEffect(() => {
    if (!data.hospitals.length) return
    const stored = localStorage.getItem("admin_hospital_id")
    setHospitalId(stored || data.hospitals[0].id)
  }, [data.hospitals])

  function handleTabChange(nextTab) {
    router.push(nextTab === "search" ? "/admin" : `/admin?tab=${nextTab}`)
  }

  function handleBookAppointment(patient) {
    setAppointmentSeed(patient?.id || null)
    setAppointmentAutoOpen(true)
    handleTabChange("appointments")
  }

  function handleAdmitIcu(patient) {
    setIcuSeed(patient?.id || null)
    setIcuAutoOpen(true)
    handleTabChange("icu")
  }
  return (
    <div>
      {data.hospitals.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">Active Hospital</div>
            <div className="text-xs text-slate-500">Admin data scoped to this hospital</div>
          </div>
          <div className="text-sm font-semibold text-slate-800">
            {data.hospitals.find((h) => h.id === hospitalId)?.name || "Not selected"}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200">
        {[
          ["search", "Patient Search"],
          ["doctors", "Doctors"],
          ["nurses", "Nurses"],
          ["appointments", "Appointments"],
          ["icu", "ICU"],
          ["cabins", "Cabins"],
          ["wards", "Wards"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
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

      {tab === "search" && (
        <PatientSearchTab
          onBookAppointment={handleBookAppointment}
          onAdmitIcu={handleAdmitIcu}
          hospitalId={hospitalId}
        />
      )}
      {tab === "doctors" && <DoctorsTab hospitalId={hospitalId} />}
      {tab === "nurses" && <NursesTab hospitalId={hospitalId} />}
      {tab === "appointments" && (
        <AppointmentsTab
          hospitalId={hospitalId}
          initialPatientId={appointmentSeed}
          autoOpen={appointmentAutoOpen}
          onAutoOpenHandled={() => setAppointmentAutoOpen(false)}
        />
      )}
      {tab === "icu" && (
        <ICUTab
          hospitalId={hospitalId}
          initialPatientId={icuSeed}
          autoOpen={icuAutoOpen}
          onAutoOpenHandled={() => setIcuAutoOpen(false)}
        />
      )}
      {tab === "cabins" && <CabinsTab hospitalId={hospitalId} />}
      {tab === "wards" && <WardsTab hospitalId={hospitalId} />}
    </div>
  )
}

function PatientSearchTab({ onBookAppointment, onAdmitIcu, hospitalId }) {
  const { data, addItem, updateItem } = useStore()
  const [phone, setPhone] = useState("")
  const [searched, setSearched] = useState(false)
  const [editing, setEditing] = useState(null)
  const [activePatient, setActivePatient] = useState(null)
  const [view, setView] = useState(null) // "profile"
  const [showAddPatient, setShowAddPatient] = useState(false)

  const matched = searched ? data.patients.find((p) => p.phone === phone) : null

  const handleSearch = (e) => {
    e.preventDefault()
    setSearched(true)
    setView(null)
    setActivePatient(data.patients.find((p) => p.phone === phone) || null)
  }

  const handleCreatePatient = (form) => {
    const newP = addItem("patients", { ...form, createdAt: new Date().toISOString() })
    setPhone(newP.phone)
    setSearched(true)
    setActivePatient(newP)
    setView(null)
    setShowAddPatient(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900">Patient List</div>
          <div className="text-sm text-slate-500">Search by phone number to locate records</div>
        </div>
        <button
          onClick={() => setShowAddPatient(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700"
        >
          + Add Patient
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-xl">
        <input
          type="tel"
          placeholder="Search by phone number..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {searched && !matched && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-semibold text-yellow-900 mb-1">No patient found</h3>
          <p className="text-sm text-yellow-800">Search results returned no matching patient.</p>
        </div>
      )}

      {matched && !view && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{matched.name}</h3>
              <p className="text-sm text-slate-500">
                {matched.phone} · {matched.age} yrs · {matched.gender}
              </p>
            </div>
            <button
              onClick={() => setEditing(matched)}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setView("profile")}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md font-medium hover:bg-slate-200"
            >
              Open Profile
            </button>
            <button
              onClick={() => onBookAppointment(matched)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              Book Appointment
            </button>
            <button
              onClick={() => onAdmitIcu(matched)}
              className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
            >
              Admit to ICU
            </button>
          </div>
        </div>
      )}

      {editing && (
        <EditPatientModal
          patient={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            updateItem("patients", editing.id, patch)
            setEditing(null)
            if (matched && matched.id === editing.id) setActivePatient({ ...matched, ...patch })
          }}
        />
      )}

      {view === "profile" && activePatient && (
        <PatientProfile patient={activePatient} onBack={() => setView(null)} />
      )}

      {showAddPatient && (
        <AddPatientModal
          initialPhone={phone}
          onClose={() => setShowAddPatient(false)}
          onSave={handleCreatePatient}
        />
      )}
    </div>
  )
}

function AddPatientModal({ initialPhone, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    phone: initialPhone || "",
    age: "",
    gender: "Male",
    address: "",
  })
  const valid = form.name && form.phone

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Add Patient</h3>
            <p className="text-xs text-slate-500">Create a new patient record</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <Input
            label="Age"
            type="number"
            value={form.age}
            onChange={(v) => setForm({ ...form, age: v })}
          />
          <Select
            label="Gender"
            value={form.gender}
            onChange={(v) => setForm({ ...form, gender: v })}
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
          />
          <Input
            label="Address"
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
          />
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() =>
              onSave({
                ...form,
                age: Number(form.age) || 0,
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Save Patient
          </button>
        </div>
      </div>
    </div>
  )
}

function EditPatientModal({ patient, onClose, onSave }) {
  const [form, setForm] = useState({ name: patient.name, phone: patient.phone })
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="font-semibold text-lg text-slate-900 mb-4">Edit Patient</h3>
        <p className="text-xs text-slate-500 mb-4">
          Admin can only edit basic info. Prescriptions are read-only.
        </p>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

function PatientProfile({ patient, onBack }) {
  const { data } = useStore()
  const appts = data.appointments.filter((a) => a.patientId === patient.id)
  const presc = data.prescriptions.filter((p) => p.patientId === patient.id)
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <button onClick={onBack} className="text-sm text-blue-600 mb-3 hover:underline">
        &larr; Back
      </button>
      <h3 className="text-xl font-semibold text-slate-900 mb-1">{patient.name}</h3>
      <p className="text-sm text-slate-500 mb-6">
        {patient.phone} · {patient.age} yrs · {patient.gender}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Section title={`Appointments (${appts.length})`}>
          {appts.length === 0 ? (
            <p className="text-sm text-slate-500">No appointments yet.</p>
          ) : (
            <ul className="space-y-2">
              {appts.map((a) => (
                <li key={a.id} className="text-sm bg-slate-50 rounded-md p-3">
                  {a.date} at {a.time} -{" "}
                  {data.doctors.find((d) => d.id === a.doctorId)?.name || "Doctor"} (
                  <span className="text-slate-500">{a.status}</span>)
                </li>
              ))}
            </ul>
          )}
        </Section>
        <Section title={`Prescriptions (${presc.length}) - read only`}>
          {presc.length === 0 ? (
            <p className="text-sm text-slate-500">No prescriptions yet.</p>
          ) : (
            <ul className="space-y-2">
              {presc.map((p) => (
                <li key={p.id} className="text-sm bg-slate-50 rounded-md p-3">
                  <div className="font-medium">
                    {data.doctors.find((d) => d.id === p.doctorId)?.name}
                  </div>
                  <div className="text-slate-500">{p.symptoms}</div>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
      {children}
    </div>
  )
}

function BookAppointmentForm({ patient, onDone }) {
  const { data, addItem } = useStore()
  const [form, setForm] = useState({
    hospitalId: "",
    doctorId: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
  })

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <button onClick={onDone} className="text-sm text-blue-600 mb-3 hover:underline">
        &larr; Back
      </button>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Book appointment for {patient.name}
      </h3>
      <div className="grid md:grid-cols-2 gap-3">
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
        onClick={() => {
          if (!form.hospitalId || !form.doctorId || !form.date || !form.time) return
          addItem("appointments", {
            patientId: patient.id,
            ...form,
            status: "Scheduled",
          })
          alert("Appointment booked")
          onDone()
        }}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
      >
        Confirm Appointment
      </button>
    </div>
  )
}

function AdmitICUForm({ patient, hospitalId, onDone }) {
  const { data, addItem, updateItem } = useStore()
  const [form, setForm] = useState({ bedId: "", doctorIds: [], nurseIds: [] })

  const hospital = data.hospitals.find((h) => h.id === hospitalId)
  const availableBeds = data.beds.filter((b) => !b.occupied && b.hospitalId === hospitalId)
  const doctors = data.doctors.filter((d) => d.hospitalIds?.includes(hospitalId))
  const nurses = data.nurses.filter((n) => n.hospitalId === hospitalId)

  const handleAdmit = () => {
    if (!form.bedId || form.doctorIds.length === 0 || form.nurseIds.length === 0) return
    addItem("icuPatients", {
      patientId: patient.id,
      bedId: form.bedId,
      doctorIds: form.doctorIds,
      nurseIds: form.nurseIds,
      hospitalId,
      admittedAt: new Date().toISOString(),
      status: "Active",
      vitals: { hr: 78, bp: "120/80", spo2: 97, temp: 98.6 },
    })
    updateItem("beds", form.bedId, { occupied: true })
    alert(`${patient.name} admitted to ICU`)
    onDone()
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <button onClick={onDone} className="text-sm text-blue-600 mb-3 hover:underline">
        &larr; Back
      </button>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">
        Admit {patient.name} to ICU
      </h3>
      <p className="text-sm text-slate-500 mb-4">Hospital: {hospital?.name || "—"}</p>
      <div className="grid md:grid-cols-2 gap-3">
        <Select
          label="Bed"
          value={form.bedId}
          onChange={(v) => setForm({ ...form, bedId: v })}
          options={availableBeds.map((b) => ({ value: b.id, label: b.number }))}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <MultiSelect
          label="Assigned Doctors"
          items={doctors}
          selected={form.doctorIds}
          onToggle={(id) =>
            setForm((prev) => ({
              ...prev,
              doctorIds: toggleSelection(prev.doctorIds, id),
            }))
          }
        />
        <MultiSelect
          label="Assigned Nurses"
          items={nurses}
          selected={form.nurseIds}
          onToggle={(id) =>
            setForm((prev) => ({
              ...prev,
              nurseIds: toggleSelection(prev.nurseIds, id),
            }))
          }
        />
      </div>
      <button
        onClick={handleAdmit}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
      >
        Confirm ICU Admission
      </button>
    </div>
  )
}

function DoctorsTab({ hospitalId }) {
  const { data, addItem, updateItem } = useStore()
  const [query, setQuery] = useState("")
  const [editing, setEditing] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  const hospital = data.hospitals.find((h) => h.id === hospitalId)
  const hospitalDoctors = data.doctors.filter((d) => d.hospitalIds?.includes(hospitalId))
  const availableDoctors = data.doctors.filter((d) => !d.hospitalIds?.includes(hospitalId))
  const searchResults = query
    ? availableDoctors.filter((d) =>
        `${d.name} ${d.phone} ${d.specialty}`.toLowerCase().includes(query.toLowerCase())
      )
    : []
  const alreadyAssigned = query
    ? hospitalDoctors.filter((d) =>
        `${d.name} ${d.phone} ${d.specialty}`.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Doctors</h2>
          <p className="text-sm text-slate-500">Hospital: {hospital?.name || "Not selected"}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700"
        >
          + Add New Doctor
        </button>
      </div>

      <section className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-sm font-semibold text-slate-900">Search Doctors (System-wide)</div>
        <div className="text-xs text-slate-500 mb-3">Add existing doctors to this hospital</div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, phone, or specialty"
          className="w-full max-w-xl px-3 py-2 border border-slate-300 rounded-md"
        />
        {query && searchResults.length === 0 && alreadyAssigned.length === 0 && (
          <div className="mt-3 flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="text-sm text-yellow-900">No doctor found</div>
            <button
              onClick={() => setShowCreate(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700"
            >
              Create New Doctor
            </button>
          </div>
        )}
        {query && alreadyAssigned.length > 0 && searchResults.length === 0 && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
            Doctor already assigned to this hospital.
          </div>
        )}
        {searchResults.length > 0 && (
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            {searchResults.map((d) => (
              <div key={d.id} className="border border-slate-200 rounded-md p-3">
                <div className="font-semibold text-slate-900">{d.name}</div>
                <div className="text-xs text-slate-500">{d.specialty}</div>
                <div className="text-xs text-slate-500">{d.phone}</div>
                <button
                  onClick={() => {
                    updateItem("doctors", d.id, {
                      hospitalIds: [...(d.hospitalIds || []), hospitalId],
                    })
                    setQuery("")
                  }}
                  className="mt-2 text-xs text-blue-600 font-semibold hover:underline"
                >
                  Add to Hospital
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-sm font-semibold text-slate-900">My Hospital Doctors</div>
        <div className="text-xs text-slate-500 mb-3">Active doctors assigned to this hospital</div>
        {hospitalDoctors.length === 0 ? (
          <div className="text-sm text-slate-400">No doctors assigned yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {hospitalDoctors.map((d) => (
              <div key={d.id} className="border border-slate-200 rounded-md p-4">
                <div className="font-semibold text-slate-900">{d.name}</div>
                <div className="text-sm text-slate-500">{d.specialty}</div>
                <div className="text-sm text-slate-500">{d.phone}</div>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => setEditing(d)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      updateItem("doctors", d.id, {
                        hospitalIds: (d.hospitalIds || []).filter((id) => id !== hospitalId),
                      })
                    }
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Remove from Hospital
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {editing && (
        <DoctorEditModal
          doctor={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            updateItem("doctors", editing.id, patch)
            setEditing(null)
          }}
        />
      )}

      {showCreate && (
        <DoctorCreateModal
          hospitalName={hospital?.name || ""}
          onClose={() => setShowCreate(false)}
          onSave={(form) => {
            addItem("doctors", { ...form, hospitalIds: [hospitalId] })
            setShowCreate(false)
          }}
        />
      )}
    </div>
  )
}

function DoctorCreateModal({ hospitalName, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", specialty: "", phone: "" })
  const valid = form.name && form.specialty

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Add New Doctor</h3>
            <p className="text-xs text-slate-500">Assign to {hospitalName}</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input
            label="Specialty"
            value={form.specialty}
            onChange={(v) => setForm({ ...form, specialty: v })}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Save Doctor
          </button>
        </div>
      </div>
    </div>
  )
}

function DoctorEditModal({ doctor, onClose, onSave }) {
  const [form, setForm] = useState({
    name: doctor.name,
    specialty: doctor.specialty,
    phone: doctor.phone || "",
  })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Edit Doctor</h3>
            <p className="text-xs text-slate-500">Update basic details</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input
            label="Specialty"
            value={form.specialty}
            onChange={(v) => setForm({ ...form, specialty: v })}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function NursesTab({ hospitalId }) {
  const { data, addItem, updateItem } = useStore()
  const [query, setQuery] = useState("")
  const [editing, setEditing] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  const hospital = data.hospitals.find((h) => h.id === hospitalId)
  const hospitalNurses = data.nurses.filter((n) => n.hospitalId === hospitalId)
  const availableNurses = data.nurses.filter((n) => n.hospitalId !== hospitalId)
  const searchResults = query
    ? availableNurses.filter((n) => n.name.toLowerCase().includes(query.toLowerCase()))
    : []

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Nurses</h2>
          <p className="text-sm text-slate-500">Hospital: {hospital?.name || "Not selected"}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700"
        >
          + Add New Nurse
        </button>
      </div>

      <section className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-sm font-semibold text-slate-900">Search Nurses (System-wide)</div>
        <div className="text-xs text-slate-500 mb-3">Assign existing nurses to this hospital</div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name"
          className="w-full max-w-xl px-3 py-2 border border-slate-300 rounded-md"
        />
        {query && searchResults.length === 0 && (
          <div className="mt-3 flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="text-sm text-yellow-900">No nurse found</div>
            <button
              onClick={() => setShowCreate(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700"
            >
              Create New Nurse
            </button>
          </div>
        )}
        {searchResults.length > 0 && (
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            {searchResults.map((n) => (
              <div key={n.id} className="border border-slate-200 rounded-md p-3">
                <div className="font-semibold text-slate-900">{n.name}</div>
                <div className="text-xs text-slate-500">Shift: {n.shift}</div>
                <button
                  onClick={() => updateItem("nurses", n.id, { hospitalId })}
                  className="mt-2 text-xs text-blue-600 font-semibold hover:underline"
                >
                  Add to Hospital
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-sm font-semibold text-slate-900">My Hospital Nurses</div>
        <div className="text-xs text-slate-500 mb-3">Nursing team assigned to this hospital</div>
        {hospitalNurses.length === 0 ? (
          <div className="text-sm text-slate-400">No nurses assigned yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {hospitalNurses.map((n) => (
              <div key={n.id} className="border border-slate-200 rounded-md p-4">
                <div className="font-semibold text-slate-900">{n.name}</div>
                <div className="text-sm text-slate-500">Shift: {n.shift}</div>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => setEditing(n)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => updateItem("nurses", n.id, { hospitalId: "" })}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Remove from Hospital
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {editing && (
        <NurseEditModal
          nurse={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            updateItem("nurses", editing.id, patch)
            setEditing(null)
          }}
        />
      )}

      {showCreate && (
        <NurseCreateModal
          hospitalName={hospital?.name || ""}
          onClose={() => setShowCreate(false)}
          onSave={(form) => {
            addItem("nurses", { ...form, hospitalId })
            setShowCreate(false)
          }}
        />
      )}
    </div>
  )
}

function NurseCreateModal({ hospitalName, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", shift: "Day" })
  const valid = form.name

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Add New Nurse</h3>
            <p className="text-xs text-slate-500">Assign to {hospitalName}</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Select
            label="Shift"
            value={form.shift}
            onChange={(v) => setForm({ ...form, shift: v })}
            options={[
              { value: "Day", label: "Day" },
              { value: "Night", label: "Night" },
            ]}
          />
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Save Nurse
          </button>
        </div>
      </div>
    </div>
  )
}

function NurseEditModal({ nurse, onClose, onSave }) {
  const [form, setForm] = useState({ name: nurse.name, shift: nurse.shift || "Day" })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Edit Nurse</h3>
            <p className="text-xs text-slate-500">Update shift or name</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Select
            label="Shift"
            value={form.shift}
            onChange={(v) => setForm({ ...form, shift: v })}
            options={[
              { value: "Day", label: "Day" },
              { value: "Night", label: "Night" },
            ]}
          />
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function AppointmentsTab({ hospitalId, initialPatientId, autoOpen, onAutoOpenHandled }) {
  const { data, addItem, updateItem, removeItem } = useStore()
  const [showCreate, setShowCreate] = useState(false)
  const [seedPatientId, setSeedPatientId] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [filterDoctor, setFilterDoctor] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("")
  const [editingAppointment, setEditingAppointment] = useState(null)

  const departments = Array.from(new Set(data.doctors.map((d) => d.specialty))).filter(Boolean)

  useEffect(() => {
    if (!autoOpen) return
    setSeedPatientId(initialPatientId || "")
    setShowCreate(true)
    onAutoOpenHandled()
  }, [autoOpen, initialPatientId, onAutoOpenHandled])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-slate-900">Appointments</div>
          <div className="text-sm text-slate-500">Manage scheduling across departments</div>
        </div>
        <button
          onClick={() => {
            setSeedPatientId("")
            setShowCreate(true)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700"
        >
          + Create Appointment
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div className="text-sm font-semibold text-slate-900">Filter Appointments</div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="min-w-[200px]">
              <Input
                label="Date"
                type="date"
                value={filterDate}
                onChange={setFilterDate}
              />
            </div>
            <div className="min-w-[240px]">
              <Select
                label="Doctor"
                value={filterDoctor}
                onChange={setFilterDoctor}
                options={data.doctors.map((d) => ({ value: d.id, label: d.name }))}
              />
            </div>
            <div className="min-w-[220px]">
              <Select
                label="Department"
                value={filterDepartment}
                onChange={setFilterDepartment}
                options={departments.map((d) => ({ value: d, label: d }))}
              />
            </div>
            <div className="min-w-[140px]">
              <div className="text-sm font-medium text-slate-700 mb-1 opacity-0">Action</div>
              <button
                onClick={() => {
                  setFilterDate("")
                  setFilterDoctor("")
                  setFilterDepartment("")
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="p-3">Patient</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Department</th>
              <th className="p-3">Date / Time</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.appointments
              .filter((a) => (!hospitalId ? true : !a.hospitalId || a.hospitalId === hospitalId))
              .filter((a) => (!filterDate ? true : a.date === filterDate))
              .filter((a) => (!filterDoctor ? true : a.doctorId === filterDoctor))
              .filter((a) => (!filterDepartment ? true : a.department === filterDepartment))
              .map((a) => (
              <tr key={a.id} className="border-t border-slate-200">
                <td className="p-3 font-medium">
                  {data.patients.find((p) => p.id === a.patientId)?.name}
                </td>
                <td className="p-3">{data.doctors.find((d) => d.id === a.doctorId)?.name}</td>
                <td className="p-3 text-slate-600">{a.department || "—"}</td>
                <td className="p-3">
                  {a.date} {a.time}
                </td>
                <td className="p-3">
                  <select
                    value={a.status}
                    onChange={(e) => updateItem("appointments", a.id, { status: e.target.value })}
                    className="px-2 py-1 border border-slate-300 rounded text-xs"
                  >
                    <option>Scheduled</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingAppointment(a)}
                      className="text-blue-600 text-xs hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeItem("appointments", a.id)}
                      className="text-red-600 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CreateAppointmentModal
          patients={data.patients}
          doctors={data.doctors}
          initialPatientId={seedPatientId}
          hospitalId={hospitalId}
          onClose={() => setShowCreate(false)}
          onSave={(form) => {
            addItem("appointments", { ...form, hospitalId, status: "Scheduled" })
            setShowCreate(false)
          }}
        />
      )}

      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          doctors={data.doctors}
          patients={data.patients}
          onClose={() => setEditingAppointment(null)}
          onSave={(patch) => {
            updateItem("appointments", editingAppointment.id, patch)
            setEditingAppointment(null)
          }}
        />
      )}
    </div>
  )
}

function EditAppointmentModal({ appointment, doctors, patients, onClose, onSave }) {
  const patient = patients.find((p) => p.id === appointment.patientId)
  const [form, setForm] = useState({
    doctorId: appointment.doctorId,
    date: appointment.date,
    time: appointment.time,
  })

  const eligibleDoctors = doctors
  const valid = form.doctorId && form.date && form.time

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Edit Appointment</h3>
            <p className="text-xs text-slate-500">Update date and doctor details</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <Input label="Patient" value={patient?.name || ""} readOnly />
          <Select
            label="Doctor"
            value={form.doctorId}
            onChange={(v) => setForm({ ...form, doctorId: v })}
            options={eligibleDoctors.map((d) => ({ value: d.id, label: d.name }))}
          />
          <Input
            label="Appointment Date"
            type="date"
            value={form.date}
            onChange={(v) => setForm({ ...form, date: v })}
          />
          <Select
            label="Time Slot"
            value={form.time}
            onChange={(v) => setForm({ ...form, time: v })}
            options={TIME_SLOTS.map((slot) => ({ value: slot, label: slot }))}
          />
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateAppointmentModal({ patients, doctors, initialPatientId, hospitalId, onClose, onSave }) {
  const [query, setQuery] = useState("")
  const [form, setForm] = useState({
    patientId: initialPatientId || "",
    doctorId: "",
    department: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    notes: "",
  })

  const departments = Array.from(new Set(doctors.map((d) => d.specialty))).filter(Boolean)
  const filteredPatients = patients.filter((p) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return `${p.name} ${p.phone}`.toLowerCase().includes(q)
  })

  const selectedPatient = patients.find((p) => p.id === form.patientId)
  const selectedDoctor = doctors.find((d) => d.id === form.doctorId)
  const valid = form.patientId && form.doctorId && form.date && form.time

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Create Appointment</h3>
            <p className="text-xs text-slate-500">Manual scheduling for outpatient visits</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Patient Search
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or phone"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
              />
              <div className="mt-2 max-h-40 overflow-y-auto border border-slate-200 rounded-md">
                {filteredPatients.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400">No matching patients.</div>
                ) : (
                  filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setForm({ ...form, patientId: p.id })}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                        form.patientId === p.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.phone}</div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <Select
              label="Doctor Selection"
              value={form.doctorId}
              onChange={(v) => {
                const doctor = doctors.find((d) => d.id === v)
                setForm({
                  ...form,
                  doctorId: v,
                  department: doctor?.specialty || "",
                })
              }}
              options={doctors.map((d) => ({ value: d.id, label: `${d.name} - ${d.specialty}` }))}
            />
            <Input label="Department" value={form.department || "—"} readOnly />
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                label="Appointment Date"
                type="date"
                value={form.date}
                onChange={(v) => setForm({ ...form, date: v })}
              />
              <Select
                label="Time Slot"
                value={form.time}
                onChange={(v) => setForm({ ...form, time: v })}
                options={TIME_SLOTS.map((slot) => ({ value: slot, label: slot }))}
              />
            </div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Notes</span>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
              />
            </label>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="text-sm font-semibold text-slate-900">Appointment Summary</div>
            <SummaryRow label="Patient" value={selectedPatient?.name || "Not selected"} />
            <SummaryRow label="Phone" value={selectedPatient?.phone || "—"} />
            <SummaryRow label="Doctor" value={selectedDoctor?.name || "Not selected"} />
            <SummaryRow label="Department" value={form.department || "—"} />
            <SummaryRow label="Date" value={form.date || "—"} />
            <SummaryRow label="Time" value={form.time || "—"} />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  )
}

function ICUTab({ hospitalId, initialPatientId, autoOpen, onAutoOpenHandled }) {
  const { data, addItem, updateItem } = useStore()
  const [showCreate, setShowCreate] = useState(false)
  const [seedPatientId, setSeedPatientId] = useState("")
  const [editingIcu, setEditingIcu] = useState(null)

  const hospital = data.hospitals.find((h) => h.id === hospitalId)
  const icuPatients = (data.icuPatients || []).filter((ip) => ip.hospitalId === hospitalId)
  const activeIcu = icuPatients.filter((ip) => ip.status !== "Discharged")

  const seedBedsForHospital = () => {
    const existing = new Set(
      data.beds
        .filter((b) => b.hospitalId === hospitalId && (!b.type || b.type === "ICU"))
        .map((b) => b.number)
    )
    for (let i = 1; i <= 10; i += 1) {
      const number = `ICU-${String(i).padStart(2, "0")}`
      if (!existing.has(number)) {
        addItem("beds", { hospitalId, number, occupied: false, type: "ICU" })
      }
    }
  }

  useEffect(() => {
    if (!autoOpen) return
    setSeedPatientId(initialPatientId || "")
    setShowCreate(true)
    onAutoOpenHandled()
  }, [autoOpen, initialPatientId, onAutoOpenHandled])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-slate-900">ICU Management</div>
          <div className="text-sm text-slate-500">Hospital: {hospital?.name || "—"}</div>
        </div>
        <button
          onClick={() => {
            setSeedPatientId("")
            setShowCreate(true)
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700"
        >
          + Create ICU Admission
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {activeIcu.length === 0 && (
          <p className="text-slate-500">No active ICU admissions.</p>
        )}
        {activeIcu.map((ip) => {
          const patient = data.patients.find((p) => p.id === ip.patientId)
          const bed = data.beds.find((b) => b.id === ip.bedId)
          const doctorIds = ip.doctorIds || (ip.doctorId ? [ip.doctorId] : [])
          const nurseIds = ip.nurseIds || (ip.nurseId ? [ip.nurseId] : [])
          const doctorNames = doctorIds
            .map((id) => data.doctors.find((d) => d.id === id)?.name)
            .filter(Boolean)
            .join(", ")
          const nurseNames = nurseIds
            .map((id) => data.nurses.find((n) => n.id === id)?.name)
            .filter(Boolean)
            .join(", ")

          return (
            <div key={ip.id} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">{patient?.name}</h4>
                  <p className="text-sm text-slate-500">Bed {bed?.number}</p>
                </div>
                <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md font-medium">
                  ICU Active
                </span>
              </div>
              <div className="mt-3 text-sm text-slate-600 space-y-1">
                <p>Doctors: {doctorNames || "Not assigned"}</p>
                <p>Nurses: {nurseNames || "Not assigned"}</p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => {
                    updateItem("icuPatients", ip.id, {
                      status: "Discharged",
                      dischargedAt: new Date().toISOString(),
                    })
                    updateItem("beds", ip.bedId, { occupied: false })
                  }}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-200"
                >
                  Discharge & Release Bed
                </button>
                <button
                  onClick={() => setEditingIcu(ip)}
                  className="px-3 py-1.5 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit Assignment
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showCreate && (
        <CreateICUAdmissionModal
          hospitalId={hospitalId}
          initialPatientId={seedPatientId}
          patients={data.patients}
          doctors={data.doctors}
          nurses={data.nurses}
          beds={data.beds}
          onSeedBeds={seedBedsForHospital}
          onClose={() => setShowCreate(false)}
          onSave={(payload) => {
            addItem("icuPatients", payload)
            updateItem("beds", payload.bedId, { occupied: true })
            setShowCreate(false)
          }}
        />
      )}

      {editingIcu && (
        <EditICUAdmissionModal
          admission={editingIcu}
          hospitalId={hospitalId}
          patients={data.patients}
          doctors={data.doctors}
          nurses={data.nurses}
          beds={data.beds}
          onClose={() => setEditingIcu(null)}
          onSave={(patch) => {
            updateItem("icuPatients", editingIcu.id, patch)
            if (patch.bedId && patch.bedId !== editingIcu.bedId) {
              updateItem("beds", editingIcu.bedId, { occupied: false })
              updateItem("beds", patch.bedId, { occupied: true })
            }
            setEditingIcu(null)
          }}
        />
      )}
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-xs text-slate-600">
      <span className="uppercase tracking-wide text-[10px] text-slate-500">{label}</span>
      <span className="font-semibold text-slate-700 text-right">{value}</span>
    </div>
  )
}

function CreateICUAdmissionModal({
  hospitalId,
  initialPatientId,
  patients,
  doctors,
  nurses,
  beds,
  onSeedBeds,
  onClose,
  onSave,
}) {
  const [query, setQuery] = useState("")
  const [form, setForm] = useState({
    patientId: initialPatientId || "",
    bedId: "",
    doctorIds: [],
    nurseIds: [],
  })

  const hospitalBeds = beds.filter(
    (b) => !b.occupied && b.hospitalId === hospitalId && (!b.type || b.type === "ICU")
  )
  const hospitalDoctors = doctors.filter((d) => d.hospitalIds?.includes(hospitalId))
  const hospitalNurses = nurses.filter((n) => n.hospitalId === hospitalId)
  useEffect(() => {
    if (!initialPatientId) return
    setForm((prev) => ({ ...prev, patientId: initialPatientId }))
  }, [initialPatientId])
  const filteredPatients = patients.filter((p) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return `${p.name} ${p.phone}`.toLowerCase().includes(q)
  })

  const selectedPatient = patients.find((p) => p.id === form.patientId)
  const valid = form.patientId && form.bedId && form.doctorIds.length > 0 && form.nurseIds.length > 0

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Create ICU Admission</h3>
            <p className="text-xs text-slate-500">Assign bed, doctors, and nurses</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>

        <div className="grid md:grid-cols-[1.3fr_1fr] gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Patient Search
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or phone"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
              />
              <div className="mt-2 max-h-40 overflow-y-auto border border-slate-200 rounded-md">
                {filteredPatients.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400">No matching patients.</div>
                ) : (
                  filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setForm({ ...form, patientId: p.id })}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                        form.patientId === p.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.phone}</div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {hospitalBeds.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <div className="text-sm font-semibold text-amber-900">No ICU beds found</div>
                <div className="text-xs text-amber-800">
                  Initialize default ICU beds for this hospital.
                </div>
                <button
                  onClick={onSeedBeds}
                  className="mt-2 px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-semibold hover:bg-amber-700"
                >
                  Create ICU Beds
                </button>
              </div>
            ) : (
              <Select
                label="ICU Bed"
                value={form.bedId}
                onChange={(v) => setForm({ ...form, bedId: v })}
                options={hospitalBeds.map((b) => ({ value: b.id, label: b.number }))}
              />
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <MultiSelect
                label="Assigned Doctors"
                items={hospitalDoctors}
                selected={form.doctorIds}
                onToggle={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    doctorIds: toggleSelection(prev.doctorIds, id),
                  }))
                }
              />
              <MultiSelect
                label="Assigned Nurses"
                items={hospitalNurses}
                selected={form.nurseIds}
                onToggle={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    nurseIds: toggleSelection(prev.nurseIds, id),
                  }))
                }
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="text-sm font-semibold text-slate-900">Admission Summary</div>
            <SummaryRow label="Patient" value={selectedPatient?.name || "Not selected"} />
            <SummaryRow label="Bed" value={hospitalBeds.find((b) => b.id === form.bedId)?.number || "—"} />
            <SummaryRow label="Doctors" value={form.doctorIds.length} />
            <SummaryRow label="Nurses" value={form.nurseIds.length} />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() =>
              onSave({
                patientId: form.patientId,
                bedId: form.bedId,
                doctorIds: form.doctorIds,
                nurseIds: form.nurseIds,
                hospitalId,
                admittedAt: new Date().toISOString(),
                status: "Active",
                vitals: { hr: 78, bp: "120/80", spo2: 97, temp: 98.6 },
              })
            }
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            Create ICU Admission
          </button>
        </div>
      </div>
    </div>
  )
}

function EditICUAdmissionModal({
  admission,
  hospitalId,
  patients,
  doctors,
  nurses,
  beds,
  onClose,
  onSave,
}) {
  const patient = patients.find((p) => p.id === admission.patientId)
  const [form, setForm] = useState({
    bedId: admission.bedId,
    doctorIds: admission.doctorIds || (admission.doctorId ? [admission.doctorId] : []),
    nurseIds: admission.nurseIds || (admission.nurseId ? [admission.nurseId] : []),
  })

  const hospitalBeds = beds.filter(
    (b) =>
      (b.id === admission.bedId || !b.occupied) &&
      b.hospitalId === hospitalId &&
      (!b.type || b.type === "ICU")
  )
  const hospitalDoctors = doctors.filter((d) => d.hospitalIds?.includes(hospitalId))
  const hospitalNurses = nurses.filter((n) => n.hospitalId === hospitalId)
  const valid = form.bedId && form.doctorIds.length > 0 && form.nurseIds.length > 0

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Edit ICU Assignment</h3>
            <p className="text-xs text-slate-500">Adjust bed and assigned staff</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-4">
          <div className="space-y-3">
            <Input label="Patient" value={patient?.name || ""} readOnly />
            <Select
              label="ICU Bed"
              value={form.bedId}
              onChange={(v) => setForm({ ...form, bedId: v })}
              options={hospitalBeds.map((b) => ({ value: b.id, label: b.number }))}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <MultiSelect
                label="Assigned Doctors"
                items={hospitalDoctors}
                selected={form.doctorIds}
                onToggle={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    doctorIds: toggleSelection(prev.doctorIds, id),
                  }))
                }
              />
              <MultiSelect
                label="Assigned Nurses"
                items={hospitalNurses}
                selected={form.nurseIds}
                onToggle={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    nurseIds: toggleSelection(prev.nurseIds, id),
                  }))
                }
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="text-sm font-semibold text-slate-900">Assignment Summary</div>
            <SummaryRow label="Bed" value={hospitalBeds.find((b) => b.id === form.bedId)?.number || "—"} />
            <SummaryRow label="Doctors" value={form.doctorIds.length} />
            <SummaryRow label="Nurses" value={form.nurseIds.length} />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() =>
              onSave({
                bedId: form.bedId,
                doctorIds: form.doctorIds,
                nurseIds: form.nurseIds,
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function MultiSelect({ label, items, selected, onToggle }) {
  return (
    <div className="border border-slate-200 rounded-md p-3">
      <div className="text-xs font-semibold text-slate-600 mb-2">{label}</div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-xs text-slate-400">No available staff.</div>
        ) : (
          items.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => onToggle(item.id)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded"
              />
              <span className="truncate">{item.name}</span>
            </label>
          ))
        )}
      </div>
    </div>
  )
}

function toggleSelection(list, id) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

function formatBedNumber(value) {
  if (!value) return ""
  return value.replace("BED-", "")
}

function CabinsTab({ hospitalId }) {
  const { data, addItem, updateItem } = useStore()
  const [showCreate, setShowCreate] = useState(false)
  const [editingCabin, setEditingCabin] = useState(null)

  const hospital = data.hospitals.find((h) => h.id === hospitalId)
  const cabinPatients = (data.cabinPatients || []).filter((cp) => cp.hospitalId === hospitalId)
  const activeCabins = cabinPatients.filter((cp) => cp.status !== "Discharged")

  const seedCabinBeds = () => {
    const existing = new Set(
      data.beds
        .filter((b) => b.hospitalId === hospitalId && b.type === "Cabin")
        .map((b) => b.number)
    )
    for (let i = 1; i <= 10; i += 1) {
      const number = `CAB-${String(i).padStart(2, "0")}`
      if (!existing.has(number)) {
        addItem("beds", { hospitalId, number, occupied: false, type: "Cabin" })
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-slate-900">Cabins</div>
          <div className="text-sm text-slate-500">Hospital: {hospital?.name || "—"}</div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700"
        >
          + Create Cabin Admission
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {activeCabins.length === 0 && <p className="text-slate-500">No active cabins.</p>}
        {activeCabins.map((cp) => {
          const patient = data.patients.find((p) => p.id === cp.patientId)
          const bed = data.beds.find((b) => b.id === cp.bedId)
          const doctorNames = (cp.doctorIds || [])
            .map((id) => data.doctors.find((d) => d.id === id)?.name)
            .filter(Boolean)
            .join(", ")
          const nurseNames = (cp.nurseIds || [])
            .map((id) => data.nurses.find((n) => n.id === id)?.name)
            .filter(Boolean)
            .join(", ")

          return (
            <div key={cp.id} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">{patient?.name}</h4>
                  <p className="text-sm text-slate-500">Cabin {bed?.number}</p>
                </div>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
                  Cabin Active
                </span>
              </div>
              <div className="mt-3 text-sm text-slate-600 space-y-1">
                <p>Doctors: {doctorNames || "Not assigned"}</p>
                <p>Nurses: {nurseNames || "Not assigned"}</p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => {
                    updateItem("cabinPatients", cp.id, {
                      status: "Discharged",
                      dischargedAt: new Date().toISOString(),
                    })
                    updateItem("beds", cp.bedId, { occupied: false })
                  }}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-200"
                >
                  Discharge & Release Cabin
                </button>
                <button
                  onClick={() => setEditingCabin(cp)}
                  className="px-3 py-1.5 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit Assignment
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showCreate && (
        <CreateCabinAdmissionModal
          hospitalId={hospitalId}
          patients={data.patients}
          doctors={data.doctors}
          nurses={data.nurses}
          beds={data.beds}
          onSeedBeds={seedCabinBeds}
          onClose={() => setShowCreate(false)}
          onSave={(payload) => {
            addItem("cabinPatients", payload)
            updateItem("beds", payload.bedId, { occupied: true })
            setShowCreate(false)
          }}
        />
      )}

      {editingCabin && (
        <EditCabinAdmissionModal
          admission={editingCabin}
          hospitalId={hospitalId}
          patients={data.patients}
          doctors={data.doctors}
          nurses={data.nurses}
          beds={data.beds}
          onClose={() => setEditingCabin(null)}
          onSave={(patch) => {
            updateItem("cabinPatients", editingCabin.id, patch)
            if (patch.bedId && patch.bedId !== editingCabin.bedId) {
              updateItem("beds", editingCabin.bedId, { occupied: false })
              updateItem("beds", patch.bedId, { occupied: true })
            }
            setEditingCabin(null)
          }}
        />
      )}
    </div>
  )
}

function CreateCabinAdmissionModal({
  hospitalId,
  patients,
  doctors,
  nurses,
  beds,
  onSeedBeds,
  onClose,
  onSave,
}) {
  const [query, setQuery] = useState("")
  const [form, setForm] = useState({ patientId: "", bedId: "", doctorIds: [], nurseIds: [] })

  const cabinBeds = beds.filter((b) => !b.occupied && b.hospitalId === hospitalId && b.type === "Cabin")
  const hospitalDoctors = doctors.filter((d) => d.hospitalIds?.includes(hospitalId))
  const hospitalNurses = nurses.filter((n) => n.hospitalId === hospitalId)
  const filteredPatients = patients.filter((p) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return `${p.name} ${p.phone}`.toLowerCase().includes(q)
  })
  const selectedPatient = patients.find((p) => p.id === form.patientId)
  const valid = form.patientId && form.bedId && form.doctorIds.length > 0 && form.nurseIds.length > 0

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Create Cabin Admission</h3>
            <p className="text-xs text-slate-500">Assign cabin, doctors, and nurses</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Patient Search
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or phone"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
              />
              <div className="mt-2 max-h-40 overflow-y-auto border border-slate-200 rounded-md">
                {filteredPatients.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400">No matching patients.</div>
                ) : (
                  filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setForm({ ...form, patientId: p.id })}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                        form.patientId === p.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.phone}</div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {cabinBeds.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <div className="text-sm font-semibold text-amber-900">No cabin beds found</div>
                <div className="text-xs text-amber-800">Initialize cabin beds for this hospital.</div>
                <button
                  onClick={onSeedBeds}
                  className="mt-2 px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-semibold hover:bg-amber-700"
                >
                  Create Cabin Beds
                </button>
              </div>
            ) : (
              <Select
                label="Cabin Bed"
                value={form.bedId}
                onChange={(v) => setForm({ ...form, bedId: v })}
                options={cabinBeds.map((b) => ({ value: b.id, label: b.number }))}
              />
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <MultiSelect
                label="Assigned Doctors"
                items={hospitalDoctors}
                selected={form.doctorIds}
                onToggle={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    doctorIds: toggleSelection(prev.doctorIds, id),
                  }))
                }
              />
              <MultiSelect
                label="Assigned Nurses"
                items={hospitalNurses}
                selected={form.nurseIds}
                onToggle={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    nurseIds: toggleSelection(prev.nurseIds, id),
                  }))
                }
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="text-sm font-semibold text-slate-900">Admission Summary</div>
            <SummaryRow label="Patient" value={selectedPatient?.name || "Not selected"} />
            <SummaryRow
              label="Cabin"
              value={cabinBeds.find((b) => b.id === form.bedId)?.number || "—"}
            />
            <SummaryRow label="Doctors" value={form.doctorIds.length} />
            <SummaryRow label="Nurses" value={form.nurseIds.length} />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() =>
              onSave({
                patientId: form.patientId,
                bedId: form.bedId,
                doctorIds: form.doctorIds,
                nurseIds: form.nurseIds,
                hospitalId,
                admittedAt: new Date().toISOString(),
                status: "Active",
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Create Cabin Admission
          </button>
        </div>
      </div>
    </div>
  )
}

function EditCabinAdmissionModal({
  admission,
  hospitalId,
  patients,
  doctors,
  nurses,
  beds,
  onClose,
  onSave,
}) {
  const patient = patients.find((p) => p.id === admission.patientId)
  const [form, setForm] = useState({
    bedId: admission.bedId,
    doctorIds: admission.doctorIds || [],
    nurseIds: admission.nurseIds || [],
  })

  const cabinBeds = beds.filter(
    (b) => (b.id === admission.bedId || !b.occupied) && b.hospitalId === hospitalId && b.type === "Cabin"
  )
  const hospitalDoctors = doctors.filter((d) => d.hospitalIds?.includes(hospitalId))
  const hospitalNurses = nurses.filter((n) => n.hospitalId === hospitalId)
  const valid = form.bedId && form.doctorIds.length > 0 && form.nurseIds.length > 0

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Edit Cabin Assignment</h3>
            <p className="text-xs text-slate-500">Adjust cabin and staff</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-4">
          <div className="space-y-3">
            <Input label="Patient" value={patient?.name || ""} readOnly />
            <Select
              label="Cabin Bed"
              value={form.bedId}
              onChange={(v) => setForm({ ...form, bedId: v })}
              options={cabinBeds.map((b) => ({ value: b.id, label: b.number }))}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <MultiSelect
                label="Assigned Doctors"
                items={hospitalDoctors}
                selected={form.doctorIds}
                onToggle={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    doctorIds: toggleSelection(prev.doctorIds, id),
                  }))
                }
              />
              <MultiSelect
                label="Assigned Nurses"
                items={hospitalNurses}
                selected={form.nurseIds}
                onToggle={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    nurseIds: toggleSelection(prev.nurseIds, id),
                  }))
                }
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="text-sm font-semibold text-slate-900">Assignment Summary</div>
            <SummaryRow label="Cabin" value={cabinBeds.find((b) => b.id === form.bedId)?.number || "—"} />
            <SummaryRow label="Doctors" value={form.doctorIds.length} />
            <SummaryRow label="Nurses" value={form.nurseIds.length} />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() =>
              onSave({
                bedId: form.bedId,
                doctorIds: form.doctorIds,
                nurseIds: form.nurseIds,
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function WardsTab({ hospitalId }) {
  const { data, addItem, updateItem } = useStore()
  const [showCreate, setShowCreate] = useState(false)
  const [editingWard, setEditingWard] = useState(null)

  const hospital = data.hospitals.find((h) => h.id === hospitalId)
  const wardPatients = (data.wardPatients || []).filter((wp) => wp.hospitalId === hospitalId)
  const activeWards = wardPatients.filter((wp) => wp.status !== "Discharged")

  const seedWardBeds = () => {
    const existing = new Set(
      data.beds
        .filter((b) => b.hospitalId === hospitalId && b.type === "Ward")
        .map((b) => `${b.wardName || ""}-${b.number}`)
    )
    WARD_LABELS.forEach((wardName) => {
      for (let i = 1; i <= 10; i += 1) {
        const number = String(i).padStart(2, "0")
        const key = `${wardName}-${number}`
        if (!existing.has(key)) {
          addItem("beds", { hospitalId, number, occupied: false, type: "Ward", wardName })
        }
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-slate-900">Wards</div>
          <div className="text-sm text-slate-500">Hospital: {hospital?.name || "—"}</div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700"
        >
          + Create Ward Admission
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {activeWards.length === 0 && <p className="text-slate-500">No active ward admissions.</p>}
        {activeWards.map((wp) => {
          const patient = data.patients.find((p) => p.id === wp.patientId)
          const bed = data.beds.find((b) => b.id === wp.bedId)
          const wardName = bed?.wardName || wp.wardName || "Ward"
          const doctorNames = (wp.doctorIds || [])
            .map((id) => data.doctors.find((d) => d.id === id)?.name)
            .filter(Boolean)
            .join(", ")
          const nurseNames = (wp.nurseIds || [])
            .map((id) => data.nurses.find((n) => n.id === id)?.name)
            .filter(Boolean)
            .join(", ")

          return (
            <div key={wp.id} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">{patient?.name}</h4>
                  <p className="text-sm text-slate-500">
                    {wardName} · {formatBedNumber(bed?.number) || "—"}
                  </p>
                </div>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md font-medium">
                  Ward Active
                </span>
              </div>
              <div className="mt-3 text-sm text-slate-600 space-y-1">
                <p>Doctors: {doctorNames || "Not assigned"}</p>
                <p>Nurses: {nurseNames || "Not assigned"}</p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => {
                    updateItem("wardPatients", wp.id, {
                      status: "Discharged",
                      dischargedAt: new Date().toISOString(),
                    })
                    updateItem("beds", wp.bedId, { occupied: false })
                  }}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-200"
                >
                  Discharge & Release Bed
                </button>
                <button
                  onClick={() => setEditingWard(wp)}
                  className="px-3 py-1.5 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit Assignment
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showCreate && (
        <CreateWardAdmissionModal
          hospitalId={hospitalId}
          patients={data.patients}
          doctors={data.doctors}
          nurses={data.nurses}
          beds={data.beds}
          onSeedBeds={seedWardBeds}
          onClose={() => setShowCreate(false)}
          onSave={(payload) => {
            addItem("wardPatients", payload)
            updateItem("beds", payload.bedId, { occupied: true })
            setShowCreate(false)
          }}
        />
      )}

      {editingWard && (
        <EditWardAdmissionModal
          admission={editingWard}
          hospitalId={hospitalId}
          patients={data.patients}
          doctors={data.doctors}
          nurses={data.nurses}
          beds={data.beds}
          onClose={() => setEditingWard(null)}
          onSave={(patch) => {
            updateItem("wardPatients", editingWard.id, patch)
            if (patch.bedId && patch.bedId !== editingWard.bedId) {
              updateItem("beds", editingWard.bedId, { occupied: false })
              updateItem("beds", patch.bedId, { occupied: true })
            }
            setEditingWard(null)
          }}
        />
      )}
    </div>
  )
}

function CreateWardAdmissionModal({
  hospitalId,
  patients,
  doctors,
  nurses,
  beds,
  onSeedBeds,
  onClose,
  onSave,
}) {
  const [query, setQuery] = useState("")
  const [form, setForm] = useState({
    patientId: "",
    wardName: "",
    bedId: "",
    doctorIds: [],
    nurseIds: [],
  })

  const wardBeds = beds.filter(
    (b) => !b.occupied && b.hospitalId === hospitalId && b.type === "Ward"
  )
  const wardOptions = WARD_LABELS.filter((ward) =>
    wardBeds.some((b) => (b.wardName || "") === ward)
  )
  const availableBeds = wardBeds.filter((b) => (b.wardName || "") === form.wardName)
  const hospitalDoctors = doctors.filter((d) => d.hospitalIds?.includes(hospitalId))
  const hospitalNurses = nurses.filter((n) => n.hospitalId === hospitalId)
  const filteredPatients = patients.filter((p) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return `${p.name} ${p.phone}`.toLowerCase().includes(q)
  })
  const selectedPatient = patients.find((p) => p.id === form.patientId)
  const valid =
    form.patientId &&
    form.wardName &&
    form.bedId &&
    form.doctorIds.length > 0 &&
    form.nurseIds.length > 0

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Create Ward Admission</h3>
            <p className="text-xs text-slate-500">Assign ward, doctors, and nurses</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Patient Search
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or phone"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
              />
              <div className="mt-2 max-h-40 overflow-y-auto border border-slate-200 rounded-md">
                {filteredPatients.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400">No matching patients.</div>
                ) : (
                  filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setForm({ ...form, patientId: p.id })}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                        form.patientId === p.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.phone}</div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {wardBeds.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <div className="text-sm font-semibold text-amber-900">No ward beds found</div>
                <div className="text-xs text-amber-800">Initialize ward beds for this hospital.</div>
                <button
                  onClick={onSeedBeds}
                  className="mt-2 px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-semibold hover:bg-amber-700"
                >
                  Create Ward Beds
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                <Select
                  label="Ward"
                  value={form.wardName}
                  onChange={(v) => setForm({ ...form, wardName: v, bedId: "" })}
                  options={wardOptions.map((w) => ({ value: w, label: w }))}
                />
                <Select
                  label="Ward Bed"
                  value={form.bedId}
                  onChange={(v) => setForm({ ...form, bedId: v })}
                  options={availableBeds.map((b) => ({
                    value: b.id,
                    label: `${form.wardName} - ${formatBedNumber(b.number)}`,
                  }))}
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <MultiSelect
                label="Assigned Doctors"
                items={hospitalDoctors}
                selected={form.doctorIds}
                onToggle={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    doctorIds: toggleSelection(prev.doctorIds, id),
                  }))
                }
              />
              <MultiSelect
                label="Assigned Nurses"
                items={hospitalNurses}
                selected={form.nurseIds}
                onToggle={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    nurseIds: toggleSelection(prev.nurseIds, id),
                  }))
                }
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="text-sm font-semibold text-slate-900">Admission Summary</div>
            <SummaryRow label="Patient" value={selectedPatient?.name || "Not selected"} />
            <SummaryRow label="Ward" value={form.wardName || "—"} />
            <SummaryRow
              label="Bed"
              value={formatBedNumber(availableBeds.find((b) => b.id === form.bedId)?.number) || "—"}
            />
            <SummaryRow label="Doctors" value={form.doctorIds.length} />
            <SummaryRow label="Nurses" value={form.nurseIds.length} />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() =>
              onSave({
                patientId: form.patientId,
                bedId: form.bedId,
                doctorIds: form.doctorIds,
                nurseIds: form.nurseIds,
                wardName: form.wardName,
                hospitalId,
                admittedAt: new Date().toISOString(),
                status: "Active",
              })
            }
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Create Ward Admission
          </button>
        </div>
      </div>
    </div>
  )
}

function EditWardAdmissionModal({
  admission,
  hospitalId,
  patients,
  doctors,
  nurses,
  beds,
  onClose,
  onSave,
}) {
  const patient = patients.find((p) => p.id === admission.patientId)
  const currentBed = beds.find((b) => b.id === admission.bedId)
  const [form, setForm] = useState({
    wardName: currentBed?.wardName || admission.wardName || "",
    bedId: admission.bedId,
    doctorIds: admission.doctorIds || [],
    nurseIds: admission.nurseIds || [],
  })

  const wardBeds = beds.filter(
    (b) =>
      (b.id === admission.bedId || !b.occupied) && b.hospitalId === hospitalId && b.type === "Ward"
  )
  const wardOptions = WARD_LABELS.filter((ward) =>
    wardBeds.some((b) => (b.wardName || "") === ward)
  )
  const availableBeds = wardBeds.filter((b) => (b.wardName || "") === form.wardName)
  const hospitalDoctors = doctors.filter((d) => d.hospitalIds?.includes(hospitalId))
  const hospitalNurses = nurses.filter((n) => n.hospitalId === hospitalId)
  const valid = form.wardName && form.bedId && form.doctorIds.length > 0 && form.nurseIds.length > 0

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Edit Ward Assignment</h3>
            <p className="text-xs text-slate-500">Adjust ward and staff</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-4">
          <div className="space-y-3">
            <Input label="Patient" value={patient?.name || ""} readOnly />
            <div className="grid md:grid-cols-2 gap-3">
              <Select
                label="Ward"
                value={form.wardName}
                onChange={(v) => setForm({ ...form, wardName: v, bedId: "" })}
                options={wardOptions.map((w) => ({ value: w, label: w }))}
              />
              <Select
                label="Ward Bed"
                value={form.bedId}
                onChange={(v) => setForm({ ...form, bedId: v })}
                options={availableBeds.map((b) => ({
                  value: b.id,
                  label: `${form.wardName} - ${formatBedNumber(b.number)}`,
                }))}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <MultiSelect
                label="Assigned Doctors"
                items={hospitalDoctors}
                selected={form.doctorIds}
                onToggle={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    doctorIds: toggleSelection(prev.doctorIds, id),
                  }))
                }
              />
              <MultiSelect
                label="Assigned Nurses"
                items={hospitalNurses}
                selected={form.nurseIds}
                onToggle={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    nurseIds: toggleSelection(prev.nurseIds, id),
                  }))
                }
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="text-sm font-semibold text-slate-900">Assignment Summary</div>
            <SummaryRow label="Ward" value={form.wardName || "—"} />
            <SummaryRow
              label="Bed"
              value={formatBedNumber(availableBeds.find((b) => b.id === form.bedId)?.number) || "—"}
            />
            <SummaryRow label="Doctors" value={form.doctorIds.length} />
            <SummaryRow label="Nurses" value={form.nurseIds.length} />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() =>
              onSave({
                bedId: form.bedId,
                doctorIds: form.doctorIds,
                nurseIds: form.nurseIds,
                wardName: form.wardName,
              })
            }
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function Input({ label, type = "text", value, onChange, readOnly = false }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 mb-1 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          readOnly ? "bg-slate-100 text-slate-600" : ""
        }`}
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
        className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
