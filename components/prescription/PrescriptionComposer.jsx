"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { getMedicineSuggestions, getSymptomProfile } from "@/components/prescription/medicine-ai"

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

const VITAL_OPTIONS = {
  temp: ["", "36.5 C", "36.8 C", "37.0 C", "37.5 C", "38.0 C", "38.5 C", "39.0 C"],
  bp: ["", "110/70", "120/80", "130/80", "140/90", "150/90", "160/100"],
  pulse: ["", "60", "72", "80", "90", "100", "110", "120"],
  spo2: ["", "100%", "99%", "98%", "97%", "96%", "95%", "92%", "90%"],
  sugar: [
    "",
    "FBS 5.5 mmol/L",
    "RBS 7.8 mmol/L",
    "RBS 11.1 mmol/L",
    "2 hrs PP 7.8 mmol/L",
    "Random 10.0 mmol/L",
  ],
}

const FOLLOW_UP_OPTIONS = [
  { value: "", label: "— Select follow-up —" },
  { value: "After 2 days", label: "After 2 days" },
  { value: "After 3 days", label: "After 3 days" },
  { value: "After 5 days", label: "After 5 days" },
  { value: "After 7 days", label: "After 7 days" },
  { value: "After 14 days", label: "After 14 days" },
  { value: "After 1 month", label: "After 1 month" },
  { value: "As needed", label: "As needed" },
]

function uid(prefix = "x") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
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

