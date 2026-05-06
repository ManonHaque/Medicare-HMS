"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { useStore } from "@/lib/store"

const NAV = [{ href: "/super-admin", label: "Overview" }]

export default function SuperAdminPage() {
  return (
    <DashboardLayout role="superadmin" title="Super Admin" navItems={NAV}>
      <SuperAdminContent />
    </DashboardLayout>
  )
}

function SuperAdminContent() {
  const { data, addItem, updateItem, removeItem } = useStore()
  const [tab, setTab] = useState("hospitals")
  const [addingHospital, setAddingHospital] = useState(false)

  const pendingMeds = data.medicines.filter((m) => m.status === "Pending")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Hospitals" value={data.hospitals.length} />
        <StatCard label="Doctors" value={data.doctors.length} />
        <StatCard label="Nurses" value={data.nurses.length} />
        <StatCard label="Pending Meds" value={pendingMeds.length} color="amber" />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {[
          ["hospitals", "Hospitals"],
          ["medicines", "Medicine Approvals"],
          ["staff", "Staff"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === id
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "hospitals" && (
        <div className="space-y-3">
          <button
            onClick={() => setAddingHospital(true)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            + Add Hospital
          </button>
          <div className="grid md:grid-cols-2 gap-3">
            {data.hospitals.map((h) => (
              <div key={h.id} className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">{h.name}</h4>
                    <p className="text-sm text-slate-500">{h.city}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${h.name}?`)) removeItem("hospitals", h.id)
                    }}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          {addingHospital && (
            <SimpleAddModal
              title="Add Hospital"
              fields={[
                { key: "name", label: "Hospital Name" },
                { key: "city", label: "City" },
              ]}
              onClose={() => setAddingHospital(false)}
              onSave={(form) => {
                addItem("hospitals", form)
                setAddingHospital(false)
              }}
            />
          )}
        </div>
      )}

      {tab === "medicines" && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            Review and approve/reject medicines submitted by companies.
          </p>
          {data.medicines.map((m) => (
            <div
              key={m.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900">{m.name}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      m.status === "Approved"
                        ? "bg-green-50 text-green-700"
                        : m.status === "Pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {m.type} · {m.generic} · by{" "}
                  {data.companies.find((c) => c.id === m.companyId)?.name}
                </p>
                <p className="text-sm text-slate-600 mt-1">{m.usage}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => updateItem("medicines", m.id, { status: "Approved" })}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateItem("medicines", m.id, { status: "Rejected" })}
                  className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "staff" && (
        <div className="space-y-4">
          <Section title="Doctors" items={data.doctors} render={(d) => `${d.name} - ${d.specialty}`} />
          <Section
            title="Nurses"
            items={data.nurses}
            render={(n) => `${n.name} - ${n.shift} shift`}
          />
        </div>
      )}
    </div>
  )
}

function Section({ title, items, render }) {
  return (
    <div>
      <h4 className="font-semibold text-slate-900 mb-2">
        {title} ({items.length})
      </h4>
      <div className="bg-white border border-slate-200 rounded-md divide-y divide-slate-200">
        {items.map((it) => (
          <div key={it.id} className="p-3 text-sm">
            {render(it)}
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value, color = "blue" }) {
  const valueColor = color === "amber" ? "text-amber-700" : "text-blue-700"
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${valueColor}`}>{value}</p>
    </div>
  )
}

function SimpleAddModal({ title, fields, onClose, onSave }) {
  const [form, setForm] = useState({})
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="font-semibold text-lg text-slate-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {fields.map((f) => (
            <label key={f.key} className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">{f.label}</span>
              <input
                value={form[f.key] || ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
              />
            </label>
          ))}
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
