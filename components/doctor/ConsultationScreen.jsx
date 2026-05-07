"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { getDoctorById } from "@/data/doctors"
import { getPatientById } from "@/data/patients"
import PatientDetailsPanel from "@/components/patient/PatientDetailsPanel"
import PrescriptionComposer from "@/components/prescription/PrescriptionComposer"
import PrescriptionPdfModal from "@/components/prescription/PrescriptionPdfModal"
import { buildPrescriptionPdfHtml } from "@/components/prescription/prescription-pdf"

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return ""
  }
}

function diagnosisSummary(p) {
  return p?.diagnosis || p?.aiSuggestion || p?.symptoms || "—"
}

export default function ConsultationScreen({ appointmentId }) {
  const { data, auth, addItem, updateItem } = useStore()
  const router = useRouter()

  const params = useParams()
  const resolvedAppointmentId = useMemo(() => {
    if (appointmentId) return appointmentId
    const raw = params?.id
    if (Array.isArray(raw)) return raw[0]
    return raw || ""
  }, [appointmentId, params])

  const appointment = data.appointments.find((a) => a.id === resolvedAppointmentId)
  const hospital = appointment ? data.hospitals.find((h) => h.id === appointment.hospitalId) : null

  const storeDoctor = data.doctors.find((d) => d.id === auth.userId)
  const doctor = { ...storeDoctor, ...(getDoctorById(auth.userId) || {}) }

  const storePatient = appointment ? data.patients.find((p) => p.id === appointment.patientId) : null
  const patient = storePatient ? { ...storePatient, ...(getPatientById(storePatient.id) || {}) } : null

  const [composer, setComposer] = useState(null)

  const [pdfOpen, setPdfOpen] = useState(false)
  const [pdfHtml, setPdfHtml] = useState("")

  const [saveBanner, setSaveBanner] = useState("")

  const [viewOpen, setViewOpen] = useState(false)
  const [viewPrescription, setViewPrescription] = useState(null)

  useEffect(() => {
    if (!appointment) return
    if (appointment.status === "Scheduled" || appointment.status === "Waiting") {
      updateItem("appointments", appointment.id, { status: "In Progress" })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedAppointmentId])

  const prescriptionsForHospital = useMemo(() => {
    if (!patient || !appointment) return []
    return (data.prescriptions || [])
      .filter((p) => p.patientId === patient.id)
      .filter((p) => (appointment.hospitalId ? !p.hospitalId || p.hospitalId === appointment.hospitalId : true))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
  }, [data.prescriptions, patient, appointment])

  const privateNotes = useMemo(() => {
    if (!patient || !appointment) return []
    return (data.privateDoctorNotes || [])
      .filter((n) => n.patientId === patient.id)
      .filter((n) => n.doctorId === auth.userId)
      .filter((n) => (appointment.hospitalId ? n.hospitalId === appointment.hospitalId : true))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
  }, [data.privateDoctorNotes, patient, appointment, auth.userId])

  const reports = useMemo(() => {
    if (!patient) return []
    return (data.reports || [])
      .filter((r) => r.patientId === patient.id)
      .sort((a, b) => String(b.uploadedAt || "").localeCompare(String(a.uploadedAt || "")))
  }, [data.reports, patient])

  if (!appointment || !patient) {
    return (
      <div className="text-slate-500">
        Appointment not found. {" "}
        <button onClick={() => router.push("/doctor")} className="text-blue-600 hover:underline">
          Back to dashboard
        </button>
      </div>
    )
  }

  const pdfHospital = useMemo(() => {
    if (hospital) return hospital
    const fallback = (data.hospitals || [])[0]
    return fallback || { name: appointment?.hospitalId || "Hospital" }
  }, [hospital, data.hospitals, appointment?.hospitalId])

  const openPdfForPrescription = (p) => {
    const html = buildPrescriptionPdfHtml({ hospital: pdfHospital, doctor, patient, prescription: p })
    setPdfHtml(html)
    setPdfOpen(true)
  }

  const savePrescription = () => {
    if (!composer) return

    const diagnosis = String(composer.diagnosis || "").trim()
    const hasVitals = Object.values(composer.vitals || {}).some((v) => String(v || "").trim())

    const advice = composer.advice || {}
    const adviceObj = {
      patientSuggestions: String(advice.patientSuggestions || "").trim(),
      foodAdvice: String(advice.foodAdvice || "").trim(),
      followUp: String(advice.followUp || "").trim(),
    }
    const hasAdvice = Object.values(adviceObj).some(Boolean)

    const newPrescription = {
      hospitalId: appointment.hospitalId,
      patientId: patient.id,
      doctorId: auth.userId,
      appointmentId: appointment.id,
      createdAt: new Date().toISOString(),
      symptoms: composer.symptoms,
      ...(diagnosis ? { diagnosis } : {}),
      ...(hasVitals ? { vitals: composer.vitals } : {}),
      medicines: composer.medicines,
      tests: composer.tests,
      ...(hasAdvice ? { advice: adviceObj } : {}),
      ai: composer.ai,
    }

    addItem("prescriptions", newPrescription)

    if (composer.privateNote?.trim()) {
      addItem("privateDoctorNotes", {
        hospitalId: appointment.hospitalId,
        patientId: patient.id,
        doctorId: auth.userId,
        createdAt: new Date().toISOString(),
        note: composer.privateNote.trim(),
      })
    }

    setSaveBanner("Prescription saved")
    setTimeout(() => setSaveBanner(""), 2000)
  }

  const printPrescription = () => {
    if (!composer) return
    const diagnosis = String(composer.diagnosis || "").trim()
    const hasVitals = Object.values(composer.vitals || {}).some((v) => String(v || "").trim())

    const advice = composer.advice || {}
    const adviceObj = {
      patientSuggestions: String(advice.patientSuggestions || "").trim(),
      foodAdvice: String(advice.foodAdvice || "").trim(),
      followUp: String(advice.followUp || "").trim(),
    }
    const hasAdvice = Object.values(adviceObj).some(Boolean)

    const p = {
      hospitalId: appointment.hospitalId,
      patientId: patient.id,
      doctorId: auth.userId,
      appointmentId: appointment.id,
      createdAt: new Date().toISOString(),
      symptoms: composer.symptoms,
      ...(diagnosis ? { diagnosis } : {}),
      ...(hasVitals ? { vitals: composer.vitals } : {}),
      medicines: composer.medicines,
      tests: composer.tests,
      ...(hasAdvice ? { advice: adviceObj } : {}),
    }

    openPdfForPrescription(p)
  }

  const completeConsultation = () => {
    updateItem("appointments", appointment.id, { status: "Completed" })
    router.push("/doctor")
  }

  const updatePatient = (patch) => {
    updateItem("patients", patient.id, patch)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">Consultation</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Hospital: <span className="font-medium text-slate-700">{hospital?.name || appointment.hospitalId}</span> •
              Appointment: <span className="font-mono">{appointment.time}</span> •
              Status: <span className="font-medium">{appointment.status === "Scheduled" ? "Waiting" : appointment.status}</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Doctor: <span className="font-medium text-slate-700">{doctor?.name || "—"}</span>
          </div>
        </div>
      </div>

      {saveBanner ? (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md px-4 py-2 text-sm">
          {saveBanner}
        </div>
      ) : null}

      <div className="grid lg:grid-cols-2 gap-4">
        {/* LEFT */}
        <div className="space-y-4">
          <PatientDetailsPanel patient={patient} onUpdatePatient={updatePatient} />

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Private Doctor Notes</div>
                <div className="text-xs text-slate-500">Only visible to you (not in PDF)</div>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {privateNotes.length === 0 ? (
                <div className="text-sm text-slate-500">No private notes yet.</div>
              ) : (
                privateNotes.slice(0, 6).map((n) => (
                  <div key={n.id} className="bg-slate-50 border border-slate-200 rounded-md p-3">
                    <div className="text-xs text-slate-500">{formatDate(n.createdAt)}</div>
                    <div className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">{n.note}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-slate-900">Prescription History (this hospital)</div>
            <div className="text-xs text-slate-500 mt-0.5">Doctor can view all prescriptions from this hospital.</div>
            <div className="mt-3 space-y-2">
              {prescriptionsForHospital.length === 0 ? (
                <div className="text-sm text-slate-500">No prescriptions found.</div>
              ) : (
                prescriptionsForHospital.slice(0, 8).map((p) => {
                  const prescriber = data.doctors.find((d) => d.id === p.doctorId)
                  return (
                    <div key={p.id} className="bg-slate-50 border border-slate-200 rounded-md p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs text-slate-500">{formatDate(p.createdAt)}</div>
                          <div className="text-sm font-semibold text-slate-900 mt-0.5">{diagnosisSummary(p)}</div>
                          <div className="text-xs text-slate-500 mt-1">Doctor: {prescriber?.name || p.doctorId}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setViewPrescription(p)
                              setViewOpen(true)
                            }}
                            className="px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-medium hover:bg-slate-50"
                          >
                            View Full Prescription
                          </button>
                          <button
                            onClick={() => openPdfForPrescription(p)}
                            className="px-2.5 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
                          >
                            Open PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-slate-900">Test Report History</div>
            <div className="text-xs text-slate-500 mt-0.5">Reports from current hospital and other hospitals.</div>
            <div className="mt-3 space-y-2">
              {reports.length === 0 ? (
                <div className="text-sm text-slate-500">No reports uploaded.</div>
              ) : (
                reports.slice(0, 8).map((r) => (
                  <div key={r.id} className="bg-slate-50 border border-slate-200 rounded-md p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{r.name}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          Hospital: {data.hospitals.find((h) => h.id === r.hospitalId)?.name || r.hospitalId || "—"} • Date: {formatDate(r.uploadedAt)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            const html = buildSimpleReportHtml({ hospital: data.hospitals.find((h) => h.id === r.hospitalId), patient, report: r })
                            setPdfHtml(html)
                            setPdfOpen(true)
                          }}
                          className="px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-medium hover:bg-slate-50"
                        >
                          View Report
                        </button>
                        <button
                          onClick={() => {
                            const html = buildSimpleReportHtml({ hospital: data.hospitals.find((h) => h.id === r.hospitalId), patient, report: r })
                            setPdfHtml(html)
                            setPdfOpen(true)
                          }}
                          className="px-2.5 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
                        >
                          Open PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <PrescriptionComposer patient={patient} onChange={setComposer} />

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={savePrescription}
              className="flex-1 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              Save Prescription
            </button>
            <button
              onClick={printPrescription}
              className="px-4 py-3 border border-slate-300 rounded-md font-medium hover:bg-slate-50"
            >
              Print Prescription
            </button>
            <button
              onClick={completeConsultation}
              className="px-4 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
            >
              Complete
            </button>
          </div>
        </div>
      </div>

      <PrescriptionPdfModal open={pdfOpen} onClose={() => setPdfOpen(false)} html={pdfHtml} />

      <PrescriptionViewDrawer
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        prescription={viewPrescription}
        doctorLookup={(id) => data.doctors.find((d) => d.id === id) || null}
        hospital={hospital}
        onOpenPdf={() => viewPrescription && openPdfForPrescription(viewPrescription)}
      />
    </div>
  )
}

function PrescriptionViewDrawer({ open, onClose, prescription, doctorLookup, hospital, onOpenPdf }) {
  if (!open) return null
  const doctor = prescription?.doctorId ? doctorLookup(prescription.doctorId) : null

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-xl bg-white border-l border-slate-200 shadow-sm overflow-auto">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Full Prescription</div>
            <div className="text-xs text-slate-500">{hospital?.name || prescription?.hospitalId || "—"}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onOpenPdf}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
            >
              Open PDF
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 rounded-md text-xs font-medium hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <Row label="Date" value={formatDate(prescription?.createdAt)} />
          <Row label="Doctor" value={doctor?.name || prescription?.doctorId || "—"} />
          <Row label="Symptoms" value={prescription?.symptoms || "—"} />
          <Row label="Diagnosis" value={prescription?.diagnosis || "—"} />

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
            <div className="text-xs font-semibold text-slate-900">Vitals</div>
            <div className="mt-2 text-sm text-slate-700">
              Temp: {prescription?.vitals?.temp || "—"} • BP: {prescription?.vitals?.bp || "—"} • Pulse: {prescription?.vitals?.pulse || "—"}
              <br />
              SpO2: {prescription?.vitals?.spo2 || "—"} • Sugar: {prescription?.vitals?.sugar || "—"}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
            <div className="text-xs font-semibold text-slate-900">Medicines</div>
            <div className="mt-2 space-y-2">
              {(prescription?.medicines || []).length === 0 ? (
                <div className="text-sm text-slate-500">No medicines.</div>
              ) : (
                (prescription?.medicines || []).map((m) => (
                  <div key={m.id} className="text-sm">
                    <div className="font-medium text-slate-900">{m.medicineLabel || "—"}</div>
                    <div className="text-xs text-slate-600">
                      Meal: {m.mealTiming || "—"} • Duration: {m.durationDays ? `${m.durationDays} days` : "—"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
            <div className="text-xs font-semibold text-slate-900">Tests</div>
            <div className="mt-2 text-sm text-slate-700">
              {(prescription?.tests || []).length === 0 ? (
                <div className="text-sm text-slate-500">No tests.</div>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {(prescription?.tests || []).map((t) => (
                    <li key={t.id}>
                      {t.name} {t.timing ? `— ${t.timing}` : ""} {t.condition ? `(${t.condition})` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
            <div className="text-xs font-semibold text-slate-900">Doctor Suggestions</div>
            <div className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
              <div>
                <span className="text-xs text-slate-500">Patient:</span> {prescription?.advice?.patientSuggestions || "—"}
              </div>
              <div className="mt-1">
                <span className="text-xs text-slate-500">Food:</span> {prescription?.advice?.foodAdvice || "—"}
              </div>
              <div className="mt-1">
                <span className="text-xs text-slate-500">Follow-up:</span> {prescription?.advice?.followUp || "—"}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">Private doctor notes are not shown here.</div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-[11px] text-slate-500 uppercase tracking-wide">{label}</div>
      <div className="text-sm text-slate-900 text-right whitespace-pre-wrap">{value}</div>
    </div>
  )
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
        <div class="sub">Test report • Powered by MediCare HMS</div>
      </div>
      <div class="card">
        <div class="label">Patient</div>
        <div class="value"><strong>${patient?.name || ""}</strong> • ${patient?.phone || "—"}</div>
      </div>
      <div class="card">
        <div class="label">Test</div>
        <div class="value"><strong>${name}</strong><br/>Date: ${date || "—"}</div>
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
