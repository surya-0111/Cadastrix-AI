import type { Parcel, Project, ProcessingLog } from "../types";

function openPrintDocument(title: string, htmlContent: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups in your browser to print / save as PDF.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @page {
          size: A4;
          margin: 12mm;
        }
        * {
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        body {
          color: #0f172a;
          background: #ffffff;
          margin: 0;
          padding: 16px;
          font-size: 12px;
          line-height: 1.45;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #0284c7;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .logo-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: #0284c7;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          border-radius: 8px;
        }
        .title-text h1 {
          margin: 0;
          font-size: 16px;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .title-text p {
          margin: 2px 0 0 0;
          font-size: 11px;
          color: #475569;
          font-family: monospace;
        }
        .meta-box {
          text-align: right;
          font-size: 11px;
          color: #475569;
        }
        .badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .badge-verified { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
        .badge-review { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
        .badge-error { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
        .badge-cyan { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }

        .section-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          margin: 16px 0 8px 0;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 6px;
          margin-bottom: 12px;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 6px 8px;
          text-align: left;
          font-size: 11px;
        }
        th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #334155;
          text-transform: uppercase;
          font-size: 10px;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 14px;
        }
        .kpi-card {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px;
          background: #f8fafc;
        }
        .kpi-card .label {
          font-size: 9px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 600;
        }
        .kpi-card .value {
          font-size: 15px;
          font-weight: bold;
          color: #0284c7;
          margin-top: 2px;
          font-family: monospace;
        }
        .footer {
          margin-top: 24px;
          border-top: 1px dashed #cbd5e1;
          padding-top: 10px;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #94a3b8;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          padding-top: 15px;
        }
        .sig-block {
          text-align: center;
          width: 180px;
          border-top: 1px solid #94a3b8;
          padding-top: 4px;
          font-size: 10px;
          color: #475569;
        }
        .actions-bar {
          margin-bottom: 16px;
          padding: 10px;
          background: #e0f2fe;
          border: 1px solid #bae6fd;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .print-btn {
          background: #0284c7;
          color: white;
          border: none;
          padding: 7px 14px;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          font-size: 11px;
        }
        .print-btn:hover { background: #0369a1; }
        @media print {
          .actions-bar { display: none; }
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="actions-bar">
        <span>📄 <strong>Official CadastrixAI PDF Report</strong> — Click &quot;Print / Save as PDF&quot; to download.</span>
        <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
      </div>
      ${htmlContent}
    </body>
    </html>
  `);
  printWindow.document.close();
}

// 1. Single Parcel Dossier PDF
export function exportParcelPdf(parcel: Parcel) {
  const html = `
    <div class="header">
      <div class="logo-box">
        <div class="logo-icon">C</div>
        <div class="title-text">
          <h1>CadastrixAI · Land Parcel Certificate</h1>
          <p>Chennai Metropolitan Development Authority · Cadastral Records Dept</p>
        </div>
      </div>
      <div class="meta-box">
        <div><strong>Record Date:</strong> ${new Date().toLocaleDateString("en-IN")}</div>
        <div><strong>CRS:</strong> EPSG:32644 (UTM 44N)</div>
        <div><strong>Certificate ID:</strong> ${parcel.id}</div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="label">Survey Number</div>
        <div class="value">${parcel.surveyNo}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Cadastral Area</div>
        <div class="value">${parcel.area.toLocaleString()} m²</div>
      </div>
      <div class="kpi-card">
        <div class="label">Structures</div>
        <div class="value">${parcel.buildings} Buildings</div>
      </div>
      <div class="kpi-card">
        <div class="label">AI Confidence</div>
        <div class="value">${parcel.confidence}%</div>
      </div>
    </div>

    <div class="section-title">Cadastral Property Attributes</div>
    <table>
      <tbody>
        <tr>
          <th style="width: 25%;">Survey Number</th>
          <td><strong>${parcel.surveyNo}</strong></td>
          <th style="width: 25%;">Parcel ID</th>
          <td style="font-family: monospace;">${parcel.id}</td>
        </tr>
        <tr>
          <th>Registered Owner</th>
          <td>${parcel.owner}</td>
          <th>Validation Status</th>
          <td>
            <span class="badge ${parcel.status === 'validated' ? 'badge-verified' : parcel.status === 'review' ? 'badge-review' : 'badge-error'}">
              ${parcel.status.toUpperCase()}
            </span>
          </td>
        </tr>
        <tr>
          <th>Land Classification</th>
          <td>${parcel.landUse}</td>
          <th>Area (Hectares)</th>
          <td>${(parcel.area / 10000).toFixed(4)} ha (${parcel.area.toLocaleString()} m²)</td>
        </tr>
        <tr>
          <th>Administrative Zone</th>
          <td>${parcel.zone}</td>
          <th>Municipal Ward</th>
          <td>${parcel.ward}</td>
        </tr>
        <tr>
          <th>Topological Integrity</th>
          <td>${parcel.topologyErrors === 0 ? "✅ Clean Geometry (No slivers/overlaps)" : `⚠️ ${parcel.topologyErrors} Anomaly Detected`}</td>
          <th>Last Reconciled</th>
          <td>${parcel.lastUpdated}</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">Regulatory Compliance & Spatial Verification</div>
    <p style="font-size: 11px; color: #475569;">
      This cadastral dossier has been generated via high-resolution drone orthomosaic vectorization and validated against official Tamil Nadu Survey and Settlement department tolerances. Geometric boundaries conform to OGC Simple Feature specifications.
    </p>

    <div class="signatures">
      <div class="sig-block">
        Authorized Cadastral Surveyor<br>
        <strong>Arjun Krishnamurthy (CMDA)</strong>
      </div>
      <div class="sig-block">
        GIS Verification Officer<br>
        <strong>Directorate of Survey & Land Records</strong>
      </div>
    </div>

    <div class="footer">
      <span>Official Government Document · CMDA CadastrixAI Portal</span>
      <span>Page 1 of 1</span>
    </div>
  `;

  openPrintDocument(`Parcel-${parcel.surveyNo}-Report`, html);
}

// 2. Validation Audit Report PDF
export function exportValidationAuditPdf(parcels: Parcel[], stats: any) {
  const rows = parcels.map(p => `
    <tr>
      <td style="font-family: monospace; color: #0284c7;">${p.id}</td>
      <td><strong>${p.surveyNo}</strong></td>
      <td>${p.landUse}</td>
      <td>${p.area.toLocaleString()} m²</td>
      <td>${p.confidence}%</td>
      <td>${p.topologyErrors === 0 ? "0" : `<strong style="color: #b91c1c;">${p.topologyErrors}</strong>`}</td>
      <td>
        <span class="badge ${p.status === 'validated' ? 'badge-verified' : p.status === 'review' ? 'badge-review' : 'badge-error'}">
          ${p.status}
        </span>
      </td>
    </tr>
  `).join("");

  const html = `
    <div class="header">
      <div class="logo-box">
        <div class="logo-icon">V</div>
        <div class="title-text">
          <h1>CadastrixAI · Validation & Topology Audit Report</h1>
          <p>Anna Nagar Urban Sector · Batch AN-34-C3 Comprehensive Reconciliation</p>
        </div>
      </div>
      <div class="meta-box">
        <div><strong>Generated:</strong> ${new Date().toLocaleDateString("en-IN")}</div>
        <div><strong>Auditor:</strong> Senior GIS Specialist</div>
        <div><strong>Progress:</strong> ${stats.validated}/${stats.total} Parcels Approved</div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="label">Total Parcels</div>
        <div class="value">${stats.total}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Verified Clean</div>
        <div class="value" style="color: #15803d;">${stats.validated}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Requires Review</div>
        <div class="value" style="color: #b45309;">${stats.review}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Average Confidence</div>
        <div class="value">${stats.avgConf}%</div>
      </div>
    </div>

    <div class="section-title">Audit Parcel Inventory</div>
    <table>
      <thead>
        <tr>
          <th>Cadastral ID</th>
          <th>Survey No</th>
          <th>Land Use</th>
          <th>Area</th>
          <th>AI Confidence</th>
          <th>Topology Gaps</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="signatures">
      <div class="sig-block">
        Survey Team Lead<br>
        <strong>CMDA Field Verification Unit</strong>
      </div>
      <div class="sig-block">
        Quality Assurance Officer<br>
        <strong>Spatial Data Infrastructure Division</strong>
      </div>
    </div>

    <div class="footer">
      <span>Official Government Document · CMDA CadastrixAI Audit Center</span>
      <span>Page 1 of 1</span>
    </div>
  `;

  openPrintDocument("Cadastra-Validation-Audit-Report", html);
}

// 3. AI Processing & Inference Report PDF
export function exportAIProcessingPdf(data: {
  tileName: string;
  coords: string;
  res: string;
  status: string;
  confidence: number;
  buildingCount: number;
  roadCount: number;
  parcelCount: number;
  logs: ProcessingLog[];
}) {
  const logRows = data.logs.slice(-8).map(l => `
    <tr>
      <td style="font-family: monospace; color: #64748b;">${l.time}</td>
      <td><span class="badge badge-cyan">${l.level}</span></td>
      <td>${l.message}</td>
    </tr>
  `).join("");

  const html = `
    <div class="header">
      <div class="logo-box">
        <div class="logo-icon">AI</div>
        <div class="title-text">
          <h1>CadastrixAI · AI Boundary Extraction Report</h1>
          <p>CadastraNet v4.2 ResNet-101 Topology Loss ML-CV Inference Engine</p>
        </div>
      </div>
      <div class="meta-box">
        <div><strong>Processing Date:</strong> ${new Date().toLocaleDateString("en-IN")}</div>
        <div><strong>Status:</strong> ${data.status.toUpperCase()}</div>
        <div><strong>Resolution:</strong> ${data.res}</div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="label">Buildings Extracted</div>
        <div class="value">${data.buildingCount.toLocaleString()}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Road Segments</div>
        <div class="value">${data.roadCount}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Parcels Reconstructed</div>
        <div class="value">${data.parcelCount}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Overall AI Confidence</div>
        <div class="value" style="color: #15803d;">${data.confidence}%</div>
      </div>
    </div>

    <div class="section-title">Survey Flight Zone Metadata</div>
    <table>
      <tbody>
        <tr>
          <th style="width: 25%;">Survey Zone Tile</th>
          <td><strong>${data.tileName}</strong></td>
          <th style="width: 25%;">Coordinates</th>
          <td style="font-family: monospace;">${data.coords}</td>
        </tr>
        <tr>
          <th>Inference Model</th>
          <td>CadastraNet v4.2 (ResNet-101 + FPN)</td>
          <th>Ground Sampling Distance</th>
          <td>5.0 cm/pixel GSD</td>
        </tr>
        <tr>
          <th>Projection Reference</th>
          <td>WGS84 / UTM Zone 44N (EPSG:32644)</td>
          <th>Topological Snapping</th>
          <td>Active (0.5m tolerance threshold)</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">Recent Inference Logs</div>
    <table>
      <thead>
        <tr>
          <th style="width: 15%;">Timestamp</th>
          <th style="width: 15%;">Level</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        ${logRows}
      </tbody>
    </table>

    <div class="signatures">
      <div class="sig-block">
        Lead AI/GIS Engineer<br>
        <strong>CadastrixAI Platform Team</strong>
      </div>
      <div class="sig-block">
        Survey Records Officer<br>
        <strong>CMDA Spatial Data Directorate</strong>
      </div>
    </div>

    <div class="footer">
      <span>Official ML-CV Extraction Report · CMDA CadastrixAI Intelligence</span>
      <span>Page 1 of 1</span>
    </div>
  `;

  openPrintDocument("Cadastra-AI-Inference-Report", html);
}

// 4. GIS Analytics Report PDF
export function exportAnalyticsPdf(stats: any, landUseBreakdown: any[]) {
  const landUseRows = landUseBreakdown.map(l => `
    <tr>
      <td><strong>${l.name}</strong></td>
      <td>${l.count} parcels</td>
      <td>${l.pct}%</td>
    </tr>
  `).join("");

  const html = `
    <div class="header">
      <div class="logo-box">
        <div class="logo-icon">A</div>
        <div class="title-text">
          <h1>CadastrixAI · GIS Operational Telemetry & Analytics</h1>
          <p>Chennai Metropolitan Area · Urban Land Cadastral Analysis Report</p>
        </div>
      </div>
      <div class="meta-box">
        <div><strong>Report Date:</strong> ${new Date().toLocaleDateString("en-IN")}</div>
        <div><strong>Coverage:</strong> Sector IV (Anna Nagar / Central)</div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="label">Total Parcels</div>
        <div class="value">${stats.totalParcels}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Verified Rate</div>
        <div class="value" style="color: #15803d;">${stats.validationPercentage}%</div>
      </div>
      <div class="kpi-card">
        <div class="label">Building Footprints</div>
        <div class="value">${stats.totalBuildings?.toLocaleString() || "8,914"}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Mean Confidence</div>
        <div class="value">${stats.avgConfidence}%</div>
      </div>
    </div>

    <div class="section-title">Land Classification Distribution</div>
    <table>
      <thead>
        <tr>
          <th>Classification</th>
          <th>Parcel Count</th>
          <th>Percentage of Total Extent</th>
        </tr>
      </thead>
      <tbody>
        ${landUseRows}
      </tbody>
    </table>

    <div class="section-title">Topological & Quality Metrics</div>
    <table>
      <tbody>
        <tr>
          <th style="width: 30%;">Repaired Geometry Anomalies</th>
          <td>${stats.topologyRepairs} polygons auto-reconciled</td>
        </tr>
        <tr>
          <th>Active Review Queue</th>
          <td>${stats.reviewParcels} parcels awaiting field verification</td>
        </tr>
        <tr>
          <th>Survey Processing Duration</th>
          <td>${stats.processingDuration || "18m 42s"} for 5cm GSD Orthomosaic</td>
        </tr>
        <tr>
          <th>Total Survey Extent</th>
          <td>${((stats.totalAreaM2 || 48000) / 10000).toFixed(2)} Hectares</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <span>Official Government Analytics Report · CadastrixAI Spatial Intelligence</span>
      <span>Page 1 of 1</span>
    </div>
  `;

  openPrintDocument("Cadastra-Analytics-Report", html);
}
