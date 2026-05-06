"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { useStore } from "@/lib/store"
import CompanyDashboard from "@/components/company/CompanyDashboard"
import CompanyMedicinesTable from "@/components/company/CompanyMedicinesTable"
import CompanyMedicineForm from "@/components/company/CompanyMedicineForm"
import CompanyPendingApprovals from "@/components/company/CompanyPendingApprovals"
import CompanyProfile from "@/components/company/CompanyProfile"
import MedicinePreviewModal from "@/components/medicine/MedicinePreviewModal"
import { medicines as seedMedicines } from "@/data/medicines"

const NAV = [
  { href: "/company?tab=dashboard", label: "Dashboard" },
  { href: "/company?tab=medicines", label: "My Medicines" },
  { href: "/company?tab=add", label: "Add Medicine" },
  { href: "/company?tab=pending", label: "Pending Approvals" },
  { href: "/company?tab=profile", label: "Profile" },
]

const TAB_TITLES = {
  dashboard: {
    title: "Company Dashboard",
    subtitle: "Portfolio oversight and regulatory status at a glance",
  },
  medicines: {
    title: "My Medicines",
    subtitle: "Manage active and submitted medicine profiles",
  },
  add: {
    title: "Add / Edit Medicine",
    subtitle: "Create a structured clinical profile for approval",
  },
  pending: {
    title: "Pending Approvals",
    subtitle: "Submissions awaiting Super Admin review",
  },
  profile: {
    title: "Company Profile",
    subtitle: "Registered pharmaceutical account details",
  },
}

export default function CompanyPage() {
  return (
    <DashboardLayout role="company" title="Medicine Company" navItems={NAV}>
      <CompanyContent />
    </DashboardLayout>
  )
}

function CompanyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "dashboard"
  const editId = searchParams.get("edit")
  const { auth, data, addItem, updateItem } = useStore()

  const company = data.companies.find((c) => c.id === auth.userId)
  const allMedicines = data.medicines.length > 0 ? data.medicines : seedMedicines
  const myMedicinesRaw = data.medicines.filter(
    (m) => m.companyId === auth.userId || m.company === company?.name
  )

  const myMedicines = useMemo(
    () =>
      myMedicinesRaw.map((m) => ({
        ...m,
        brandName: m.brandName || m.brand || (m.name || "").split(" ")[0],
        genericName: m.genericName || m.generic || "",
        updatedAtLabel: formatDate(m.updatedAt || m.createdAt),
      })),
    [myMedicinesRaw]
  )

  const editingMedicine = myMedicinesRaw.find((m) => m.id === editId)
  const [previewMedicine, setPreviewMedicine] = useState(null)

  const stats = {
    total: myMedicines.length,
    approved: myMedicines.filter((m) => m.status === "Approved").length,
    pending: myMedicines.filter((m) => m.status === "Pending").length,
    rejected: myMedicines.filter((m) => m.status === "Rejected").length,
    recent: myMedicines.filter((m) => m.updatedAt).length,
  }

  const recent = [...myMedicines]
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
    .slice(0, 5)

  const baseHeader = TAB_TITLES[tab] || TAB_TITLES.dashboard
  const header =
    tab === "add"
      ? {
          title: editingMedicine ? "Edit Medicine" : "Add Medicine",
          subtitle: editingMedicine
            ? "Update clinical details before resubmitting"
            : "Create a structured clinical profile for approval",
        }
      : baseHeader

  function goToTab(nextTab, params = "") {
    router.push(`/company?tab=${nextTab}${params}`)
  }

  function handleEdit(medicine) {
    goToTab("add", `&edit=${medicine.id}`)
  }

  function handleSave(payload) {
    const submission = {
      ...payload,
      companyId: auth.userId,
      status: "Pending",
    }
    if (editingMedicine) {
      updateItem("medicines", editingMedicine.id, submission)
    } else {
      addItem("medicines", submission)
    }
    goToTab("medicines")
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900">{header.title}</div>
          <div className="text-sm text-slate-500">{header.subtitle}</div>
        </div>
        {tab !== "add" && tab !== "profile" && (
          <button
            onClick={() => goToTab("add")}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
          >
            + Add Medicine
          </button>
        )}
      </div>

      {tab === "dashboard" && <CompanyDashboard stats={stats} recent={recent} />}

      {tab === "medicines" && (
        <CompanyMedicinesTable
          medicines={myMedicines}
          onEdit={handleEdit}
          onPreview={setPreviewMedicine}
        />
      )}

      {tab === "add" && (
        <CompanyMedicineForm
          companyName={company?.name || ""}
          medicine={editingMedicine}
          allMedicines={allMedicines}
          onCancel={() => goToTab("medicines")}
          onSave={handleSave}
        />
      )}

      {tab === "pending" && (
        <CompanyPendingApprovals
          medicines={myMedicines.filter((m) => m.status === "Pending")}
        />
      )}

      {tab === "profile" && <CompanyProfile company={company} stats={stats} />}

      <MedicinePreviewModal
        medicine={previewMedicine}
        allMedicines={allMedicines}
        onClose={() => setPreviewMedicine(null)}
      />
    </div>
  )
}

function formatDate(value) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
