// Patient Quick View Panel - Shows patient key information
"use client";

export default function PatientQuickView({ patient, icuPatient, doctors }) {
  const assignedDoctors = doctors.filter((d) =>
    icuPatient.doctor?.id ? d.id === icuPatient.doctor.id : false,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
      {/* Basic Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <p className="text-xs font-bold text-slate-600 mb-2">BLOOD GROUP</p>
        <p className="text-lg font-bold text-slate-900">
          {patient?.bloodGroup}
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <p className="text-xs font-bold text-slate-600 mb-2">AGE / GENDER</p>
        <p className="text-sm font-semibold text-slate-900">
          {patient?.age} yrs • {patient?.gender}
        </p>
      </div>

      {/* Allergies */}
      {patient?.allergies && patient.allergies.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs font-bold text-red-700 mb-2">⚠ ALLERGIES</p>
          <div className="space-y-1">
            {patient.allergies.map((allergy, idx) => (
              <p key={idx} className="text-xs text-red-700 font-medium">
                • {allergy}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Oxygen Level */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs font-bold text-blue-600 mb-2">O₂ LEVEL</p>
        <p className="text-lg font-bold text-blue-900">
          {icuPatient?.vitals?.spo2}%
        </p>
      </div>

      {/* Doctor */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <p className="text-xs font-bold text-purple-600 mb-2">
          ATTENDING DOCTOR
        </p>
        <p className="text-sm font-semibold text-purple-900">
          {icuPatient?.doctor?.name || "Dr. N/A"}
        </p>
        <p className="text-xs text-purple-700">
          {icuPatient?.doctor?.specialty}
        </p>
      </div>

      {/* Admission Date */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <p className="text-xs font-bold text-slate-600 mb-2">ADMITTED</p>
        <p className="text-sm font-semibold text-slate-900">
          {new Date(icuPatient?.admissionDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Chronic Conditions */}
      {patient?.chronicConditions && patient.chronicConditions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:col-span-2">
          <p className="text-xs font-bold text-yellow-700 mb-2">
            CHRONIC CONDITIONS
          </p>
          <div className="flex flex-wrap gap-1">
            {patient.chronicConditions.map((condition, idx) => (
              <span
                key={idx}
                className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-medium"
              >
                {condition}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
