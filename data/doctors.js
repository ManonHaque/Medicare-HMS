import { demoDoctors } from "@/lib/demo-roster"

export const doctors = demoDoctors

export function getDoctorById(id) {
  return doctors.find((d) => d.id === id) || null
}
