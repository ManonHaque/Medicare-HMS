import {
  classifyMedicineTags,
  generateAiInsights,
  getDisplayBrand,
  getDisplayGeneric,
  getDisplayIndications,
} from "./medicine-helpers"

export function MedicinePreview({ medicine, allMedicines = [] }) {
  if (!medicine) return null
  const ai = generateAiInsights(medicine, allMedicines)
  const tags = classifyMedicineTags(medicine)
  const brand = getDisplayBrand(medicine)
  const generic = getDisplayGeneric(medicine)
  const variants = medicine.variants || []

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <header className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="text-sm font-semibold text-slate-900">{brand}</div>
        <div className="text-xs text-slate-600">{generic}</div>
      </header>

      <div className="p-4 space-y-4">
        <section className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Medicine Snapshot
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <InfoRow label="Type" value={medicine.type || "—"} />
            <InfoRow label="Strength" value={medicine.strength || "—"} />
            <InfoRow label="Company" value={medicine.company || "—"} />
            <InfoRow label="Pack" value={medicine.packSize || "—"} />
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-blue-50 text-blue-700 rounded"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        <section>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
            Dosage Variants
          </div>
          <div className="space-y-1">
            {variants.length === 0 ? (
              <div className="text-xs text-slate-400">No variants added yet.</div>
            ) : (
              variants.map((v, idx) => (
                <div
                  key={`${v.type}-${v.strength}-${idx}`}
                  className="flex items-center justify-between text-xs text-slate-700"
                >
                  <span>
                    {v.type} {v.strength}
                  </span>
                  <span className="text-slate-500">{v.packSize || "—"}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
            Clinical Summary
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            {getDisplayIndications(medicine) || "No clinical information added yet."}
          </div>
        </section>

        <section className="border-t border-slate-200 pt-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
            AI Insight Panels
          </div>
          <div className="space-y-2 text-xs text-slate-700">
            <AiRow title="AI Detected Similar Medicines" items={ai.similar} />
            <AiRow title="AI Suggested Alternatives" items={ai.alternatives} />
            <AiText title="AI Usage Summary" text={ai.usageSummary} />
            <AiText title="AI Risk Warnings" text={ai.riskWarnings} />
          </div>
        </section>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 bg-slate-50 px-2 py-1 rounded">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-xs text-slate-700 font-medium">{value}</span>
    </div>
  )
}

function AiRow({ title, items }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-slate-600">{title}</div>
      <div className="flex flex-wrap gap-1 mt-1">
        {(items || []).length === 0 ? (
          <span className="text-[11px] text-slate-400">Not enough data yet</span>
        ) : (
          items.map((i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-700 rounded"
            >
              {i}
            </span>
          ))
        )}
      </div>
    </div>
  )
}

function AiText({ title, text }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-slate-600">{title}</div>
      <div className="text-[11px] text-slate-500 mt-1">{text}</div>
    </div>
  )
}
