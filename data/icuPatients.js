// 🏥 HEAVY ICU PATIENT DATA - May 9, 2026
// Comprehensive realistic Bangladesh healthcare context
// Multiple patients across ICU with extensive prescriptions and tests

export const icuPatientsData = [
  // ===== HOSPITAL 1 - ICU PATIENTS H1 =====
  {
    id: "icu-h1-p1",
    bedNumber: "ICU-01",
    status: "Critical",
    statusColor: "bg-red-100 text-red-800",
    patientName: "Md. Abdul Karim",
    age: 45,
    gender: "Male",
    phone: "01711-100101",
    bloodGroup: "B+",
    allergies: ["Penicillin"],
    chronicConditions: ["Hypertension", "Diabetes"],
    admissionDate: new Date(Date.now() - 86400000).toISOString(),
    admissionReason: "Post-operative complications",
    doctor: { id: "d1", name: "Dr. Sara Rahman", specialty: "Medicine" },
    nursesAssigned: [
      { id: "n1", name: "Nurse Fatema Akter", shift: "Day" },
      { id: "n2", name: "Nurse Rahima Sultana", shift: "Night" },
    ],
    vitals: {
      bp: "158/96",
      hr: 102,
      spo2: 92,
      temp: 100.4,
      rr: 24,
      glucose: 245,
      lastUpdated: new Date(Date.now() - 600000).toISOString(),
      updatedBy: "Nurse Fatema Akter",
    },
    vitalsTrend: [
      { time: "06:00", spo2: 94, bp: "152/92", glucose: 240 },
      { time: "08:00", spo2: 93, bp: "155/94", glucose: 242 },
      { time: "10:00", spo2: 92, bp: "158/96", glucose: 245 },
    ],
    currentPrescriptions: [
      {
        id: "px-1-1",
        medicine: "Cef-3 (Cefixime)",
        dosage: "200mg",
        frequency: "IV Every 8 hours",
        route: "IV",
        startDate: new Date(Date.now() - 172800000).toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString(),
        indication: "Infection control - suspected pneumonia",
        medicineId: "m1",
      },
      {
        id: "px-1-2",
        medicine: "Napa (Paracetamol)",
        dosage: "500mg",
        frequency: "Oral Twice daily",
        route: "Oral",
        startDate: new Date(Date.now() - 86400000).toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        indication: "Fever management",
        medicineId: "m2",
      },
      {
        id: "px-1-3",
        medicine: "Seclo (Omeprazole)",
        dosage: "20mg",
        frequency: "Oral Once daily",
        route: "Oral",
        startDate: new Date(Date.now() - 172800000).toISOString(),
        endDate: new Date(Date.now() + 259200000).toISOString(),
        indication: "GI protection",
        medicineId: "m3",
      },
      {
        id: "px-1-4",
        medicine: "Insulin",
        dosage: "10 units",
        frequency: "IV Sliding scale",
        route: "IV",
        startDate: new Date(Date.now() - 86400000).toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString(),
        indication: "Blood glucose control",
        medicineId: "m4",
      },
      {
        id: "px-1-5",
        medicine: "Lasix (Furosemide)",
        dosage: "20mg",
        frequency: "IV Every 12 hours",
        route: "IV",
        startDate: new Date(Date.now() - 86400000).toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString(),
        indication: "Fluid management",
        medicineId: "m5",
      },
    ],
    testOrders: [
      {
        id: "t1-1",
        name: "Complete Blood Count (CBC)",
        status: "Pending",
        orderedTime: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "t1-2",
        name: "Chest X-Ray",
        status: "Completed",
        result: "Mild pneumonic infiltrate left lower lobe",
        resultTime: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "t1-3",
        name: "Blood Culture",
        status: "Pending",
        orderedTime: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "t1-4",
        name: "Liver Function Test",
        status: "Pending",
        orderedTime: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: "t1-5",
        name: "Kidney Function Test",
        status: "Completed",
        result: "Creatinine: 1.2 mg/dL",
        resultTime: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
    alerts: [
      {
        type: "SpO2 Low",
        severity: "High",
        message: "Oxygen saturation dropping (92%)",
        time: new Date(Date.now() - 300000).toISOString(),
      },
      {
        type: "BP High",
        severity: "Medium",
        message: "Blood pressure elevated (158/96)",
        time: new Date(Date.now() - 600000).toISOString(),
      },
    ],
    medicalHistory:
      "Hypertensive, admitted 2 days ago with fever and cough. CT shows pneumonic changes. Currently on oxygen support.",
    medicineRequestStatus: {}, // Key: medicine id, Value: "hospital" | "family" | null
    printMedicineList: true,
    printTestList: true,
  },
  {
    id: "icu-h1-p3-adv",
    bedNumber: "ICU-02",
    status: "Observation",
    statusColor: "bg-yellow-100 text-yellow-800",
    patientName: "Md. Hasan Mahmud",
    age: 56,
    gender: "Male",
    phone: "01912-300303",
    bloodGroup: "A+",
    allergies: ["Sulfa"],
    chronicConditions: ["Diabetes", "Hypertension"],
    admissionDate: new Date(Date.now() - 172800000).toISOString(),
    doctor: { id: "d2", name: "Dr. Mahmud Hasan", specialty: "Cardiology" },
    nursesAssigned: [
      { id: "n2", name: "Nurse Rahima Sultana", shift: "Night" },
      { id: "n5", name: "Nurse Nusrat Jahan", shift: "Night" },
    ],
    vitals: {
      bp: "138/86",
      hr: 88,
      spo2: 97,
      temp: 98.6,
      rr: 18,
      glucose: 156,
      lastUpdated: new Date(Date.now() - 900000).toISOString(),
      updatedBy: "Nurse Rahima Sultana",
    },
    vitalsTrend: [
      { time: "06:00", spo2: 98, bp: "136/84" },
      { time: "08:00", spo2: 97, bp: "137/85" },
      { time: "10:00", spo2: 97, bp: "138/86" },
    ],
    currentPrescriptions: [
      {
        id: "px-4",
        medicine: "Monas (Montelukast)",
        dosage: "10mg",
        frequency: "Oral Once daily",
        route: "Oral",
        startDate: new Date(Date.now() - 604800000).toISOString(),
        endDate: new Date(Date.now() + 604800000).toISOString(),
        indication: "Respiratory management",
      },
      {
        id: "px-5",
        medicine: "Ace (Paracetamol)",
        dosage: "500mg",
        frequency: "Oral As needed",
        route: "Oral",
        startDate: new Date(Date.now() - 86400000).toISOString(),
        indication: "Pain management",
      },
    ],
    testOrders: [
      {
        id: "t4",
        name: "Echocardiography",
        status: "Completed",
        result: "Normal cardiac function",
      },
      {
        id: "t5",
        name: "ECG",
        status: "Completed",
        result: "Normal sinus rhythm",
      },
    ],
    alerts: [],
    medicalHistory:
      "Diabetic, post-cardiac event 2 months ago. Now stable on medical management. Admitted for monitoring.",
    medicineRequestStatus: {},
    printMedicineList: true,
    printTestList: false,
  },
  {
    id: "icu-h2-p2-adv",
    bedNumber: "ICU-01",
    status: "Stable",
    statusColor: "bg-green-100 text-green-800",
    patientName: "Farzana Akter",
    age: 32,
    gender: "Female",
    phone: "01819-200202",
    bloodGroup: "O+",
    allergies: [],
    chronicConditions: ["Gastritis"],
    admissionDate: new Date(Date.now() - 86400000).toISOString(),
    doctor: { id: "d3", name: "Dr. Nusrat Jahan", specialty: "Paediatrics" },
    nursesAssigned: [
      { id: "n3", name: "Nurse Shirin Begum", shift: "Day" },
      { id: "n6", name: "Nurse Tahmina Akter", shift: "Day" },
    ],
    vitals: {
      bp: "124/78",
      hr: 80,
      spo2: 98,
      temp: 98.4,
      rr: 16,
      glucose: 110,
      lastUpdated: new Date(Date.now() - 300000).toISOString(),
      updatedBy: "Nurse Shirin Begum",
    },
    vitalsTrend: [
      { time: "06:00", spo2: 98, bp: "122/76" },
      { time: "08:00", spo2: 98, bp: "123/77" },
      { time: "10:00", spo2: 98, bp: "124/78" },
    ],
    currentPrescriptions: [
      {
        id: "px-6",
        medicine: "Sergel (Esomeprazole)",
        dosage: "40mg",
        frequency: "Oral Once daily",
        route: "Oral",
        startDate: new Date(Date.now() - 172800000).toISOString(),
        endDate: new Date(Date.now() + 604800000).toISOString(),
        indication: "Gastric ulcer healing",
      },
      {
        id: "px-7",
        medicine: "Fexo (Fexofenadine)",
        dosage: "120mg",
        frequency: "Oral Once daily",
        route: "Oral",
        startDate: new Date(Date.now() - 86400000).toISOString(),
        endDate: new Date(Date.now() + 604800000).toISOString(),
        indication: "Allergy management",
      },
    ],
    testOrders: [
      {
        id: "t6",
        name: "Upper GI Endoscopy",
        status: "Completed",
        result: "Grade II esophageal ulcer noted",
      },
    ],
    alerts: [],
    medicalHistory:
      "Admitted with severe gastritis. Responding well to treatment. Stable vital signs.",
    medicineRequestStatus: {},
    printMedicineList: true,
    printTestList: false,
  },
  {
    id: "icu-h2-p4-adv",
    bedNumber: "ICU-02",
    status: "Observation",
    statusColor: "bg-yellow-100 text-yellow-800",
    patientName: "Nusrat Jahan",
    age: 41,
    gender: "Female",
    phone: "01678-400404",
    bloodGroup: "B+",
    allergies: [],
    chronicConditions: ["Asthma"],
    admissionDate: new Date(Date.now() - 259200000).toISOString(),
    doctor: { id: "d4", name: "Dr. Hasan Imam", specialty: "Critical Care" },
    nursesAssigned: [
      { id: "n7", name: "Nurse Priti Das", shift: "Night" },
      { id: "n8", name: "Nurse Mahbuba Khan", shift: "Day" },
    ],
    vitals: {
      bp: "132/82",
      hr: 92,
      spo2: 96,
      temp: 99.1,
      rr: 20,
      glucose: 128,
      lastUpdated: new Date(Date.now() - 450000).toISOString(),
      updatedBy: "Nurse Priti Das",
    },
    vitalsTrend: [
      { time: "06:00", spo2: 97, bp: "128/80" },
      { time: "08:00", spo2: 96, bp: "130/81" },
      { time: "10:00", spo2: 96, bp: "132/82" },
    ],
    currentPrescriptions: [
      {
        id: "px-8",
        medicine: "Cef-3 (Cefixime)",
        dosage: "200mg",
        frequency: "IV Every 8 hours",
        route: "IV",
        startDate: new Date(Date.now() - 172800000).toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        indication: "Respiratory infection",
      },
      {
        id: "px-9",
        medicine: "Amodis (Metronidazole)",
        dosage: "400mg",
        frequency: "Oral Thrice daily",
        route: "Oral",
        startDate: new Date(Date.now() - 172800000).toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString(),
        indication: "Anaerobic infection control",
      },
    ],
    testOrders: [
      {
        id: "t7",
        name: "Sputum Culture",
        status: "Pending",
        orderedTime: new Date().toISOString(),
      },
      {
        id: "t8",
        name: "Chest CT",
        status: "Completed",
        result: "Pneumonic consolidation bilateral",
      },
    ],
    alerts: [
      {
        type: "Temperature",
        severity: "Low",
        message: "Monitor fever trend (99.1°C)",
        time: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
    medicalHistory:
      "Asthmatic, admitted with acute exacerbation and respiratory infection. Currently improving with treatment.",
    medicineRequestStatus: {},
    printMedicineList: true,
    printTestList: true,
  },
];

// Helper function to get ICU patients assigned to a nurse
export const getICUPatientsForNurse = (nurseId, icuPatients) => {
  return icuPatients.filter((patient) =>
    patient.nursesAssigned.some((nurse) => nurse.id === nurseId),
  );
};

// Helper function to get alert priority level
export const getAlertPriority = (severity) => {
  switch (severity) {
    case "High":
      return { badge: "bg-red-100 text-red-800", border: "border-red-300" };
    case "Medium":
      return {
        badge: "bg-yellow-100 text-yellow-800",
        border: "border-yellow-300",
      };
    case "Low":
      return { badge: "bg-blue-100 text-blue-800", border: "border-blue-300" };
    default:
      return { badge: "bg-gray-100 text-gray-800", border: "border-gray-300" };
  }
};

// Helper to check if vitals are critical
export const isVitalCritical = (vital, value) => {
  const thresholds = {
    spo2: { min: 94, max: 100 },
    hr: { min: 60, max: 100 },
    bp_systolic: { min: 90, max: 140 },
    temp: { min: 36.5, max: 38.5 },
    rr: { min: 12, max: 20 },
    glucose: { min: 80, max: 180 },
  };

  if (vital === "spo2")
    return value < thresholds.spo2.min || value > thresholds.spo2.max;
  if (vital === "hr")
    return value < thresholds.hr.min || value > thresholds.hr.max;
  if (vital === "temp")
    return value < thresholds.temp.min || value > thresholds.temp.max;
  if (vital === "rr")
    return value < thresholds.rr.min || value > thresholds.rr.max;
  if (vital === "glucose")
    return value < thresholds.glucose.min || value > thresholds.glucose.max;

  return false;
};
