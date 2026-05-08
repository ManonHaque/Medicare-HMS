// Task Execution Panel - Opens when nurse clicks a task
"use client";

import { useState } from "react";

export default function TaskExecutionPanel({
  task,
  icuPatient,
  patient,
  doctor,
  isOpen,
  onClose,
  onConfirmGiven,
  onDelayed,
  onSkip,
  onEscalate,
}) {
  const [activeTab, setActiveTab] = useState("details");
  const [confirmNote, setConfirmNote] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [givenTime, setGivenTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  );

  if (!isOpen || !task || !icuPatient) return null;

  const handleConfirmGiven = () => {
    onConfirmGiven?.({
      taskId: task.id,
      givenTime,
      patientResponse: "Patient stable",
      note: confirmNote,
      completedAt: new Date().toISOString(),
    });
    setShowConfirmModal(false);
    setConfirmNote("");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {task.type}: {task.patientName}
            </h2>
            <p className="text-blue-100 text-sm">
              {task.bedNumber} • {task.time}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-75"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 sticky top-16 bg-white">
          <div className="flex gap-1 p-3">
            {["details", "vitals", "prescription", "allergies"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* DETAILS TAB */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-bold text-slate-900 mb-3">
                  Task Description
                </h3>
                <p className="text-slate-700 mb-3">{task.description}</p>

                {task.medicines && task.medicines.length > 0 && (
                  <div className="bg-white border border-blue-200 rounded p-3">
                    <p className="text-xs font-bold text-blue-700 mb-2">
                      MEDICINES:
                    </p>
                    {task.medicines.map((med, idx) => (
                      <div key={idx} className="text-sm text-slate-600 mb-1">
                        • <span className="font-semibold">{med.name}</span>{" "}
                        {med.dosage} ({med.route})
                      </div>
                    ))}
                  </div>
                )}

                {task.doctorNote && (
                  <div className="mt-3 bg-blue-50 border-l-4 border-blue-500 p-3">
                    <p className="text-xs font-bold text-blue-700 mb-1">
                      Doctor's Note:
                    </p>
                    <p className="text-sm text-slate-700">{task.doctorNote}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-bold text-slate-600 mb-1">
                    PRIORITY
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {task.priority}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-bold text-slate-600 mb-1">
                    ASSIGNED DOCTOR
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    Dr. {doctor?.name || "N/A"}
                  </p>
                  <p className="text-xs text-slate-600">{doctor?.specialty}</p>
                </div>
              </div>
            </div>
          )}

          {/* VITALS TAB */}
          {activeTab === "vitals" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-slate-900 mb-3">
                  Current Vitals
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-white rounded p-3 text-center">
                    <p className="text-xs text-slate-600 font-medium">BP</p>
                    <p className="text-lg font-bold text-slate-900">
                      {icuPatient.vitals?.bp}
                    </p>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <p className="text-xs text-slate-600 font-medium">HR</p>
                    <p className="text-lg font-bold text-slate-900">
                      {icuPatient.vitals?.hr}
                    </p>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <p className="text-xs text-slate-600 font-medium">SpO₂</p>
                    <p className="text-lg font-bold text-slate-900">
                      {icuPatient.vitals?.spo2}%
                    </p>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <p className="text-xs text-slate-600 font-medium">Temp</p>
                    <p className="text-lg font-bold text-slate-900">
                      {icuPatient.vitals?.temp}°C
                    </p>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <p className="text-xs text-slate-600 font-medium">RR</p>
                    <p className="text-lg font-bold text-slate-900">
                      {icuPatient.vitals?.rr}
                    </p>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <p className="text-xs text-slate-600 font-medium">
                      Glucose
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {icuPatient.vitals?.glucose}
                    </p>
                  </div>
                </div>
              </div>

              {icuPatient.vitalsTrend && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-bold text-slate-600 mb-3">
                    VITALS TREND
                  </p>
                  <div className="space-y-2">
                    {icuPatient.vitalsTrend.map((v, idx) => (
                      <div key={idx} className="text-xs text-slate-600">
                        <span className="font-semibold">{v.time}:</span> SpO₂{" "}
                        {v.spo2}%, BP {v.bp}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PRESCRIPTION TAB */}
          {activeTab === "prescription" && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900">
                Current Prescriptions
              </h3>
              {icuPatient.currentPrescriptions?.map((px) => (
                <div
                  key={px.id}
                  className="border border-slate-200 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{px.medicine}</p>
                      <p className="text-sm text-slate-600">{px.dosage}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                      {px.frequency}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    {px.indication}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ALLERGIES TAB */}
          {activeTab === "allergies" && (
            <div className="space-y-4">
              {patient?.allergies && patient.allergies.length > 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-xs font-bold text-red-700 mb-2">
                    ⚠ ALLERGIES
                  </p>
                  <div className="space-y-2">
                    {patient.allergies.map((allergy, idx) => (
                      <div
                        key={idx}
                        className="bg-red-100 text-red-800 px-3 py-2 rounded font-medium text-sm"
                      >
                        {allergy}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">✓ No known allergies</p>
                </div>
              )}

              {patient?.chronicConditions &&
                patient.chronicConditions.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-xs font-bold text-slate-600 mb-2">
                      CHRONIC CONDITIONS
                    </p>
                    <div className="space-y-1">
                      {patient.chronicConditions.map((condition, idx) => (
                        <p key={idx} className="text-sm text-slate-700">
                          • {condition}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer - Action Buttons */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-3 justify-end">
          {task.status !== "Completed" && (
            <>
              {task.status === "Pending" && (
                <button
                  onClick={() => onDelayed?.(task.id)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium text-sm"
                >
                  Mark Delayed
                </button>
              )}
              <button
                onClick={() => onSkip?.(task.id)}
                className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded-lg font-medium text-sm"
              >
                Skip
              </button>
              <button
                onClick={() => onEscalate?.(task.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm"
              >
                Escalate
              </button>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold"
              >
                ✓ Confirm Given
              </button>
            </>
          )}
        </div>
      </div>

      {/* Confirm Given Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Confirm Task Completed
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-2">
                  Given Time
                </label>
                <input
                  type="time"
                  value={givenTime.substring(0, 5)}
                  onChange={(e) => setGivenTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-2">
                  Nurse Note
                </label>
                <textarea
                  rows={3}
                  value={confirmNote}
                  onChange={(e) => setConfirmNote(e.target.value)}
                  placeholder="e.g., Patient stable after injection, no adverse effects"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGiven}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
