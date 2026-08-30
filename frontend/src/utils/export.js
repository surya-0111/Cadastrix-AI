/**
 * Export helpers for GeoJSON and Cadastral datasets
 */

export function downloadGeoJSON(data, filename = 'cadastral_parcels.geojson') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/geo+json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCadastralReportCSV(parcels, filename = 'cadastral_survey_report.csv') {
  const headers = [
    'Parcel ID',
    'Area (sq m)',
    'Building Footprint (sq m)',
    'Coverage Ratio (%)',
    'Confidence Score (%)',
    'Geometry Status',
    'Topology Issues',
    'Surveyor Verified',
    'CRS Code'
  ];

  const rows = parcels.map((p) => {
    const props = p.properties || p;
    const ratio = props.area_m2 ? ((props.building_m2 / props.area_m2) * 100).toFixed(1) : '0';
    return [
      props.parcel_id,
      props.area_m2,
      props.building_m2 || 0,
      `${ratio}%`,
      `${Math.round(props.confidence * 100)}%`,
      props.geometry_valid ? 'VALID' : 'REQUIRES_REVIEW',
      `"${props.issue || 'None'}"`,
      props.survey_status === 'APPROVED' ? 'YES' : 'PENDING',
      'EPSG:32644 (UTM 44N)'
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
