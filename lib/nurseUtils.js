// 🏥 Comprehensive Nurse Dashboard Utilities
// localStorage persistence, shift calculations, task filtering, and medical operations

/**
 * ✓ TASK PERSISTENCE - Save/Load task state from localStorage
 */

export const persistTaskUpdate = (nurseId, task) => {
  try {
    const stored = localStorage.getItem("nurseTasks") || "{}";
    const data = JSON.parse(stored);

    if (!data[nurseId]) {
      data[nurseId] = [];
    }

    // Update or add task
    const existingIndex = data[nurseId].findIndex((t) => t.id === task.id);
    if (existingIndex >= 0) {
      data[nurseId][existingIndex] = {
        ...task,
        updatedAt: new Date().toISOString(),
      };
    } else {
      data[nurseId].push(task);
    }

    localStorage.setItem("nurseTasks", JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error persisting task:", error);
    return false;
  }
};

export const loadNurseTasks = (nurseId) => {
  try {
    const stored = localStorage.getItem("nurseTasks") || "{}";
    const data = JSON.parse(stored);
    return data[nurseId] || [];
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
};

export const clearNurseTasks = (nurseId) => {
  try {
    const stored = localStorage.getItem("nurseTasks") || "{}";
    const data = JSON.parse(stored);
    delete data[nurseId];
    localStorage.setItem("nurseTasks", JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error clearing tasks:", error);
    return false;
  }
};

/**
 * ✓ MEDICINE REQUEST PERSISTENCE
 */

export const persistMedicineRequests = (nurseId, requests) => {
  try {
    const stored = localStorage.getItem("medicineRequests") || "{}";
    const data = JSON.parse(stored);
    data[nurseId] = requests;
    localStorage.setItem("medicineRequests", JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error persisting medicine requests:", error);
    return false;
  }
};

export const loadMedicineRequests = (nurseId) => {
  try {
    const stored = localStorage.getItem("medicineRequests") || "{}";
    const data = JSON.parse(stored);
    return data[nurseId] || {};
  } catch (error) {
    console.error("Error loading medicine requests:", error);
    return {};
  }
};

/**
 * ✓ NURSE NOTES PERSISTENCE
 */

export const persistNurseNote = (taskId, note) => {
  try {
    const stored = localStorage.getItem("nurseNotes") || "{}";
    const data = JSON.parse(stored);
    data[taskId] = {
      ...data[taskId],
      ...note,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("nurseNotes", JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error persisting note:", error);
    return false;
  }
};

export const loadNurseNotes = () => {
  try {
    const stored = localStorage.getItem("nurseNotes") || "{}";
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading notes:", error);
    return {};
  }
};

/**
 * ✓ SHIFT CALCULATIONS
 */

export const getCurrentShift = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 18) return "Day";
  if (hour >= 18 || hour < 6) return "Night";
  return "Day";
};

export const getShiftRemaining = (shift) => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  let endHour = 0;
  if (shift === "Day") {
    endHour = 18;
  } else if (shift === "Night") {
    endHour = hour >= 18 ? 30 : 6; // 06:00 next day or early morning
  }

  let remaining = endHour - hour;
  if (remaining <= 0 && shift === "Night") remaining = 24 - hour + 6;

  const minutes = 60 - minute;
  return {
    hours: Math.max(0, remaining),
    minutes: minutes,
    totalMinutes: Math.max(0, remaining * 60 + minutes),
    formatted: `${Math.max(0, remaining)}h ${minutes}m`,
  };
};

export const isInShift = (hour, shift) => {
  if (shift === "Day") return hour >= 6 && hour < 18;
  if (shift === "Night") return hour >= 18 || hour < 6;
  return false;
};

/**
 * ✓ TASK FILTERING & GROUPING
 */

export const filterTasksByShift = (tasks, shift) => {
  return tasks.filter((task) => {
    const taskHour = parseInt(task.time.split(":")[0]);
    return isInShift(taskHour, shift);
  });
};

export const filterTasksByStatus = (tasks, status) => {
  return tasks.filter((task) => task.status === status);
};

export const groupTasksByStatus = (tasks) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const grouped = {
    NOW: [],
    UPCOMING: [],
    OVERDUE: [],
    COMPLETED: [],
  };

  tasks.forEach((task) => {
    const diff = currentMinutes - task.timeInMinutes;

    if (task.status === "Completed") {
      grouped.COMPLETED.push(task);
    } else if (diff >= -5 && diff < 30) {
      grouped.NOW.push(task);
    } else if (diff >= 30) {
      grouped.OVERDUE.push(task);
    } else {
      grouped.UPCOMING.push(task);
    }
  });

  return grouped;
};

export const sortTasksByTime = (tasks) => {
  return tasks.sort((a, b) => a.timeInMinutes - b.timeInMinutes);
};

/**
 * ✓ PATIENT STATUS & ALERTS
 */

export const generatePatientAlerts = (patient) => {
  const alerts = [];
  const { vitals, status } = patient;

  // Low oxygen alert
  if (vitals?.spo2 < 94) {
    alerts.push({
      type: "SpO₂ Low",
      severity: vitals?.spo2 < 90 ? "Critical" : "High",
      message: `Oxygen saturation: ${vitals.spo2}%`,
      icon: "⚠️",
    });
  }

  // High BP alert
  const bpSystolic = parseInt(vitals?.bp?.split("/")[0]);
  if (bpSystolic > 160) {
    alerts.push({
      type: "BP Elevated",
      severity: bpSystolic > 180 ? "Critical" : "High",
      message: `Blood pressure: ${vitals.bp}`,
      icon: "⚠️",
    });
  }

  // High temperature alert
  if (vitals?.temp > 39) {
    alerts.push({
      type: "High Fever",
      severity: vitals?.temp > 40 ? "Critical" : "High",
      message: `Temperature: ${vitals.temp}°C`,
      icon: "🌡️",
    });
  }

  // High glucose alert
  if (vitals?.glucose > 300) {
    alerts.push({
      type: "Hyperglycemia",
      severity: "High",
      message: `Blood glucose: ${vitals.glucose} mg/dL`,
      icon: "🩸",
    });
  }

  return alerts;
};

export const getPatientStatusColor = (status) => {
  switch (status) {
    case "Critical":
      return {
        bg: "bg-red-50",
        border: "border-red-300",
        badge: "bg-red-100 text-red-800",
      };
    case "Observation":
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-300",
        badge: "bg-yellow-100 text-yellow-800",
      };
    case "Stable":
      return {
        bg: "bg-green-50",
        border: "border-green-300",
        badge: "bg-green-100 text-green-800",
      };
    default:
      return {
        bg: "bg-slate-50",
        border: "border-slate-300",
        badge: "bg-slate-100 text-slate-800",
      };
  }
};

/**
 * ✓ TASK ACTIONS
 */

export const confirmTaskGiven = (task, data) => {
  return {
    ...task,
    status: "Completed",
    completedAt: data.completedAt || new Date().toISOString(),
    completionTime: data.givenTime,
    patientResponse: data.patientResponse,
    note: data.note,
    updatedAt: new Date().toISOString(),
  };
};

export const delayTask = (task, delayReason) => {
  return {
    ...task,
    status: "Delayed",
    delayedAt: new Date().toISOString(),
    delayReason,
    updatedAt: new Date().toISOString(),
  };
};

export const escalateTask = (task, escalationReason) => {
  return {
    ...task,
    status: "Escalated",
    escalatedAt: new Date().toISOString(),
    escalationReason,
    escalatedTo: "Doctor",
    updatedAt: new Date().toISOString(),
  };
};

/**
 * ✓ VITAL SIGNS VALIDATION
 */

export const isVitalCritical = (vital, value) => {
  const thresholds = {
    spo2: { min: 94, max: 100 },
    hr: { min: 60, max: 100 },
    systolic: { min: 90, max: 140 },
    diastolic: { min: 60, max: 90 },
    temp: { min: 36.5, max: 38.5 },
    rr: { min: 12, max: 20 },
    glucose: { min: 80, max: 180 },
  };

  if (vital === "spo2") return value < thresholds.spo2.min;
  if (vital === "hr")
    return value < thresholds.hr.min || value > thresholds.hr.max;
  if (vital === "temp") return value > thresholds.temp.max;
  if (vital === "rr") return value > thresholds.rr.max;
  if (vital === "glucose") return value > thresholds.glucose.max;

  return false;
};

/**
 * ✓ SHIFT SUMMARY CALCULATIONS
 */

export const calculateShiftSummary = (tasks, patients, shift) => {
  const tasksInShift = filterTasksByShift(tasks, shift);

  return {
    tasksCompleted: tasksInShift.filter((t) => t.status === "Completed").length,
    tasksPending: tasksInShift.filter((t) => t.status !== "Completed").length,
    tasksOverdue: tasksInShift.filter((t) => t.status === "Overdue").length,
    criticalPatients: patients.filter((p) => p.status === "Critical").length,
    observationPatients: patients.filter((p) => p.status === "Observation")
      .length,
    stablePatients: patients.filter((p) => p.status === "Stable").length,
    shiftRemaining: getShiftRemaining(shift),
  };
};

/**
 * ✓ TIME FORMATTING
 */

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

/**
 * ✓ AI MONITORING SUGGESTIONS
 */

export const generateAIInsights = (patients) => {
  const insights = [];

  patients.forEach((patient) => {
    // Oxygen trend analysis
    if (patient.vitals?.spo2 < 94) {
      insights.push({
        type: "warning",
        patient: patient.patientName,
        message: `AI detected abnormal oxygen trend for ${patient.bedNumber}. SpO₂ dropping below safe threshold.`,
        action: "Increase oxygen support and notify doctor",
      });
    }

    // BP instability
    const bpSystolic = parseInt(patient.vitals?.bp?.split("/")[0]);
    if (bpSystolic > 160 || bpSystolic < 90) {
      insights.push({
        type: "alert",
        patient: patient.patientName,
        message: `BP instability detected for ${patient.bedNumber}. Multiple readings abnormal.`,
        action: "Check patient immediately, review medications",
      });
    }
  });

  return insights;
};
