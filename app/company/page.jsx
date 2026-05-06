"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { useStore } from "@/lib/store"

const NAV = [{ href: "/company", label: "My Medicines" }]

export default function CompanyPage() {
  return (
    <DashboardLayout role="company" title="Medicine Company" navItems={NAV}>
      <CompanyContent />
    </DashboardLayout>
  )
}

function CompanyContent() {
  const { auth, data, addItem, updateItem } = useStore()
  const myMeds = data.medicines.filter((m) => m.companyId === auth.userId)
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total" value={myMeds.length} />
        <StatCard
          label="Approved"
          value={myMeds.filter((m) => m.status === "Approved").length}
          color="green"
        />
        <StatCard
          label="Pending"
          value={myMeds.filter((m) => m.status === "Pending").length}
          color="amber"
        />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">My Medicines</h2>
        <button
          onClick={() => setAdding(true)}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          + Add Medicine
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {myMeds.map((m) => (
          <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-slate-900">{m.name}</h3>
              <StatusBadge status={m.status} />
            </div>
            <p className="text-sm text-slate-500 mb-2">
              {m.type} · {m.generic}
            </p>
            <p className="text-sm text-slate-600">{m.usage}</p>
            <button
              onClick={() => setEditing(m)}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {(adding || editing) && (
        <MedicineFormModal
          medicine={editing}
          onClose={() => {
            setAdding(false)
            setEditing(null)
          }}
          onSave={(form) => {
            if (editing) updateItem("medicines", editing.id, form)
            else addItem("medicines", { ...form, companyId: auth.userId, status: "Pending" })
            setAdding(false)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
  }
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${colors[color].split(" ")[1]}`}>{value}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    Approved: "bg-green-50 text-green-700",
    Pending: "bg-amber-50 text-amber-700",
    Rejected: "bg-red-50 text-red-700",
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{status}</span>
  )
}

function MedicineFormModal({ medicine, onClose, onSave }) {
  const [form, setForm] = useState({
    name: medicine?.name || "",
    type: medicine?.type || "Tablet",
    generic: medicine?.generic || "",
    usage: medicine?.usage || "",
    dosage: medicine?.dosage || "",
    sideEffects: medicine?.sideEffects || "",
  })
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg my-8">
        <h3 className="font-semibold text-lg text-slate-900 mb-4">
          {medicine ? "Edit" : "Add"} Medicine
        </h3>
        <div className="space-y-3">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field
            label="Type"
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v })}
            select
            options={["Tablet", "Capsule", "Syrup", "Injection", "Cream"]}
          />
          <Field
            label="Generic"
            value={form.generic}
            onChange={(v) => setForm({ ...form, generic: v })}
          />
          <Field
            label="Usage"
            value={form.usage}
            onChange={(v) => setForm({ ...form, usage: v })}
            textarea
          />
          <Field
            label="Dosage"
            value={form.dosage}
            onChange={(v) => setForm({ ...form, dosage: v })}
          />
          <Field
            label="Side Effects"
            value={form.sideEffects}
            onChange={(v) => setForm({ ...form, sideEffects: v })}
            textarea
          />
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

function Field({ label, value, onChange, textarea, select, options }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 mb-1 block">{label}</span>
      {select ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-md"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md"
        />
      )}
    </label>
  )
}
