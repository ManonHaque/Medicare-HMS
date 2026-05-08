// Medicine Request Panel - Shows medicine availability workflow
// Supports Bangladesh hospital reality where families often buy medicines externally
"use client";

import { useState, useEffect } from "react";

export default function MedicineRequestPanel({
  icuPatient,
  onGeneratePDF,
  medicineRequestStatus = {},
  onStatusChange,
}) {
  const [localStatus, setLocalStatus] = useState(medicineRequestStatus);
  const [expandedMedicine, setExpandedMedicine] = useState(null);

  useEffect(() => {
    setLocalStatus(medicineRequestStatus);
  }, [medicineRequestStatus]);

  if (!icuPatient) return null;

  const medicines = icuPatient.currentPrescriptions || [];

  const handleStatusChange = (medicineId, status) => {
    const newStatus = { ...localStatus, [medicineId]: status };
    setLocalStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "hospital":
        return "bg-green-100 border-green-300 text-green-800";
      case "family":
        return "bg-blue-100 border-blue-300 text-blue-800";
      default:
        return "bg-slate-100 border-slate-300 text-slate-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "hospital":
        return "🏥";
      case "family":
        return "👨‍👩‍👧";
      default:
        return "?";
    }
  };

  const pendingMedicines = medicines.filter((m) => !localStatus[m.id]);
  const hospitalMedicines = medicines.filter(
    (m) => localStatus[m.id] === "hospital",
  );
  const familyMedicines = medicines.filter(
    (m) => localStatus[m.id] === "family",
  );

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-slate-700">
            {medicines.length}
          </p>
          <p className="text-xs text-slate-600">Total Medicines</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700">
            {hospitalMedicines.length}
          </p>
          <p className="text-xs text-green-600">In Hospital</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">
            {familyMedicines.length}
          </p>
          <p className="text-xs text-blue-600">Family to Buy</p>
        </div>
      </div>

      {/* Medicines List */}
      <div className="space-y-2">
        <h3 className="font-bold text-slate-900 text-sm">
          Medicines & Requests
        </h3>

        {medicines.map((medicine) => {
          const status = localStatus[medicine.id];
          const isExpanded = expandedMedicine === medicine.id;

          return (
            <div
              key={medicine.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                status
                  ? getStatusColor(status)
                  : "bg-white border-slate-300 hover:border-slate-400"
              }`}
              onClick={() =>
                setExpandedMedicine(isExpanded ? null : medicine.id)
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{medicine.medicine}</p>
                  <p className="text-xs opacity-75">
                    {medicine.dosage} • {medicine.frequency}
                  </p>
                </div>
                {status && (
                  <span className="text-lg font-bold">
                    {getStatusIcon(status)}
                  </span>
                )}
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-current space-y-3">
                  <p className="text-xs opacity-75 italic">
                    Indication: {medicine.indication}
                  </p>

                  {/* Radio Buttons for Selection */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/50 rounded">
                      <input
                        type="radio"
                        name={`medicine-${medicine.id}`}
                        checked={status === "hospital"}
                        onChange={() =>
                          handleStatusChange(medicine.id, "hospital")
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">
                        ✓ Available in Hospital Stock
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/50 rounded">
                      <input
                        type="radio"
                        name={`medicine-${medicine.id}`}
                        checked={status === "family"}
                        onChange={() =>
                          handleStatusChange(medicine.id, "family")
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">
                        👨‍👩‍👧 Ask Family to Purchase
                      </span>
                    </label>
                  </div>

                  {/* Info Box */}
                  {status === "family" && (
                    <div className="bg-blue-100/50 border border-blue-300 rounded p-2 text-xs text-blue-800">
                      <p className="font-bold mb-1">ℹ Important:</p>
                      <p>
                        Family will need to purchase this from external
                        pharmacy. Include in printable medicine list for
                        reference.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Print Medicine List Button */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-4">
        <p className="text-xs font-bold text-blue-700 mb-3">
          📋 GENERATE MEDICINE LIST
        </p>
        <p className="text-xs text-blue-600 mb-3">
          Print this list to help patient family purchase external medicines
          from pharmacy. Includes hospital & external medicines.
        </p>
        <button
          onClick={() => onGeneratePDF?.("medicine")}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all"
        >
          🖨 Print Medicine List (PDF)
        </button>
      </div>

      {/* Status Summary */}
      {pendingMedicines.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
          <p className="text-xs font-bold text-yellow-800">
            ⚠ {pendingMedicines.length} medicine
            {pendingMedicines.length !== 1 ? "s" : ""} not yet classified
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            Please select status for each medicine above
          </p>
        </div>
      )}
    </div>
  );
}
