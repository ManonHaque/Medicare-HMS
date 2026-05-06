"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { useStore } from "@/lib/store"

const NAV = [{ href: "/nurse", label: "Tasks" }]

export default function NursePage() {
  return (
    <DashboardLayout role="nurse" title="Nurse Dashboard" navItems={NAV}>
      <NurseContent />
    </DashboardLayout>
  )
}

function NurseContent() {
  const { auth, data, updateItem, addItem } = useStore()
  const [noteFor, setNoteFor] = useState(null)
  const [noteText, setNoteText] = useState("")

  const myTasks = data.nurseTasks.filter((t) => t.nurseId === auth.userId)
  const grouped = myTasks.reduce((acc, t) => {
    const time = t.time || "unscheduled"
    if (!acc[time]) acc[time] = []
    acc[time].push(t)
    return acc
  }, {})
  const sortedTimes = Object.keys(grouped).sort()

  const myICU = data.icuPatients.filter((ip) => ip.nurseId === auth.userId)
  const lowSpo2 = myICU.find((ip) => (ip.vitals?.spo2 || 100) < 95)

  const updateStatus = (taskId, status) => {
    updateItem("nurseTasks", taskId, {
      status,
      [status === "Completed" ? "completedAt" : "updatedAt"]: new Date().toISOString(),
    })
  }

  const saveNote = () => {
    if (!noteFor || !noteText.trim()) return
    updateItem("nurseTasks", noteFor.id, { note: noteText })
    setNoteFor(null)
    setNoteText("")
  }

  return (
    <div className="space-y-6">
      {/* AI Monitoring Panel - top, always visible */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">AI Monitoring Panel</h3>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Live</span>
        </div>
        <p className="text-sm text-blue-100 mb-3">
          Monitoring {myICU.length} ICU patient{myICU.length !== 1 ? "s" : ""}
        </p>
        {lowSpo2 ? (
          <div className="bg-red-500/20 border border-red-300 rounded-md p-3 text-sm">
            <strong>EMERGENCY ALERT</strong>: Oxygen low for{" "}
            {data.patients.find((p) => p.id === lowSpo2.patientId)?.name}
          </div>
        ) : (
          <div className="bg-white/10 rounded-md p-3 text-sm">All patients stable</div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">My Tasks ({myTasks.length})</h2>
        {myTasks.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No tasks assigned. Doctors will create tasks via ICU plans.
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTimes.map((time) => (
              <div key={time}>
                <h3 className="text-sm font-medium text-slate-500 mb-2">
                  {time === "unscheduled" ? "Unscheduled" : `Time: ${time}`}
                </h3>
                <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
                  {grouped[time].map((t) => (
                    <div key={t.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              t.status === "Completed"
                                ? "bg-green-50 text-green-700"
                                : t.status === "Skipped"
                                  ? "bg-slate-100 text-slate-600"
                                  : t.status === "In Progress"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {t.status}
                          </span>
                          <span className="text-xs text-slate-400">{t.type}</span>
                        </div>
                        <p className="font-medium text-slate-900">{t.patientName}</p>
                        <p className="text-sm text-slate-600">{t.description}</p>
                        {t.note && (
                          <p className="text-xs text-slate-500 mt-1 italic">Note: {t.note}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {t.status === "Pending" && (
                          <button
                            onClick={() => updateStatus(t.id, "In Progress")}
                            className="px-2 py-1 text-xs bg-amber-500 text-white rounded hover:bg-amber-600"
                          >
                            Start
                          </button>
                        )}
                        {t.status !== "Completed" && (
                          <button
                            onClick={() => updateStatus(t.id, "Completed")}
                            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Confirm
                          </button>
                        )}
                        {t.status === "Pending" && (
                          <button
                            onClick={() => updateStatus(t.id, "Skipped")}
                            className="px-2 py-1 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                          >
                            Skip
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setNoteFor(t)
                            setNoteText(t.note || "")
                          }}
                          className="px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50"
                        >
                          Note
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">My ICU Patients</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {myICU.map((ip) => {
            const patient = data.patients.find((p) => p.id === ip.patientId)
            return (
              <div key={ip.id} className="bg-white border border-slate-200 rounded-xl p-4">
                <h4 className="font-semibold text-slate-900">{patient?.name}</h4>
                <p className="text-sm text-slate-500">
                  {patient?.phone} · {patient?.age} yrs
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Bed {data.beds.find((b) => b.id === ip.bedId)?.number}
                </p>
                <p className="text-xs text-slate-400 italic mt-1">
                  View only - cannot modify prescriptions
                </p>
              </div>
            )
          })}
          {myICU.length === 0 && <p className="text-sm text-slate-500">None assigned.</p>}
        </div>
      </div>

      {noteFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-slate-900 mb-3">Add Note</h3>
            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            />
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setNoteFor(null)}
                className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
