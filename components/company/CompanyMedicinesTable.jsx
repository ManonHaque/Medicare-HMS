import { getDisplayBrand, getDisplayGeneric } from "@/components/medicine/medicine-helpers"

export default function CompanyMedicinesTable({ medicines, onEdit, onPreview }) {
  return (
    <section className="bg-white border border-slate-200 rounded-lg">
      <header className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">My Medicines</div>
          <div className="text-xs text-slate-500">Manage and review submitted products</div>
        </div>
        <div className="text-xs text-slate-500">{medicines.length} medicines</div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500 bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left">Brand Name</th>
              <th className="px-4 py-2 text-left">Generic</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Last Updated</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {medicines.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No medicines added yet.
                </td>
              </tr>
            ) : (
              medicines.map((m) => (
                <tr key={m.id} className="hover:bg-blue-50/40">
                  <td className="px-4 py-2 font-semibold text-slate-900">
                    {getDisplayBrand(m)}
                  </td>
                  <td className="px-4 py-2 text-slate-600">{getDisplayGeneric(m)}</td>
                  <td className="px-4 py-2 text-slate-600">{m.type || "—"}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-4 py-2 text-slate-500">{m.updatedAtLabel}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => onEdit(m)}
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onPreview(m)}
                      className="text-xs font-semibold text-slate-600 hover:underline"
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function StatusBadge({ status }) {
  const map = {
    Approved: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Rejected: "bg-rose-50 text-rose-700",
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${map[status]}`}>
      {status}
    </span>
  )
}
