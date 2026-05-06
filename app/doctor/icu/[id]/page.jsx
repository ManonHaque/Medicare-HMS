"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { useStore } from "@/lib/store"

const NAV = [
  { href: "/doctor", label: "Today's Appointments" },
  { href: "/doctor/icu", label: "ICU Patients" },
]

export default function ICUDetailPage({ params }) {
  const resolvedParams = use(params)
  return (
    <DashboardLayout role="doctor" title="ICU Patient" navItems={NAV}>
      <ICUDetail icuId={resolvedParams.id} />
    </DashboardLayout>
  )
}

function ICUDetail({ icuId }) {
  const { data, addItem, updateItem } = useStore()
  const router = useRouter()
  const icu = data.icuPatients.find((ip) => ip.id === icuId)
  const patient = icu ? data.patients.find((p) => p.id === icu.patientId) : null

  // Live vital simulation (visual only, no persistence)
  const [liveVitals, setLiveVitals] = useState(icu?.vitals || {})
  useEffect(() => {
    if (!icu) return
    const interval = setInterval(() => {
      setLiveVitals({
        hr: 70 + Math.floor(Math.random() * 20),
        bp: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 15)}`,
        spo2: 94 + Math.floor(Math.random() * 6),
        temp: (98 + Math.random() * 1.5).toFixed(1),
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [icu])

  const [med, setMed] = useState({ name: "", dosage: "", time: "", repeatHours: 6 })
  const [observation, setObservation] = useState("")
  const myPlans = data.icuPlans.filter((pl) => pl.icuPatientId === icuId)

  if (!icu || !patient) {
    return (
      <div className="text-slate-500">
        ICU patient not found.{" "}
        <button onClick={() => router.push("/doctor/icu")} className="text-blue-600 hover:underline">
          Back
        </button>
      </div>
    )
  }

  const aiAlert =
    liveVitals.spo2 < 95 ? "Oxygen low" : liveVitals.hr > 85 ? "Heart rate elevated" : null

  const handleAddMed = () => {
    if (!med.name || !med.time) return
    const plan = addItem("icuPlans", {
      icuPatientId: icuId,
      type: "medicine",
      ...med,
      createdAt: new Date().toISOString(),
    })
    // Auto-create nurse task
    addItem("nurseTasks", {
      icuPatientId: icuId,
      planId: plan.id,
      patientName: patient.name,
      nurseId: icu.nurseId,
      type: "Administer Medicine",
      description: `${med.name} ${med.dosage} at ${med.time}`,
      time: med.time,
      status: "Pending",
      createdAt: new Date().toISOString(),
    })
    setMed({ name: "", dosage: "", time: "", repeatHours: 6 })
    alert("Medicine scheduled & nurse task created")
  }

  const handleAddObservation = () => {
    if (!observation.trim()) return
    addItem("icuPlans", {
      icuPatientId: icuId,
      type: "observation",
      note: observation,
      createdAt: new Date().toISOString(),
    })
    setObservation("")
  }

  const handleDischarge = () => {
    if (!confirm("Discharge this patient from ICU?")) return
    updateItem("icuPatients", icu.id, { status: "Discharged" })
    updateItem("beds", icu.bedId, { occupied: false })
    router.push("/doctor/icu")
  }

  const handlePDF = () => {
    openICUReport(icu, patient, myPlans, data)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{patient.name}</h3>
            <p className="text-sm text-slate-500">
              {patient.phone} · {patient.age} yrs · Bed{" "}
              {data.beds.find((b) => b.id === icu.bedId)?.number}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePDF}
              className="px-3 py-1.5 border border-slate-300 rounded-md text-sm hover:bg-slate-50"
            >
              ICU Report PDF
            </button>
            <button
              onClick={handleDischarge}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-sm hover:bg-slate-700"
            >
              Discharge
            </button>
          </div>
        </div>
      </div>

      {aiAlert && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between">
          <span className="font-medium text-amber-900">AI Alert: {aiAlert}</span>
          <span className="text-xs text-amber-700">Doctor must confirm</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h4 className="font-semibold text-slate-900 mb-3">Live Vitals</h4>
        <div className="grid grid-cols-4 gap-3">
          <VitalCard label="Heart Rate" value={liveVitals.hr} unit="bpm" />
          <VitalCard label="Blood Pressure" value={liveVitals.bp} unit="" />
          <VitalCard label="SpO2" value={liveVitals.spo2} unit="%" />
          <VitalCard label="Temperature" value={liveVitals.temp} unit="F" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3">Schedule Medicine / Injection</h4>
          <div className="space-y-2">
            <input
              placeholder="Medicine name"
              value={med.name}
              onChange={(e) => setMed({ ...med, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            />
            <input
              placeholder="Dosage"
              value={med.dosage}
              onChange={(e) => setMed({ ...med, dosage: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                value={med.time}
                onChange={(e) => setMed({ ...med, time: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm"
              />
              <input
                type="number"
                placeholder="Repeat (hours)"
                value={med.repeatHours}
                onChange={(e) => setMed({ ...med, repeatHours: Number(e.target.value) })}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm"
              />
            </div>
            <button
              onClick={handleAddMed}
              className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              Add to Plan & Notify Nurse
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3">Add Observation</h4>
          <textarea
            rows={4}
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            placeholder="Patient stable, monitoring..."
          />
          <button
            onClick={handleAddObservation}
            className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 mt-2"
          >
            Save Observation
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h4 className="font-semibold text-slate-900 mb-3">
          ICU Plan & Activity ({myPlans.length})
        </h4>
        {myPlans.length === 0 ? (
          <p className="text-sm text-slate-500">No plan items yet.</p>
        ) : (
          <ul className="space-y-2">
            {myPlans
              .slice()
              .reverse()
              .map((p) => (
                <li key={p.id} className="text-sm bg-slate-50 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium uppercase text-xs text-slate-500">{p.type}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(p.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-900">
                    {p.type === "medicine"
                      ? `${p.name} ${p.dosage} at ${p.time} (every ${p.repeatHours}h)`
                      : p.note}
                  </p>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function VitalCard({ label, value, unit }) {
  return (
    <div className="bg-slate-50 rounded-md p-3 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">
        {value}
        <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>
      </p>
    </div>
  )
}

function openICUReport(icu, patient, plans, data) {
  const w = window.open("", "_blank", "width=800,height=900")
  if (!w) return alert("Please allow popups")
  const planHtml = plans
    .map(
      (p) =>
        `<li><strong>${p.type}</strong> - ${
          p.type === "medicine"
            ? `${p.name} ${p.dosage} at ${p.time}`
            : p.note
        } <em style="color:#64748b">(${new Date(p.createdAt).toLocaleString()})</em></li>`
    )
    .join("")
  w.document.write(`
    <html><head><title>ICU Report</title>
    <style>
      body{font-family:system-ui;padding:40px;color:#0f172a}
      h1{color:#dc2626;margin:0 0 4px}
      .header{border-bottom:2px solid #dc2626;padding-bottom:12px;margin-bottom:20px}
      .label{color:#64748b;font-size:12px;text-transform:uppercase}
      .section{margin:16px 0}
      .vitals{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px}
      .v{background:#f1f5f9;padding:10px;border-radius:6px;text-align:center}
    </style></head>
    <body>
      <div class="header">
        <h1>MediCare HMS - ICU Report</h1>
        <p>Generated ${new Date().toLocaleString()}</p>
      </div>
      <div class="section">
        <p class="label">Patient</p>
        <p><strong>${patient.name}</strong> | ${patient.phone} | ${patient.age} yrs</p>
      </div>
      <div class="section">
        <p class="label">Vitals (last recorded)</p>
        <div class="vitals">
          <div class="v"><div>HR</div><strong>${icu.vitals?.hr}</strong></div>
          <div class="v"><div>BP</div><strong>${icu.vitals?.bp}</strong></div>
          <div class="v"><div>SpO2</div><strong>${icu.vitals?.spo2}%</strong></div>
          <div class="v"><div>Temp</div><strong>${icu.vitals?.temp}</strong></div>
        </div>
      </div>
      <div class="section">
        <p class="label">Care Plan & Observations</p>
        <ul>${planHtml || "<li>None</li>"}</ul>
      </div>
      <button onclick="window.print()" style="margin-top:20px;padding:10px 20px;background:#dc2626;color:white;border:none;border-radius:6px;cursor:pointer">Print / Save as PDF</button>
    </body></html>
  `)
  w.document.close()
}
