"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { getMedicineSuggestions } from "@/components/prescription/medicine-ai"
import PrescriptionPdfModal from "@/components/prescription/PrescriptionPdfModal"
import { buildPrescriptionPdfHtml } from "@/components/prescription/prescription-pdf"

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

export default function InpatientCareDetail({ admissionId, admissionType, backHref, label }) {
  const { auth, data, addItem, updateItem } = useStore()
  const router = useRouter()
  const collection = admissionType === "cabin" ? "cabinPatients" : "wardPatients"
  const admission =
    (data[collection] || []).find((item) => item.id === admissionId) || null
  const patient = admission ? data.patients.find((item) => item.id === admission.patientId) : null
  const hospital = admission ? data.hospitals.find((item) => item.id === admission.hospitalId) : null
  const bed = admission ? data.beds.find((item) => item.id === admission.bedId) : null
  const currentDoctor = data.doctors.find((doctor) => doctor.id === auth.userId)

  const [med, setMed] = useState(createMedicineSchedule())
  const [test, setTest] = useState(createTestSchedule())
  const [observation, setObservation] = useState("")
  const [vitals, setVitals] = useState(() => createVitalsForm(admission?.vitals))
  const [pdfOpen, setPdfOpen] = useState(false)
  const [pdfHtml, setPdfHtml] = useState("")

  useEffect(() => {
    setVitals(createVitalsForm(admission?.vitals))
  }, [admission])

  const plans = useMemo(() => {
    return (data.inpatientPlans || [])
      .filter((plan) => plan.admissionType === admissionType && plan.admissionId === admissionId)
      .sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")))
  }, [data.inpatientPlans, admissionId, admissionType])

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

  if (!admission || !patient) {
    return (
      <div className="text-slate-500">
        {label} patient not found.{" "}
        <button onClick={() => router.push(backHref)} className="text-blue-600 hover:underline">
          Back
        </button>
      </div>
    )
  }

  const basePlan = {
    admissionId,
    admissionType,
    patientId: patient.id,
    hospitalId: admission.hospitalId,
    doctorId: auth.userId,
    doctorName: currentDoctor?.name || auth.userId,
    createdAt: new Date().toISOString(),
  }

  const addMedicine = () => {
    if (!med.medicineLabel || !hasSelectedTiming(med)) return
    addItem("inpatientPlans", {
      ...basePlan,
      type: "medicine",
      ...med,
      name: med.medicineLabel,
      time: formatMedicineTiming(med),
    })
    setMed(createMedicineSchedule())
    alert("Medicine added to plan")
  }

  const addObservation = () => {
    if (!observation.trim()) return
    addItem("inpatientPlans", {
      ...basePlan,
      type: "observation",
      note: observation.trim(),
    })
    setObservation("")
  }

  const addTest = () => {
    if (!test.name.trim()) return
    addItem("inpatientPlans", {
      ...basePlan,
      type: "test",
      ...test,
      name: test.name.trim(),
    })
    setTest(createTestSchedule())
    alert("Test added to plan")
  }

  const saveVitals = () => {
    const nextVitals = {
      hr: toNumberOrNull(vitals.hr),
      bp: vitals.bp.trim(),
      spo2: toNumberOrNull(vitals.spo2),
      temp: toNumberOrNull(vitals.temp),
      rr: toNumberOrNull(vitals.rr),
      updatedAt: new Date().toISOString(),
      updatedBy: currentDoctor?.name || auth.userId,
    }
    const nextHistory = [...getVitalHistory(admission), nextVitals]
    updateItem(collection, admission.id, { vitals: nextVitals, vitalHistory: nextHistory })
    alert("Vitals saved")
  }

  const openPrescriptionPdf = (prescription) => {
    const prescriptionHospital =
      data.hospitals.find((item) => item.id === prescription.hospitalId) || hospital || data.hospitals[0]
    const prescriptionDoctor =
      data.doctors.find((doctor) => doctor.id === prescription.doctorId) || {
        name: prescription.doctorId || "Doctor",
      }
    setPdfHtml(buildPrescriptionPdfHtml({ hospital: prescriptionHospital, doctor: prescriptionDoctor, patient, prescription }))
    setPdfOpen(true)
  }

  const openReportPdf = (report) => {
    setPdfHtml(
      buildSimpleReportHtml({
        hospital: data.hospitals.find((item) => item.id === report.hospitalId) || hospital,
        patient,
        report,
      })
    )
    setPdfOpen(true)
  }

  const openRoundReport = () => {
    openInpatientReport({ admission, patient, hospital, bed, plans, data, label, currentDoctor })
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{patient.name}</h3>
            <p className="text-sm text-slate-500">
              {patient.phone} - {patient.age} yrs - {label} {bed?.wardName ? `${bed.wardName} ` : ""}
              {bed?.number || admission.bedNumber || admission.wardName || ""}
            </p>
          </div>
          <button
            onClick={openRoundReport}
            className="px-3 py-1.5 border border-slate-300 rounded-md text-sm hover:bg-slate-50"
          >
            {label} Report PDF
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h4 className="font-semibold text-slate-900">Manual Vitals Entry</h4>
            <p className="text-xs text-slate-500">Update the current ward or cabin vitals manually.</p>
          </div>
          <span className="text-xs text-slate-500">
            {admission.vitals?.updatedAt ? `Updated ${formatDateTime(admission.vitals.updatedAt)}` : "Not recorded yet"}
          </span>
        </div>
        <div className="grid md:grid-cols-5 gap-3">
          <InputField label="HR" type="number" value={vitals.hr} onChange={(value) => setVitals((prev) => ({ ...prev, hr: value }))} placeholder="78" />
          <InputField label="BP" value={vitals.bp} onChange={(value) => setVitals((prev) => ({ ...prev, bp: value }))} placeholder="120/80" />
          <InputField label="SpO2" type="number" value={vitals.spo2} onChange={(value) => setVitals((prev) => ({ ...prev, spo2: value }))} placeholder="97" />
          <InputField label="Temp" type="number" step="0.1" value={vitals.temp} onChange={(value) => setVitals((prev) => ({ ...prev, temp: value }))} placeholder="98.6" />
          <InputField label="RR" type="number" value={vitals.rr} onChange={(value) => setVitals((prev) => ({ ...prev, rr: value }))} placeholder="16" />
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={saveVitals} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            Save Vitals
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h4 className="font-semibold text-slate-900">Vitals History</h4>
            <p className="text-xs text-slate-500">Latest updates for this ward or cabin admission.</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 rounded-full px-2 py-1">{getVitalHistory(admission).length}</span>
        </div>
        {getVitalHistory(admission).length === 0 ? (
          <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-md p-3">No vitals recorded yet.</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-auto pr-1">
            {getVitalHistory(admission)
              .slice()
              .reverse()
              .map((entry, index) => (
                <div key={`${entry.updatedAt || index}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900">
                      {entry.updatedAt ? formatDateTime(entry.updatedAt) : "Initial entry"}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {entry.updatedBy || "Unknown"}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-slate-700">
                    <VitalsHistoryItem label="HR" value={formatVitalValue(entry.hr)} />
                    <VitalsHistoryItem label="BP" value={formatVitalValue(entry.bp)} />
                    <VitalsHistoryItem label="SpO2" value={formatVitalValue(entry.spo2, "%")} />
                    <VitalsHistoryItem label="Temp" value={formatVitalValue(entry.temp, "°F")} />
                    <VitalsHistoryItem label="RR" value={formatVitalValue(entry.rr, "/min")} />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3">Schedule Medicine / Injection</h4>
          <ICUMedicineSchedule row={med} patient={patient} onChange={(patch) => setMed((prev) => ({ ...prev, ...patch }))} />
          <button onClick={addMedicine} className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 mt-3">
            Add to Plan
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3">Add Observation</h4>
          <textarea
            rows={4}
            value={observation}
            onChange={(event) => setObservation(event.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            placeholder="Patient stable, monitoring..."
          />
          <button onClick={addObservation} className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 mt-2">
            Save Observation
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3">Add Test</h4>
          <ICUTestSchedule row={test} onChange={(patch) => setTest((prev) => ({ ...prev, ...patch }))} />
          <button onClick={addTest} className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 mt-3">
            Add Test to Plan
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h4 className="font-semibold text-slate-900 mb-3">
          {label} Plan & Activity ({plans.length})
        </h4>
        {plans.length === 0 ? (
          <p className="text-sm text-slate-500">No plan items yet.</p>
        ) : (
          <ul className="space-y-2">
            {plans
              .slice()
              .reverse()
              .map((plan) => (
                <li key={plan.id} className="text-sm bg-slate-50 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium uppercase text-xs text-slate-500">{plan.type}</span>
                    <span className="text-xs text-slate-400">{new Date(plan.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-900">{formatPlanDescription(plan)}</p>
                  <p className="text-xs text-slate-500 mt-1">Doctor: {getPlanDoctorName(plan, data, currentDoctor)}</p>
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <TestReportsPanel reports={patientReports} data={data} onOpenReport={openReportPdf} />
        <PrescriptionHistoryPanel prescriptions={patientPrescriptions} data={data} onOpenPrescription={openPrescriptionPdf} />
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
          <p className="text-xs text-slate-500 mt-0.5">Uploaded reports from all connected hospitals</p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-700 rounded-full px-2 py-1">{reports.length}</span>
      </div>
      <div className="mt-3 space-y-2 max-h-96 overflow-auto pr-1">
        {reports.length === 0 ? (
          <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-md p-3">No test reports uploaded.</p>
        ) : (
          reports.map((report) => {
            const reportHospital = data.hospitals.find((item) => item.id === report.hospitalId)
            return (
              <div key={report.id} className="bg-slate-50 border border-slate-200 rounded-md p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{report.name || "Test Report"}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {reportHospital?.name || report.hospitalId || "Hospital not specified"} - {formatDate(report.uploadedAt)}
                    </div>
                    {report.result ? <div className="text-xs text-slate-700 mt-2 line-clamp-2">{report.result}</div> : null}
                  </div>
                  <button type="button" onClick={() => onOpenReport(report)} className="shrink-0 px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-medium hover:bg-white">
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
          <p className="text-xs text-slate-500 mt-0.5">Complete prescription history for this patient</p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-700 rounded-full px-2 py-1">{prescriptions.length}</span>
      </div>
      <div className="mt-3 space-y-2 max-h-96 overflow-auto pr-1">
        {prescriptions.length === 0 ? (
          <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-md p-3">No prescriptions found.</p>
        ) : (
          prescriptions.map((prescription) => {
            const prescriber = data.doctors.find((doctor) => doctor.id === prescription.doctorId)
            const prescriptionHospital = data.hospitals.find((item) => item.id === prescription.hospitalId)
            return (
              <div key={prescription.id} className="bg-slate-50 border border-slate-200 rounded-md p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">
                      {formatDate(prescription.createdAt)} - {prescriptionHospital?.name || prescription.hospitalId || "Hospital"}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5 truncate">{diagnosisSummary(prescription)}</div>
                    <div className="text-xs text-slate-500 mt-1">Doctor: {prescriber?.name || prescription.doctorId || "Doctor"}</div>
                    <PrescriptionMedicineSummary prescription={prescription} />
                  </div>
                  <button type="button" onClick={() => onOpenPrescription(prescription)} className="shrink-0 px-2.5 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700">
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
  if (!medicines.length) return <div className="text-xs text-slate-500 mt-2">No medicines listed.</div>
  return (
    <div className="mt-2 space-y-1">
      {medicines.slice(0, 3).map((medicine) => (
        <div key={medicine.id || medicine.medicineLabel} className="text-xs text-slate-700">
          <span className="font-medium">{medicine.medicineLabel || "Medicine"}</span>
          <span className="text-slate-500">
            {" "}
            - {formatPrescriptionTiming(medicine)} - {medicine.durationDays ? `${medicine.durationDays} days` : "duration not set"} -{" "}
            {medicine.mealTiming || "meal timing not set"}
          </span>
        </div>
      ))}
      {medicines.length > 3 ? <div className="text-xs text-slate-500">+{medicines.length - 3} more medicine</div> : null}
    </div>
  )
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
        active ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
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

  useOutsideClose(open, inputRef, () => setOpen(false))

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
        <label className="text-[11px] text-slate-500 uppercase tracking-wide">Medicine Search</label>
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
            <div className="px-3 py-2 text-[11px] text-slate-500 border-b border-slate-200">Suggestions from medicine database</div>
            {suggestions.map((medicine) => (
              <button key={medicine.id} type="button" onClick={() => selectMedicine(medicine)} className="w-full text-left px-3 py-2 hover:bg-slate-50">
                <div className="text-sm font-medium text-slate-900">{medicine.brandName}</div>
                <div className="text-xs text-slate-600">
                  {medicine.genericName} - {medicine.strength} - {medicine.type}
                </div>
              </button>
            ))}
            {suggestions.length === 0 ? <div className="px-3 py-3 text-sm text-slate-500">No matches.</div> : null}
          </div>
        ) : null}
      </div>

      <div className="mt-3 grid gap-3">
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wide">Time</div>
          <div className="mt-1 flex gap-2 flex-wrap">
            <Toggle active={row.timing?.morning} onClick={() => onChange({ timing: { ...row.timing, morning: !row.timing?.morning } })}>
              Morning
            </Toggle>
            <Toggle active={row.timing?.noon} onClick={() => onChange({ timing: { ...row.timing, noon: !row.timing?.noon } })}>
              Noon
            </Toggle>
            <Toggle active={row.timing?.night} onClick={() => onChange({ timing: { ...row.timing, night: !row.timing?.night } })}>
              Night
            </Toggle>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">Meal Timing</div>
            <div className="mt-1 flex gap-2 flex-wrap">
              {["Before Meal", "After Meal", "Not Applicable"].map((option) => (
                <Toggle key={option} active={row.mealTiming === option} onClick={() => onChange({ mealTiming: option })}>
                  {option}
                </Toggle>
              ))}
            </div>
          </div>
          <label>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">Number of Days</div>
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

function ICUTestSchedule({ row, onChange }) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return COMMON_TESTS
    return COMMON_TESTS.filter((name) => name.toLowerCase().includes(normalized))
  }, [query])

  useOutsideClose(open, inputRef, () => setOpen(false))

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
            <div className="px-3 py-2 text-[11px] text-slate-500 border-b border-slate-200">Test suggestions</div>
            {suggestions.map((name) => (
              <button key={name} type="button" onClick={() => selectTest(name)} className="w-full text-left px-3 py-2 hover:bg-slate-50">
                <div className="text-sm font-medium text-slate-900">{name}</div>
                <div className="text-xs text-slate-600">Diagnostic test</div>
              </button>
            ))}
            {suggestions.length === 0 ? <div className="px-3 py-3 text-sm text-slate-500">No matches.</div> : null}
          </div>
        ) : null}
      </div>

      <div className="grid md:grid-cols-2 gap-2 mt-3">
        <MiniSelect label="Timing" value={row.timing} onChange={(value) => onChange({ timing: value })} options={["Today", "Tomorrow", "Next Visit"]} />
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
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function useOutsideClose(open, ref, onClose) {
  useEffect(() => {
    if (!open) return
    const onDoc = (event) => {
      if (!ref.current) return
      if (ref.current.contains(event.target)) return
      onClose()
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open, ref, onClose])
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
  const duration = medicine.durationDays ? `${medicine.durationDays} days` : medicine.repeatHours ? `every ${medicine.repeatHours}h` : "Duration not set"
  const mealTiming = medicine.mealTiming || "Not Applicable"
  return `${name} - ${timing} - ${duration} - ${mealTiming}`
}

function formatTestTaskDescription(test) {
  return `${test.name || "Test"} - ${test.timing || "Today"} - ${test.condition || "Mandatory"}`
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

function formatPrescriptionTiming(medicine) {
  if (medicine.useCustom && medicine.customTimesPerDay) return `${medicine.customTimesPerDay} times daily`
  return formatMedicineTiming(medicine) || "timing not set"
}

function formatDate(iso) {
  if (!iso) return "-"
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return "-"
  }
}

function formatDateTime(iso) {
  if (!iso) return "-"
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return "-"
  }
}

function createVitalsForm(vitals = {}) {
  return {
    hr: vitals.hr ?? "",
    bp: vitals.bp ?? "",
    spo2: vitals.spo2 ?? "",
    temp: vitals.temp ?? "",
    rr: vitals.rr ?? "",
  }
}

function toNumberOrNull(value) {
  if (value === "" || value === null || value === undefined) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function formatVitalValue(value, suffix = "") {
  if (value === null || value === undefined || value === "") return "Not recorded"
  return `${value}${suffix}`
}

function getVitalHistory(admission) {
  const history = Array.isArray(admission?.vitalHistory) ? admission.vitalHistory : []
  if (history.length) return history
  return admission?.vitals ? [admission.vitals] : []
}

function VitalsChip({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  )
}

function VitalsHistoryItem({ label, value }) {
  return (
    <div className="rounded-md bg-white border border-slate-200 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-0.5 font-medium text-slate-900">{value}</div>
    </div>
  )
}

function InputField({ label, value, onChange, type = "text", step, placeholder }) {
  return (
    <label className="block">
      <div className="text-[11px] text-slate-500 uppercase tracking-wide">{label}</div>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
      />
    </label>
  )
}

function diagnosisSummary(prescription) {
  return prescription?.diagnosis || prescription?.aiSuggestion || prescription?.symptoms || "-"
}

function buildSimpleReportHtml({ hospital, patient, report }) {
  const name = report?.name || "Report"
  const date = report?.uploadedAt ? formatDate(report.uploadedAt) : ""
  return `
  <html><head><title>${name}</title><meta charset="utf-8" />
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:28px;color:#0f172a}
    .header{border-bottom:2px solid #1d4ed8;padding-bottom:10px;margin-bottom:14px}
    h1{font-size:18px;margin:0;color:#1d4ed8}.sub{font-size:12px;color:#475569;margin-top:2px}
    .card{border:1px solid #cbd5e1;border-radius:10px;padding:10px;margin-top:10px}
    .label{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.04em}.value{font-size:13px;margin-top:4px}
    @media print{.no-print{display:none}}
  </style></head><body>
    <div class="header"><h1>${hospital?.name || "Hospital"}</h1><div class="sub">Test report - Powered by MediCare HMS</div></div>
    <div class="card"><div class="label">Patient</div><div class="value"><strong>${patient?.name || ""}</strong> - ${patient?.phone || "-"}</div></div>
    <div class="card"><div class="label">Test</div><div class="value"><strong>${name}</strong><br/>Date: ${date || "-"}</div></div>
    <div class="card"><div class="label">Result</div><div class="value">${report?.result || "(Demo) Report preview not available."}</div></div>
    <div class="no-print" style="margin-top:16px"><button onclick="window.print()" style="padding:10px 14px;background:#1d4ed8;color:white;border:none;border-radius:8px;cursor:pointer">Print / Save as PDF</button></div>
  </body></html>`.trim()
}

function openInpatientReport({ admission, patient, hospital, bed, plans, data, label, currentDoctor }) {
  const w = window.open("", "_blank", "width=800,height=900")
  if (!w) return alert("Please allow popups")
  const planHtml = plans
    .map(
      (plan) =>
        `<li><strong>${plan.type}</strong> - ${formatPlanDescription(plan)}<br/>
        <span style="color:#64748b;font-size:12px">Doctor: ${getPlanDoctorName(plan, data, currentDoctor)} | ${new Date(plan.createdAt).toLocaleString()}</span></li>`
    )
    .join("")
  w.document.write(`
    <html><head><title>${label} Report</title>
    <style>
      body{font-family:system-ui;padding:40px;color:#0f172a}
      h1{color:#1d4ed8;margin:0 0 4px}.header{border-bottom:2px solid #1d4ed8;padding-bottom:12px;margin-bottom:20px}
      .label{color:#64748b;font-size:12px;text-transform:uppercase}.section{margin:16px 0}
    </style></head><body>
      <div class="header"><h1>MediCare HMS - ${label} Report</h1><p>Generated ${new Date().toLocaleString()}</p></div>
      <div class="section"><p class="label">Patient</p><p><strong>${patient.name}</strong> | ${patient.phone} | ${patient.age} yrs</p></div>
      <div class="section"><p class="label">${label}</p><p>${hospital?.name || admission.hospitalId || "Hospital"} | ${bed?.wardName ? `${bed.wardName} ` : ""}${bed?.number || admission.wardName || ""}</p></div>
      <div class="section"><p class="label">Vitals</p><p>${formatVitalsForReport(admission.vitals)}</p></div>
      <div class="section"><p class="label">Care Plan & Observations</p><ul>${planHtml || "<li>None</li>"}</ul></div>
      <button onclick="window.print()" style="margin-top:20px;padding:10px 20px;background:#1d4ed8;color:white;border:none;border-radius:6px;cursor:pointer">Print / Save as PDF</button>
    </body></html>
  `)
  w.document.close()
}

function formatVitalsForReport(vitals) {
  if (!vitals) return "Not recorded"
  const items = [
    ["HR", vitals.hr, "bpm"],
    ["BP", vitals.bp, ""],
    ["SpO2", vitals.spo2, "%"],
    ["Temp", vitals.temp, "°F"],
    ["RR", vitals.rr, "/min"],
  ]
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([label, value, suffix]) => `${label}: ${value}${suffix}`)
  return items.length ? items.join(" | ") : "Not recorded"
}
