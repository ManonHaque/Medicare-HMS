function esc(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return ""
  }
}

function timingLabel(m) {
  if (m?.useCustom) {
    return m?.customTimesPerDay ? `${m.customTimesPerDay}x/day` : "Custom"
  }
  const mor = m?.timing?.morning ? 1 : 0
  const noon = m?.timing?.noon ? 1 : 0
  const night = m?.timing?.night ? 1 : 0
  return `${mor}-${noon}-${night}`
}

export function buildPrescriptionPdfHtml({ hospital, doctor, patient, prescription }) {
  const meds = prescription?.medicines || []
  const tests = prescription?.tests || []

  const diagnosis = String(prescription?.diagnosis || "").trim()
  const advice = prescription?.advice || {}
  const patientAdvice = String(advice.patientSuggestions || "").trim()
  const foodAdvice = String(advice.foodAdvice || "").trim()
  const followUp = String(advice.followUp || "").trim()
  const hasAdvice = !!(patientAdvice || foodAdvice || followUp)

  const medsHtml = meds
    .map((m) => {
      const name = m?.medicineLabel || "—"
      return `<tr>
        <td>${esc(name)}</td>
        <td>${esc(timingLabel(m))}</td>
        <td>${esc(m?.mealTiming || "—")}</td>
        <td>${esc(m?.durationDays ? `${m.durationDays} days` : "—")}</td>
      </tr>`
    })
    .join("")

  const testsHtml = tests
    .map((t) => `<li>${esc(t?.name)}${t?.timing ? ` — ${esc(t.timing)}` : ""}${t?.condition ? ` (${esc(t.condition)})` : ""}</li>`)
    .join("")

  const vitals = prescription?.vitals || {}
  const hasVitals = Object.values(vitals || {}).some((v) => String(v || "").trim())

  return `
  <html>
    <head>
      <title>Prescription</title>
      <meta charset="utf-8" />
      <style>
        body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:28px;color:#0f172a}
        .header{border-bottom:2px solid #1d4ed8;padding-bottom:10px;margin-bottom:14px}
        h1{font-size:18px;margin:0;color:#1d4ed8}
        .sub{font-size:12px;color:#475569;margin-top:2px}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .card{border:1px solid #cbd5e1;border-radius:10px;padding:10px}
        .label{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.04em}
        .value{font-size:13px;margin-top:4px}
        table{width:100%;border-collapse:collapse;margin-top:8px}
        th,td{border:1px solid #cbd5e1;padding:8px;text-align:left;font-size:12px}
        th{background:#f1f5f9}
        .section{margin-top:12px}
        .title{font-size:13px;font-weight:700;margin:0 0 6px}
        .muted{color:#64748b}
        @media print{.no-print{display:none}}
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${esc(hospital?.name || "Hospital")}</h1>
        <div class="sub">
          Doctor: <strong>${esc(doctor?.name || "")}</strong>${doctor?.specialty ? ` • ${esc(doctor.specialty)}` : ""}
          <span class="muted"> • Powered by MediCare HMS</span>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <div class="label">Patient Info</div>
          <div class="value">
            <strong>${esc(patient?.name)}</strong><br/>
            Age: ${esc(patient?.age ?? "—")} • Gender: ${esc(patient?.gender || "—")}<br/>
            Phone: ${esc(patient?.phone || "—")}<br/>
            Date: ${esc(formatDate(prescription?.createdAt || new Date().toISOString()))}
          </div>
        </div>
        <div class="card">
          <div class="label">Vitals</div>
          <div class="value">
            ${
              hasVitals
                ? `Temp: ${esc(vitals?.temp || "—")} • BP: ${esc(vitals?.bp || "—")}<br/>
            Pulse: ${esc(vitals?.pulse || "—")} • SpO2: ${esc(vitals?.spo2 || "—")}<br/>
            Sugar: ${esc(vitals?.sugar || "—")}`
                : `<span class="muted">Not recorded</span>`
            }
          </div>
        </div>
      </div>

      <div class="section">
        <p class="title">Clinical</p>
        <div class="card">
          <div class="label">Symptoms</div>
          <div class="value">${esc(prescription?.symptoms || "—")}</div>
          ${
            diagnosis
              ? `<div style="height:8px"></div>
          <div class="label">Diagnosis</div>
          <div class="value">${esc(diagnosis)}</div>`
              : ""
          }
        </div>
      </div>

      <div class="section">
        <p class="title">Medicines</p>
        <table>
          <thead><tr><th>Medicine</th><th>Timing</th><th>Meal</th><th>Duration</th></tr></thead>
          <tbody>${medsHtml || '<tr><td colspan="4" class="muted">No medicines</td></tr>'}</tbody>
        </table>
      </div>

      <div class="section">
        <p class="title">Tests</p>
        <div class="card">
          <ul style="margin:0;padding-left:18px">${testsHtml || "<li class=\"muted\">No tests</li>"}</ul>
        </div>
      </div>

      <div class="section">
        <p class="title">Doctor Suggestions</p>
        <div class="card">
          ${
            hasAdvice
              ? `${
                  patientAdvice
                    ? `<div class="label">Patient Advice</div><div class="value">${esc(patientAdvice)}</div>`
                    : ""
                }
                ${foodAdvice ? `<div style="height:8px"></div><div class="label">Food Advice</div><div class="value">${esc(foodAdvice)}</div>` : ""}
                ${followUp ? `<div style="height:8px"></div><div class="label">Follow-up</div><div class="value">${esc(followUp)}</div>` : ""}`
              : `<div class="value muted">—</div>`
          }
        </div>
      </div>

      <div class="no-print" style="margin-top:16px;display:flex;gap:8px">
        <button onclick="window.print()" style="padding:10px 14px;background:#1d4ed8;color:white;border:none;border-radius:8px;cursor:pointer">Print / Save as PDF</button>
        <button onclick="window.close()" style="padding:10px 14px;background:white;color:#0f172a;border:1px solid #cbd5e1;border-radius:8px;cursor:pointer">Close</button>
      </div>
    </body>
  </html>
  `.trim()
}
