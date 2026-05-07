const WARD_LABELS = ["Ward A", "Ward B", "Ward C", "Ward D", "Ward E"]

export const demoPatients = [
  { id: "p1", name: "Md. Abdul Karim", age: 45, gender: "Male", phone: "01711-100101", bloodGroup: "B+", heightCm: 168, weightKg: 72, address: "Mirpur, Dhaka", allergies: ["Penicillin"], chronicConditions: ["Hypertension"] },
  { id: "p2", name: "Farzana Akter", age: 32, gender: "Female", phone: "01819-200202", bloodGroup: "O+", heightCm: 160, weightKg: 58, address: "Panchlaish, Chattogram", allergies: [], chronicConditions: ["Gastritis"] },
  { id: "p3", name: "Md. Hasan Mahmud", age: 56, gender: "Male", phone: "01912-300303", bloodGroup: "A+", heightCm: 171, weightKg: 76, address: "Uttara, Dhaka", allergies: ["Sulfa"], chronicConditions: ["Diabetes"] },
  { id: "p4", name: "Nusrat Jahan", age: 41, gender: "Female", phone: "01678-400404", bloodGroup: "B+", heightCm: 155, weightKg: 64, address: "Khulshi, Chattogram", allergies: [], chronicConditions: ["Asthma"] },
  { id: "p5", name: "Md. Rafiul Islam", age: 29, gender: "Male", phone: "01517-500505", bloodGroup: "AB+", heightCm: 173, weightKg: 70, address: "Dhanmondi, Dhaka", allergies: [], chronicConditions: [] },
  { id: "p6", name: "Shahana Begum", age: 63, gender: "Female", phone: "01411-600606", bloodGroup: "O-", heightCm: 158, weightKg: 59, address: "Halishahar, Chattogram", allergies: ["Aspirin"], chronicConditions: ["COPD"] },
  { id: "p7", name: "Md. Jahid Hasan", age: 50, gender: "Male", phone: "01322-700707", bloodGroup: "A-", heightCm: 169, weightKg: 68, address: "Mohakhali, Dhaka", allergies: [], chronicConditions: ["Coronary artery disease"] },
  { id: "p8", name: "Mrs. Tahmina Akter", age: 37, gender: "Female", phone: "01788-800808", bloodGroup: "B+", heightCm: 162, weightKg: 61, address: "Agrabad, Chattogram", allergies: ["Dust"], chronicConditions: ["Thyroid disorder"] },
  { id: "p9", name: "Md. Siam Hossain", age: 24, gender: "Male", phone: "01856-900909", bloodGroup: "O+", heightCm: 175, weightKg: 73, address: "Badda, Dhaka", allergies: [], chronicConditions: [] },
  { id: "p10", name: "Mim Akter", age: 47, gender: "Female", phone: "01945-101010", bloodGroup: "A+", heightCm: 157, weightKg: 66, address: "Nasirabad, Chattogram", allergies: [], chronicConditions: ["Hypertension"] },
  { id: "p11", name: "Md. Shakil Ahmed", age: 39, gender: "Male", phone: "01655-111111", bloodGroup: "B-", heightCm: 170, weightKg: 74, address: "Farmgate, Dhaka", allergies: ["Seafood"], chronicConditions: ["Peptic ulcer disease"] },
  { id: "p12", name: "Ayesha Rahman", age: 28, gender: "Female", phone: "01519-121212", bloodGroup: "AB+", heightCm: 159, weightKg: 55, address: "Kotwali, Chattogram", allergies: [], chronicConditions: [] },
  { id: "p13", name: "Md. Tanvir Hasan", age: 61, gender: "Male", phone: "01444-131313", bloodGroup: "O+", heightCm: 166, weightKg: 69, address: "Mirpur, Dhaka", allergies: [], chronicConditions: ["CKD"] },
  { id: "p14", name: "Sumaiya Islam", age: 35, gender: "Female", phone: "01333-141414", bloodGroup: "A+", heightCm: 161, weightKg: 57, address: "Cox's Bazar", allergies: ["Pollen"], chronicConditions: ["Migraine"] },
  { id: "p15", name: "Md. Farid Uddin", age: 52, gender: "Male", phone: "01222-151515", bloodGroup: "B+", heightCm: 172, weightKg: 80, address: "Tejgaon, Dhaka", allergies: [], chronicConditions: ["Heart failure"] },
  { id: "p16", name: "Rumana Akter", age: 44, gender: "Female", phone: "01766-161616", bloodGroup: "O+", heightCm: 156, weightKg: 63, address: "Pahartali, Chattogram", allergies: [], chronicConditions: ["Anemia"] },
  { id: "p17", name: "Md. Imran Hossain", age: 31, gender: "Male", phone: "01822-171717", bloodGroup: "A+", heightCm: 174, weightKg: 71, address: "Banani, Dhaka", allergies: ["Latex"], chronicConditions: [] },
  { id: "p18", name: "Nabila Sultana", age: 27, gender: "Female", phone: "01911-181818", bloodGroup: "B+", heightCm: 163, weightKg: 54, address: "Mogbazar, Dhaka", allergies: [], chronicConditions: [] },
  { id: "p19", name: "Md. Arif Hossain", age: 58, gender: "Male", phone: "01666-191919", bloodGroup: "AB-", heightCm: 168, weightKg: 75, address: "Anderkilla, Chattogram", allergies: [], chronicConditions: ["Stroke follow-up"] },
  { id: "p20", name: "Tania Chowdhury", age: 40, gender: "Female", phone: "01555-202020", bloodGroup: "O+", heightCm: 160, weightKg: 60, address: "Gulshan, Dhaka", allergies: ["Penicillin"], chronicConditions: ["Rheumatoid arthritis"] },
  { id: "p21", name: "Rashedul Alam", age: 34, gender: "Male", phone: "01733-212121", bloodGroup: "A+", heightCm: 172, weightKg: 78, address: "Shyamoli, Dhaka", allergies: [], chronicConditions: ["Fatty liver"] },
  { id: "p22", name: "Sabina Yasmin", age: 46, gender: "Female", phone: "01844-222222", bloodGroup: "B-", heightCm: 157, weightKg: 62, address: "Mohammadpur, Dhaka", allergies: ["NSAIDs"], chronicConditions: ["Hypothyroidism"] },
  { id: "p23", name: "Rezaul Karim", age: 53, gender: "Male", phone: "01977-232323", bloodGroup: "O+", heightCm: 170, weightKg: 72, address: "Pahartali, Chattogram", allergies: [], chronicConditions: ["COPD"] },
  { id: "p24", name: "Jannatul Ferdous", age: 30, gender: "Female", phone: "01699-242424", bloodGroup: "AB+", heightCm: 160, weightKg: 56, address: "Chawkbazar, Chattogram", allergies: ["Dust"], chronicConditions: [] },
  { id: "p25", name: "Sakib Mahfuz", age: 27, gender: "Male", phone: "01566-252525", bloodGroup: "B+", heightCm: 176, weightKg: 74, address: "Basundhara, Dhaka", allergies: [], chronicConditions: [] },
  { id: "p26", name: "Moushumi Akter", age: 38, gender: "Female", phone: "01455-262626", bloodGroup: "O-", heightCm: 158, weightKg: 59, address: "EPZ, Chattogram", allergies: [], chronicConditions: ["Anxiety"] },
  { id: "p27", name: "Sabbir Ahmed", age: 42, gender: "Male", phone: "01388-272727", bloodGroup: "A-", heightCm: 173, weightKg: 83, address: "Rampura, Dhaka", allergies: ["Shellfish"], chronicConditions: ["Hypertension"] },
  { id: "p28", name: "Nargis Sultana", age: 49, gender: "Female", phone: "01792-282828", bloodGroup: "B+", heightCm: 155, weightKg: 61, address: "Bakalia, Chattogram", allergies: [], chronicConditions: ["Osteoarthritis"] },
  { id: "p29", name: "Mahin Chowdhury", age: 33, gender: "Male", phone: "01888-292929", bloodGroup: "AB-", heightCm: 174, weightKg: 77, address: "Banasree, Dhaka", allergies: ["Pollen"], chronicConditions: [] },
  { id: "p30", name: "Tumpa Rani Das", age: 36, gender: "Female", phone: "01999-303030", bloodGroup: "O+", heightCm: 159, weightKg: 58, address: "Kotwali, Chattogram", allergies: [], chronicConditions: ["Gastritis"] },
]