export default function PrescriptionComposer({ patient, initialSymptoms = "", onChange }) {
  const [symptoms, setSymptoms] = useState(initialSymptoms)
  const symptomProfile = useMemo(() => getSymptomProfile(symptoms), [symptoms])

  const [diagnosis, setDiagnosis] = useState("")

  const [vitals, setVitals] = useState({ temp: "", bp: "", pulse: "", spo2: "", sugar: "" })

  const [questionChecks, setQuestionChecks] = useState({})

  const [medicines, setMedicines] = useState([])
  const [tests, setTests] = useState([])

  const [advice, setAdvice] = useState({ patientSuggestions: "", foodAdvice: "", followUp: "" })
  const [privateNote, setPrivateNote] = useState("")

  useEffect(() => {
    onChange?.({ symptoms, diagnosis, vitals, medicines, tests, advice, privateNote, ai: symptomProfile })
  }, [symptoms, diagnosis, vitals, medicines, tests, advice, privateNote, symptomProfile, onChange])

  useEffect(() => {
    setSymptoms((s) => (s ? s : initialSymptoms))
  }, [initialSymptoms])

  const addMedicine = () => {
    const auto = autoScheduleForSymptoms(symptomProfile)

    setMedicines((prev) => [
      ...prev,
      {
        id: uid("med"),
        medicineId: "",
        medicineLabel: "",
        timing: auto.timing,
        useCustom: false,
        customTimesPerDay: "",
        mealTiming: auto.mealTiming,
        durationDays: auto.durationDays,
      },
    ])
  }

  const updateMedicine = (id, patch) => {
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }

  const removeMedicine = (id) => setMedicines((prev) => prev.filter((m) => m.id !== id))

  const addTest = () => {
    setTests((prev) => [
      ...prev,
      {
        id: uid("test"),
        name: "",
        timing: "Today",
        condition: "Mandatory",
      },
    ])
  }

  const updateTest = (id, patch) => setTests((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))

  const removeTest = (id) => setTests((prev) => prev.filter((t) => t.id !== id))

  const testSuggestions = useMemo(() => {
    const fromAi = symptomProfile?.tests || []
    const base = COMMON_TESTS
    return Array.from(new Set([...fromAi, ...base])).slice(0, 10)
  }, [symptomProfile])

  return (
    <div className="space-y-3">
      <Section title="Symptoms">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Fever, cough, chest pain..."
        />
      </Section>

      <Section title="AI Assist" subtle>
        {symptoms.trim().length < 3 ? (
          <div className="text-sm text-slate-500">Enter symptoms to see assistive suggestions.</div>
        ) : (
          <div className="grid gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="text-xs font-semibold text-blue-900">Possible diagnosis (assist only)</div>
              <ul className="mt-2 space-y-1 text-sm text-blue-900 list-disc pl-5">
                {(symptomProfile?.diagnoses || ["General consultation"]).map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <div className="text-[11px] text-blue-700 mt-2">Doctor must confirm</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-md p-3">
              <div className="text-xs font-semibold text-slate-900">AI suggested questions</div>
              <div className="mt-2 grid gap-2">
                {(symptomProfile?.questions || []).map((q) => (
                  <label key={q} className="flex items-start gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={!!questionChecks[q]}
                      onChange={(e) => setQuestionChecks((p) => ({ ...p, [q]: e.target.checked }))}
                      className="mt-1"
                    />
                    <span>{q}</span>
                  </label>
                ))}
                {(symptomProfile?.questions || []).length === 0 ? (
                  <div className="text-sm text-slate-500">No checklist available for these symptoms.</div>
                ) : null}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-md p-3">
              <div className="text-xs font-semibold text-slate-900">Possible medicine suggestions</div>
              <div className="mt-2 text-sm text-slate-700">
                {renderAiMedicineSuggestions({ symptoms, patient })}
              </div>
            </div>
          </div>
        )}
      </Section>

      <Section title="Diagnosis">
        <input
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Doctor confirmed diagnosis (required for realism)"
        />
      </Section>

      <Section title="Vitals">
        <div className="grid grid-cols-2 gap-2">
          <MiniSelect
            label="Temperature"
            value={vitals.temp}
            onChange={(v) => setVitals((p) => ({ ...p, temp: v }))}
            options={VITAL_OPTIONS.temp.map((x) => ({ value: x, label: x || "—" }))}
          />
          <MiniSelect
            label="Blood Pressure"
            value={vitals.bp}
            onChange={(v) => setVitals((p) => ({ ...p, bp: v }))}
            options={VITAL_OPTIONS.bp.map((x) => ({ value: x, label: x || "—" }))}
          />
          <MiniSelect
            label="Pulse"
            value={vitals.pulse}
            onChange={(v) => setVitals((p) => ({ ...p, pulse: v }))}
            options={VITAL_OPTIONS.pulse.map((x) => ({ value: x, label: x ? `${x} bpm` : "—" }))}
          />
          <MiniSelect
            label="SpO2"
            value={vitals.spo2}
            onChange={(v) => setVitals((p) => ({ ...p, spo2: v }))}
            options={VITAL_OPTIONS.spo2.map((x) => ({ value: x, label: x || "—" }))}
          />
          <MiniSelect
            label="Sugar"
            value={vitals.sugar}
            onChange={(v) => setVitals((p) => ({ ...p, sugar: v }))}
            options={VITAL_OPTIONS.sugar.map((x) => ({ value: x, label: x || "—" }))}
            className="col-span-2"
          />
        </div>
      </Section>

      <Section title="Medicines">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">Use shared medicine database suggestions.</div>
          <button
            type="button"
            onClick={addMedicine}
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Another Medicine
          </button>
        </div>

        {medicines.length === 0 ? (
          <div className="mt-3 text-sm text-slate-500">No medicines added.</div>
        ) : (
          <div className="mt-3 space-y-3">
            {medicines.map((m) => (
              <MedicineRow
                key={m.id}
                row={m}
                patient={patient}
                symptoms={symptoms}
                onChange={(patch) => updateMedicine(m.id, patch)}
                onRemove={() => removeMedicine(m.id)}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="Tests">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">AI suggests tests; doctor can edit.</div>
          <button
            type="button"
            onClick={addTest}
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Test
          </button>
        </div>

        {tests.length === 0 ? (
          <div className="mt-3 text-sm text-slate-500">No tests added.</div>
        ) : (
          <div className="mt-3 space-y-2">
            {tests.map((t) => (
              <div key={t.id} className="bg-slate-50 border border-slate-200 rounded-md p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <label className="text-[11px] text-slate-500 uppercase tracking-wide">Test name</label>
                    <input
                      value={t.name}
                      onChange={(e) => updateTest(t.id, { name: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                      list={`tests-${t.id}`}
                      placeholder="Search tests..."
                    />
                    <datalist id={`tests-${t.id}`}>
                      {testSuggestions.map((n) => (
                        <option key={n} value={n} />
                      ))}
                    </datalist>
                  </div>
                  <MiniSelect
                    label="Timing"
                    value={t.timing}
                    onChange={(v) => updateTest(t.id, { timing: v })}
                    options={["Today", "Tomorrow", "Next Visit"]}
                  />
                  <MiniSelect
                    label="Condition"
                    value={t.condition}
                    onChange={(v) => updateTest(t.id, { condition: v })}
                    options={["Mandatory", "If not improved", "If symptoms worsen"]}
                  />
                </div>
                <div className="mt-2 text-right">
                  <button type="button" onClick={() => removeTest(t.id)} className="text-xs text-red-700 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Notes">
        <div className="grid gap-2">
          <SmallTextarea
            label="Patient Suggestions"
            value={advice.patientSuggestions}
            onChange={(v) => setAdvice((p) => ({ ...p, patientSuggestions: v }))}
            placeholder="e.g. Rest, hydration"
          />
          <SmallTextarea
            label="Food Advice"
            value={advice.foodAdvice}
            onChange={(v) => setAdvice((p) => ({ ...p, foodAdvice: v }))}
            placeholder="e.g. Avoid oily/spicy foods"
          />
          <label>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">Follow-up</div>
            <select
              value={advice.followUp}
              onChange={(e) => setAdvice((p) => ({ ...p, followUp: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
            >
              {FOLLOW_UP_OPTIONS.map((o) => (
                <option key={o.value || "__empty"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Section>

      <Section title="Private Doctor Notes" subtle>
        <div className="text-xs text-slate-500 mb-2">Not shown in prescription PDF. Visible only to you later.</div>
        <textarea
          value={privateNote}
          onChange={(e) => setPrivateNote(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
          placeholder="Follow-up reminders, differential, personal notes..."
        />
      </Section>
    </div>
  )
}

function renderAiMedicineSuggestions({ symptoms, patient }) {
  const list = getMedicineSuggestions({ symptoms, patient, query: "", limit: 4 })
  if (!list.length) return <span className="text-slate-500">No suggestions.</span>
  return (
    <ul className="list-disc pl-5 space-y-1">
      {list.map((m) => (
        <li key={m.id}>
          <span className="font-medium">{m.brandName}</span> <span className="text-slate-600">({m.genericName})</span>
        </li>
      ))}
    </ul>
  )
}

function autoScheduleForSymptoms(symptomProfile) {
  const f = symptomProfile?.flags || {}

  if (f.fever) {
    return { timing: { morning: true, noon: true, night: true }, mealTiming: "After Meal", durationDays: 5 }
  }

  if (f.acidity) {
    return { timing: { morning: true, noon: false, night: false }, mealTiming: "Before Meal", durationDays: 14 }
  }

  return { timing: { morning: true, noon: false, night: true }, mealTiming: "After Meal", durationDays: 7 }
}

function MedicineRow({ row, patient, symptoms, onChange, onRemove }) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)

  const suggestions = useMemo(() => {
    const q = open ? query : ""
    return getMedicineSuggestions({ query: q, symptoms, patient, limit: 8 })
  }, [query, symptoms, patient, open])

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (!inputRef.current) return
      if (inputRef.current.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  const select = (m) => {
    onChange({
      medicineId: m.id,
      medicineLabel: `${m.brandName} — ${m.genericName} (${m.strength} ${m.type})`,
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
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            onChange({ medicineLabel: e.target.value, medicineId: "" })
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
              Suggestions (from /data/medicines.js)
            </div>
            {suggestions.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => select(m)}
                className="w-full text-left px-3 py-2 hover:bg-slate-50"
              >
                <div className="text-sm font-medium text-slate-900">{m.brandName}</div>
                <div className="text-xs text-slate-600">
                  {m.genericName} • {m.strength} • {m.type}
                </div>
              </button>
            ))}
            {suggestions.length === 0 ? (
              <div className="px-3 py-3 text-sm text-slate-500">No matches.</div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-3 grid gap-2">
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wide">Timing</div>
          <div className="mt-1 flex gap-2 flex-wrap">
            <Toggle active={!row.useCustom && row.timing?.morning} onClick={() => onChange({ useCustom: false, timing: { ...row.timing, morning: !row.timing?.morning } })}>
              Morning
            </Toggle>
            <Toggle active={!row.useCustom && row.timing?.noon} onClick={() => onChange({ useCustom: false, timing: { ...row.timing, noon: !row.timing?.noon } })}>
              Noon
            </Toggle>
            <Toggle active={!row.useCustom && row.timing?.night} onClick={() => onChange({ useCustom: false, timing: { ...row.timing, night: !row.timing?.night } })}>
              Night
            </Toggle>
            <Toggle active={row.useCustom} onClick={() => onChange({ useCustom: !row.useCustom })}>
              Custom
            </Toggle>
          </div>
          {row.useCustom ? (
            <div className="mt-2">
              <label className="text-[11px] text-slate-500 uppercase tracking-wide">Times per day</label>
              <input
                type="number"
                min={1}
                value={row.customTimesPerDay}
                onChange={(e) => onChange({ customTimesPerDay: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                placeholder="e.g. 2"
              />
              <div className="text-[11px] text-slate-500 mt-1">Use custom only if not using Morning/Noon/Night buttons.</div>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wide">Meal Timing</div>
            <div className="mt-1 flex gap-2">
              <Toggle active={row.mealTiming === "Before Meal"} onClick={() => onChange({ mealTiming: "Before Meal" })}>
                Before Meal
              </Toggle>
              <Toggle active={row.mealTiming === "After Meal"} onClick={() => onChange({ mealTiming: "After Meal" })}>
                After Meal
              </Toggle>
            </div>
          </div>
          <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wide">Duration (days)</label>
            <input
              type="number"
              min={1}
              value={row.durationDays}
              onChange={(e) => onChange({ durationDays: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
            />
          </div>
        </div>
      </div>

      <div className="mt-2 text-right">
        <button type="button" onClick={onRemove} className="text-xs text-red-700 hover:underline">
          Remove
        </button>
      </div>
    </div>
  )
}

function Section({ title, children, subtle }) {
  return (
    <div className={`bg-white border rounded-xl p-4 ${subtle ? "border-blue-100" : "border-slate-200"}`}>
      <div className="text-sm font-semibold text-slate-900 mb-2">{title}</div>
      {children}
    </div>
  )
}

function MiniSelect({ label, value, onChange, options, className = "" }) {
  return (
    <label className={className}>
      <div className="text-[11px] text-slate-500 uppercase tracking-wide">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
      >
        {options.map((o) => (
          <option key={o.value || "__empty"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function SmallTextarea({ label, value, onChange, placeholder }) {
  return (
    <label>
      <div className="text-[11px] text-slate-500 uppercase tracking-wide">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
        placeholder={placeholder}
      />
    </label>
  )
}
