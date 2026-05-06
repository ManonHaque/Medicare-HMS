"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { useStore } from "@/lib/store"

const NAV = [
  { href: "/admin", label: "Patient Search" },
  { href: "/admin?tab=doctors", label: "Doctors" },
  { href: "/admin?tab=nurses", label: "Nurses" },
  { href: "/admin?tab=appointments", label: "Appointments" },
  { href: "/admin?tab=icu", label: "ICU" },
]

export default function AdminPage() {
  return (
    <DashboardLayout role="admin" title="Hospital Admin" navItems={NAV}>
      <AdminContent />
    </DashboardLayout>
  )
}

function AdminContent() {
  const [tab, setTab] = useState("search")
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200">
        {[
          ["search", "Patient Search"],
          ["doctors", "Doctors"],
          ["nurses", "Nurses"],
          ["appointments", "Appointments"],
          ["icu", "ICU"],
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

      {tab === "search" && <PatientSearchTab />}
      {tab === "doctors" && <DoctorsTab />}
      {tab === "nurses" && <NursesTab />}
      {tab === "appointments" && <AppointmentsTab />}
      {tab === "icu" && <ICUTab />}
    </div>
  )
}

function PatientSearchTab() {
  const { data, addItem, updateItem } = useStore()
  const [phone, setPhone] = useState("")
  const [searched, setSearched] = useState(false)
  const [editing, setEditing] = useState(null)
  const [activePatient, setActivePatient] = useState(null)
  const [view, setView] = useState(null) // "appointment" | "icu" | "profile"

  const matched = searched ? data.patients.find((p) => p.phone === phone) : null

  const handleSearch = (e) => {
    e.preventDefault()
    setSearched(true)
    setView(null)
    setActivePatient(data.patients.find((p) => p.phone === phone) || null)
  }

  const handleCreatePatient = (form) => {
    const newP = addItem("patients", { ...form, createdAt: new Date().toISOString() })
    setActivePatient(newP)
    setView("appointment")
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
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
          <h3 className="font-semibold text-yellow-900 mb-2">No patient found</h3>
          <p className="text-sm text-yellow-800 mb-4">Create a new patient record:</p>
          <CreatePatientForm initialPhone={phone} onSave={handleCreatePatient} />
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
              onClick={() => setView("appointment")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              Book Appointment
            </button>
            <button
              onClick={() => setView("icu")}
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
      {view === "appointment" && activePatient && (
        <BookAppointmentForm patient={activePatient} onDone={() => setView(null)} />
      )}
      {view === "icu" && activePatient && (
        <AdmitICUForm patient={activePatient} onDone={() => setView(null)} />
      )}
    </div>
  )
}

function CreatePatientForm({ initialPhone, onSave }) {
  const [form, setForm] = useState({
    name: "",
    phone: initialPhone || "",
    age: "",
    gender: "Male",
  })
  const valid = form.name && form.phone
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
      <Input
        label="Phone"
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
      <div className="md:col-span-2">
        <button
          disabled={!valid}
          onClick={() => onSave({ ...form, age: Number(form.age) || 0 })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          Create & Continue
        </button>
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

function AdmitICUForm({ patient, onDone }) {
  const { data, addItem, updateItem } = useStore()
  const [form, setForm] = useState({ bedId: "", doctorId: "", nurseId: "", hospitalId: "" })

  const availableBeds = data.beds.filter(
    (b) => !b.occupied && (!form.hospitalId || b.hospitalId === form.hospitalId)
  )

  const handleAdmit = () => {
    if (!form.bedId || !form.doctorId || !form.nurseId) return
    addItem("icuPatients", {
      patientId: patient.id,
      bedId: form.bedId,
      doctorId: form.doctorId,
      nurseId: form.nurseId,
      hospitalId: form.hospitalId,
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
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Admit {patient.name} to ICU
      </h3>
      <div className="grid md:grid-cols-2 gap-3">
        <Select
          label="Hospital"
          value={form.hospitalId}
          onChange={(v) => setForm({ ...form, hospitalId: v, bedId: "" })}
          options={data.hospitals.map((h) => ({ value: h.id, label: h.name }))}
        />
        <Select
          label="Bed"
          value={form.bedId}
          onChange={(v) => setForm({ ...form, bedId: v })}
          options={availableBeds.map((b) => ({ value: b.id, label: b.number }))}
        />
        <Select
          label="Assigned Doctor"
          value={form.doctorId}
          onChange={(v) => setForm({ ...form, doctorId: v })}
          options={data.doctors.map((d) => ({ value: d.id, label: d.name }))}
        />
        <Select
          label="Assigned Nurse"
          value={form.nurseId}
          onChange={(v) => setForm({ ...form, nurseId: v })}
          options={data.nurses.map((n) => ({ value: n.id, label: n.name }))}
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

function DoctorsTab() {
  const { data, addItem, updateItem, removeItem } = useStore()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Manage Doctors</h2>
        <button
          onClick={() => setAdding(true)}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          + Add Doctor
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.doctors.map((d) => (
          <div key={d.id} className="bg-white border border-slate-200 rounded-md p-4">
            <h4 className="font-semibold text-slate-900">{d.name}</h4>
            <p className="text-sm text-slate-500">{d.specialty}</p>
            <p className="text-sm text-slate-500">{d.phone}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditing(d)}
                className="text-xs text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm(`Remove ${d.name}?`)) removeItem("doctors", d.id)
                }}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {(editing || adding) && (
        <DoctorFormModal
          doctor={editing}
          hospitals={data.hospitals}
          onClose={() => {
            setEditing(null)
            setAdding(false)
          }}
          onSave={(form) => {
            if (editing) updateItem("doctors", editing.id, form)
            else addItem("doctors", form)
            setEditing(null)
            setAdding(false)
          }}
        />
      )}
    </div>
  )
}

function DoctorFormModal({ doctor, hospitals, onClose, onSave }) {
  const [form, setForm] = useState({
    name: doctor?.name || "",
    specialty: doctor?.specialty || "",
    phone: doctor?.phone || "",
    hospitalIds: doctor?.hospitalIds || [],
  })
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="font-semibold text-lg text-slate-900 mb-4">
          {doctor ? "Edit" : "Add"} Doctor
        </h3>
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
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Hospitals</label>
            <div className="space-y-1">
              {hospitals.map((h) => (
                <label key={h.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.hospitalIds.includes(h.id)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...form.hospitalIds, h.id]
                        : form.hospitalIds.filter((id) => id !== h.id)
                      setForm({ ...form, hospitalIds: next })
                    }}
                  />
                  {h.name}
                </label>
              ))}
            </div>
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

function NursesTab() {
  const { data, addItem, updateItem, removeItem } = useStore()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Manage Nurses</h2>
        <button
          onClick={() => setAdding(true)}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          + Add Nurse
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.nurses.map((n) => (
          <div key={n.id} className="bg-white border border-slate-200 rounded-md p-4">
            <h4 className="font-semibold text-slate-900">{n.name}</h4>
            <p className="text-sm text-slate-500">
              {data.hospitals.find((h) => h.id === n.hospitalId)?.name}
            </p>
            <p className="text-sm text-slate-500">Shift: {n.shift}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditing(n)}
                className="text-xs text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm(`Remove ${n.name}?`)) removeItem("nurses", n.id)
                }}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {(editing || adding) && (
        <NurseFormModal
          nurse={editing}
          hospitals={data.hospitals}
          onClose={() => {
            setEditing(null)
            setAdding(false)
          }}
          onSave={(form) => {
            if (editing) updateItem("nurses", editing.id, form)
            else addItem("nurses", form)
            setEditing(null)
            setAdding(false)
          }}
        />
      )}
    </div>
  )
}

function NurseFormModal({ nurse, hospitals, onClose, onSave }) {
  const [form, setForm] = useState({
    name: nurse?.name || "",
    hospitalId: nurse?.hospitalId || "",
    shift: nurse?.shift || "Day",
  })
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="font-semibold text-lg text-slate-900 mb-4">
          {nurse ? "Edit" : "Add"} Nurse
        </h3>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Select
            label="Hospital"
            value={form.hospitalId}
            onChange={(v) => setForm({ ...form, hospitalId: v })}
            options={hospitals.map((h) => ({ value: h.id, label: h.name }))}
          />
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
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

function AppointmentsTab() {
  const { data, updateItem, removeItem } = useStore()
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 text-left">
          <tr>
            <th className="p-3">Patient</th>
            <th className="p-3">Doctor</th>
            <th className="p-3">Date / Time</th>
            <th className="p-3">Status</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {data.appointments.map((a) => (
            <tr key={a.id} className="border-t border-slate-200">
              <td className="p-3 font-medium">
                {data.patients.find((p) => p.id === a.patientId)?.name}
              </td>
              <td className="p-3">{data.doctors.find((d) => d.id === a.doctorId)?.name}</td>
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
                <button
                  onClick={() => removeItem("appointments", a.id)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ICUTab() {
  const { data } = useStore()
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {data.icuPatients.length === 0 && (
        <p className="text-slate-500">No active ICU admissions.</p>
      )}
      {data.icuPatients.map((ip) => {
        const patient = data.patients.find((p) => p.id === ip.patientId)
        const bed = data.beds.find((b) => b.id === ip.bedId)
        return (
          <div key={ip.id} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">{patient?.name}</h4>
                <p className="text-sm text-slate-500">
                  Bed {bed?.number} ·{" "}
                  {data.hospitals.find((h) => h.id === ip.hospitalId)?.name}
                </p>
              </div>
              <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md font-medium">
                ICU Active
              </span>
            </div>
            <div className="mt-3 text-sm text-slate-600">
              <p>Doctor: {data.doctors.find((d) => d.id === ip.doctorId)?.name}</p>
              <p>Nurse: {data.nurses.find((n) => n.id === ip.nurseId)?.name}</p>
            </div>
          </div>
        )
      })}
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
