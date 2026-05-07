"use client"

import { useEffect, useMemo, useState } from "react"

function storageKey(doctorId) {
  return `doctor_active_hospital_id_${doctorId || "unknown"}`
}

export function useDoctorHospital({ doctor, hospitals }) {
  const fallbackId = doctor?.hospitalIds?.[0] || ""
  const [hospitalId, setHospitalId] = useState(fallbackId)

  useEffect(() => {
    if (!doctor?.id) return
    try {
      const saved = localStorage.getItem(storageKey(doctor.id))
      if (saved && doctor?.hospitalIds?.includes(saved)) {
        setHospitalId(saved)
      } else if (fallbackId) {
        setHospitalId(fallbackId)
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor?.id])

  useEffect(() => {
    if (!doctor?.id) return
    if (!hospitalId) return
    try {
      localStorage.setItem(storageKey(doctor.id), hospitalId)
    } catch {
      // ignore
    }
  }, [doctor?.id, hospitalId])

  const hospital = useMemo(
    () => hospitals?.find((h) => h.id === hospitalId) || null,
    [hospitals, hospitalId]
  )

  return {
    hospitalId,
    setHospitalId,
    hospital,
  }
}
