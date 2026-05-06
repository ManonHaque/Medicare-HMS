import { MedicinePreview } from "./MedicinePreview"

export default function MedicinePreviewModal({ medicine, allMedicines, onClose }) {
  if (!medicine) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div>
            <div className="text-sm font-semibold text-slate-900">Medicine Page Preview</div>
            <div className="text-xs text-slate-500">Live preview of public medicine profile</div>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>
        <div className="p-4 max-h-[75vh] overflow-y-auto">
          <MedicinePreview medicine={medicine} allMedicines={allMedicines} />
        </div>
      </div>
    </div>
  )
}
