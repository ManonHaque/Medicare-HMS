// PDF Generation utility for nurse documents
// Generates printable medicine and test lists

export const generateMedicineListPDF = (
  icuPatient,
  patient,
  doctor,
  hospital,
) => {
  const now = new Date();
  const docTitle = `Medicine List - ${patient?.name}`;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${docTitle}</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0;
          padding: 20px;
          background: white;
        }
        .header {
          border-bottom: 3px solid #1e40af;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0 0 5px 0;
          color: #1e40af;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          background: #1e40af;
          color: white;
          padding: 10px 15px;
          font-weight: bold;
          margin-bottom: 10px;
          border-radius: 3px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        th {
          background: #dbeafe;
          border: 1px solid #1e40af;
          padding: 10px;
          text-align: left;
          font-weight: bold;
          color: #1e40af;
        }
        td {
          border: 1px solid #ccc;
          padding: 10px;
          font-size: 13px;
        }
        tr:nth-child(even) {
          background: #f5f5f5;
        }
        .info-box {
          background: #fef3c7;
          border: 2px solid #f59e0b;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 15px;
          font-size: 13px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .info-card {
          background: #f0f9ff;
          border: 1px solid #0284c7;
          padding: 12px;
          border-radius: 5px;
        }
        .info-card strong {
          color: #0284c7;
          display: block;
          font-size: 12px;
          margin-bottom: 5px;
        }
        @media print {
          body { margin: 0; padding: 10mm; }
          .info-box { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${hospital?.name || "MediCare General Hospital"}</h1>
        <p>ICU Department - Medicine Request List</p>
        <p>Date: ${now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div class="grid">
        <div class="info-card">
          <strong>PATIENT NAME</strong>
          ${patient?.name || "N/A"}
        </div>
        <div class="info-card">
          <strong>BED NUMBER</strong>
          ${icuPatient?.bedNumber || "N/A"}
        </div>
        <div class="info-card">
          <strong>ATTENDING DOCTOR</strong>
          Dr. ${doctor?.name || "N/A"}
        </div>
        <div class="info-card">
          <strong>AGE / BLOOD GROUP</strong>
          ${patient?.age} yrs / ${patient?.bloodGroup}
        </div>
      </div>

      <div class="section">
        <div class="section-title">📋 PRESCRIBED MEDICINES</div>
        <table>
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Route</th>
            </tr>
          </thead>
          <tbody>
            ${(icuPatient?.currentPrescriptions || [])
              .map(
                (med) => `
              <tr>
                <td><strong>${med.medicine}</strong></td>
                <td>${med.dosage}</td>
                <td>${med.frequency}</td>
                <td>${med.route}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="info-box">
        <strong>ℹ️ IMPORTANT INSTRUCTIONS FOR PATIENT FAMILY:</strong>
        <p>
          Some medicines listed above may not be available in the hospital pharmacy. 
          Please check with the hospital pharmacy first. For medicines not available, 
          you may need to purchase them from authorized pharmacies. Ensure all medicines 
          are in original packaging with proper labels and expiry dates.
        </p>
      </div>

      ${
        patient?.allergies && patient.allergies.length > 0
          ? `
        <div class="section">
          <div class="section-title">⚠️ ALLERGIES</div>
          <table>
            <tbody>
              ${patient.allergies
                .map(
                  (allergy) => `
                <tr>
                  <td><strong>${allergy}</strong></td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
          : ""
      }

      <div class="footer">
        <p><strong>Generated on:</strong> ${now.toLocaleString("en-US")}</p>
        <p><strong>Note:</strong> This is an official medicine request list from ${hospital?.name || "MediCare Hospital"}. 
        Please present this to your pharmacist when purchasing medicines.</p>
      </div>
    </body>
    </html>
  `;

  return html;
};

export const generateTestListPDF = (icuPatient, patient, doctor, hospital) => {
  const now = new Date();
  const docTitle = `Test List - ${patient?.name}`;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${docTitle}</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0;
          padding: 20px;
          background: white;
        }
        .header {
          border-bottom: 3px solid #7c3aed;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0 0 5px 0;
          color: #7c3aed;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          background: #7c3aed;
          color: white;
          padding: 10px 15px;
          font-weight: bold;
          margin-bottom: 10px;
          border-radius: 3px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        th {
          background: #ede9fe;
          border: 1px solid #7c3aed;
          padding: 10px;
          text-align: left;
          font-weight: bold;
          color: #7c3aed;
        }
        td {
          border: 1px solid #ccc;
          padding: 10px;
          font-size: 13px;
        }
        tr:nth-child(even) {
          background: #f5f5f5;
        }
        .info-box {
          background: #ede9fe;
          border: 2px solid #7c3aed;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 15px;
          font-size: 13px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .info-card {
          background: #f5f3ff;
          border: 1px solid #7c3aed;
          padding: 12px;
          border-radius: 5px;
        }
        .info-card strong {
          color: #7c3aed;
          display: block;
          font-size: 12px;
          margin-bottom: 5px;
        }
        @media print {
          body { margin: 0; padding: 10mm; }
          .info-box { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${hospital?.name || "MediCare General Hospital"}</h1>
        <p>ICU Department - Test Request List</p>
        <p>Date: ${now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div class="grid">
        <div class="info-card">
          <strong>PATIENT NAME</strong>
          ${patient?.name || "N/A"}
        </div>
        <div class="info-card">
          <strong>BED NUMBER</strong>
          ${icuPatient?.bedNumber || "N/A"}
        </div>
        <div class="info-card">
          <strong>ATTENDING DOCTOR</strong>
          Dr. ${doctor?.name || "N/A"}
        </div>
        <div class="info-card">
          <strong>AGE / BLOOD GROUP</strong>
          ${patient?.age} yrs / ${patient?.bloodGroup}
        </div>
      </div>

      <div class="section">
        <div class="section-title">🧪 PRESCRIBED TESTS</div>
        <table>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Status</th>
              <th>Timing</th>
            </tr>
          </thead>
          <tbody>
            ${(icuPatient?.testOrders || [])
              .map(
                (test) => `
              <tr>
                <td><strong>${test.name}</strong></td>
                <td>${test.status}</td>
                <td>${test.orderedTime ? "Urgent" : "Routine"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="info-box">
        <strong>ℹ️ IMPORTANT:</strong>
        <p>
          All tests should be performed as per the doctor's instructions. 
          Ensure proper sample collection, labeling, and documentation. 
          Results should be reported to the attending doctor immediately.
        </p>
      </div>

      <div class="footer">
        <p><strong>Generated on:</strong> ${now.toLocaleString("en-US")}</p>
        <p><strong>Note:</strong> This is an official test request list from ${hospital?.name || "MediCare Hospital"}.</p>
      </div>
    </body>
    </html>
  `;

  return html;
};

export const downloadPDF = (htmlContent, filename) => {
  const element = document.createElement("a");
  element.href =
    "data:text/html;charset=utf-8," + encodeURIComponent(htmlContent);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const printPDF = (htmlContent) => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
};
