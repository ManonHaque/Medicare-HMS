// Live Task Timeline - Shows tasks grouped by status
"use client";

import { useState } from "react";

export default function LiveTaskTimeline({
  tasks,
  icuPatients,
  patients,
  onTaskSelect,
  onTaskUpdate,
}) {
  const [expandedGroup, setExpandedGroup] = useState("NOW");

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Group tasks by status
  const groupedTasks = {
    NOW: [],
    UPCOMING: [],
    OVERDUE: [],
    COMPLETED: [],
  };

  tasks.forEach((task) => {
    const diff = currentMinutes - task.timeInMinutes;
    if (task.status === "Completed") {
      groupedTasks.COMPLETED.push(task);
    } else if (diff > 0 && diff <= 30) {
      groupedTasks.NOW.push(task);
    } else if (diff > 30) {
      groupedTasks.OVERDUE.push(task);
    } else {
      groupedTasks.UPCOMING.push(task);
    }
  });

  // Sort each group by time
  Object.keys(groupedTasks).forEach((key) => {
    groupedTasks[key].sort((a, b) => a.timeInMinutes - b.timeInMinutes);
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "text-red-700 bg-red-50 border-red-200";
      case "Important":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "Routine":
        return "text-green-700 bg-green-50 border-green-200";
      default:
        return "text-slate-700 bg-slate-50 border-slate-200";
    }
  };

  const getGroupColor = (groupName) => {
    switch (groupName) {
      case "NOW":
        return "border-l-4 border-red-500 bg-red-50";
      case "UPCOMING":
        return "border-l-4 border-blue-500 bg-blue-50";
      case "OVERDUE":
        return "border-l-4 border-red-600 bg-red-100";
      case "COMPLETED":
        return "border-l-4 border-green-500 bg-green-50";
      default:
        return "border-l-4 border-gray-500 bg-gray-50";
    }
  };

  const getGroupIcon = (groupName) => {
    switch (groupName) {
      case "NOW":
        return "🔴";
      case "UPCOMING":
        return "→";
      case "OVERDUE":
        return "⚠";
      case "COMPLETED":
        return "✓";
      default:
        return "•";
    }
  };

  const renderTaskGroup = (groupName) => {
    const taskList = groupedTasks[groupName];
    if (!taskList || taskList.length === 0) return null;

    return (
      <div key={groupName} className="mb-4">
        {/* Group Header */}
        <button
          onClick={() =>
            setExpandedGroup(expandedGroup === groupName ? null : groupName)
          }
          className={`w-full ${getGroupColor(
            groupName,
          )} rounded-lg p-3 flex items-center justify-between font-semibold text-sm cursor-pointer transition-all hover:shadow-md`}
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">{getGroupIcon(groupName)}</span>
            {groupName}
            <span className="text-xs font-normal bg-black/10 px-2 py-1 rounded-full">
              {taskList.length}
            </span>
          </span>
          <span className="text-lg">
            {expandedGroup === groupName ? "−" : "+"}
          </span>
        </button>

        {/* Group Tasks */}
        {expandedGroup === groupName && (
          <div className="space-y-2 mt-2">
            {taskList.map((task) => {
              const icu = icuPatients.find((i) => i.id === task.patientId);

              return (
                <div
                  key={task.id}
                  className={`${getPriorityColor(
                    task.priority,
                  )} border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md hover:scale-102`}
                  onClick={() => onTaskSelect?.(task)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold">
                          {task.time}
                        </span>
                        <span className="text-xs font-semibold uppercase">
                          {task.type}
                        </span>
                      </div>
                      <p className="font-semibold text-sm truncate">
                        {task.patientName}
                      </p>
                      <p className="text-xs opacity-75 truncate">
                        {task.bedNumber}
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <span className="font-bold">{task.priority}</span>
                    </div>
                  </div>

                  <p className="text-xs mb-2 line-clamp-2">
                    {task.description}
                  </p>

                  {task.medicines && task.medicines.length > 0 && (
                    <div className="text-xs bg-black/5 rounded px-2 py-1 mb-2">
                      {task.medicines[0].name} {task.medicines[0].dosage}
                    </div>
                  )}

                  {/* Quick Action Buttons */}
                  {task.status !== "Completed" && (
                    <div className="flex gap-2 justify-end mt-2">
                      {task.status === "Pending" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskUpdate?.(task.id, "In Progress");
                          }}
                          className="px-2 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded font-medium"
                        >
                          Start
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskUpdate?.(task.id, "Completed");
                        }}
                        className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded font-medium"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="tasks" className="space-y-2">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Task Timeline</h2>

      {["NOW", "UPCOMING", "OVERDUE", "COMPLETED"].map((group) =>
        renderTaskGroup(group),
      )}

      {Object.values(groupedTasks).every((tasks) => tasks.length === 0) && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center text-slate-500">
          <p className="font-medium">No tasks assigned</p>
          <p className="text-sm">
            Tasks will appear here as doctors create ICU plans
          </p>
        </div>
      )}
    </div>
  );
}
