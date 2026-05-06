import { useEffect, useMemo, useState } from "react"
import {
  MEDICINE_TYPES,
  WARNING_OPTIONS,
  buildMedicinePayload,
  classifyMedicineTags,
  generateAiInsights,
  normalizeMedicineForForm,
} from "@/components/medicine/medicine-helpers"
import { MedicinePreview } from "@/components/medicine/MedicinePreview"

const EMPTY_VARIANT = { type: "Tablet", strength: "", packSize: "", price: "" }

export default function CompanyMedicineForm({ companyName, medicine, allMedicines, onCancel, onSave }) {
  const [form, setForm] = useState(() => normalizeMedicineForForm(medicine, companyName))

  useEffect(() => {
    setForm(normalizeMedicineForForm(medicine, companyName))
  }, [medicine, companyName])

  const aiPreview = useMemo(() => generateAiInsights(form, allMedicines), [form, allMedicines])
  const aiTags = useMemo(() => classifyMedicineTags(form), [form])

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateVariant(index, patch) {
    setForm((prev) => {
      const next = [...prev.variants]
      next[index] = { ...next[index], ...patch }
      return { ...prev, variants: next }
    })
  }

  function addVariant() {
    setForm((prev) => ({ ...prev, variants: [...prev.variants, { ...EMPTY_VARIANT }] }))
  }

  function removeVariant(index) {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index),
    }))
  }

  function toggleWarning(key) {
    setForm((prev) => {
      const has = prev.warnings.includes(key)
      return {
        ...prev,
        warnings: has ? prev.warnings.filter((w) => w !== key) : [...prev.warnings, key],
      }
    })
  }

  function handleSave() {
    const payload = buildMedicinePayload(form, { base: medicine })
    onSave(payload)
  }

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
      <div className="space-y-6">
        <Section title="Basic Information">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Brand Name" value={form.brandName} onChange={(v) => updateField("brandName", v)} />
            <Field
              label="Generic Name"
              value={form.genericName}
              onChange={(v) => updateField("genericName", v)}
            />
            <Field label="Company" value={form.company} onChange={(v) => updateField("company", v)} />
            <Field
              label="Type"
              value={form.type}
              onChange={(v) => updateField("type", v)}
              select
              options={MEDICINE_TYPES}
            />
            <Field label="Strength" value={form.strength} onChange={(v) => updateField("strength", v)} />
            <Field label="Price" value={form.price} onChange={(v) => updateField("price", v)} />
            <Field label="Pack Size" value={form.packSize} onChange={(v) => updateField("packSize", v)} />
          </div>
        </Section>

        <Section title="Dosage Variants">
          <div className="space-y-3">
            {form.variants.length === 0 && (
              <div className="text-xs text-slate-400">No variants added yet.</div>
            )}
            {form.variants.map((variant, idx) => (
              <div key={`${variant.type}-${idx}`} className="grid md:grid-cols-4 gap-2 items-end">
                <Field
                  label="Type"
                  value={variant.type}
                  onChange={(v) => updateVariant(idx, { type: v })}
                  select
                  options={MEDICINE_TYPES}
                />
                <Field
                  label="Strength"
                  value={variant.strength}
                  onChange={(v) => updateVariant(idx, { strength: v })}
                />
                <Field
                  label="Pack Size"
                  value={variant.packSize}
                  onChange={(v) => updateVariant(idx, { packSize: v })}
                />
                <Field
                  label="Price"
                  value={variant.price}
                  onChange={(v) => updateVariant(idx, { price: v })}
                />
                <button
                  onClick={() => removeVariant(idx)}
                  className="text-xs text-rose-600 hover:underline justify-self-start"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addVariant}
              className="px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              + Add Variant
            </button>
          </div>
        </Section>

        <Section title="Clinical Information">
          <div className="grid md:grid-cols-2 gap-3">
            <Field
              label="Indications"
              value={form.indications}
              onChange={(v) => updateField("indications", v)}
              textarea
              rows={3}
            />
            <Field
              label="Adult Dose"
              value={form.adultDose}
              onChange={(v) => updateField("adultDose", v)}
              textarea
              rows={3}
            />
            <Field
              label="Child Dose"
              value={form.childDose}
              onChange={(v) => updateField("childDose", v)}
              textarea
              rows={3}
            />
            <Field
              label="Renal Dose"
              value={form.renalDose}
              onChange={(v) => updateField("renalDose", v)}
              textarea
              rows={3}
            />
            <Field
              label="Administration"
              value={form.administration}
              onChange={(v) => updateField("administration", v)}
              textarea
              rows={3}
            />
            <Field
              label="Contraindications"
              value={form.contraindications}
              onChange={(v) => updateField("contraindications", v)}
              textarea
              rows={3}
            />
            <Field
              label="Precautions"
              value={form.precautions}
              onChange={(v) => updateField("precautions", v)}
              textarea
              rows={3}
            />
            <Field
              label="Pregnancy & Lactation"
              value={form.pregnancy}
              onChange={(v) => updateField("pregnancy", v)}
              textarea
              rows={3}
            />
            <Field
              label="Drug Interactions"
              value={form.interactions}
              onChange={(v) => updateField("interactions", v)}
              textarea
              rows={3}
            />
            <Field
              label="Adverse Effects"
              value={form.adverseEffects}
              onChange={(v) => updateField("adverseEffects", v)}
              textarea
              rows={3}
            />
            <Field
              label="Mechanism of Action"
              value={form.mechanism}
              onChange={(v) => updateField("mechanism", v)}
              textarea
              rows={3}
            />
            <Field
              label="Storage Conditions"
              value={form.storage}
              onChange={(v) => updateField("storage", v)}
              textarea
              rows={3}
            />
          </div>
        </Section>

        <Section title="Warning Tags">
          <div className="grid sm:grid-cols-2 gap-3">
            {WARNING_OPTIONS.map((w) => (
              <label key={w.key} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.warnings.includes(w.key)}
                  onChange={() => toggleWarning(w.key)}
                  className="h-4 w-4 text-blue-600 border-slate-300 rounded"
                />
                {w.label}
              </label>
            ))}
          </div>
        </Section>

        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">All submissions remain pending until approval.</div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 rounded text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
            >
              Save & Submit
            </button>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <section className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-sm font-semibold text-slate-900">AI Medicine Insights Preview</div>
          <div className="text-xs text-slate-500">Simulated insights based on current draft</div>
          <div className="mt-3 space-y-3">
            <div>
              <div className="text-[11px] font-semibold text-slate-600">AI Classification</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {aiTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-blue-50 text-blue-700 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-600">Similar to</div>
              <div className="text-xs text-slate-500 mt-1">
                {(aiPreview.similar || []).length === 0
                  ? "No matches detected yet"
                  : aiPreview.similar.join(", ")}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-600">Usage Summary</div>
              <div className="text-xs text-slate-500 mt-1">{aiPreview.usageSummary}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-600">Risk Flags</div>
              <div className="text-xs text-slate-500 mt-1">{aiPreview.riskWarnings}</div>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <div className="text-sm font-semibold text-slate-900">Live Medicine Page Preview</div>
          <div className="text-xs text-slate-500">See how this entry appears to clinicians.</div>
          <MedicinePreview medicine={form} allMedicines={allMedicines} />
        </section>
      </aside>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="text-sm font-semibold text-slate-900 mb-3">{title}</div>
      {children}
    </section>
  )
}

function Field({ label, value, onChange, textarea, select, options, rows = 2 }) {
  return (
    <label className="block text-sm text-slate-700">
      <span className="text-xs font-semibold text-slate-600 mb-1 block">{label}</span>
      {select ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-sm"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
        />
      )}
    </label>
  )
}
