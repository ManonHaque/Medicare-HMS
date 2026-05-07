"use client"

import { use } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { DOCTOR_NAV } from "@/components/doctor/doctor-nav"
import InpatientCareDetail from "@/components/doctor/InpatientCareDetail"

export default function WardPatientDetailPage({ params }) {
  const resolvedParams = use(params)

  return (
    <DashboardLayout role="doctor" title="Ward Patient" navItems={DOCTOR_NAV}>
      <InpatientCareDetail
        admissionId={resolvedParams.id}
        admissionType="ward"
        backHref="/doctor/wards"
        label="Ward"
      />
    </DashboardLayout>
  )
}
