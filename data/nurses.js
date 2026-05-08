// 📋 NURSES DATA - Heavy Mock Data (May 9, 2026)
// Complete nurse roster for all shifts

export const demoNurses = [
  // ===== HOSPITAL 1 - NURSES =====
  {
    id: "n1",
    name: "Nurse Fatema Akter",
    hospitalId: "h1",
    shift: "Day",
    designation: "Senior ICU Nurse",
    brnNo: "BRN-2020-001",
    experience: 5,
    specialization: "Critical Care",
    phone: "01800-100001",
  },
  {
    id: "n2",
    name: "Nurse Rahima Sultana",
    hospitalId: "h1",
    shift: "Night",
    designation: "ICU Nurse",
    brnNo: "BRN-2019-045",
    experience: 3,
    specialization: "ICU Monitoring",
    phone: "01800-100002",
  },
  {
    id: "n4",
    name: "Nurse Ayesha Khatun",
    hospitalId: "h1",
    shift: "Day",
    designation: "ICU Nurse",
    brnNo: "BRN-2021-078",
    experience: 2,
    specialization: "Cardiac Care",
    phone: "01800-100003",
  },
  {
    id: "n5",
    name: "Nurse Nusrat Jahan",
    hospitalId: "h1",
    shift: "Night",
    designation: "ICU Nurse",
    brnNo: "BRN-2020-112",
    experience: 4,
    specialization: "Respiratory Care",
    phone: "01800-100004",
  },
  {
    id: "n9",
    name: "Nurse Kamrul Hasan",
    hospitalId: "h1",
    shift: "Night",
    designation: "ICU Nurse",
    brnNo: "BRN-2021-089",
    experience: 1,
    specialization: "General ICU",
    phone: "01800-100005",
  },

  // ===== HOSPITAL 2 - NURSES =====
  {
    id: "n3",
    name: "Nurse Shirin Begum",
    hospitalId: "h2",
    shift: "Day",
    designation: "Senior ICU Nurse",
    brnNo: "BRN-2019-034",
    experience: 6,
    specialization: "Critical Care",
    phone: "01800-200001",
  },
  {
    id: "n6",
    name: "Nurse Tahmina Akter",
    hospitalId: "h2",
    shift: "Day",
    designation: "ICU Nurse",
    brnNo: "BRN-2020-156",
    experience: 3,
    specialization: "Neurological Care",
    phone: "01800-200002",
  },
  {
    id: "n7",
    name: "Nurse Priti Das",
    hospitalId: "h2",
    shift: "Night",
    designation: "ICU Nurse",
    brnNo: "BRN-2020-189",
    experience: 2,
    specialization: "Gastric Care",
    phone: "01800-200003",
  },
  {
    id: "n8",
    name: "Nurse Mahbuba Khan",
    hospitalId: "h2",
    shift: "Day",
    designation: "ICU Nurse",
    brnNo: "BRN-2021-201",
    experience: 2,
    specialization: "Respiratory Care",
    phone: "01800-200004",
  },
  {
    id: "n10",
    name: "Nurse Sharmin Akter",
    hospitalId: "h2",
    shift: "Night",
    designation: "ICU Nurse",
    brnNo: "BRN-2021-234",
    experience: 1,
    specialization: "General ICU",
    phone: "01800-200005",
  },
];

export function getNurseById(id) {
  return demoNurses.find((n) => n.id === id) || null;
}

export function getNursesByHospital(hospitalId) {
  return demoNurses.filter((n) => n.hospitalId === hospitalId) || [];
}

export function getNursesByShift(shift) {
  return demoNurses.filter((n) => n.shift === shift) || [];
}

export function getDayShiftNurses(hospitalId) {
  return (
    demoNurses.filter(
      (n) => n.hospitalId === hospitalId && n.shift === "Day",
    ) || []
  );
}

export function getNightShiftNurses(hospitalId) {
  return (
    demoNurses.filter(
      (n) => n.hospitalId === hospitalId && n.shift === "Night",
    ) || []
  );
}
