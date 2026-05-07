export const doctors = [
  {
    id: "d1",
    name: "Dr. Sara Rahman",
    specialty: "Medicine",
    department: "General Medicine",
    bmdcRegNo: "A-12345",
    designation: "Medical Officer",
  },
  {
    id: "d2",
    name: "Dr. Mahmud Hasan",
    specialty: "Cardiology",
    department: "Cardiology",
    bmdcRegNo: "A-23456",
    designation: "Registrar",
  },
  {
    id: "d3",
    name: "Dr. Nusrat Jahan",
    specialty: "Paediatrics",
    department: "Paediatrics",
    bmdcRegNo: "A-34567",
    designation: "Consultant",
  },
]

export function getDoctorById(id) {
  return doctors.find((d) => d.id === id) || null
}
