// 🏥 Professional ICU Bed Overview Component
// Displays all ICU beds with patient status, vitals, and quick actions

"use client";

import { useState } from "react";

export default function ICUBedOverview({
  icuPatients,
  patients,
  doctors,
  onBedClick,
}) {
  const [hoveredBed, setHoveredBed] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const getStatusColor = (status) => {
    switch (status) {
      case "Stable":
        return {
          bg: "bg-green-50",
          border: "border-green-300",
          hover: "hover:border-green-400",
        };
      case "Observation":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-300",
          hover: "hover:border-yellow-400",
        };
      case "Critical":
        return {
          bg: "bg-red-50",
          border: "border-red-300",
          hover: "hover:border-red-400",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-300",
          hover: "hover:border-gray-400",
        };
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Stable":
        return "bg-green-100 text-green-800";
      case "Observation":
        return "bg-yellow-100 text-yellow-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Sort and filter beds
  const sortedBeds = [...icuPatients]
    .sort((a, b) => a.bedNumber.localeCompare(b.bedNumber))
    .filter((bed) => filterStatus === "All" || bed.status === filterStatus);

  const stats = {
    critical: icuPatients.filter((b) => b.status === "Critical").length,
    observation: icuPatients.filter((b) => b.status === "Observation").length,
    stable: icuPatients.filter((b) => b.status === "Stable").length,
  };

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">ICU Bed Overview</h2>
          <p className="text-xs text-slate-600">
            Real-time patient status and vitals
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus("All")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterStatus === "All"
                ? "bg-slate-700 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All ({icuPatients.length})
          </button>
          <button
            onClick={() => setFilterStatus("Critical")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterStatus === "Critical"
                ? "bg-red-600 text-white shadow-md"
                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
            }`}
          >
            Critical ({stats.critical})
          </button>
          <button
            onClick={() => setFilterStatus("Observation")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterStatus === "Observation"
                ? "bg-yellow-600 text-white shadow-md"
                : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
            }`}
          >
            Observation ({stats.observation})
          </button>
          <button
            onClick={() => setFilterStatus("Stable")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterStatus === "Stable"
                ? "bg-green-600 text-white shadow-md"
                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
            }`}
          >
            Stable ({stats.stable})
          </button>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex gap-4 text-xs bg-slate-50 rounded-lg p-3 border border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-300 border border-green-500 rounded-full"></div>
          <span className="text-slate-700">Stable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-300 border border-yellow-500 rounded-full"></div>
          <span className="text-slate-700">Observation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-300 border border-red-500 rounded-full"></div>
          <span className="text-slate-700">Critical</span>
        </div>
      </div>

      {/* Bed Grid */}
      {sortedBeds.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {sortedBeds.map((icu) => {
            const patient = patients.find((p) => p.id === icu.patientId);
            const doctor = doctors.find((d) => d.id === icu.doctor?.id);
            const colors = getStatusColor(icu.status);
            const isHovered = hoveredBed === icu.id;

            return (
              <button
                key={icu.id}
                onClick={() => onBedClick?.(icu)}
                onMouseEnter={() => setHoveredBed(icu.id)}
                onMouseLeave={() => setHoveredBed(null)}
                className={`${colors.bg} border-2 ${colors.border} ${colors.hover} rounded-lg p-3 text-left transition-all cursor-pointer transform ${
                  isHovered
                    ? "scale-105 shadow-lg ring-2 ring-blue-300"
                    : "hover:scale-102 shadow-sm"
                }`}
              >
                {/* Header: Bed Number + Status */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">
                    {icu.bedNumber}
                  </span>
                  <span
                    className={`${getStatusBadgeColor(icu.status)} px-2 py-0.5 rounded text-xs font-semibold`}
                  >
                    {icu.status.substring(0, 3)}
                  </span>
                </div>

                {/* Patient Name */}
                <p className="text-xs font-semibold text-slate-800 truncate mb-2 line-clamp-2">
                  {patient?.name || "Empty Bed"}
                </p>

                {/* Core Vitals Always Visible */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">SpO₂</span>
                    <span
                      className={`font-bold ${icu.vitals?.spo2 < 94 ? "text-red-600" : "text-green-600"}`}
                    >
                      {icu.vitals?.spo2}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">HR</span>
                    <span className="font-bold text-slate-800">
                      {icu.vitals?.hr}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">BP</span>
                    <span className="font-bold text-slate-800 text-xs">
                      {icu.vitals?.bp}
                    </span>
                  </div>
                </div>

                {/* Hover Details */}
                {isHovered && (
                  <div className="mt-2 pt-2 border-t border-slate-300 space-y-2">
                    {/* Additional Vitals */}
                    <div className="text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Temp</span>
                        <span className="font-semibold">
                          {icu.vitals?.temp}°C
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">RR</span>
                        <span className="font-semibold">{icu.vitals?.rr}</span>
                      </div>
                    </div>

                    {/* Doctor */}
                    <div className="pt-1 border-t border-slate-300">
                      <p className="text-xs text-slate-700">
                        👨‍⚕️ Dr. {doctor?.name?.split(" ").slice(-1)[0]}
                      </p>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <p className="text-slate-600 font-medium">
            No ICU beds in {filterStatus} status
          </p>
        </div>
      )}
    </div>
  );
}
