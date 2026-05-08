"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import NurseDashboard from "@/components/nurse/NurseDashboard";
import { useStore } from "@/lib/store";
import { NURSE_NAV } from "@/components/nurse/nurse-nav";
import { generateNurseTasks } from "@/data/nurseTasks";
import { icuPatientsData, getICUPatientsForNurse } from "@/data/icuPatients";

export default function NursePage() {
  return (
    <DashboardLayout
      role="nurse"
      title="🏥 ICU Nurse Dashboard"
      navItems={NURSE_NAV}
    >
      <NurseContent />
    </DashboardLayout>
  );
}

function NurseContent() {
  const { auth, data } = useStore();
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [enhancedICUPatients, setEnhancedICUPatients] = useState([]);

  // Get the current nurse from store
  const nurse = data.nurses.find((n) => n.id === auth.userId);

  // Enhance ICU patients with additional data
  useEffect(() => {
    if (data.patients.length > 0 && data.icuPatients.length > 0) {
      // Map demo ICU patients to enhanced data
      const enhanced = data.icuPatients.map((icu) => {
        const patient = data.patients.find((p) => p.id === icu.patientId);
        const doctor = data.doctors.find((d) => d.id === icu.doctorIds?.[0]);

        // Get nurse assignments
        const nursesAssigned = icu.nurseIds
          ? icu.nurseIds
              .map((nId) => {
                const n = data.nurses.find((x) => x.id === nId);
                return n ? { id: n.id, name: n.name, shift: n.shift } : null;
              })
              .filter(Boolean)
          : [];

        return {
          id: icu.id,
          bedNumber: icu.bedId
            ? data.beds.find((b) => b.id === icu.bedId)?.number
            : "ICU-0",
          status:
            Math.random() > 0.6
              ? "Critical"
              : Math.random() > 0.5
                ? "Observation"
                : "Stable",
          patientId: icu.patientId,
          patientName: patient?.name || "Unknown Patient",
          age: patient?.age,
          gender: patient?.gender,
          phone: patient?.phone,
          bloodGroup: patient?.bloodGroup,
          allergies: patient?.allergies || [],
          chronicConditions: patient?.chronicConditions || [],
          admissionDate: icu.admittedAt || new Date().toISOString(),
          doctor: doctor
            ? { id: doctor.id, name: doctor.name, specialty: doctor.specialty }
            : null,
          nursesAssigned,
          vitals: icu.vitals || {
            bp: `${120 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 30)}`,
            hr: 70 + Math.floor(Math.random() * 40),
            spo2: 94 + Math.floor(Math.random() * 6),
            temp: 98.4 + (Math.random() - 0.5) * 2,
            rr: 16 + Math.floor(Math.random() * 12),
            glucose: 100 + Math.floor(Math.random() * 80),
            lastUpdated: new Date().toISOString(),
            updatedBy: nursesAssigned?.[0]?.name || "Nurse",
          },
          vitalsTrend: [
            { time: "06:00", spo2: 96, bp: "128/80" },
            { time: "08:00", spo2: 95, bp: "130/82" },
            { time: "10:00", spo2: 94, bp: "132/84" },
          ],
          currentPrescriptions: [
            {
              id: "px-1",
              medicine: "Cef-3 (Cefixime)",
              dosage: "200mg",
              frequency: "IV Every 8 hours",
              route: "IV",
              indication: "Infection control",
            },
            {
              id: "px-2",
              medicine: "Napa (Paracetamol)",
              dosage: "500mg",
              frequency: "Oral Twice daily",
              route: "Oral",
              indication: "Fever",
            },
            {
              id: "px-3",
              medicine: "Seclo (Omeprazole)",
              dosage: "20mg",
              frequency: "Oral Once daily",
              route: "Oral",
              indication: "GI protection",
            },
          ],
          testOrders: [
            {
              id: "t1",
              name: "Complete Blood Count",
              status: "Pending",
              orderedTime: new Date().toISOString(),
            },
            {
              id: "t2",
              name: "Chest X-Ray",
              status: "Completed",
              result: "Normal",
            },
          ],
          alerts:
            Math.random() > 0.7
              ? [
                  {
                    type: "SpO2 Low",
                    severity: "High",
                    message: "Oxygen saturation dropping",
                    time: new Date(Date.now() - 300000).toISOString(),
                  },
                ]
              : [],
          medicalHistory:
            "Admitted with critical condition, responding to treatment",
          medicineRequestStatus: {},
        };
      });

      setEnhancedICUPatients(enhanced);
    }
  }, [data.patients, data.icuPatients, data.doctors, data.nurses, data.beds]);

  // Generate nurse tasks based on shift
  useEffect(() => {
    if (nurse && enhancedICUPatients.length > 0) {
      const tasks = generateNurseTasks(
        enhancedICUPatients,
        data.nurses,
        data.medicines,
      );

      // Filter tasks by nurse and shift
      const shiftTasks = tasks.filter((t) => {
        const nurseShift = nurse.shift;
        const taskHour = parseInt(t.time.split(":")[0]);

        // Check if task is within nurse's shift
        if (nurseShift === "Day") return taskHour >= 6 && taskHour < 18;
        if (nurseShift === "Night") return taskHour >= 18 || taskHour < 6;
        return false;
      });

      setGeneratedTasks(shiftTasks);
    }
  }, [nurse, enhancedICUPatients, data.nurses, data.medicines]);

  if (
    !nurse ||
    (generatedTasks.length === 0 && enhancedICUPatients.length === 0)
  ) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900 font-medium">
            Loading ICU Nurse Dashboard...
          </p>
          <p className="text-blue-700 text-sm mt-2">
            Please wait while we fetch patient and task data
          </p>
        </div>
      </div>
    );
  }

  return (
    <NurseDashboard
      nurse={nurse}
      icuPatients={enhancedICUPatients}
      tasks={generatedTasks}
      patients={data.patients}
      doctors={data.doctors}
      hospitals={data.hospitals}
    />
  );
}
