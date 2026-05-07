import { medicines as MED_DB } from "@/data/medicines"

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function includesAny(text, keywords) {
  const t = normalize(text)
  return keywords.some((k) => t.includes(normalize(k)))
}

export function getSymptomProfile(symptoms = "") {
  const s = normalize(symptoms)
  const flags = {
    fever: s.includes("fever") || s.includes("temperature") || s.includes("জ্বর"),
    cough: s.includes("cough") || s.includes("sputum") || s.includes("কাশি"),
    chestPain: s.includes("chest") || s.includes("angina") || s.includes("চেস্ট") || s.includes("বুকে"),
    headache: s.includes("headache") || s.includes("migraine") || s.includes("মাথা"),
    acidity: s.includes("acidity") || s.includes("heartburn") || s.includes("gas") || s.includes("burning"),
    allergy: s.includes("allergy") || s.includes("sneeze") || s.includes("rash"),
  }

  const diagnoses = []
  const questions = []
  const tests = []
  const medicineKeywords = []

  if (flags.fever) {
    diagnoses.push("Acute febrile illness (viral fever) – rule out dengue/typhoid if indicated")
    questions.push("Duration of fever?", "Any chills/rigor?", "Any vomiting/diarrhoea?", "Any breathing issue?", "Any allergy history?")
    tests.push("CBC", "CRP", "Dengue NS1 (if day 1–5)")
    medicineKeywords.push("Paracetamol")
  }

  if (flags.cough) {
    diagnoses.push("Upper respiratory tract infection (URTI)")
    questions.push("Dry or productive cough?", "Any shortness of breath?", "Any smoking history?")
    tests.push("Chest X-ray (if red flags)")
    medicineKeywords.push("Antihistamine")
  }

  if (flags.chestPain) {
    diagnoses.push("Chest pain – rule out ACS", "GERD / gastritis")
    questions.push("Exertional pain?", "Radiation to left arm/jaw?", "Sweating?", "Breathlessness?", "Past cardiac history?")
    tests.push("ECG", "Troponin", "Lipid Profile")
  }

  if (flags.headache) {
    diagnoses.push("Tension headache", "Migraine (consider)")
    questions.push("Any visual symptoms?", "Any vomiting?", "Any neck stiffness?", "Sleep pattern?", "BP checked?")
    tests.push("Blood Pressure")
  }

  if (flags.acidity) {
    diagnoses.push("Dyspepsia / GERD")
    questions.push("Any NSAID use?", "Any black stool/vomiting blood?", "Meal relation?")
    medicineKeywords.push("Esomeprazole", "Omeprazole")
  }

  if (flags.allergy) {
    diagnoses.push("Allergic rhinitis / urticaria")
    questions.push("Any trigger?", "Any wheeze?", "Any drug allergy?")
    medicineKeywords.push("Antihistamine")
  }

  const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean)

  return {
    flags,
    diagnoses: uniq(diagnoses).slice(0, 4),
    questions: uniq(questions).slice(0, 8),
    tests: uniq(tests).slice(0, 6),
    medicineKeywords: uniq(medicineKeywords).slice(0, 6),
  }
}

export function scoreMedicine({ medicine, query, symptomProfile, patient }) {
  let score = 0
  const q = normalize(query)

  const fields = [
    medicine?.brandName,
    medicine?.genericName,
    medicine?.company,
    medicine?.type,
    medicine?.strength,
    medicine?.indications,
  ]
    .filter(Boolean)
    .join(" | ")

  const text = normalize(fields)

  if (q) {
    if (text.includes(q)) score += 50
    if (normalize(medicine?.brandName).includes(q)) score += 20
    if (normalize(medicine?.genericName).includes(q)) score += 20
  }

  if (symptomProfile?.medicineKeywords?.length) {
    if (includesAny(medicine?.genericName, symptomProfile.medicineKeywords)) score += 30
    if (includesAny(medicine?.indications, symptomProfile.medicineKeywords)) score += 10
  }

  const allergies = (patient?.allergies || []).map(normalize)
  if (allergies.length) {
    if (includesAny(medicine?.genericName, allergies) || includesAny(medicine?.brandName, allergies)) score -= 50
  }

  if ((medicine?.warnings || []).length) score -= 2

  return score
}

export function getMedicineSuggestions({ query = "", symptoms = "", patient = null, limit = 8 }) {
  const symptomProfile = getSymptomProfile(symptoms)

  return MED_DB
    .map((m) => ({
      medicine: m,
      score: scoreMedicine({ medicine: m, query, symptomProfile, patient }),
    }))
    .filter((x) => (query ? x.score > 0 : x.score >= 0))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.medicine)
}