export const demoDoctors = [
  { id: "d1", name: "Dr. Sara Rahman", specialty: "Medicine", department: "General Medicine", bmdcRegNo: "A-12345", designation: "Medical Officer", hospitalIds: ["h1", "h2"], phone: "01711-010101" },
  { id: "d2", name: "Dr. Mahmud Hasan", specialty: "Cardiology", department: "Cardiology", bmdcRegNo: "A-23456", designation: "Registrar", hospitalIds: ["h1"], phone: "01711-010102" },
  { id: "d3", name: "Dr. Nusrat Jahan", specialty: "Paediatrics", department: "Paediatrics", bmdcRegNo: "A-34567", designation: "Consultant", hospitalIds: ["h2"], phone: "01711-010103" },
  { id: "d4", name: "Dr. Hasan Imam", specialty: "Critical Care", department: "ICU", bmdcRegNo: "A-45678", designation: "Consultant", hospitalIds: ["h1", "h2"], phone: "01711-010104" },
  { id: "d5", name: "Dr. Ruma Chowdhury", specialty: "Internal Medicine", department: "General Medicine", bmdcRegNo: "A-56789", designation: "Registrar", hospitalIds: ["h1"], phone: "01711-010105" },
  { id: "d6", name: "Dr. Arafat Hossain", specialty: "Pulmonology", department: "Chest Medicine", bmdcRegNo: "A-67890", designation: "Medical Officer", hospitalIds: ["h2"], phone: "01711-010106" },
  { id: "d7", name: "Dr. Mahi Tasnim", specialty: "Nephrology", department: "Medicine", bmdcRegNo: "A-78901", designation: "Consultant", hospitalIds: ["h1", "h2"], phone: "01711-010107" },
  { id: "d8", name: "Dr. Samiul Hasan", specialty: "Orthopaedics", department: "Surgery", bmdcRegNo: "A-89012", designation: "Medical Officer", hospitalIds: ["h1"], phone: "01711-010108" },
  { id: "d9", name: "Dr. Nafisa Karim", specialty: "Endocrinology", department: "Medicine", bmdcRegNo: "A-90123", designation: "Consultant", hospitalIds: ["h2"], phone: "01711-010109" },
  { id: "d10", name: "Dr. Rafiq Uddin", specialty: "Neurology", department: "Medicine", bmdcRegNo: "A-91234", designation: "Registrar", hospitalIds: ["h1", "h2"], phone: "01711-010110" },
]

export const demoNurses = [
  { id: "n1", name: "Nurse Fatema Akter", hospitalId: "h1", shift: "Day" },
  { id: "n2", name: "Nurse Rahima Sultana", hospitalId: "h1", shift: "Night" },
  { id: "n3", name: "Nurse Shirin Begum", hospitalId: "h2", shift: "Day" },
  { id: "n4", name: "Nurse Ayesha Khatun", hospitalId: "h1", shift: "Day" },
  { id: "n5", name: "Nurse Nusrat Jahan", hospitalId: "h1", shift: "Night" },
  { id: "n6", name: "Nurse Tahmina Akter", hospitalId: "h2", shift: "Day" },
  { id: "n7", name: "Nurse Priti Das", hospitalId: "h2", shift: "Night" },
  { id: "n8", name: "Nurse Mahbuba Khan", hospitalId: "h2", shift: "Day" },
  { id: "n9", name: "Nurse Kamrul Hasan", hospitalId: "h1", shift: "Night" },
  { id: "n10", name: "Nurse Sharmin Akter", hospitalId: "h2", shift: "Night" },
]

function padNumber(value) {
  return String(value).padStart(2, "0")
}

