"use client"

import { use } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { DOCTOR_NAV } from "@/components/doctor/doctor-nav"
import InpatientCareDetail from "@/components/doctor/InpatientCareDetail"

export default function CabinPatientDetailPage({ params }) {
  const resolvedParams = use(params)

  return (
    <DashboardLayout role="doctor" title="Cabin Patient" navItems={DOCTOR_NAV}>
      <InpatientCareDetail
        admissionId={resolvedParams.id}
        admissionType="cabin"
        backHref="/doctor/cabins"
        label="Cabin"
      />
    </DashboardLayout>
  )
}
