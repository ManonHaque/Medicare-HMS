"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { useStore } from "@/lib/store"

const NAV = [
  { href: "/doctor", label: "Today's Appointments" },
  { href: "/doctor/icu", label: "ICU Patients" },
]

export default function ConsultationPage({ params }) {
  const resolvedParams = use(params)
  return (
    <DashboardLayout role="doctor" title="Consultation" navItems={NAV}>
      <Consultation appointmentId={resolvedParams.id} />
    </DashboardLayout>
  )
}

function Consultation({ appointmentId }) {
  const { data, auth, addItem, updateItem } = useStore()
  const router = useRouter()
  const appointment = data.appointments.find((a) => a.id === appointmentId)
  const patient = appointment ? data.patients.find((p) => p.id === appointment.patientId) : null

  const [symptoms, setSymptoms] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [meds, setMeds] = useState([])
  const [tests, setTests] = useState([])
  const [notes, setNotes] = useState("")
  const [followUp, setFollowUp] = useState({ value: "", unit: "Days" })

  if (!appointment || !patient) {
    return (
      <div className="text-slate-500">
        Appointment not found.{" "}
        <button onClick={() => router.push("/doctor")} className="text-blue-600 hover:underline">
          Back to dashboard
        </button>
      </div>
    )
  }

  // Fake AI suggestion
  const generateAi = () => {
    if (!symptoms.trim()) return
    setAiLoading(true)
    setAiSuggestion("")
    setTimeout(() => {
      const lower = symptoms.toLowerCase()
      let suggestion = "Suggestion: General consultation, supportive care"
      if (lower.includes("fever") || lower.includes("cough"))
        suggestion = "Suggestion: Viral Infection, Paracetamol, CBC"
      else if (lower.includes("chest") || lower.includes("heart"))
        suggestion = "Suggestion: Cardiac evaluation, ECG, Lipid Profile"
      else if (lower.includes("headache"))
        suggestion = "Suggestion: Tension headache, Ibuprofen, BP check"
      setAiSuggestion(suggestion)
      setAiLoading(false)
    }, 1200)
  }

  // Patient history (only this doctor's prescriptions and notes)
  const myPrescriptions = data.prescriptions.filter(
    (p) => p.patientId === patient.id && p.doctorId === auth.userId
  )
  const reports = data.reports.filter((r) => r.patientId === patient.id)

  const addMed = () =>
    setMeds([
      ...meds,
      { id: Date.now(), name: "", dosage: "", frequency: "Morning", meal: "After", duration: "" },
    ])
  const updateMed = (id, patch) =>
    setMeds(meds.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  const removeMed = (id) => setMeds(meds.filter((m) => m.id !== id))

  const addTest = () =>
    setTests([...tests, { id: Date.now(), name: "", whenDays: 1, condition: "Mandatory" }])
  const updateTest = (id, patch) =>
    setTests(tests.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  const removeTest = (id) => setTests(tests.filter((t) => t.id !== id))

  const handleSave = () => {
    const presc = {
      patientId: patient.id,
      doctorId: auth.userId,
      appointmentId: appointment.id,
      symptoms,
      aiSuggestion,
      medicines: meds,
      tests,
      notes,
      followUp: followUp.value ? `${followUp.value} ${followUp.unit}` : "None",
      createdAt: new Date().toISOString(),
    }
    addItem("prescriptions", presc)
    updateItem("appointments", appointment.id, { status: "Completed" })
    alert("Prescription saved")
    router.push("/doctor")
  }

  const handlePDF = () => {
    const presc = {
      patientId: patient.id,
      doctorId: auth.userId,
      symptoms,
      medicines: meds,
      tests,
      notes,
      followUp: followUp.value ? `${followUp.value} ${followUp.unit}` : "None",
    }
    openPrescriptionPDF(presc, patient, data.doctors.find((d) => d.id === auth.userId))
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* LEFT: Patient History */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 mb-1">{patient.name}</h3>
          <p className="text-sm text-slate-500">
            {patient.phone} · {patient.age} yrs · {patient.gender}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Appointment: {appointment.date} at {appointment.time}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3">My Previous Prescriptions</h4>
          {myPrescriptions.length === 0 ? (
            <p className="text-sm text-slate-500">No previous visits.</p>
          ) : (
            <ul className="space-y-3">
              {myPrescriptions.map((p) => (
                <li key={p.id} className="text-sm bg-slate-50 rounded-md p-3">
                  <p className="text-xs text-slate-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                  <p className="font-medium">{p.symptoms}</p>
                  {p.notes && <p className="text-slate-600 mt-1">Notes: {p.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3">Test Reports (shared)</h4>
          {reports.length === 0 ? (
            <p className="text-sm text-slate-500">No reports uploaded.</p>
          ) : (
            <ul className="space-y-2">
              {reports.map((r) => (
                <li key={r.id} className="text-sm bg-slate-50 rounded-md p-3">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(r.uploadedAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* RIGHT: Prescription Form */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3">Symptoms</h4>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Patient reports..."
          />
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={generateAi}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Get AI Suggestion
            </button>
            {aiLoading && <span className="text-xs text-slate-500">Loading...</span>}
          </div>
          {aiSuggestion && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-900">{aiSuggestion}</p>
              <p className="text-xs text-blue-700 mt-1">Doctor must confirm</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900">Medicines</h4>
            <button
              onClick={addMed}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Add
            </button>
          </div>
          {meds.length === 0 && <p className="text-sm text-slate-500">No medicines added.</p>}
          <div className="space-y-3">
            {meds.map((m) => (
              <div key={m.id} className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-md">
                <input
                  placeholder="Medicine name"
                  value={m.name}
                  onChange={(e) => updateMed(m.id, { name: e.target.value })}
                  className="px-2 py-1.5 border border-slate-300 rounded text-sm"
                />
                <input
                  placeholder="Dosage"
                  value={m.dosage}
                  onChange={(e) => updateMed(m.id, { dosage: e.target.value })}
                  className="px-2 py-1.5 border border-slate-300 rounded text-sm"
                />
                <select
                  value={m.frequency}
                  onChange={(e) => updateMed(m.id, { frequency: e.target.value })}
                  className="px-2 py-1.5 border border-slate-300 rounded text-sm bg-white"
                >
                  <option>Morning</option>
                  <option>Noon</option>
                  <option>Night</option>
                  <option>Custom</option>
                </select>
                <select
                  value={m.meal}
                  onChange={(e) => updateMed(m.id, { meal: e.target.value })}
                  className="px-2 py-1.5 border border-slate-300 rounded text-sm bg-white"
                >
                  <option>Before</option>
                  <option>After</option>
                </select>
                <input
                  placeholder="Duration (e.g. 5 days)"
                  value={m.duration}
                  onChange={(e) => updateMed(m.id, { duration: e.target.value })}
                  className="col-span-2 px-2 py-1.5 border border-slate-300 rounded text-sm"
                />
                <button
                  onClick={() => removeMed(m.id)}
                  className="col-span-2 text-xs text-red-600 hover:underline text-right"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900">Tests</h4>
            <button
              onClick={addTest}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Add
            </button>
          </div>
          {tests.length === 0 && <p className="text-sm text-slate-500">No tests added.</p>}
          <div className="space-y-3">
            {tests.map((t) => (
              <div key={t.id} className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-md">
                <input
                  placeholder="Test name"
                  value={t.name}
                  onChange={(e) => updateTest(t.id, { name: e.target.value })}
                  className="col-span-3 px-2 py-1.5 border border-slate-300 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="When (days)"
                  value={t.whenDays}
                  onChange={(e) => updateTest(t.id, { whenDays: Number(e.target.value) })}
                  className="px-2 py-1.5 border border-slate-300 rounded text-sm"
                />
                <select
                  value={t.condition}
                  onChange={(e) => updateTest(t.id, { condition: e.target.value })}
                  className="col-span-2 px-2 py-1.5 border border-slate-300 rounded text-sm bg-white"
                >
                  <option>Mandatory</option>
                  <option>If not improved</option>
                </select>
                <button
                  onClick={() => removeTest(t.id)}
                  className="col-span-3 text-xs text-red-600 hover:underline text-right"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3">Notes</h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional notes..."
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3">Follow-up</h4>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Number"
              value={followUp.value}
              onChange={(e) => setFollowUp({ ...followUp, value: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-md w-32"
            />
            <select
              value={followUp.unit}
              onChange={(e) => setFollowUp({ ...followUp, unit: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-md bg-white"
            >
              <option>Days</option>
              <option>Months</option>
              <option>None</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
          >
            Save Prescription
          </button>
          <button
            onClick={handlePDF}
            className="px-4 py-3 border border-slate-300 rounded-md font-medium hover:bg-slate-50"
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  )
}

function openPrescriptionPDF(presc, patient, doctor) {
  const w = window.open("", "_blank", "width=800,height=900")
  if (!w) return alert("Please allow popups to generate PDF")
  const medsHtml = presc.medicines
    .map(
      (m) =>
        `<tr><td>${m.name}</td><td>${m.dosage}</td><td>${m.frequency}</td><td>${m.meal} meal</td><td>${m.duration}</td></tr>`
    )
    .join("")
  const testsHtml = presc.tests
    .map((t) => `<li>${t.name} - in ${t.whenDays} day(s) (${t.condition})</li>`)
    .join("")
  w.document.write(`
    <html><head><title>Prescription</title>
    <style>
      body{font-family:system-ui;padding:40px;color:#0f172a}
      h1{color:#1d4ed8;margin:0 0 4px}
      .header{border-bottom:2px solid #1d4ed8;padding-bottom:12px;margin-bottom:20px}
      table{width:100%;border-collapse:collapse;margin:8px 0}
      th,td{border:1px solid #cbd5e1;padding:8px;text-align:left;font-size:13px}
      th{background:#f1f5f9}
      .section{margin:16px 0}
      .label{color:#64748b;font-size:12px;text-transform:uppercase}
      @media print{button{display:none}}
    </style></head>
    <body>
      <div class="header">
        <h1>MediCare HMS - Prescription</h1>
        <p>${doctor?.name || ""} - ${doctor?.specialty || ""}</p>
      </div>
      <div class="section">
        <p class="label">Patient</p>
        <p><strong>${patient.name}</strong> | ${patient.phone} | ${patient.age} yrs | ${patient.gender}</p>
      </div>
      <div class="section">
        <p class="label">Symptoms</p>
        <p>${presc.symptoms || "—"}</p>
      </div>
      <div class="section">
        <p class="label">Medicines</p>
        <table><thead><tr><th>Name</th><th>Dosage</th><th>Frequency</th><th>Meal</th><th>Duration</th></tr></thead><tbody>${medsHtml || '<tr><td colspan="5">None</td></tr>'}</tbody></table>
      </div>
      <div class="section">
        <p class="label">Tests</p>
        <ul>${testsHtml || "<li>None</li>"}</ul>
      </div>
      <div class="section">
        <p class="label">Notes</p>
        <p>${presc.notes || "—"}</p>
      </div>
      <div class="section">
        <p class="label">Follow-up</p>
        <p>${presc.followUp}</p>
      </div>
      <button onclick="window.print()" style="margin-top:20px;padding:10px 20px;background:#1d4ed8;color:white;border:none;border-radius:6px;cursor:pointer">Print / Save as PDF</button>
    </body></html>
  `)
  w.document.close()
}
