"use client"

import { useEffect, useMemo, useState } from "react"

function Field({ label, value }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm font-medium text-slate-900">{value ?? "—"}</div>
    </div>
  )
}

export default function PatientDetailsPanel({ patient, onUpdatePatient, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const initialForm = useMemo(
    () => ({
      name: patient?.name || "",
      age: patient?.age ?? "",
      gender: patient?.gender || "",
      phone: patient?.phone || "",
      bloodGroup: patient?.bloodGroup || patient?.blood_group || "",
      heightCm: patient?.heightCm ?? patient?.height ?? "",
      weightKg: patient?.weightKg ?? patient?.weight ?? "",
    }),
    [patient]
  )
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    setForm(initialForm)
  }, [initialForm])

  const applyAdd = (key) => {
    setEditing(true)
    setForm((prev) => ({ ...prev, [key]: prev[key] || "" }))
  }

  const save = () => {
    const handler = onUpdatePatient || onUpdate
    handler?.({
      name: form.name,
      age: form.age === "" ? undefined : Number(form.age),
      gender: form.gender,
      phone: form.phone,
      bloodGroup: form.bloodGroup,
      heightCm: form.heightCm === "" ? null : Number(form.heightCm),
      weightKg: form.weightKg === "" ? null : Number(form.weightKg),
    })
    setEditing(false)
  }

  const cancel = () => {
    setForm(initialForm)
    setEditing(false)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 truncate">Patient Details</div>
          <div className="text-xs text-slate-500 mt-0.5">Identity + baseline measurements</div>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-xs px-2 py-1 border border-slate-200 rounded-md hover:bg-slate-50"
          >
            Edit Details
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={save}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={cancel}
              className="text-xs px-2 py-1 border border-slate-200 rounded-md hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {!editing ? (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Field label="Name" value={patient?.name} />
          <Field label="Age" value={patient?.age != null ? `${patient.age} yrs` : "—"} />
          <Field label="Height" value={patient?.heightCm != null ? `${patient.heightCm} cm` : "—"} />
          <Field label="Weight" value={patient?.weightKg != null ? `${patient.weightKg} kg` : "—"} />
          <Field label="Blood Group" value={patient?.bloodGroup || "—"} />
          <Field label="Gender" value={patient?.gender || "—"} />
          <div className="col-span-2">
            <Field label="Phone Number" value={patient?.phone || "—"} />
          </div>

          <div className="col-span-2 flex gap-2 mt-1">
            {patient?.heightCm == null ? (
              <button
                onClick={() => applyAdd("heightCm")}
                className="text-xs px-2 py-1 border border-slate-200 rounded-md hover:bg-slate-50"
              >
                + Add Height
              </button>
            ) : null}
            {patient?.weightKg == null ? (
              <button
                onClick={() => applyAdd("weightKg")}
                className="text-xs px-2 py-1 border border-slate-200 rounded-md hover:bg-slate-50"
              >
                + Add Weight
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <LabeledInput label="Name" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
          <LabeledInput label="Age" type="number" value={form.age} onChange={(v) => setForm((p) => ({ ...p, age: v }))} />
          <LabeledInput
            label="Height (cm)"
            type="number"
            value={form.heightCm}
            onChange={(v) => setForm((p) => ({ ...p, heightCm: v }))}
          />
          <LabeledInput
            label="Weight (kg)"
            type="number"
            value={form.weightKg}
            onChange={(v) => setForm((p) => ({ ...p, weightKg: v }))}
          />
          <LabeledInput
            label="Blood Group"
            value={form.bloodGroup}
            onChange={(v) => setForm((p) => ({ ...p, bloodGroup: v }))}
          />
          <LabeledInput label="Gender" value={form.gender} onChange={(v) => setForm((p) => ({ ...p, gender: v }))} />
          <div className="col-span-2">
            <LabeledInput
              label="Phone Number"
              value={form.phone}
              onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function LabeledInput({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
