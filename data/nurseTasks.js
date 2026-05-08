// 🏥 HEAVY NURSE TASKS DATA - May 9, 2026
// Pre-generated comprehensive task list for ICU nurses
// Includes all shifts: Day (06:00-18:00) and Night (18:00-06:00)

export const generateNurseTasks = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const createTask = (
    patientId,
    patientName,
    bedNumber,
    nurseId,
    type,
    time,
    priority,
    medicine = null,
  ) => {
    const [hour, minute] = time.split(":").map(Number);
    const taskDate = new Date(today);
    taskDate.setHours(hour, minute, 0, 0);

    const now = new Date();
    let status = "Pending";
    if (taskDate <= now) {
      const diffMs = now - taskDate;
      const diffMins = diffMs / (1000 * 60);
      if (diffMins < 30) status = "In Progress";
      else status = "Completed";
    }

    return {
      id: `task_${patientId}_${type}_${time.replace(":", "")}`,
      patientId,
      patientName,
      bedNumber,
      nurseId,
      type,
      category: type === "Vital Signs" ? "Monitoring" : "Prescription",
      description: medicine ? `${type}: ${medicine.name}` : `${type} Check`,
      details: medicine
        ? `Administer ${medicine.name} ${medicine.dosage} via ${medicine.route}`
        : `Monitor and record ${type.toLowerCase()}`,
      time,
      status,
      priority,
      createdAt: new Date().toISOString(),
      completedAt: null,
      completionTime: null,
      note: "",
      medicine,
    };
  };

  const tasks = [];

  // ===== DAY SHIFT TASKS (06:00-18:00) - Nurse Fatema, Ayesha, Shirin, Mahbuba, Tahmina =====

  // Bed ICU-01 (Md. Abdul Karim) - Critical - Day Nurse: Nurse Fatema Akter
  tasks.push(
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n1", "Vital Signs", "06:00", "Routine"),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n1", "Injection", "06:30", "Critical", {
      name: "Cef-3 IV",
      dosage: "200mg",
      route: "IV",
    }),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n1", "Medicine", "08:00", "Important", {
      name: "Napa",
      dosage: "500mg",
      route: "Oral",
    }),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n1", "Vital Signs", "08:00", "Routine"),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n1", "Insulin", "08:30", "Critical", {
      name: "Insulin",
      dosage: "10 units",
      route: "IV",
    }),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n1", "Vital Signs", "10:00", "Routine"),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n1", "Injection", "14:30", "Critical", {
      name: "Cef-3 IV",
      dosage: "200mg",
      route: "IV",
    }),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n1", "Vital Signs", "12:00", "Routine"),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n1", "Observation", "14:00", "Important"),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n1", "Vital Signs", "16:00", "Routine"),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n1", "Medicine", "18:00", "Important", {
      name: "Napa",
      dosage: "500mg",
      route: "Oral",
    }),
  );

  // Bed ICU-02 (Md. Hasan Mahmud) - Observation - Day Nurse: Nurse Ayesha
  tasks.push(
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n4", "Vital Signs", "06:00", "Routine"),
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n4", "Medicine", "06:30", "Important", {
      name: "Monas",
      dosage: "10mg",
      route: "Oral",
    }),
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n4", "Vital Signs", "08:00", "Routine"),
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n4", "ECG", "09:00", "Important"),
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n4", "Vital Signs", "10:00", "Routine"),
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n4", "Observation", "12:00", "Important"),
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n4", "Vital Signs", "14:00", "Routine"),
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n4", "Blood Glucose Check", "16:00", "Important"),
  );

  // Bed ICU-03 (Md. Tanvir Hasan) - Stable - Day Nurse: Nurse Fatema
  tasks.push(
    createTask("icu-h1-p13", "Md. Tanvir Hasan", "ICU-03", "n1", "Vital Signs", "06:00", "Routine"),
    createTask("icu-h1-p13", "Md. Tanvir Hasan", "ICU-03", "n1", "Medicine", "07:00", "Important", {
      name: "Vasopril",
      dosage: "5mg",
      route: "Oral",
    }),
    createTask("icu-h1-p13", "Md. Tanvir Hasan", "ICU-03", "n1", "Vital Signs", "08:00", "Routine"),
    createTask("icu-h1-p13", "Md. Tanvir Hasan", "ICU-03", "n1", "Vital Signs", "10:00", "Routine"),
    createTask("icu-h1-p13", "Md. Tanvir Hasan", "ICU-03", "n1", "Urine Output Check", "12:00", "Important"),
    createTask("icu-h1-p13", "Md. Tanvir Hasan", "ICU-03", "n1", "Vital Signs", "14:00", "Routine"),
    createTask("icu-h1-p13", "Md. Tanvir Hasan", "ICU-03", "n1", "Medicine", "18:00", "Important", {
      name: "Calcon",
      dosage: "500mg",
      route: "Oral",
    }),
  );

  // Bed ICU-04 (Md. Farid Uddin) - Critical - Day Nurse: Nurse Ayesha
  tasks.push(
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n4", "Vital Signs", "06:00", "Routine"),
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n4", "Injection", "06:15", "Critical", {
      name: "Digoxin",
      dosage: "0.25mg",
      route: "IV",
    }),
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n4", "Vital Signs", "08:00", "Routine"),
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n4", "Injection", "08:30", "Critical", {
      name: "Diuretic",
      dosage: "40mg",
      route: "IV",
    }),
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n4", "Vital Signs", "10:00", "Routine"),
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n4", "Observation", "12:00", "Critical"),
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n4", "Vital Signs", "14:00", "Routine"),
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n4", "Vital Signs", "16:00", "Routine"),
  );

  // Bed ICU-05 (Md. Jahid Hasan) - Observation - Day Nurse: Nurse Shirin
  tasks.push(
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n3", "Vital Signs", "06:00", "Routine"),
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n3", "Medicine", "07:00", "Important", {
      name: "Clopidogrel",
      dosage: "75mg",
      route: "Oral",
    }),
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n3", "Vital Signs", "08:00", "Routine"),
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n3", "ECG", "10:00", "Important"),
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n3", "Vital Signs", "12:00", "Routine"),
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n3", "Observation", "14:00", "Important"),
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n3", "Vital Signs", "16:00", "Routine"),
  );

  // ===== HOSPITAL 2 - DAY SHIFT =====

  // Bed ICU-01 (Farzana Akter) - Stable - Day Nurse: Nurse Shirin
  tasks.push(
    createTask("icu-h2-p2", "Farzana Akter", "ICU-01", "n3", "Vital Signs", "06:00", "Routine"),
    createTask("icu-h2-p2", "Farzana Akter", "ICU-01", "n3", "Medicine", "06:30", "Important", {
      name: "Sergel",
      dosage: "40mg",
      route: "Oral",
    }),
    createTask("icu-h2-p2", "Farzana Akter", "ICU-01", "n3", "Vital Signs", "08:00", "Routine"),
    createTask("icu-h2-p2", "Farzana Akter", "ICU-01", "n3", "Vital Signs", "10:00", "Routine"),
    createTask("icu-h2-p2", "Farzana Akter", "ICU-01", "n3", "Vital Signs", "12:00", "Routine"),
    createTask("icu-h2-p2", "Farzana Akter", "ICU-01", "n3", "Observation", "14:00", "Important"),
    createTask("icu-h2-p2", "Farzana Akter", "ICU-01", "n3", "Vital Signs", "16:00", "Routine"),
  );

  // Bed ICU-02 (Nusrat Jahan) - Observation - Day Nurse: Nurse Mahbuba
  tasks.push(
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n8", "Vital Signs", "06:00", "Routine"),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n8", "Injection", "06:30", "Critical", {
      name: "Cef-3 IV",
      dosage: "200mg",
      route: "IV",
    }),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n8", "Vital Signs", "08:00", "Routine"),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n8", "Respiratory Assessment", "09:00", "Critical"),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n8", "Vital Signs", "10:00", "Routine"),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n8", "Vital Signs", "12:00", "Routine"),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n8", "Observation", "14:00", "Important"),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n8", "Vital Signs", "16:00", "Routine"),
  );

  // Bed ICU-03 (Sumaiya Islam) - Stable - Day Nurse: Nurse Tahmina
  tasks.push(
    createTask("icu-h2-p14", "Sumaiya Islam", "ICU-03", "n6", "Vital Signs", "06:00", "Routine"),
    createTask("icu-h2-p14", "Sumaiya Islam", "ICU-03", "n6", "Medicine", "07:00", "Important", {
      name: "Propranolol",
      dosage: "40mg",
      route: "Oral",
    }),
    createTask("icu-h2-p14", "Sumaiya Islam", "ICU-03", "n6", "Vital Signs", "08:00", "Routine"),
    createTask("icu-h2-p14", "Sumaiya Islam", "ICU-03", "n6", "Vital Signs", "10:00", "Routine"),
    createTask("icu-h2-p14", "Sumaiya Islam", "ICU-03", "n6", "Vital Signs", "12:00", "Routine"),
    createTask("icu-h2-p14", "Sumaiya Islam", "ICU-03", "n6", "Observation", "14:00", "Important"),
    createTask("icu-h2-p14", "Sumaiya Islam", "ICU-03", "n6", "Vital Signs", "16:00", "Routine"),
  );

  // Bed ICU-04 (Md. Arif Hossain) - Critical - Day Nurse: Nurse Mahbuba
  tasks.push(
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n8", "Vital Signs", "06:00", "Routine"),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n8", "Injection", "06:15", "Critical", {
      name: "Warfarin",
      dosage: "5mg",
      route: "IV",
    }),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n8", "Vital Signs", "08:00", "Routine"),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n8", "Neurological Check", "09:00", "Critical"),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n8", "Vital Signs", "10:00", "Routine"),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n8", "Vital Signs", "12:00", "Routine"),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n8", "Observation", "14:00", "Critical"),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n8", "Vital Signs", "16:00", "Routine"),
  );

  // ===== NIGHT SHIFT TASKS (18:00-06:00) - Nurse Rahima, Nusrat, Priti, Kamrul, Sharmin =====

  // Bed ICU-01 (Md. Abdul Karim) - Critical - Night Nurse: Nurse Rahima
  tasks.push(
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n2", "Vital Signs", "18:00", "Routine"),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n2", "Injection", "22:30", "Critical", {
      name: "Cef-3 IV",
      dosage: "200mg",
      route: "IV",
    }),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n2", "Vital Signs", "20:00", "Routine"),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n2", "Insulin", "22:00", "Critical", {
      name: "Insulin",
      dosage: "10 units",
      route: "IV",
    }),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n2", "Vital Signs", "22:00", "Routine"),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n2", "Observation", "00:00", "Important"),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n2", "Vital Signs", "02:00", "Routine"),
    createTask("icu-h1-p1", "Md. Abdul Karim", "ICU-01", "n2", "Vital Signs", "04:00", "Routine"),
  );

  // Bed ICU-02 (Md. Hasan Mahmud) - Observation - Night Nurse: Nurse Nusrat
  tasks.push(
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n5", "Vital Signs", "18:00", "Routine"),
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n5", "Medicine", "18:30", "Important", {
      name: "Monas",
      dosage: "10mg",
      route: "Oral",
    }),
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n5", "Vital Signs", "20:00", "Routine"),
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n5", "Vital Signs", "22:00", "Routine"),
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n5", "Observation", "00:00", "Important"),
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n5", "Vital Signs", "02:00", "Routine"),
    createTask("icu-h1-p3", "Md. Hasan Mahmud", "ICU-02", "n5", "Vital Signs", "04:00", "Routine"),
  );

  // Bed ICU-03 (Md. Tanvir Hasan) - Stable - Night Nurse: Nurse Kamrul
  tasks.push(
    createTask("icu-h1-p13", "Md. Tanvir Hasan", "ICU-03", "n9", "Vital Signs", "18:00", "Routine"),
    createTask("icu-h1-p13", "Md. Tanvir Hasan", "ICU-03", "n9", "Vital Signs", "20:00", "Routine"),
    createTask("icu-h1-p13", "Md. Tanvir Hasan", "ICU-03", "n9", "Vital Signs", "22:00", "Routine"),
    createTask("icu-h1-p13", "Md. Tanvir Hasan", "ICU-03", "n9", "Observation", "00:00", "Important"),
    createTask("icu-h1-p13", "Md. Tanvir Hasan", "ICU-03", "n9", "Vital Signs", "02:00", "Routine"),
    createTask("icu-h1-p13", "Md. Tanvir Hasan", "ICU-03", "n9", "Vital Signs", "04:00", "Routine"),
  );

  // Bed ICU-04 (Md. Farid Uddin) - Critical - Night Nurse: Nurse Kamrul
  tasks.push(
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n9", "Vital Signs", "18:00", "Routine"),
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n9", "Injection", "18:30", "Critical", {
      name: "Digoxin",
      dosage: "0.25mg",
      route: "IV",
    }),
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n9", "Vital Signs", "20:00", "Routine"),
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n9", "Observation", "21:00", "Critical"),
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n9", "Vital Signs", "22:00", "Routine"),
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n9", "Vital Signs", "02:00", "Routine"),
    createTask("icu-h1-p15", "Md. Farid Uddin", "ICU-04", "n9", "Vital Signs", "04:00", "Routine"),
  );

  // Bed ICU-05 (Md. Jahid Hasan) - Observation - Night Nurse: Nurse Nusrat
  tasks.push(
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n5", "Vital Signs", "18:00", "Routine"),
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n5", "Medicine", "18:30", "Important", {
      name: "Lovastatin",
      dosage: "20mg",
      route: "Oral",
    }),
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n5", "Vital Signs", "20:00", "Routine"),
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n5", "Vital Signs", "22:00", "Routine"),
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n5", "Observation", "00:00", "Important"),
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n5", "Vital Signs", "02:00", "Routine"),
    createTask("icu-h1-p7", "Md. Jahid Hasan", "ICU-05", "n5", "Vital Signs", "04:00", "Routine"),
  );

  // ===== HOSPITAL 2 - NIGHT SHIFT =====

  // Bed ICU-01 (Farzana Akter) - Stable - Night Nurse: Nurse Priti
  tasks.push(
    createTask("icu-h2-p2", "Farzana Akter", "ICU-01", "n7", "Vital Signs", "18:00", "Routine"),
    createTask("icu-h2-p2", "Farzana Akter", "ICU-01", "n7", "Vital Signs", "20:00", "Routine"),
    createTask("icu-h2-p2", "Farzana Akter", "ICU-01", "n7", "Vital Signs", "22:00", "Routine"),
    createTask("icu-h2-p2", "Farzana Akter", "ICU-01", "n7", "Observation", "00:00", "Important"),
    createTask("icu-h2-p2", "Farzana Akter", "ICU-01", "n7", "Vital Signs", "02:00", "Routine"),
    createTask("icu-h2-p2", "Farzana Akter", "ICU-01", "n7", "Vital Signs", "04:00", "Routine"),
  );

  // Bed ICU-02 (Nusrat Jahan) - Observation - Night Nurse: Nurse Sharmin
  tasks.push(
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n10", "Vital Signs", "18:00", "Routine"),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n10", "Injection", "18:30", "Critical", {
      name: "Cef-3 IV",
      dosage: "200mg",
      route: "IV",
    }),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n10", "Vital Signs", "20:00", "Routine"),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n10", "Respiratory Assessment", "21:00", "Critical"),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n10", "Vital Signs", "22:00", "Routine"),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n10", "Observation", "00:00", "Important"),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n10", "Vital Signs", "02:00", "Routine"),
    createTask("icu-h2-p4", "Nusrat Jahan", "ICU-02", "n10", "Vital Signs", "04:00", "Routine"),
  );

  // Bed ICU-03 (Sumaiya Islam) - Stable - Night Nurse: Nurse Priti
  tasks.push(
    createTask("icu-h2-p14", "Sumaiya Islam", "ICU-03", "n7", "Vital Signs", "18:00", "Routine"),
    createTask("icu-h2-p14", "Sumaiya Islam", "ICU-03", "n7", "Vital Signs", "20:00", "Routine"),
    createTask("icu-h2-p14", "Sumaiya Islam", "ICU-03", "n7", "Vital Signs", "22:00", "Routine"),
    createTask("icu-h2-p14", "Sumaiya Islam", "ICU-03", "n7", "Observation", "00:00", "Important"),
    createTask("icu-h2-p14", "Sumaiya Islam", "ICU-03", "n7", "Vital Signs", "02:00", "Routine"),
    createTask("icu-h2-p14", "Sumaiya Islam", "ICU-03", "n7", "Vital Signs", "04:00", "Routine"),
  );

  // Bed ICU-04 (Md. Arif Hossain) - Critical - Night Nurse: Nurse Sharmin
  tasks.push(
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n10", "Vital Signs", "18:00", "Routine"),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n10", "Injection", "18:30", "Critical", {
      name: "Warfarin",
      dosage: "5mg",
      route: "IV",
    }),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n10", "Vital Signs", "20:00", "Routine"),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n10", "Neurological Check", "21:00", "Critical"),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n10", "Vital Signs", "22:00", "Routine"),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n10", "Observation", "00:00", "Critical"),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n10", "Vital Signs", "02:00", "Routine"),
    createTask("icu-h2-p19", "Md. Arif Hossain", "ICU-04", "n10", "Vital Signs", "04:00", "Routine"),
  );

  return tasks;
};

export const parsedNurseTasks = generateNurseTasks();
