// 🏥 🚨 Professional Critical Alerts Panel
// Real-time monitoring of critical patient alerts with AI insights

"use client";

import { useState, useEffect } from "react";
import { generatePatientAlerts, generateAIInsights } from "@/lib/nurseUtils";

export default function CriticalAlertsPanel({
  icuPatients,
  patients,
  onPatientSelect,
}) {
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);

  // Generate alerts from patient vitals
  const allAlerts = icuPatients.flatMap((icu) => {
    const patient = patients.find((p) => p.id === icu.patientId);
    const vitalAlerts = generatePatientAlerts(icu);

    return vitalAlerts
      .map((alert) => ({
        id: `${icu.id}-${alert.type}`,
        icuId: icu.id,
        bedNumber: icu.bedNumber,
        patientName: patient?.name || "Unknown",
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        icon: alert.icon,
        time: new Date().toISOString(),
        fromVitals: true,
      }))
      .concat(
        (icu.alerts || []).map((alert) => ({
          id: `${icu.id}-${alert.type}-direct`,
          icuId: icu.id,
          bedNumber: icu.bedNumber,
          patientName: patient?.name || "Unknown",
          type: alert.type,
          severity: alert.severity,
          message: alert.message,
          icon: alert.icon || "⚠️",
          time: alert.time,
          fromVitals: false,
        })),
      );
  });

  // Sort by severity then time
  const sortedAlerts = allAlerts.sort((a, b) => {
    const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    const aOrder = severityOrder[a.severity] ?? 99;
    const bOrder = severityOrder[b.severity] ?? 99;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return new Date(b.time) - new Date(a.time);
  });

  // AI Insights
  useEffect(() => {
    const insights = generateAIInsights(icuPatients);
    setAiInsights(insights);
  }, [icuPatients]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-50 border-red-300 text-red-900";
      case "High":
        return "bg-red-50 border-red-200 text-red-800";
      case "Medium":
        return "bg-yellow-50 border-yellow-300 text-yellow-900";
      case "Low":
        return "bg-blue-50 border-blue-300 text-blue-800";
      default:
        return "bg-gray-50 border-gray-300 text-gray-800";
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-600 text-white";
      case "High":
        return "bg-red-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-white";
      case "Low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getTimeAgo = (timeStr) => {
    const then = new Date(timeStr);
    const now = new Date();
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (sortedAlerts.length === 0 && aiInsights.length === 0) {
    return (
      <div
        id="alerts"
        className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-300 rounded-lg p-6 text-center shadow-sm"
      >
        <div className="text-3xl mb-2">✓</div>
        <p className="text-green-800 font-bold text-lg">All Patients Stable</p>
        <p className="text-green-700 text-sm mt-1">
          No critical alerts at this time
        </p>
      </div>
    );
  }

  return (
    <div id="alerts" className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="text-2xl animate-pulse">🚨</span>
            Critical Alerts & Notifications
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {sortedAlerts.length} active alerts
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-full font-bold text-white ${getSeverityBadge(sortedAlerts[0]?.severity)}`}
        >
          {sortedAlerts.length}
        </div>
      </div>

      {/* AI Insights Section */}
      {aiInsights.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 space-y-2">
          <p className="text-xs font-bold text-blue-700 uppercase">
            🧠 AI Monitoring Insights
          </p>
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="text-sm text-blue-900">
              <p className="font-semibold">{insight.patient}</p>
              <p className="text-blue-700 text-xs mt-1">{insight.message}</p>
              <p className="text-blue-600 text-xs mt-1">→ {insight.action}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active Alerts */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {sortedAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`${getSeverityColor(
              alert.severity,
            )} border-2 rounded-lg p-4 cursor-pointer transition-all transform hover:scale-101 hover:shadow-lg`}
            onClick={() =>
              setExpandedAlert(expandedAlert === alert.id ? null : alert.id)
            }
          >
            <div className="flex items-start justify-between gap-4">
              {/* Alert Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{alert.icon}</span>
                  <div>
                    <span
                      className={`${getSeverityBadge(alert.severity)} px-2 py-1 rounded text-xs font-bold`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs ml-2 opacity-60">
                      {alert.bedNumber}
                    </span>
                  </div>
                </div>

                <p className="font-bold text-sm text-slate-900 mb-1">
                  {alert.patientName}
                </p>
                <p className="text-sm font-medium leading-tight">
                  {alert.message}
                </p>

                {expandedAlert === alert.id && (
                  <div className="mt-3 pt-3 border-t border-current opacity-75 text-xs">
                    <p>Alert ID: {alert.id}</p>
                    <p>Detected: {getTimeAgo(alert.time)}</p>
                    <p>
                      Type: {alert.fromVitals ? "Vital Signs" : "Direct Alert"}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPatientSelect?.(alert.icuId);
                  }}
                  className="px-2.5 py-1 bg-white/70 hover:bg-white rounded text-xs font-bold border border-current transition-all"
                  title="Open patient details"
                >
                  👁️ View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("📞 Doctor notification sent to assigned physician");
                  }}
                  className="px-2.5 py-1 bg-white/70 hover:bg-white rounded text-xs font-bold border border-current transition-all"
                  title="Call assigned doctor"
                >
                  📞 Doctor
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("🚑 Emergency escalation initiated");
                  }}
                  className="px-2.5 py-1 bg-white/70 hover:bg-white rounded text-xs font-bold border border-current transition-all"
                  title="Emergency escalation"
                >
                  🚑 Escalate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-200">
        <p className="font-bold mb-1">💡 Quick Actions:</p>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>Click alert to expand details</li>
          <li>Click "View" to open patient panel for detailed assessment</li>
          <li>Click "Doctor" to notify assigned physician</li>
          <li>Click "Escalate" for emergency situations</li>
        </ul>
      </div>
    </div>
  );
}
