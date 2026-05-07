"use client"

import { use } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import ConsultationScreen from "@/components/doctor/ConsultationScreen"
import { DOCTOR_NAV } from "@/components/doctor/doctor-nav"

export default function ConsultationPage({ params }) {
  const resolvedParams = use(params)

  return (
    <DashboardLayout role="doctor" title="Consultation" navItems={DOCTOR_NAV}>
      <ConsultationScreen appointmentId={resolvedParams.id} />
    </DashboardLayout>
  )
}
