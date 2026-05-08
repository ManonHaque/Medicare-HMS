// Nurse Dashboard Component - Main dashboard orchestrator
"use client";

import { useState, useEffect } from "react";
import ICUBedOverview from "./ICUBedOverview";
import CriticalAlertsPanel from "./CriticalAlertsPanel";
import LiveTaskTimeline from "./LiveTaskTimeline";
import TaskExecutionPanel from "./TaskExecutionPanel";
import MedicineRequestPanel from "./MedicineRequestPanel";
import PatientQuickView from "./PatientQuickView";
import ShiftSummary from "./ShiftSummary";
import {
  generateMedicineListPDF,
  generateTestListPDF,
  printPDF,
} from "./pdf-utils";

export default function NurseDashboard({
  nurse,
  icuPatients,
  tasks,
  patients,
  doctors,
  hospitals,
}) {
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasksPersisted, setTasksPersisted] = useState(tasks);
  const [medicineRequests, setMedicineRequests] = useState({});

  // Get current hospital
  const hospital = hospitals?.[0];

  // Filter ICU patients assigned to this nurse
  const myICUPatients = icuPatients.filter((icu) =>
    icu.nursesAssigned?.some((n) => n.id === nurse.id),
  );

  // Filter tasks assigned to this nurse
  const myTasks = tasksPersisted.filter((t) => t.nurseId === nurse.id);

  // Handle task updates
  const handleTaskUpdate = (taskId, newStatus) => {
    const updatedTasks = tasksPersisted.map((t) =>
      t.id === taskId
        ? {
            ...t,
            status: newStatus,
            completedAt:
              newStatus === "Completed"
                ? new Date().toISOString()
                : t.completedAt,
            updatedAt: new Date().toISOString(),
          }
        : t,
    );
    setTasksPersisted(updatedTasks);

    // Persist to localStorage
    const stored = localStorage.getItem("nurseTasks") || "{}";
    const data = JSON.parse(stored);
    data[nurse.id] = updatedTasks;
    localStorage.setItem("nurseTasks", JSON.stringify(data));
  };

  const handleConfirmGiven = (data) => {
    const { taskId, givenTime, patientResponse, note, completedAt } = data;
    const updatedTasks = tasksPersisted.map((t) =>
      t.id === taskId
        ? {
            ...t,
            status: "Completed",
            completedAt,
            note: note || t.note,
            completionTime: givenTime,
            patientResponse,
          }
        : t,
    );
    setTasksPersisted(updatedTasks);

    // Persist to localStorage
    const stored = localStorage.getItem("nurseTasks") || "{}";
    const data2 = JSON.parse(stored);
    data2[nurse.id] = updatedTasks;
    localStorage.setItem("nurseTasks", JSON.stringify(data2));
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
  };

  const handleBedClick = (bed) => {
    setSelectedBed(bed);
  };

  // Handle PDF generation
  const handleGeneratePDF = (type) => {
    if (!selectedBed) return;

    const selectedPatient = patients.find(
      (p) => p.id === selectedBed.patientId,
    );
    const selectedDoctor = doctors.find((d) => d.id === selectedBed.doctor?.id);

    if (type === "medicine") {
      const html = generateMedicineListPDF(
        selectedBed,
        selectedPatient,
        selectedDoctor,
        hospital,
      );
      printPDF(html);
    } else if (type === "test") {
      const html = generateTestListPDF(
        selectedBed,
        selectedPatient,
        selectedDoctor,
        hospital,
      );
      printPDF(html);
    }
  };

  return (
    <div className="space-y-6">
      {/* Shift Summary Cards */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          👩‍⚕️ {nurse.name} • {nurse.shift} Shift
        </h1>
        <ShiftSummary
          nurseId={nurse.id}
          tasks={myTasks}
          icuPatients={myICUPatients}
          shift={nurse.shift}
        />
      </div>

      {/* Critical Alerts (Top Priority) */}
      <CriticalAlertsPanel
        icuPatients={myICUPatients}
        patients={patients}
        onPatientSelect={handleBedClick}
      />

      {/* ICU Bed Overview */}
      <ICUBedOverview
        icuPatients={myICUPatients}
        patients={patients}
        doctors={doctors}
        onBedClick={handleBedClick}
      />

      {/* Live Task Timeline */}
      <LiveTaskTimeline
        tasks={myTasks}
        icuPatients={myICUPatients}
        patients={patients}
        onTaskSelect={handleTaskSelect}
        onTaskUpdate={handleTaskUpdate}
      />

      {/* Selected Bed Details Panel */}
      {selectedBed && (
        <div className="bg-white border-2 border-blue-300 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Patient Details: {selectedBed.patientName}
            </h2>
            <button
              onClick={() => setSelectedBed(null)}
              className="text-2xl font-bold text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Patient Quick View */}
            <div className="lg:col-span-1">
              <h3 className="font-bold text-slate-900 mb-3">Patient Info</h3>
              <PatientQuickView
                patient={patients.find((p) => p.id === selectedBed.patientId)}
                icuPatient={selectedBed}
                doctors={doctors}
              />
            </div>

            {/* Middle Column - Medicine Request */}
            <div className="lg:col-span-1">
              <h3 className="font-bold text-slate-900 mb-3">💊 Medicines</h3>
              <MedicineRequestPanel
                icuPatient={selectedBed}
                medicineRequestStatus={medicineRequests[selectedBed.id] || {}}
                onStatusChange={(status) => {
                  setMedicineRequests({
                    ...medicineRequests,
                    [selectedBed.id]: status,
                  });
                  // Persist to localStorage
                  const stored =
                    localStorage.getItem("medicineRequests") || "{}";
                  const data = JSON.parse(stored);
                  data[selectedBed.id] = status;
                  localStorage.setItem(
                    "medicineRequests",
                    JSON.stringify(data),
                  );
                }}
                onGeneratePDF={handleGeneratePDF}
              />
            </div>

            {/* Right Column - Tests & Actions */}
            <div className="lg:col-span-1">
              <h3 className="font-bold text-slate-900 mb-3">🧪 Tests</h3>
              <div className="space-y-3">
                {selectedBed.testOrders && selectedBed.testOrders.length > 0 ? (
                  <div className="space-y-2">
                    {selectedBed.testOrders.map((test) => (
                      <div
                        key={test.id}
                        className={`border rounded-lg p-3 text-sm ${
                          test.status === "Completed"
                            ? "bg-green-50 border-green-200"
                            : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <p className="font-semibold text-slate-900">
                          {test.name}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Status:{" "}
                          <span className="font-bold">{test.status}</span>
                        </p>
                        {test.result && (
                          <p className="text-xs text-slate-600 mt-1 italic">
                            {test.result}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No tests ordered</p>
                )}

                {/* Print Test List Button */}
                <button
                  onClick={() => handleGeneratePDF("test")}
                  className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm transition-all"
                >
                  🖨 Print Test List
                </button>
              </div>
            </div>
          </div>

          {/* Alerts for this patient */}
          {selectedBed.alerts && selectedBed.alerts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h3 className="font-bold text-red-700 mb-2">Active Alerts</h3>
              <div className="space-y-2">
                {selectedBed.alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="bg-red-50 border border-red-200 rounded p-3 text-sm"
                  >
                    <p className="font-bold text-red-800">{alert.type}</p>
                    <p className="text-red-700 text-xs mt-1">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task Execution Panel */}
      {selectedTask && (
        <TaskExecutionPanel
          task={selectedTask}
          icuPatient={myICUPatients.find(
            (i) => i.id === selectedTask.patientId,
          )}
          patient={patients.find((p) => p.id === selectedTask.patientId)}
          doctor={doctors.find((d) => d.id === selectedTask.doctorId)}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onConfirmGiven={handleConfirmGiven}
          onDelayed={(taskId) => handleTaskUpdate(taskId, "Delayed")}
          onSkip={(taskId) => handleTaskUpdate(taskId, "Skipped")}
          onEscalate={(taskId) => {
            handleTaskUpdate(taskId, "Escalated");
            alert("⚠️ Task escalated to senior nurse and doctor");
          }}
        />
      )}

      {/* Empty state */}
      {myICUPatients.length === 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-800 font-medium">
            🏥 No ICU patients assigned to your shift
          </p>
          <p className="text-blue-600 text-sm mt-2">
            You will see your assigned patients here when doctors create ICU
            plans
          </p>
        </div>
      )}
    </div>
  );
}
