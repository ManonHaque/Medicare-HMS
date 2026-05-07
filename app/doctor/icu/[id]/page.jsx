"use client"

import { use, useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { useStore } from "@/lib/store"
import { getMedicineSuggestions } from "@/components/prescription/medicine-ai"
import PrescriptionPdfModal from "@/components/prescription/PrescriptionPdfModal"
import { buildPrescriptionPdfHtml } from "@/components/prescription/prescription-pdf"

const NAV = [
  { href: "/doctor", label: "Today's Appointments" },
  { href: "/doctor/icu", label: "ICU Patients" },
]

const COMMON_TESTS = [
  "CBC",
  "ESR",
  "CRP",
  "RBS",
  "HbA1c",
  "Urine R/M/E",
  "Serum Creatinine",
  "SGPT/ALT",
  "ECG",
  "Chest X-ray",
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
  const { auth, data, addItem, updateItem } = useStore()
  const router = useRouter()
  const icu = data.icuPatients.find((ip) => ip.id === icuId)
  const patient = icu ? data.patients.find((p) => p.id === icu.patientId) : null
  const hospital = icu ? data.hospitals.find((h) => h.id === icu.hospitalId) : null
  const currentDoctor = data.doctors.find((doctor) => doctor.id === auth.userId)
  const initialVitals = normalizeVitals(icu?.vitals || {})

  // Live vital simulation (visual only, no persistence)
  const [liveVitals, setLiveVitals] = useState(initialVitals)
  const [vitalHistory, setVitalHistory] = useState(() => seedVitalHistory(initialVitals))
  useEffect(() => {
    if (!icu) return
    const interval = setInterval(() => {
      const nextVitals = normalizeVitals({
        hr: 70 + Math.floor(Math.random() * 20),
        bp: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 15)}`,
        spo2: 94 + Math.floor(Math.random() * 6),
        temp: (98 + Math.random() * 1.5).toFixed(1),
      })
      setLiveVitals(nextVitals)
      setVitalHistory((history) => [...history.slice(-17), nextVitals])
    }, 3000)
    return () => clearInterval(interval)
  }, [icu])

  const [med, setMed] = useState(createMedicineSchedule())
  const [test, setTest] = useState(createTestSchedule())
  const [observation, setObservation] = useState("")
  const [pdfOpen, setPdfOpen] = useState(false)
  const [pdfHtml, setPdfHtml] = useState("")
  const myPlans = data.icuPlans.filter((pl) => pl.icuPatientId === icuId)
  const patientPrescriptions = useMemo(() => {
    if (!patient) return []
    return (data.prescriptions || [])
      .filter((prescription) => prescription.patientId === patient.id)
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
  }, [data.prescriptions, patient])
  const patientReports = useMemo(() => {
    if (!patient) return []
    return (data.reports || [])
      .filter((report) => report.patientId === patient.id)
      .sort((a, b) => String(b.uploadedAt || "").localeCompare(String(a.uploadedAt || "")))
  }, [data.reports, patient])

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
    if (!med.medicineLabel || !hasSelectedTiming(med)) return
    const timingText = formatMedicineTiming(med)
    const description = formatMedicineTaskDescription(med)
    const plan = addItem("icuPlans", {
      icuPatientId: icuId,
      type: "medicine",
      ...med,
      name: med.medicineLabel,
      time: timingText,
      doctorId: auth.userId,
      doctorName: currentDoctor?.name || auth.userId,
      createdAt: new Date().toISOString(),
    })
    // Auto-create nurse task
    addItem("nurseTasks", {
      icuPatientId: icuId,
      planId: plan.id,
      patientName: patient.name,
      nurseId: icu.nurseId || icu.nurseIds?.[0],
      type: "Administer Medicine",
      description,
      time: timingText,
      status: "Pending",
      createdAt: new Date().toISOString(),
    })
    setMed(createMedicineSchedule())
    alert("Medicine scheduled & nurse task created")
  }

  const handleAddObservation = () => {
    if (!observation.trim()) return
    addItem("icuPlans", {
      icuPatientId: icuId,
      type: "observation",
      note: observation,
      doctorId: auth.userId,
      doctorName: currentDoctor?.name || auth.userId,
      createdAt: new Date().toISOString(),
    })
    setObservation("")
  }

  const handleAddTest = () => {
    if (!test.name.trim()) return
    addItem("icuPlans", {
      icuPatientId: icuId,
      type: "test",
      ...test,
      name: test.name.trim(),
      doctorId: auth.userId,
      doctorName: currentDoctor?.name || auth.userId,
      createdAt: new Date().toISOString(),
    })
    setTest(createTestSchedule())
    alert("Test added to ICU plan")
  }

  const handleDischarge = () => {
    if (!confirm("Discharge this patient from ICU?")) return
    updateItem("icuPatients", icu.id, { status: "Discharged" })
    updateItem("beds", icu.bedId, { occupied: false })
    router.push("/doctor/icu")
  }

  const handlePDF = () => {
    openICUReport(icu, patient, myPlans, data, currentDoctor)
  }

  const openPrescriptionPdf = (prescription) => {
    const prescriptionHospital =
      data.hospitals.find((h) => h.id === prescription.hospitalId) || hospital || data.hospitals[0]
    const prescriptionDoctor =
      data.doctors.find((doctor) => doctor.id === prescription.doctorId) || {
        name: prescription.doctorId || "Doctor",
      }
    setPdfHtml(
      buildPrescriptionPdfHtml({
        hospital: prescriptionHospital,
        doctor: prescriptionDoctor,
        patient,
        prescription,
      })
    )
    setPdfOpen(true)
  }

  const openReportPdf = (report) => {
    setPdfHtml(
      buildSimpleReportHtml({
        hospital: data.hospitals.find((h) => h.id === report.hospitalId) || hospital,
        patient,
        report,
      })
    )
    setPdfOpen(true)
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
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="font-semibold text-slate-900">Live Vitals Trend</h4>
            <p className="text-xs text-slate-500">Simulated bedside monitor, last 18 readings</p>
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
            Live
          </span>
        </div>
        <VitalsGraph history={vitalHistory} current={liveVitals} />
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3">Schedule Medicine / Injection</h4>
          <div className="space-y-3">
            <ICUMedicineSchedule
              row={med}
              patient={patient}
              onChange={(patch) => setMed((prev) => ({ ...prev, ...patch }))}
            />
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

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3">Add Test</h4>
          <ICUTestSchedule
            row={test}
            onChange={(patch) => setTest((prev) => ({ ...prev, ...patch }))}
          />
          <button
            onClick={handleAddTest}
            className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 mt-3"
          >
            Add Test to Plan
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
                  <p className="text-slate-900">{formatPlanDescription(p)}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Doctor: {getPlanDoctorName(p, data, currentDoctor)}
                  </p>
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <TestReportsPanel reports={patientReports} data={data} onOpenReport={openReportPdf} />
        <PrescriptionHistoryPanel
          prescriptions={patientPrescriptions}
          data={data}
          onOpenPrescription={openPrescriptionPdf}
        />
      </div>

      <PrescriptionPdfModal open={pdfOpen} onClose={() => setPdfOpen(false)} html={pdfHtml} />
    </div>
  )
}

function TestReportsPanel({ reports, data, onOpenReport }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-slate-900">All Test Reports</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Uploaded reports from all connected hospitals
          </p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-700 rounded-full px-2 py-1">
          {reports.length}
        </span>
      </div>

      <div className="mt-3 space-y-2 max-h-96 overflow-auto pr-1">
        {reports.length === 0 ? (
          <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-md p-3">
            No test reports uploaded.
          </p>
        ) : (
          reports.map((report) => {
            const reportHospital = data.hospitals.find((h) => h.id === report.hospitalId)
            return (
              <div key={report.id} className="bg-slate-50 border border-slate-200 rounded-md p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {report.name || "Test Report"}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {reportHospital?.name || report.hospitalId || "Hospital not specified"} -{" "}
                      {formatDate(report.uploadedAt)}
                    </div>
                    {report.result ? (
                      <div className="text-xs text-slate-700 mt-2 line-clamp-2">
                        {report.result}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenReport(report)}
                    className="shrink-0 px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-medium hover:bg-white"
                  >
                    View
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function PrescriptionHistoryPanel({ prescriptions, data, onOpenPrescription }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-slate-900">All Prescriptions</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete prescription history for this ICU patient
          </p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-700 rounded-full px-2 py-1">
          {prescriptions.length}
        </span>
      </div>

      <div className="mt-3 space-y-2 max-h-96 overflow-auto pr-1">
        {prescriptions.length === 0 ? (
          <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-md p-3">
            No prescriptions found.
          </p>
        ) : (
          prescriptions.map((prescription) => {
            const prescriber = data.doctors.find((doctor) => doctor.id === prescription.doctorId)
            const prescriptionHospital = data.hospitals.find(
              (hospital) => hospital.id === prescription.hospitalId
            )
            return (
              <div
                key={prescription.id}
                className="bg-slate-50 border border-slate-200 rounded-md p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">
                      {formatDate(prescription.createdAt)} -{" "}
                      {prescriptionHospital?.name || prescription.hospitalId || "Hospital"}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
                      {diagnosisSummary(prescription)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Doctor: {prescriber?.name || prescription.doctorId || "Doctor"}
                    </div>
                    <PrescriptionMedicineSummary prescription={prescription} />
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenPrescription(prescription)}
                    className="shrink-0 px-2.5 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
                  >
                    Open PDF
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function PrescriptionMedicineSummary({ prescription }) {
  const medicines = prescription.medicines || []
  if (!medicines.length) {
    return <div className="text-xs text-slate-500 mt-2">No medicines listed.</div>
  }

  return (
    <div className="mt-2 space-y-1">
      {medicines.slice(0, 3).map((medicine) => (
        <div key={medicine.id || medicine.medicineLabel} className="text-xs text-slate-700">
          <span className="font-medium">{medicine.medicineLabel || "Medicine"}</span>
          <span className="text-slate-500">
            {" "}
            - {formatPrescriptionTiming(medicine)} -{" "}
            {medicine.durationDays ? `${medicine.durationDays} days` : "duration not set"} -{" "}
            {medicine.mealTiming || "meal timing not set"}
          </span>
        </div>
      ))}
      {medicines.length > 3 ? (
        <div className="text-xs text-slate-500">+{medicines.length - 3} more medicine</div>
      ) : null}
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return "-"
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return "-"
  }
}

function diagnosisSummary(prescription) {
  return prescription?.diagnosis || prescription?.aiSuggestion || prescription?.symptoms || "-"
}

function formatPrescriptionTiming(medicine) {
  if (medicine.useCustom && medicine.customTimesPerDay) {
    return `${medicine.customTimesPerDay} times daily`
  }
  return formatMedicineTiming(medicine) || "timing not set"
}

function formatPlanDescription(plan) {
  if (plan.type === "medicine") return formatMedicineTaskDescription(plan)
  if (plan.type === "test") return formatTestTaskDescription(plan)
  return plan.note || "-"
}

function getPlanDoctorName(plan, data, currentDoctor) {
  if (plan.doctorName) return plan.doctorName
  const doctor = data.doctors.find((item) => item.id === plan.doctorId)
  return doctor?.name || plan.doctorId || currentDoctor?.name || "Current doctor"
}

function createMedicineSchedule() {
  return {
    medicineId: "",
    medicineLabel: "",
    timing: { morning: true, noon: false, night: true },
    mealTiming: "After Meal",
    durationDays: 5,
  }
}

function createTestSchedule() {
  return {
    name: "",
    timing: "Today",
    condition: "Mandatory",
  }
}

function Toggle({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-md text-xs font-medium border ${
        active
          ? "bg-blue-600 border-blue-600 text-white"
          : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  )
}

function ICUTestSchedule({ row, onChange }) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return COMMON_TESTS
    return COMMON_TESTS.filter((name) => name.toLowerCase().includes(normalized))
  }, [query])

  useEffect(() => {
    if (!open) return
    const onDoc = (event) => {
      if (!inputRef.current) return
      if (inputRef.current.contains(event.target)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  const selectTest = (name) => {
    onChange({ name })
    setQuery("")
    setOpen(false)
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
      <div ref={inputRef} className="relative">
        <label className="text-[11px] text-slate-500 uppercase tracking-wide">Test Name</label>
        <input
          value={open ? query : row.name}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            onChange({ name: event.target.value })
          }}
          onFocus={() => {
            setOpen(true)
            setQuery("")
          }}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
          placeholder="Search from test suggestions..."
        />

        {open ? (
          <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-sm max-h-56 overflow-auto">
            <div className="px-3 py-2 text-[11px] text-slate-500 border-b border-slate-200">
              Test suggestions
            </div>
            {suggestions.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => selectTest(name)}
                className="w-full text-left px-3 py-2 hover:bg-slate-50"
              >
                <div className="text-sm font-medium text-slate-900">{name}</div>
                <div className="text-xs text-slate-600">Diagnostic test</div>
              </button>
            ))}
            {suggestions.length === 0 ? (
              <div className="px-3 py-3 text-sm text-slate-500">No matches.</div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="grid md:grid-cols-2 gap-2 mt-3">
        <MiniSelect
          label="Timing"
          value={row.timing}
          onChange={(value) => onChange({ timing: value })}
          options={["Today", "Tomorrow", "Next Visit"]}
        />
        <MiniSelect
          label="Condition"
          value={row.condition}
          onChange={(value) => onChange({ condition: value })}
          options={["Mandatory", "If not improved", "If symptoms worsen"]}
        />
      </div>
    </div>
  )
}

function MiniSelect({ label, value, onChange, options }) {
  return (
    <label>
      <div className="text-[11px] text-slate-500 uppercase tracking-wide">{label}</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function ICUMedicineSchedule({ row, patient, onChange }) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)

  const suggestions = useMemo(() => {
    const q = open ? query : ""
    return getMedicineSuggestions({ query: q, symptoms: "", patient, limit: 8 })
  }, [query, patient, open])

  useEffect(() => {
    if (!open) return
    const onDoc = (event) => {
      if (!inputRef.current) return
      if (inputRef.current.contains(event.target)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  const selectMedicine = (medicine) => {
    onChange({
      medicineId: medicine.id,
      medicineLabel: `${medicine.brandName} - ${medicine.genericName} (${medicine.strength} ${medicine.type})`,
    })
    setQuery("")
    setOpen(false)
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
      <div ref={inputRef} className="relative">
        <label className="text-[11px] text-slate-500 uppercase tracking-wide">
          Medicine Search
        </label>
        <input
          value={open ? query : row.medicineLabel}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            onChange({ medicineLabel: event.target.value, medicineId: "" })
          }}
          onFocus={() => {
            setOpen(true)
            setQuery("")
          }}
          placeholder="Search from shared medicine database..."
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
        />

        {open ? (
          <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-sm max-h-56 overflow-auto">
            <div className="px-3 py-2 text-[11px] text-slate-500 border-b border-slate-200">
              Suggestions from medicine database
            </div>
            {suggestions.map((medicine) => (
              <button
                key={medicine.id}
                type="button"
                onClick={() => selectMedicine(medicine)}
                className="w-full text-left px-3 py-2 hover:bg-slate-50"
              >
                <div className="text-sm font-medium text-slate-900">{medicine.brandName}</div>
                <div className="text-xs text-slate-600">
                  {medicine.genericName} - {medicine.strength} - {medicine.type}
                </div>
              </button>
            ))}
            {suggestions.length === 0 ? (
              <div className="px-3 py-3 text-sm text-slate-500">No matches.</div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-3 grid gap-3">
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wide">Time</div>
          <div className="mt-1 flex gap-2 flex-wrap">
            <Toggle
              active={row.timing?.morning}
              onClick={() =>
                onChange({ timing: { ...row.timing, morning: !row.timing?.morning } })
              }
            >
              Morning
            </Toggle>
            <Toggle
              active={row.timing?.noon}
              onClick={() => onChange({ timing: { ...row.timing, noon: !row.timing?.noon } })}
            >
              Noon
            </Toggle>
            <Toggle
              active={row.timing?.night}
              onClick={() => onChange({ timing: { ...row.timing, night: !row.timing?.night } })}
            >
              Night
            </Toggle>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">Meal Timing</div>
            <div className="mt-1 flex gap-2 flex-wrap">
              {["Before Meal", "After Meal", "Not Applicable"].map((option) => (
                <Toggle
                  key={option}
                  active={row.mealTiming === option}
                  onClick={() => onChange({ mealTiming: option })}
                >
                  {option}
                </Toggle>
              ))}
            </div>
          </div>

          <label>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">
              Number of Days
            </div>
            <input
              type="number"
              min={1}
              value={row.durationDays}
              onChange={(event) => onChange({ durationDays: Number(event.target.value) })}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
            />
          </label>
        </div>
      </div>
    </div>
  )
}

function hasSelectedTiming(medicine) {
  return Boolean(medicine.timing?.morning || medicine.timing?.noon || medicine.timing?.night)
}

function formatMedicineTiming(medicine) {
  const timing = []
  if (medicine.timing?.morning) timing.push("Morning")
  if (medicine.timing?.noon) timing.push("Noon")
  if (medicine.timing?.night) timing.push("Night")
  return timing.join(", ")
}

function formatMedicineTaskDescription(medicine) {
  const name = medicine.dosage
    ? `${medicine.medicineLabel || medicine.name || "Medicine"} ${medicine.dosage}`
    : medicine.medicineLabel || medicine.name || "Medicine"
  const timing = formatMedicineTiming(medicine) || medicine.time || "Timing not set"
  const duration = medicine.durationDays
    ? `${medicine.durationDays} days`
    : medicine.repeatHours
      ? `every ${medicine.repeatHours}h`
      : "Duration not set"
  const mealTiming = medicine.mealTiming || "Not Applicable"
  return `${name} - ${timing} - ${duration} - ${mealTiming}`
}

function formatTestTaskDescription(test) {
  const timing = test.timing || "Today"
  const condition = test.condition || "Mandatory"
  return `${test.name || "Test"} - ${timing} - ${condition}`
}

function normalizeVitals(vitals) {
  const [systolic = 120, diastolic = 80] = String(vitals.bp || "120/80")
    .split("/")
    .map((value) => Number(value))

  return {
    hr: Number(vitals.hr || 78),
    bp: `${systolic || 120}/${diastolic || 80}`,
    systolic: systolic || 120,
    diastolic: diastolic || 80,
    spo2: Number(vitals.spo2 || 97),
    temp: Number(vitals.temp || 98.6),
  }
}

function seedVitalHistory(vitals) {
  const base = normalizeVitals(vitals)
  return Array.from({ length: 14 }, (_, index) =>
    normalizeVitals({
      hr: base.hr + Math.round(Math.sin(index / 2) * 4),
      bp: `${base.systolic + Math.round(Math.cos(index / 2) * 5)}/${
        base.diastolic + Math.round(Math.sin(index / 3) * 3)
      }`,
      spo2: Math.min(100, Math.max(90, base.spo2 + Math.round(Math.sin(index / 3) * 2))),
      temp: (base.temp + Math.sin(index / 4) * 0.3).toFixed(1),
    })
  )
}

function VitalsGraph({ history, current }) {
  const readings = history.length ? history : [current]
  const heartRate = readings.map((item) => item.hr)
  const oxygen = readings.map((item) => item.spo2)
  const temperature = readings.map((item) => item.temp)
  const systolic = readings.map((item) => item.systolic)
  const diastolic = readings.map((item) => item.diastolic)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <VitalReading label="HR" value={current.hr} unit="bpm" tone="text-rose-700" />
        <VitalReading label="BP" value={current.bp} unit="mmHg" tone="text-blue-700" />
        <VitalReading label="SpO2" value={current.spo2} unit="%" tone="text-emerald-700" />
        <VitalReading label="Temp" value={current.temp.toFixed(1)} unit="F" tone="text-amber-700" />
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <TrendChart
          title="Heart Rate"
          subtitle="Normal range: 60-100 bpm"
          values={heartRate}
          min={55}
          max={110}
          color="#e11d48"
          unit="bpm"
        />
        <TrendChart
          title="Blood Pressure"
          subtitle="Systolic / Diastolic"
          values={systolic}
          secondaryValues={diastolic}
          min={55}
          max={145}
          color="#2563eb"
          secondaryColor="#60a5fa"
          unit="mmHg"
        />
        <TrendChart
          title="Oxygen Saturation"
          subtitle="Alert below 95%"
          values={oxygen}
          min={88}
          max={100}
          color="#059669"
          unit="%"
        />
        <TrendChart
          title="Temperature"
          subtitle="Fahrenheit"
          values={temperature}
          min={96}
          max={102}
          color="#d97706"
          unit="F"
        />
      </div>
    </div>
  )
}

function VitalReading({ label, value, unit, tone }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-xl font-bold ${tone}`}>
        {value}
        <span className="text-xs font-normal text-slate-500 ml-1">{unit}</span>
      </p>
    </div>
  )
}

function TrendChart({
  title,
  subtitle,
  values,
  secondaryValues,
  min,
  max,
  color,
  secondaryColor,
  unit,
}) {
  const latest = values[values.length - 1]
  const secondaryLatest = secondaryValues?.[secondaryValues.length - 1]

  return (
    <div className="border border-slate-200 rounded-md p-3">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="text-xs text-slate-500">{subtitle}</div>
        </div>
        <div className="text-right text-sm font-semibold text-slate-900">
          {Math.round(latest * 10) / 10}
          {secondaryLatest ? `/${Math.round(secondaryLatest)}` : ""}
          <span className="text-xs font-normal text-slate-500 ml-1">{unit}</span>
        </div>
      </div>
      <svg
        viewBox="0 0 320 112"
        className="w-full h-28"
        role="img"
        aria-label={`${title} trend graph`}
      >
        <rect x="0" y="0" width="320" height="112" rx="6" fill="#f8fafc" />
        {[24, 52, 80].map((y) => (
          <line key={y} x1="12" x2="308" y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
        ))}
        {secondaryValues && (
          <polyline
            points={toGraphPoints(secondaryValues, min, max)}
            fill="none"
            stroke={secondaryColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        <polyline
          points={toGraphPoints(values, min, max)}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function toGraphPoints(values, min, max) {
  const width = 296
  const height = 76
  const left = 12
  const top = 18
  const range = max - min
  const step = values.length > 1 ? width / (values.length - 1) : width

  return values
    .map((value, index) => {
      const normalized = Math.max(0, Math.min(1, (Number(value) - min) / range))
      const x = left + index * step
      const y = top + height - normalized * height
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")
}

function buildSimpleReportHtml({ hospital, patient, report }) {
  const name = report?.name || "Report"
  const date = report?.uploadedAt ? formatDate(report.uploadedAt) : ""

  return `
  <html>
    <head>
      <title>${name}</title>
      <meta charset="utf-8" />
      <style>
        body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:28px;color:#0f172a}
        .header{border-bottom:2px solid #1d4ed8;padding-bottom:10px;margin-bottom:14px}
        h1{font-size:18px;margin:0;color:#1d4ed8}
        .sub{font-size:12px;color:#475569;margin-top:2px}
        .card{border:1px solid #cbd5e1;border-radius:10px;padding:10px;margin-top:10px}
        .label{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.04em}
        .value{font-size:13px;margin-top:4px}
        @media print{.no-print{display:none}}
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${hospital?.name || "Hospital"}</h1>
        <div class="sub">Test report - Powered by MediCare HMS</div>
      </div>
      <div class="card">
        <div class="label">Patient</div>
        <div class="value"><strong>${patient?.name || ""}</strong> - ${patient?.phone || "-"}</div>
      </div>
      <div class="card">
        <div class="label">Test</div>
        <div class="value"><strong>${name}</strong><br/>Date: ${date || "-"}</div>
      </div>
      <div class="card">
        <div class="label">Result</div>
        <div class="value">${report?.result || "(Demo) Report preview not available."}</div>
      </div>
      <div class="no-print" style="margin-top:16px">
        <button onclick="window.print()" style="padding:10px 14px;background:#1d4ed8;color:white;border:none;border-radius:8px;cursor:pointer">Print / Save as PDF</button>
      </div>
    </body>
  </html>
  `.trim()
}

function openICUReport(icu, patient, plans, data, currentDoctor) {
  const w = window.open("", "_blank", "width=800,height=900")
  if (!w) return alert("Please allow popups")
  const planHtml = plans
    .map(
      (p) =>
        `<li><strong>${p.type}</strong> - ${formatPlanDescription(p)}<br/>
        <span style="color:#64748b;font-size:12px">Doctor: ${getPlanDoctorName(p, data, currentDoctor)} | ${new Date(p.createdAt).toLocaleString()}</span></li>`
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
