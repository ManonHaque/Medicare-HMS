export const patients = [
  {
    id: "p1",
    name: "Abdul Karim",
    age: 45,
    gender: "Male",
    phone: "01711-100101",
    bloodGroup: "B+",
    heightCm: 168,
    weightKg: 72,
    address: "Mirpur, Dhaka",
    allergies: ["Penicillin"],
    chronicConditions: ["Hypertension"],
  },
  {
    id: "p2",
    name: "Farzana Akter",
    age: 32,
    gender: "Female",
    phone: "01819-200202",
    bloodGroup: "O+",
    heightCm: null,
    weightKg: null,
    address: "Panchlaish, Chattogram",
    allergies: [],
    chronicConditions: ["Gastritis"],
  },
]

export function getPatientById(id) {
  return patients.find((p) => p.id === id) || null
}
