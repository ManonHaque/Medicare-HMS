export const MEDICINE_TYPES = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Suspension",
  "Drops",
  "Injection",
  "Suppository",
  "Cream",
  "Infusion",
]

export const WARNING_OPTIONS = [
  { key: "Pregnancy", label: "Pregnancy Warning" },
  { key: "Kidney", label: "Kidney Warning" },
  { key: "Liver", label: "Liver Warning" },
  { key: "Child", label: "Child Safety Warning" },
]

export function normalizeMedicineForForm(medicine, companyName = "") {
  const base = medicine || {}
  const brandName = base.brandName || base.brand || (base.name || "").split(" ")[0] || ""
  const genericName = base.genericName || base.generic || ""

  return {
    id: base.id,
    brandName,
    genericName,
    company: base.company || companyName,
    type: base.type || "Tablet",
    strength: base.strength || "",
    price: base.price || "",
    packSize: base.packSize || "",
    variants: (base.variants || []).map((v) => ({
      type: v.type || "Tablet",
      strength: v.strength || "",
      packSize: v.packSize || "",
      price: v.price || "",
    })),
    indications: base.indications || base.indication || base.usage || "",
    adultDose: base.adultDose || base.dosage || "",
    childDose: base.childDose || "",
    renalDose: base.renalDose || "",
    administration: base.administration || "",
    contraindications: base.contraindications || "",
    precautions: base.precautions || "",
    pregnancy: base.pregnancy || "",
    interactions: base.interactions || "",
    adverseEffects: base.adverseEffects || base.adverse || base.sideEffects || "",
    mechanism: base.mechanism || "",
    storage: base.storage || "",
    warnings: Array.isArray(base.warnings) ? base.warnings : [],
    aiInsights: base.aiInsights || {},
    status: base.status || "Pending",
  }
}

export function buildVariantLabel(variant) {
  const strength = variant.strength ? ` ${variant.strength}` : ""
  return `${variant.type}${strength}`.trim()
}

export function buildMedicinePayload(form, options = {}) {
  const now = new Date().toISOString()
  const variants = (form.variants || []).map((v) => ({
    ...v,
    label: buildVariantLabel(v),
  }))

  const nameSuffix = form.strength ? ` ${form.strength}` : ""

  return {
    ...options.base,
    brandName: form.brandName,
    genericName: form.genericName,
    company: form.company,
    type: form.type,
    strength: form.strength,
    price: form.price,
    packSize: form.packSize,
    variants,
    indications: form.indications,
    adultDose: form.adultDose,
    childDose: form.childDose,
    renalDose: form.renalDose,
    administration: form.administration,
    contraindications: form.contraindications,
    precautions: form.precautions,
    pregnancy: form.pregnancy,
    interactions: form.interactions,
    adverseEffects: form.adverseEffects,
    mechanism: form.mechanism,
    storage: form.storage,
    warnings: form.warnings || [],
    aiInsights: form.aiInsights || {},
    status: options.status || options.base?.status || "Pending",
    updatedAt: now,
    brand: form.brandName,
    generic: form.genericName,
    name: `${form.brandName}${nameSuffix}`.trim(),
    usage: form.indications,
    dosage: form.adultDose,
    sideEffects: form.adverseEffects,
    indication: form.indications,
    adverse: form.adverseEffects,
  }
}

export function getDisplayBrand(medicine) {
  return medicine.brandName || medicine.brand || "Unknown"
}

export function getDisplayGeneric(medicine) {
  return medicine.genericName || medicine.generic || ""
}

export function getDisplayIndications(medicine) {
  return medicine.indications || medicine.indication || medicine.usage || ""
}

export function generateAiInsights(medicine, allMedicines) {
  const generic = (medicine.genericName || medicine.generic || "").toLowerCase()
  const indications = getDisplayIndications(medicine).toLowerCase()

  const similar = allMedicines
    .filter((m) => (m.id || "") !== (medicine.id || ""))
    .filter((m) => (m.genericName || m.generic || "").toLowerCase() === generic)
    .map((m) => getDisplayBrand(m))

  const alternatives = allMedicines
    .filter((m) => (m.id || "") !== (medicine.id || ""))
    .filter((m) => {
      const otherInd = getDisplayIndications(m).toLowerCase()
      return otherInd && indications && otherInd.split(",").some((w) => indications.includes(w.trim()))
    })
    .map((m) => getDisplayBrand(m))

  const usageSummary = buildUsageSummary(generic, indications)
  const riskWarnings = buildRiskSummary(medicine.warnings || [])

  return {
    similar: Array.from(new Set(similar)).slice(0, 4),
    alternatives: Array.from(new Set(alternatives)).slice(0, 4),
    usageSummary,
    riskWarnings,
  }
}

export function classifyMedicineTags(medicine) {
  const generic = (medicine.genericName || medicine.generic || "").toLowerCase()
  const indications = getDisplayIndications(medicine).toLowerCase()
  const tags = []

  if (generic.includes("paracetamol") || indications.includes("fever")) {
    tags.push("Fever treatment")
  }
  if (generic.includes("paracetamol") || indications.includes("pain")) {
    tags.push("Pain relief")
  }
  if (generic.includes("omeprazole") || indications.includes("gerd")) {
    tags.push("Acid control")
  }
  if (generic.includes("montelukast") || indications.includes("asthma")) {
    tags.push("Respiratory care")
  }
  if (generic.includes("cefixime") || indications.includes("infection")) {
    tags.push("Antibiotic")
  }

  return tags.length > 0 ? tags.slice(0, 3) : ["General medicine"]
}

function buildUsageSummary(generic, indications) {
  if (generic.includes("paracetamol")) return "Commonly used for fever and mild pain."
  if (generic.includes("omeprazole") || generic.includes("esomeprazole"))
    return "Used for acid reflux, gastric and duodenal ulcers."
  if (generic.includes("montelukast"))
    return "Supports asthma prophylaxis and allergic rhinitis control."
  if (generic.includes("cefixime"))
    return "Used for bacterial infections including respiratory and urinary tract."
  if (indications) return `Used for ${indications.split(".")[0].trim().toLowerCase()}.`
  return "Used for indicated clinical conditions."
}

function buildRiskSummary(warnings) {
  if (!warnings || warnings.length === 0) return "No major risk signals detected from labels."
  const map = {
    Pregnancy: "Pregnancy caution advised.",
    Kidney: "Monitor renal function in long-term use.",
    Liver: "Possible liver caution for prolonged use.",
    Child: "Use pediatric dosing guidance carefully.",
  }
  return warnings.map((w) => map[w] || w).join(" ")
}
