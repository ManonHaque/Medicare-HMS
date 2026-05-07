import { demoPatients } from "@/lib/demo-roster"

export const patients = demoPatients

export function getPatientById(id) {
  return patients.find((p) => p.id === id) || null
}
