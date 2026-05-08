// Shift Summary Component - Shows overview metrics for current shift
"use client";

import { useEffect, useState } from "react";

export default function ShiftSummary({ nurseId, tasks, icuPatients, shift }) {
  const [summary, setSummary] = useState({
    tasksCompleted: 0,
    tasksPending: 0,
    criticalPatients: 0,
    shiftRemaining: "0h",
  });

  useEffect(() => {
    const tasksCompleted = tasks.filter((t) => t.status === "Completed").length;
    const tasksPending = tasks.filter((t) => t.status !== "Completed").length;
    const criticalPatients = icuPatients.filter(
      (p) => p.status === "Critical",
    ).length;

    // Calculate shift remaining
    const now = new Date();
    const hour = now.getHours();
    let shiftRemaining = 0;

    if (shift === "Day") {
      shiftRemaining = 18 - hour;
    } else if (shift === "Night") {
      shiftRemaining = hour >= 18 ? 24 - hour + 6 : 6 - hour;
    }

    setSummary({
      tasksCompleted,
      tasksPending,
      criticalPatients,
      shiftRemaining: `${Math.max(0, shiftRemaining)}h`,
    });
  }, [tasks, icuPatients, shift]);

  const cards = [
    {
      label: "Tasks Completed",
      value: summary.tasksCompleted,
      color: "bg-green-50 border-green-200",
      icon: "✓",
      textColor: "text-green-700",
    },
    {
      label: "Pending Tasks",
      value: summary.tasksPending,
      color: "bg-blue-50 border-blue-200",
      icon: "→",
      textColor: "text-blue-700",
    },
    {
      label: "Critical Patients",
      value: summary.criticalPatients,
      color: "bg-red-50 border-red-200",
      icon: "⚠",
      textColor: "text-red-700",
    },
    {
      label: "Shift Remaining",
      value: summary.shiftRemaining,
      color: "bg-purple-50 border-purple-200",
      icon: "⏱",
      textColor: "text-purple-700",
    },
  ];

  return (
    <div
      id="summary"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.color} border rounded-lg p-4 flex items-center gap-3 transition-transform hover:scale-105`}
        >
          <div className={`text-2xl ${card.textColor}`}>{card.icon}</div>
          <div className="flex-1">
            <p className="text-xs text-slate-600 font-medium">{card.label}</p>
            <p className={`text-2xl font-bold ${card.textColor}`}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