function addDays(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function makeVitals(hr, bp, spo2, temp, rr, updatedAt, updatedBy) {
  return { hr, bp, spo2, temp, rr, updatedAt, updatedBy }
}

function makeMedicineItem(name, dose, frequency, meal, durationDays) {
  return {
    id: `${name}-${dose}-${frequency}`,
    name,
    medicineLabel: `${name} ${dose}`,
    dosage: dose,
    frequency,
    meal,
    duration: `${durationDays} days`,
    durationDays,
    mealTiming: meal,
    timing: {
      morning: frequency.includes("1") || frequency.includes("2") || frequency.includes("3"),
      noon: frequency.startsWith("0-1") || frequency.startsWith("1-1") || frequency.startsWith("1-0-1") || frequency.startsWith("1-1-1"),
      night: frequency.endsWith("1"),
    },
  }
}

function makeTestItem(name, timing = "Today", condition = "Mandatory") {
  return { id: `${name}-${timing}`, name, timing, condition }
}

function pickDoctorIds(hospitalId) {
  return demoDoctors.filter((doctor) => doctor.hospitalIds?.includes(hospitalId)).map((doctor) => doctor.id)
}

function pickNurseIds(hospitalId) {
  return demoNurses.filter((nurse) => nurse.hospitalId === hospitalId).map((nurse) => nurse.id)
}

function findBedId(beds, hospitalId, type, number, wardName) {
  return beds.find(
    (bed) =>
      bed.hospitalId === hospitalId &&
      bed.type === type &&
      bed.number === number &&
      (!wardName || bed.wardName === wardName)
  )?.id
}

function getPatientName(patientId) {
  return demoPatients.find((patient) => patient.id === patientId)?.name || patientId
}

function getNurseIdsForPlan(plan) {
  const hospitalId = plan.icuPatientId?.startsWith("icu-h2") ? "h2" : "h1"
  return demoNurses.filter((nurse) => nurse.hospitalId === hospitalId).map((nurse) => nurse.id)
}

function getTaskVariantsForPlan(plan) {
  if (plan.type === "medicine") {
    return [
      {
        type: "Administer Medicine",
        description: `${plan.name} - administer on schedule`,
        time: plan.time === "Night" ? "21:00" : "08:00",
      },
      {
        type: "Observation",
        description: `${plan.medicineLabel || plan.name} response observe korun`,
        time: plan.time === "Night" ? "23:00" : "11:00",
      },
      {
        type: "Chart Update",
        description: `${plan.medicineLabel || plan.name} chart entry complete korun`,
        time: plan.time === "Night" ? "23:30" : "12:30",
      },
    ]
  }

  if (plan.type === "test") {
    return [
      {
        type: "Collect Sample",
        description: `${plan.name} sample collection korun`,
        time: "09:00",
      },
      {
        type: "Send To Lab",
        description: `${plan.name} sample lab-e pathan`,
        time: "09:30",
      },
      {
        type: "Follow Up",
        description: `${plan.name} result ashle doctor ke update korun`,
        time: "15:00",
      },
    ]
  }

  return [
    {
      type: "Observation",
      description: plan.note || `${plan.doctorName} note follow korun`,
      time: "10:00",
    },
    {
      type: "Recheck Vitals",
      description: "Vitals repeat kore chart e likhun",
      time: "14:00",
    },
    {
      type: "Shift Handover",
      description: "Next shift er jonno concise handover ready rakhun",
      time: "19:00",
    },
  ]
}

function buildNurseTasksForPlan(plan, index) {
  const patientName = getPatientName(plan.icuPatientId.replace("icu-", "").split("-").slice(1).join("-") || plan.icuPatientId)
  const nurseIds = getNurseIdsForPlan(plan)
  const variants = getTaskVariantsForPlan(plan)
  const taskCount = index % 2 === 0 ? 3 : 2

  return variants.slice(0, taskCount).map((variant, variantIndex) => {
    const nurseId = nurseIds[(index + variantIndex) % nurseIds.length] || nurseIds[0] || "n1"
    const taskId = `nt-${index + 1}-${variantIndex + 1}`

    return {
      id: taskId,
      icuPatientId: plan.icuPatientId,
      planId: plan.id,
      patientName,
      nurseId,
      type: variant.type,
      description: variant.description,
      time: variant.time,
      status: variantIndex === 1 && plan.type === "medicine" ? "In Progress" : variantIndex === 0 ? "Pending" : "Pending",
      createdAt: addDays(-Math.max(1, variantIndex + 1)),
      ...(variant.type === "Chart Update" ? { note: "Shift chart updated" } : {}),
      ...(variant.type === "Follow Up" ? { note: "Awaiting investigation result" } : {}),
      ...(variant.type === "Shift Handover" ? { note: "Verbal handover ready" } : {}),
    }
  })
}

export function buildDemoAppointments() {
  const schedule = [
    [0, "p1", "d1", "h1", "09:00"],
    [0, "p11", "d2", "h1", "11:00"],
    [1, "p2", "d1", "h2", "09:30"],
    [1, "p12", "d3", "h2", "11:30"],
    [2, "p3", "d5", "h1", "10:00"],
    [2, "p13", "d7", "h1", "12:00"],
    [3, "p4", "d3", "h2", "09:00"],
    [3, "p14", "d6", "h2", "11:30"],
    [4, "p5", "d4", "h1", "09:15"],
    [4, "p15", "d2", "h1", "12:15"],
    [5, "p6", "d6", "h2", "09:45"],
    [5, "p16", "d3", "h2", "11:45"],
    [6, "p7", "d7", "h1", "10:15"],
    [6, "p17", "d4", "h1", "13:00"],
    [0, "p18", "d10", "h2", "14:15"],
    [0, "p21", "d5", "h1", "15:00"],
    [1, "p19", "d9", "h2", "13:15"],
    [1, "p22", "d2", "h1", "16:00"],
    [2, "p20", "d4", "h2", "14:00"],
    [2, "p23", "d6", "h2", "15:30"],
    [3, "p24", "d3", "h2", "13:45"],
    [3, "p25", "d8", "h1", "16:15"],
    [4, "p26", "d9", "h2", "10:45"],
    [4, "p27", "d10", "h1", "14:45"],
    [5, "p28", "d6", "h2", "13:30"],
    [5, "p29", "d1", "h1", "16:30"],
    [6, "p30", "d3", "h2", "12:45"],
    [6, "p21", "d7", "h1", "15:15"],
  ]

  return schedule.map(([dayOffset, patientId, doctorId, hospitalId, time], index) => ({
    id: `a${index + 1}`,
    patientId,
    doctorId,
    hospitalId,
    date: addDays(dayOffset).split("T")[0],
    time,
    status: index % 4 === 3 ? "Checked In" : "Scheduled",
  }))
}

export function buildDemoBeds(hospitals) {
  const beds = []

  hospitals.forEach((hospital) => {
    for (let i = 1; i <= 10; i += 1) {
      beds.push({ id: `${hospital.id}-icu-${i}`, hospitalId: hospital.id, number: `ICU-${padNumber(i)}`, occupied: false, type: "ICU" })
    }

    for (let i = 1; i <= 10; i += 1) {
      beds.push({ id: `${hospital.id}-cab-${i}`, hospitalId: hospital.id, number: `CAB-${padNumber(i)}`, occupied: false, type: "Cabin" })
    }

    WARD_LABELS.forEach((wardName, wardIndex) => {
      for (let bedIndex = 1; bedIndex <= 2; bedIndex += 1) {
        beds.push({
          id: `${hospital.id}-ward-${wardIndex + 1}-${bedIndex}`,
          hospitalId: hospital.id,
          number: `BED-${String.fromCharCode(65 + wardIndex)}-${padNumber(bedIndex)}`,
          occupied: false,
          type: "Ward",
          wardName,
        })
      }
    })
  })

  return beds
}

export function buildDemoInpatientData(hospitals, beds) {
  const admissions = {
    icuPatients: [
      {
        id: "icu-h1-p1",
        hospitalId: "h1",
        patientId: "p1",
        bedId: findBedId(beds, "h1", "ICU", "ICU-01"),
        doctorIds: ["d1", "d4"],
        nurseIds: ["n1", "n4"],
        admittedAt: addDays(-1),
        status: "Active",
        vitals: makeVitals(94, "138/86", 96, 99.1, 22, addDays(-1), "Nurse Fatema Akter"),
      },
      {
        id: "icu-h1-p3",
        hospitalId: "h1",
        patientId: "p3",
        bedId: findBedId(beds, "h1", "ICU", "ICU-02"),
        doctorIds: ["d2", "d7"],
        nurseIds: ["n2", "n5"],
        admittedAt: addDays(-2),
        status: "Active",
        vitals: makeVitals(102, "146/92", 93, 100.2, 24, addDays(-1), "Nurse Rahima Sultana"),
      },
      {
        id: "icu-h2-p2",
        hospitalId: "h2",
        patientId: "p2",
        bedId: findBedId(beds, "h2", "ICU", "ICU-01"),
        doctorIds: ["d3", "d4"],
        nurseIds: ["n3", "n6"],
        admittedAt: addDays(-1),
        status: "Active",
        vitals: makeVitals(88, "124/78", 98, 98.4, 18, addDays(-1), "Nurse Shirin Begum"),
      },
      {
        id: "icu-h2-p4",
        hospitalId: "h2",
        patientId: "p4",
        bedId: findBedId(beds, "h2", "ICU", "ICU-02"),
        doctorIds: ["d3", "d6"],
        nurseIds: ["n7", "n8"],
        admittedAt: addDays(-3),
        status: "Active",
        vitals: makeVitals(91, "130/84", 95, 99.0, 20, addDays(-1), "Nurse Priti Das"),
      },
      {
        id: "icu-h1-p13",
        hospitalId: "h1",
        patientId: "p13",
        bedId: findBedId(beds, "h1", "ICU", "ICU-03"),
        doctorIds: ["d7", "d10"],
        nurseIds: ["n2", "n9"],
        admittedAt: addDays(-4),
        status: "Active",
        vitals: makeVitals(89, "132/84", 97, 99.0, 19, addDays(-1), "Nurse Kamrul Hasan"),
      },
      {
        id: "icu-h1-p15",
        hospitalId: "h1",
        patientId: "p15",
        bedId: findBedId(beds, "h1", "ICU", "ICU-04"),
        doctorIds: ["d2", "d4"],
        nurseIds: ["n1", "n9"],
        admittedAt: addDays(-2),
        status: "Active",
        vitals: makeVitals(98, "144/90", 95, 99.6, 21, addDays(-1), "Nurse Fatema Akter"),
      },
      {
        id: "icu-h2-p14",
        hospitalId: "h2",
        patientId: "p14",
        bedId: findBedId(beds, "h2", "ICU", "ICU-03"),
        doctorIds: ["d6", "d9"],
        nurseIds: ["n7", "n10"],
        admittedAt: addDays(-2),
        status: "Active",
        vitals: makeVitals(86, "124/80", 98, 98.9, 18, addDays(-1), "Nurse Sharmin Akter"),
      },
      {
        id: "icu-h2-p19",
        hospitalId: "h2",
        patientId: "p19",
        bedId: findBedId(beds, "h2", "ICU", "ICU-04"),
        doctorIds: ["d3", "d10"],
        nurseIds: ["n3", "n10"],
        admittedAt: addDays(-5),
        status: "Active",
        vitals: makeVitals(92, "136/86", 96, 99.1, 20, addDays(-1), "Nurse Shirin Begum"),
      },
    ],
    cabinPatients: [
      {
        id: "cabin-h1-p5",
        hospitalId: "h1",
        patientId: "p5",
        bedId: findBedId(beds, "h1", "Cabin", "CAB-01"),
        bedNumber: "CAB-01",
        doctorIds: ["d1", "d5"],
        nurseIds: ["n1", "n4"],
        admittedAt: addDays(-2),
        status: "Active",
        vitalHistory: [
          makeVitals(80, "122/80", 98, 98.6, 18, addDays(-2), "Dr. Sara Rahman"),
          makeVitals(82, "120/78", 99, 98.4, 17, addDays(-1), "Dr. Sara Rahman"),
        ],
        vitals: makeVitals(82, "120/78", 99, 98.4, 17, addDays(-1), "Dr. Sara Rahman"),
      },
      {
        id: "cabin-h1-p6",
        hospitalId: "h1",
        patientId: "p6",
        bedId: findBedId(beds, "h1", "Cabin", "CAB-02"),
        bedNumber: "CAB-02",
        doctorIds: ["d2", "d7"],
        nurseIds: ["n2", "n5"],
        admittedAt: addDays(-1),
        status: "Active",
        vitalHistory: [
          makeVitals(90, "134/82", 97, 99.2, 20, addDays(-2), "Dr. Mahmud Hasan"),
          makeVitals(88, "132/80", 98, 98.9, 19, addDays(-1), "Dr. Mahmud Hasan"),
        ],
        vitals: makeVitals(88, "132/80", 98, 98.9, 19, addDays(-1), "Dr. Mahmud Hasan"),
      },
      {
        id: "cabin-h2-p7",
        hospitalId: "h2",
        patientId: "p7",
        bedId: findBedId(beds, "h2", "Cabin", "CAB-01"),
        bedNumber: "CAB-01",
        doctorIds: ["d3", "d6"],
        nurseIds: ["n3", "n6"],
        admittedAt: addDays(-2),
        status: "Active",
        vitalHistory: [
          makeVitals(86, "126/84", 97, 98.8, 18, addDays(-2), "Dr. Nusrat Jahan"),
          makeVitals(84, "124/82", 97, 98.7, 18, addDays(-1), "Dr. Nusrat Jahan"),
        ],
        vitals: makeVitals(84, "124/82", 97, 98.7, 18, addDays(-1), "Dr. Nusrat Jahan"),
      },
      {
        id: "cabin-h2-p8",
        hospitalId: "h2",
        patientId: "p8",
        bedId: findBedId(beds, "h2", "Cabin", "CAB-02"),
        bedNumber: "CAB-02",
        doctorIds: ["d4", "d6"],
        nurseIds: ["n7", "n8"],
        admittedAt: addDays(-3),
        status: "Active",
        vitalHistory: [
          makeVitals(92, "128/86", 96, 99.3, 20, addDays(-3), "Dr. Hasan Imam"),
          makeVitals(90, "126/84", 97, 99.0, 19, addDays(-1), "Dr. Hasan Imam"),
        ],
        vitals: makeVitals(90, "126/84", 97, 99.0, 19, addDays(-1), "Dr. Hasan Imam"),
      },
      {
        id: "cabin-h1-p16",
        hospitalId: "h1",
        patientId: "p16",
        bedId: findBedId(beds, "h1", "Cabin", "CAB-03"),
        bedNumber: "CAB-03",
        doctorIds: ["d5", "d10"],
        nurseIds: ["n4", "n9"],
        admittedAt: addDays(-1),
        status: "Active",
        vitalHistory: [
          makeVitals(85, "128/82", 98, 98.8, 18, addDays(-2), "Dr. Ruma Chowdhury"),
          makeVitals(84, "126/80", 98, 98.6, 17, addDays(-1), "Dr. Ruma Chowdhury"),
        ],
        vitals: makeVitals(84, "126/80", 98, 98.6, 17, addDays(-1), "Dr. Ruma Chowdhury"),
      },
      {
        id: "cabin-h1-p17",
        hospitalId: "h1",
        patientId: "p17",
        bedId: findBedId(beds, "h1", "Cabin", "CAB-04"),
        bedNumber: "CAB-04",
        doctorIds: ["d1", "d8"],
        nurseIds: ["n2", "n9"],
        admittedAt: addDays(-2),
        status: "Active",
        vitalHistory: [
          makeVitals(88, "130/84", 97, 99.0, 19, addDays(-2), "Dr. Sara Rahman"),
          makeVitals(86, "128/82", 98, 98.8, 18, addDays(-1), "Dr. Samiul Hasan"),
        ],
        vitals: makeVitals(86, "128/82", 98, 98.8, 18, addDays(-1), "Dr. Samiul Hasan"),
      },
      {
        id: "cabin-h2-p18",
        hospitalId: "h2",
        patientId: "p18",
        bedId: findBedId(beds, "h2", "Cabin", "CAB-03"),
        bedNumber: "CAB-03",
        doctorIds: ["d3", "d9"],
        nurseIds: ["n6", "n10"],
        admittedAt: addDays(-1),
        status: "Active",
        vitalHistory: [
          makeVitals(82, "120/78", 99, 98.5, 16, addDays(-2), "Dr. Nusrat Jahan"),
          makeVitals(83, "122/80", 99, 98.7, 17, addDays(-1), "Dr. Nafisa Karim"),
        ],
        vitals: makeVitals(83, "122/80", 99, 98.7, 17, addDays(-1), "Dr. Nafisa Karim"),
      },
      {
        id: "cabin-h2-p20",
        hospitalId: "h2",
        patientId: "p20",
        bedId: findBedId(beds, "h2", "Cabin", "CAB-04"),
        bedNumber: "CAB-04",
        doctorIds: ["d6", "d10"],
        nurseIds: ["n7", "n10"],
        admittedAt: addDays(-3),
        status: "Active",
        vitalHistory: [
          makeVitals(90, "134/86", 97, 99.1, 19, addDays(-3), "Dr. Arafat Hossain"),
          makeVitals(89, "132/84", 97, 98.9, 19, addDays(-1), "Dr. Arafat Hossain"),
        ],
        vitals: makeVitals(89, "132/84", 97, 98.9, 19, addDays(-1), "Dr. Arafat Hossain"),
      },
    ],
    wardPatients: [
      {
        id: "ward-h1-p9",
        hospitalId: "h1",
        patientId: "p9",
        bedId: findBedId(beds, "h1", "Ward", "BED-A-01", "Ward A"),
        wardName: "Ward A",
        doctorIds: ["d1", "d8"],
        nurseIds: ["n1", "n4"],
        admittedAt: addDays(-3),
        status: "Active",
        vitalHistory: [
          makeVitals(78, "118/76", 99, 98.6, 16, addDays(-3), "Nurse Fatema Akter"),
          makeVitals(79, "116/74", 99, 98.5, 16, addDays(-1), "Nurse Fatema Akter"),
        ],
        vitals: makeVitals(79, "116/74", 99, 98.5, 16, addDays(-1), "Nurse Fatema Akter"),
      },
      {
        id: "ward-h1-p10",
        hospitalId: "h1",
        patientId: "p10",
        bedId: findBedId(beds, "h1", "Ward", "BED-B-01", "Ward B"),
        wardName: "Ward B",
        doctorIds: ["d2", "d5"],
        nurseIds: ["n2", "n5"],
        admittedAt: addDays(-2),
        status: "Active",
        vitalHistory: [
          makeVitals(96, "140/88", 97, 99.4, 20, addDays(-2), "Dr. Mahmud Hasan"),
          makeVitals(94, "138/86", 98, 99.1, 19, addDays(-1), "Dr. Mahmud Hasan"),
        ],
        vitals: makeVitals(94, "138/86", 98, 99.1, 19, addDays(-1), "Dr. Mahmud Hasan"),
      },
      {
        id: "ward-h2-p11",
        hospitalId: "h2",
        patientId: "p11",
        bedId: findBedId(beds, "h2", "Ward", "BED-A-01", "Ward A"),
        wardName: "Ward A",
        doctorIds: ["d3", "d7"],
        nurseIds: ["n3", "n6"],
        admittedAt: addDays(-2),
        status: "Active",
        vitalHistory: [
          makeVitals(84, "126/80", 98, 98.8, 17, addDays(-2), "Nurse Shirin Begum"),
          makeVitals(83, "124/78", 98, 98.7, 17, addDays(-1), "Nurse Shirin Begum"),
        ],
        vitals: makeVitals(83, "124/78", 98, 98.7, 17, addDays(-1), "Nurse Shirin Begum"),
      },
      {
        id: "ward-h2-p12",
        hospitalId: "h2",
        patientId: "p12",
        bedId: findBedId(beds, "h2", "Ward", "BED-B-01", "Ward B"),
        wardName: "Ward B",
        doctorIds: ["d4", "d6"],
        nurseIds: ["n7", "n8"],
        admittedAt: addDays(-1),
        status: "Active",
        vitalHistory: [
          makeVitals(88, "122/76", 99, 98.5, 16, addDays(-1), "Dr. Hasan Imam"),
        ],
        vitals: makeVitals(88, "122/76", 99, 98.5, 16, addDays(-1), "Dr. Hasan Imam"),
      },
      {
        id: "ward-h1-p21",
        hospitalId: "h1",
        patientId: "p21",
        bedId: findBedId(beds, "h1", "Ward", "BED-C-01", "Ward C"),
        wardName: "Ward C",
        doctorIds: ["d5", "d10"],
        nurseIds: ["n1", "n9"],
        admittedAt: addDays(-2),
        status: "Active",
        vitalHistory: [
          makeVitals(87, "128/80", 98, 98.9, 18, addDays(-2), "Nurse Fatema Akter"),
          makeVitals(86, "126/78", 98, 98.7, 17, addDays(-1), "Nurse Kamrul Hasan"),
        ],
        vitals: makeVitals(86, "126/78", 98, 98.7, 17, addDays(-1), "Nurse Kamrul Hasan"),
      },
      {
        id: "ward-h1-p22",
        hospitalId: "h1",
        patientId: "p22",
        bedId: findBedId(beds, "h1", "Ward", "BED-D-01", "Ward D"),
        wardName: "Ward D",
        doctorIds: ["d2", "d8"],
        nurseIds: ["n2", "n9"],
        admittedAt: addDays(-1),
        status: "Active",
        vitalHistory: [
          makeVitals(92, "136/84", 97, 99.3, 20, addDays(-1), "Dr. Mahmud Hasan"),
        ],
        vitals: makeVitals(92, "136/84", 97, 99.3, 20, addDays(-1), "Dr. Mahmud Hasan"),
      },
      {
        id: "ward-h2-p23",
        hospitalId: "h2",
        patientId: "p23",
        bedId: findBedId(beds, "h2", "Ward", "BED-C-01", "Ward C"),
        wardName: "Ward C",
        doctorIds: ["d6", "d9"],
        nurseIds: ["n6", "n10"],
        admittedAt: addDays(-3),
        status: "Active",
        vitalHistory: [
          makeVitals(95, "140/88", 96, 99.5, 21, addDays(-3), "Nurse Tahmina Akter"),
          makeVitals(93, "138/86", 97, 99.2, 20, addDays(-1), "Nurse Sharmin Akter"),
        ],
        vitals: makeVitals(93, "138/86", 97, 99.2, 20, addDays(-1), "Nurse Sharmin Akter"),
      },
      {
        id: "ward-h2-p24",
        hospitalId: "h2",
        patientId: "p24",
        bedId: findBedId(beds, "h2", "Ward", "BED-D-01", "Ward D"),
        wardName: "Ward D",
        doctorIds: ["d3", "d9"],
        nurseIds: ["n3", "n10"],
        admittedAt: addDays(-2),
        status: "Active",
        vitalHistory: [
          makeVitals(84, "122/78", 99, 98.6, 17, addDays(-2), "Dr. Nusrat Jahan"),
          makeVitals(83, "120/76", 99, 98.4, 16, addDays(-1), "Dr. Nafisa Karim"),
        ],
        vitals: makeVitals(83, "120/76", 99, 98.4, 16, addDays(-1), "Dr. Nafisa Karim"),
      },
    ],
  }

  const occupiedBeds = new Set(
    [...admissions.icuPatients, ...admissions.cabinPatients, ...admissions.wardPatients]
      .map((admission) => admission.bedId)
      .filter(Boolean)
  )

  const syncedBeds = beds.map((bed) => (occupiedBeds.has(bed.id) ? { ...bed, occupied: true } : bed))

  return { ...admissions, beds: syncedBeds }
}

export function buildDemoPrescriptions() {
  return [
    {
      id: "rx-1",
      hospitalId: "h1",
      patientId: "p1",
      doctorId: "d1",
      appointmentId: "a1",
      createdAt: addDays(-6),
      symptoms: "Jor, shorir betha",
      diagnosis: "Viral Fever",
      vitals: { temp: "100.2", bp: "130/84", pulse: "96", spo2: "97", sugar: "6.5" },
      medicines: [
        makeMedicineItem("Napa", "500 mg", "1-1-1", "After Meal", 5),
        makeMedicineItem("Sergel", "20 mg", "1-0-0", "Before Meal", 7),
      ],
      tests: [makeTestItem("CBC"), makeTestItem("CRP")],
      advice: {
        patientSuggestions: "Bishram nin ebong porjapto pani pan korun",
        foodAdvice: "Halka gorom khabar o soup grohon korun",
        followUp: "5 days",
      },
    },
    {
      id: "rx-2",
      hospitalId: "h2",
      patientId: "p2",
      doctorId: "d3",
      appointmentId: "a3",
      createdAt: addDays(-5),
      symptoms: "Kof, shashkosto",
      diagnosis: "Bronchitis",
      vitals: { temp: "99.8", bp: "124/80", pulse: "90", spo2: "95", sugar: "5.8" },
      medicines: [
        makeMedicineItem("Fexo", "120 mg", "1-0-1", "After Meal", 7),
        makeMedicineItem("Cef-3", "200 mg", "1-0-1", "After Meal", 5),
      ],
      tests: [makeTestItem("Chest X-ray"), makeTestItem("CBC")],
      advice: {
        patientSuggestions: "Dhulabali eriye cholun",
        foodAdvice: "Gorom pani o vhap nin",
        followUp: "7 days",
      },
    },
    {
      id: "rx-3",
      hospitalId: "h1",
      patientId: "p5",
      doctorId: "d5",
      appointmentId: "a9",
      createdAt: addDays(-4),
      symptoms: "Gastric betha, buk jwala",
      diagnosis: "GERD",
      medicines: [
        makeMedicineItem("Seclo", "20 mg", "1-0-0", "Before Meal", 14),
        makeMedicineItem("Maxpro", "20 mg", "0-0-1", "Before Meal", 14),
      ],
      tests: [makeTestItem("H. pylori Antigen", "Tomorrow")],
      advice: {
        patientSuggestions: "Rate deri kore khaben na",
        foodAdvice: "Mosla-jukto khabar koman",
        followUp: "14 days",
      },
    },
    {
      id: "rx-4",
      hospitalId: "h2",
      patientId: "p8",
      doctorId: "d6",
      appointmentId: "a8",
      createdAt: addDays(-3),
      symptoms: "Allergy, nak diye pani pora",
      diagnosis: "Allergic Rhinitis",
      medicines: [
        makeMedicineItem("Cetin", "10 mg", "0-0-1", "After Meal", 10),
        makeMedicineItem("Fexo", "120 mg", "1-0-0", "After Meal", 10),
      ],
      tests: [makeTestItem("IgE", "Next Visit", "If symptoms worsen")],
      advice: {
        patientSuggestions: "Dhulabali o thanda poribesh theke dure thakun",
        foodAdvice: "Thanda paniyo koman",
        followUp: "10 days",
      },
    },
    {
      id: "rx-5",
      hospitalId: "h1",
      patientId: "p10",
      doctorId: "d2",
      appointmentId: "a10",
      createdAt: addDays(-2),
      symptoms: "Buke chap, shash nite kosto",
      diagnosis: "Unstable Angina (under observation)",
      vitals: { temp: "98.7", bp: "146/92", pulse: "104", spo2: "94", sugar: "7.1" },
      medicines: [
        makeMedicineItem("Brufen", "400 mg", "1-0-1", "After Meal", 3),
        makeMedicineItem("Sergel", "40 mg", "1-0-0", "Before Meal", 7),
      ],
      tests: [makeTestItem("ECG"), makeTestItem("Troponin-I"), makeTestItem("Serum Creatinine")],
      advice: {
        patientSuggestions: "Jekono notun betha hole joruri bibhage asun",
        foodAdvice: "Lobon koman",
        followUp: "3 days",
      },
    },
    {
      id: "rx-6",
      hospitalId: "h2",
      patientId: "p12",
      doctorId: "d4",
      appointmentId: "a4",
      createdAt: addDays(-1),
      symptoms: "Matha betha, bomi bomi vab",
      diagnosis: "Migraine",
      medicines: [
        makeMedicineItem("Napa", "500 mg", "1-1-1", "After Meal", 3),
        makeMedicineItem("Fexo", "60 mg", "0-0-1", "After Meal", 5),
      ],
      tests: [makeTestItem("RBS", "Today", "If not improved")],
      advice: {
        patientSuggestions: "Porjapto ghum nishchit korun",
        foodAdvice: "Caffeine koman",
        followUp: "7 days",
      },
    },
    {
      id: "rx-7",
      hospitalId: "h1",
      patientId: "p13",
      doctorId: "d7",
      appointmentId: "a6",
      createdAt: addDays(-2),
      symptoms: "Paye fola, durbolota",
      diagnosis: "CKD follow-up",
      medicines: [
        makeMedicineItem("Lasix", "40 mg", "1-0-1", "After Meal", 5),
        makeMedicineItem("Napa", "500 mg", "0-0-1", "After Meal", 3),
      ],
      tests: [makeTestItem("Serum Electrolytes"), makeTestItem("Urea")],
      advice: {
        patientSuggestions: "Pani poriman moto nin ebong blood pressure monitor korun",
        foodAdvice: "Lobon kom khan",
        followUp: "5 days",
      },
    },
    {
      id: "rx-8",
      hospitalId: "h2",
      patientId: "p14",
      doctorId: "d9",
      appointmentId: "a8",
      createdAt: addDays(-1),
      symptoms: "Matha ghura, klanti",
      diagnosis: "Anemia with migraine",
      medicines: [
        makeMedicineItem("Ferrous Sulfate", "200 mg", "1-0-1", "After Meal", 14),
        makeMedicineItem("Cetin", "10 mg", "0-0-1", "After Meal", 5),
      ],
      tests: [makeTestItem("CBC"), makeTestItem("Ferritin")],
      advice: {
        patientSuggestions: "Routine ghum ebong pani intake maintain korun",
        foodAdvice: "Iron rich khabar beshi nin",
        followUp: "10 days",
      },
    },
    {
      id: "rx-9",
      hospitalId: "h1",
      patientId: "p21",
      doctorId: "d5",
      appointmentId: "a16",
      createdAt: addDays(-1),
      symptoms: "Pet fola, heaviness",
      diagnosis: "Fatty liver with dyspepsia",
      medicines: [
        makeMedicineItem("Seclo", "20 mg", "1-0-0", "Before Meal", 10),
        makeMedicineItem("Ursocol", "300 mg", "0-0-1", "After Meal", 14),
      ],
      tests: [makeTestItem("LFT"), makeTestItem("USG W/A")],
      advice: {
        patientSuggestions: "Regular walk korun",
        foodAdvice: "Tel-mosla kom khan",
        followUp: "14 days",
      },
    },
    {
      id: "rx-10",
      hospitalId: "h2",
      patientId: "p23",
      doctorId: "d6",
      appointmentId: "a20",
      createdAt: addDays(-1),
      symptoms: "Bar bar kashi",
      diagnosis: "COPD exacerbation",
      medicines: [
        makeMedicineItem("Fexo", "120 mg", "1-0-1", "After Meal", 7),
        makeMedicineItem("Montelukast", "10 mg", "0-0-1", "After Meal", 10),
      ],
      tests: [makeTestItem("CXR"), makeTestItem("SpO2 Monitoring", "Today")],
      advice: {
        patientSuggestions: "Dhulo dhua theke dure thakun",
        foodAdvice: "Gorom pani pan korun",
        followUp: "7 days",
      },
    },
    {
      id: "rx-11",
      hospitalId: "h1",
      patientId: "p27",
      doctorId: "d2",
      appointmentId: "a25",
      createdAt: addDays(0),
      symptoms: "Buk dhorfor",
      diagnosis: "Uncontrolled hypertension",
      medicines: [
        makeMedicineItem("Amlodipine", "5 mg", "1-0-0", "After Meal", 14),
        makeMedicineItem("Losartan", "50 mg", "0-0-1", "After Meal", 14),
      ],
      tests: [makeTestItem("ECG"), makeTestItem("Creatinine")],
      advice: {
        patientSuggestions: "Daily BP check korun",
        foodAdvice: "Lobon ekdom koman",
        followUp: "7 days",
      },
    },
    {
      id: "rx-12",
      hospitalId: "h2",
      patientId: "p30",
      doctorId: "d3",
      appointmentId: "a27",
      createdAt: addDays(0),
      symptoms: "Buk jwala, gas",
      diagnosis: "Chronic gastritis",
      medicines: [
        makeMedicineItem("Maxpro", "20 mg", "1-0-0", "Before Meal", 10),
        makeMedicineItem("Antacid", "10 ml", "1-1-1", "After Meal", 5),
      ],
      tests: [makeTestItem("Stool R/E")],
      advice: {
        patientSuggestions: "Raat e late meal avoid korun",
        foodAdvice: "Jhal kom khan",
        followUp: "10 days",
      },
    },
  ]
}

export function buildDemoReports() {
  return [
    { id: "rp-1", patientId: "p1", hospitalId: "h1", name: "CBC", result: "WBC slightly elevated; Hb 12.4 g/dL", uploadedAt: addDays(-6) },
    { id: "rp-2", patientId: "p2", hospitalId: "h2", name: "Chest X-ray", result: "Mild peribronchial thickening", uploadedAt: addDays(-5) },
    { id: "rp-3", patientId: "p3", hospitalId: "h1", name: "Serum Creatinine", result: "1.6 mg/dL (elevated)", uploadedAt: addDays(-4) },
    { id: "rp-4", patientId: "p5", hospitalId: "h1", name: "H. pylori Antigen", result: "Positive", uploadedAt: addDays(-3) },
    { id: "rp-5", patientId: "p8", hospitalId: "h2", name: "IgE", result: "Raised", uploadedAt: addDays(-2) },
    { id: "rp-6", patientId: "p10", hospitalId: "h1", name: "ECG", result: "Sinus tachycardia", uploadedAt: addDays(-2) },
    { id: "rp-7", patientId: "p11", hospitalId: "h2", name: "Urine R/M/E", result: "No significant abnormality", uploadedAt: addDays(-1) },
    { id: "rp-8", patientId: "p12", hospitalId: "h2", name: "RBS", result: "7.4 mmol/L", uploadedAt: addDays(-1) },
    { id: "rp-9", patientId: "p15", hospitalId: "h1", name: "HbA1c", result: "8.2%", uploadedAt: addDays(-7) },
    { id: "rp-10", patientId: "p17", hospitalId: "h1", name: "CRP", result: "Moderately elevated", uploadedAt: addDays(-3) },
    { id: "rp-11", patientId: "p18", hospitalId: "h2", name: "TSH", result: "Borderline high", uploadedAt: addDays(-2) },
    { id: "rp-12", patientId: "p19", hospitalId: "h2", name: "CT Brain", result: "Old infarct changes", uploadedAt: addDays(-2) },
    { id: "rp-13", patientId: "p20", hospitalId: "h2", name: "Lipid Profile", result: "LDL mildly elevated", uploadedAt: addDays(-1) },
    { id: "rp-14", patientId: "p21", hospitalId: "h1", name: "LFT", result: "ALT mildly raised", uploadedAt: addDays(-1) },
    { id: "rp-15", patientId: "p22", hospitalId: "h1", name: "FT4", result: "Normal", uploadedAt: addDays(-1) },
    { id: "rp-16", patientId: "p23", hospitalId: "h2", name: "CXR", result: "Hyperinflation noted", uploadedAt: addDays(-1) },
    { id: "rp-17", patientId: "p24", hospitalId: "h2", name: "Urine C/S", result: "No growth", uploadedAt: addDays(0) },
    { id: "rp-18", patientId: "p27", hospitalId: "h1", name: "Creatinine", result: "1.1 mg/dL", uploadedAt: addDays(0) },
    { id: "rp-19", patientId: "p29", hospitalId: "h1", name: "CRP", result: "Slightly high", uploadedAt: addDays(0) },
    { id: "rp-20", patientId: "p30", hospitalId: "h2", name: "Stool R/E", result: "No ova or cyst", uploadedAt: addDays(0) },
  ]
}

export function buildDemoIcuPlans() {
  return [
    { id: "icu-plan-1", icuPatientId: "icu-h1-p1", type: "medicine", name: "Napa 500 mg", medicineLabel: "Napa 500 mg", time: "Morning, Night", doctorId: "d1", doctorName: "Dr. Sara Rahman", createdAt: addDays(-1) },
    { id: "icu-plan-2", icuPatientId: "icu-h1-p1", type: "observation", note: "SpO2 monitoring proti 2 ghonta", doctorId: "d4", doctorName: "Dr. Hasan Imam", createdAt: addDays(-1) },
    { id: "icu-plan-3", icuPatientId: "icu-h1-p3", type: "test", name: "ABG", timing: "Today", condition: "Mandatory", doctorId: "d2", doctorName: "Dr. Mahmud Hasan", createdAt: addDays(-1) },
    { id: "icu-plan-4", icuPatientId: "icu-h2-p2", type: "medicine", name: "Cef-3 200 mg", medicineLabel: "Cef-3 200 mg", time: "Morning, Night", doctorId: "d3", doctorName: "Dr. Nusrat Jahan", createdAt: addDays(-2) },
    { id: "icu-plan-5", icuPatientId: "icu-h2-p4", type: "observation", note: "Shashkosto briddhi pele NIV bibecona", doctorId: "d6", doctorName: "Dr. Arafat Hossain", createdAt: addDays(-1) },
    { id: "icu-plan-6", icuPatientId: "icu-h1-p13", type: "test", name: "Creatinine", timing: "Today", condition: "Mandatory", doctorId: "d7", doctorName: "Dr. Mahi Tasnim", createdAt: addDays(-1) },
    { id: "icu-plan-7", icuPatientId: "icu-h1-p15", type: "medicine", name: "Lasix 40 mg", medicineLabel: "Lasix 40 mg", time: "Morning", doctorId: "d2", doctorName: "Dr. Mahmud Hasan", createdAt: addDays(-1) },
    { id: "icu-plan-8", icuPatientId: "icu-h2-p14", type: "observation", note: "Hourly neuro-observation maintain", doctorId: "d9", doctorName: "Dr. Nafisa Karim", createdAt: addDays(-1) },
    { id: "icu-plan-9", icuPatientId: "icu-h2-p19", type: "medicine", name: "Aspirin 75 mg", medicineLabel: "Aspirin 75 mg", time: "Night", doctorId: "d10", doctorName: "Dr. Rafiq Uddin", createdAt: addDays(-1) },
    { id: "icu-plan-10", icuPatientId: "icu-h1-p1", type: "test", name: "Serum Lactate", timing: "Tomorrow", condition: "If unstable", doctorId: "d4", doctorName: "Dr. Hasan Imam", createdAt: addDays(0) },
  ]
}

export function buildDemoInpatientPlans() {
  return [
    { id: "inplan-1", admissionId: "cabin-h1-p5", admissionType: "cabin", patientId: "p5", hospitalId: "h1", doctorId: "d5", doctorName: "Dr. Ruma Chowdhury", createdAt: addDays(-2), type: "medicine", medicineLabel: "Seclo 20 mg", name: "Seclo 20 mg", timing: { morning: true, noon: false, night: false }, mealTiming: "Before Meal", durationDays: 7, time: "Morning" },
    { id: "inplan-2", admissionId: "cabin-h1-p6", admissionType: "cabin", patientId: "p6", hospitalId: "h1", doctorId: "d2", doctorName: "Dr. Mahmud Hasan", createdAt: addDays(-1), type: "test", name: "ECG", timing: "Today", condition: "Mandatory" },
    { id: "inplan-3", admissionId: "cabin-h2-p7", admissionType: "cabin", patientId: "p7", hospitalId: "h2", doctorId: "d3", doctorName: "Dr. Nusrat Jahan", createdAt: addDays(-1), type: "observation", note: "Rogi sthitishil, rat 10tay vitals repeat" },
    { id: "inplan-4", admissionId: "ward-h1-p9", admissionType: "ward", patientId: "p9", hospitalId: "h1", doctorId: "d1", doctorName: "Dr. Sara Rahman", createdAt: addDays(-2), type: "medicine", medicineLabel: "Napa 500 mg", name: "Napa 500 mg", timing: { morning: true, noon: true, night: true }, mealTiming: "After Meal", durationDays: 3, time: "Morning, Noon, Night" },
    { id: "inplan-5", admissionId: "ward-h2-p11", admissionType: "ward", patientId: "p11", hospitalId: "h2", doctorId: "d7", doctorName: "Dr. Mahi Tasnim", createdAt: addDays(-1), type: "test", name: "Urine R/M/E", timing: "Tomorrow", condition: "If not improved" },
    { id: "inplan-6", admissionId: "ward-h2-p12", admissionType: "ward", patientId: "p12", hospitalId: "h2", doctorId: "d4", doctorName: "Dr. Hasan Imam", createdAt: addDays(-1), type: "observation", note: "Matha betha komeche, follow-up chalu" },
    { id: "inplan-7", admissionId: "cabin-h1-p16", admissionType: "cabin", patientId: "p16", hospitalId: "h1", doctorId: "d5", doctorName: "Dr. Ruma Chowdhury", createdAt: addDays(-1), type: "test", name: "CBC", timing: "Today", condition: "Mandatory" },
    { id: "inplan-8", admissionId: "cabin-h1-p17", admissionType: "cabin", patientId: "p17", hospitalId: "h1", doctorId: "d8", doctorName: "Dr. Samiul Hasan", createdAt: addDays(-1), type: "observation", note: "Night pain score monitor korun" },
    { id: "inplan-9", admissionId: "cabin-h2-p18", admissionType: "cabin", patientId: "p18", hospitalId: "h2", doctorId: "d9", doctorName: "Dr. Nafisa Karim", createdAt: addDays(-1), type: "medicine", medicineLabel: "Cetin 10 mg", name: "Cetin 10 mg", timing: { morning: false, noon: false, night: true }, mealTiming: "After Meal", durationDays: 5, time: "Night" },
    { id: "inplan-10", admissionId: "cabin-h2-p20", admissionType: "cabin", patientId: "p20", hospitalId: "h2", doctorId: "d6", doctorName: "Dr. Arafat Hossain", createdAt: addDays(-1), type: "test", name: "ECG", timing: "Tomorrow", condition: "If chest discomfort" },
    { id: "inplan-11", admissionId: "ward-h1-p21", admissionType: "ward", patientId: "p21", hospitalId: "h1", doctorId: "d10", doctorName: "Dr. Rafiq Uddin", createdAt: addDays(-1), type: "medicine", medicineLabel: "Seclo 20 mg", name: "Seclo 20 mg", timing: { morning: true, noon: false, night: true }, mealTiming: "Before Meal", durationDays: 7, time: "Morning, Night" },
    { id: "inplan-12", admissionId: "ward-h2-p23", admissionType: "ward", patientId: "p23", hospitalId: "h2", doctorId: "d6", doctorName: "Dr. Arafat Hossain", createdAt: addDays(-1), type: "observation", note: "SpO2 every 4 hours" },
  ]
}

export function buildDemoNurseTasks() {
  return buildDemoIcuPlans().flatMap((plan, index) => buildNurseTasksForPlan(plan, index))
}

export function buildDemoDoctorsForHospital(hospitalId) {
  return demoDoctors.filter((doctor) => doctor.hospitalIds?.includes(hospitalId))
}

export function buildDemoNursesForHospital(hospitalId) {
  return demoNurses.filter((nurse) => nurse.hospitalId === hospitalId)
}
