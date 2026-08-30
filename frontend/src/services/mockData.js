/**
 * Mock Cadastral Survey Dataset for Cadastrix AI
 * Location: Chennai Urban Area (T. Nagar / Panagal Park Sector)
 * Coordinate Reference System: EPSG:4326 (Display) / EPSG:32644 (Target UTM)
 */

export const INITIAL_PROJECTS = [
  {
    id: "proj-001",
    name: "Urban Survey — Chennai",
    subtext: "Panagal Park / Pondy Bazaar Cadastral Sector 4",
    location: "Chennai, Tamil Nadu",
    date: "2026-08-28",
    status: "Completed",
    total_area_m2: 184520,
    parcels_count: 127,
    buildings_count: 214,
    roads_km: 4.8,
    valid_parcels: 121,
    repaired_parcels: 4,
    review_parcels: 2,
    crs: "EPSG:32644 - UTM 44N",
    gsd_cm: 3.5,
    orthomosaic_url: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "proj-002",
    name: "Urban Survey — Test Area",
    subtext: "Zone 7 Peripheral Settlement Pilot",
    location: "Guindy Industrial Corridor",
    date: "2026-08-30",
    status: "Processing",
    total_area_m2: 92400,
    parcels_count: 48,
    buildings_count: 82,
    roads_km: 2.1,
    valid_parcels: 45,
    repaired_parcels: 2,
    review_parcels: 1,
    crs: "EPSG:32644 - UTM 44N",
    gsd_cm: 4.0,
    orthomosaic_url: null
  },
  {
    id: "proj-003",
    name: "North Chennai Industrial Zone",
    subtext: "Harbour Environs Cadastral Revision",
    location: "George Town & Port Sector",
    date: "2026-08-24",
    status: "Completed",
    total_area_m2: 340100,
    parcels_count: 84,
    buildings_count: 145,
    roads_km: 7.2,
    valid_parcels: 82,
    repaired_parcels: 2,
    review_parcels: 0,
    crs: "EPSG:32644 - UTM 44N",
    gsd_cm: 2.8,
    orthomosaic_url: null
  }
];

// Center coordinate for Chennai T. Nagar
export const MAP_CENTER = [80.2341, 13.0418]; // [lng, lat]
export const MAP_DEFAULT_ZOOM = 16.8;

// Generate 127 Realistic Parcels arranged in a grid-aligned urban layout around Panagal Park
export function generateParcelsGeoJSON() {
  const originLng = 80.2310;
  const originLat = 13.0395;
  const rows = 11;
  const cols = 12;
  const dLng = 0.00045; // roughly 45m
  const dLat = 0.00040; // roughly 44m
  const gap = 0.00008; // road separation

  const features = [];
  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      count++;
      if (count > 127) break;

      const parcelId = `P${count.toString().padStart(3, '0')}`;
      const minX = originLng + c * (dLng + gap);
      const maxX = minX + dLng;
      const minY = originLat + r * (dLat + gap);
      const maxY = minY + dLat;

      // Add slight organic vertex wobble for realistic cadastral look
      const wobble = ((r * 13 + c * 7) % 5) * 0.00002;
      const ring = [
        [minX, minY],
        [maxX + wobble, minY],
        [maxX, maxY + wobble],
        [minX - wobble, maxY],
        [minX, minY]
      ];

      // Benchmark values from PM blueprint:
      // P017 is 1432 m2, 351 m2 building, 93% confidence, VALID
      let area = Math.round(1200 + ((r * 77 + c * 31) % 450));
      let buildingArea = Math.round(area * 0.28 + ((c * 19) % 80));
      let confidence = 0.90 + ((r + c) % 8) * 0.01;
      let valid = true;
      let issue = null;
      let surveyStatus = 'APPROVED';

      if (parcelId === 'P017') {
        area = 1432.7;
        buildingArea = 351.0;
        confidence = 0.93;
        valid = true;
        issue = null;
      } else if (parcelId === 'P024') {
        area = 890.5;
        buildingArea = 210.0;
        confidence = 0.61;
        valid = false;
        issue = 'Boundary uncertainty / Potential road overlap';
        surveyStatus = 'REQUIRES_REVIEW';
      } else if (parcelId === 'P042') {
        area = 1120.0;
        buildingArea = 280.0;
        confidence = 0.74;
        valid = false;
        issue = 'Minor gap detected with adjacent plot P041';
        surveyStatus = 'REQUIRES_REVIEW';
      } else if (parcelId === 'P038' || parcelId === 'P065' || parcelId === 'P089' || parcelId === 'P112') {
        confidence = 0.88;
        valid = true;
        issue = 'Self-intersection auto-repaired by topology engine';
        surveyStatus = 'AUTO_REPAIRED';
      }

      features.push({
        type: 'Feature',
        id: parcelId,
        properties: {
          parcel_id: parcelId,
          area_m2: area,
          building_m2: buildingArea,
          confidence: Math.round(confidence * 100) / 100,
          geometry_valid: valid,
          issue: issue,
          survey_status: surveyStatus,
          zone_code: 'R3-URBAN',
          last_modified: '2026-08-30T10:15:00Z'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [ring]
        }
      });
    }
  }

  return {
    type: 'FeatureCollection',
    features: features
  };
}

// Generate Buildings GeoJSON (extracted by AI SegFormer / U-Net)
export function generateBuildingsGeoJSON(parcelsGeoJSON) {
  const features = [];
  
  parcelsGeoJSON.features.forEach((p, idx) => {
    // 85% of parcels contain a detected building structure
    if (idx % 7 === 0 && idx !== 16) return; // skip few to simulate open yards

    const coords = p.geometry.coordinates[0];
    const minX = coords[0][0];
    const maxX = coords[1][0];
    const minY = coords[0][1];
    const maxY = coords[2][1];

    const padX = (maxX - minX) * 0.22;
    const padY = (maxY - minY) * 0.20;

    const bRing = [
      [minX + padX, minY + padY],
      [maxX - padX, minY + padY],
      [maxX - padX, maxY - padY],
      [minX + padX, maxY - padY],
      [minX + padX, minY + padY]
    ];

    features.push({
      type: 'Feature',
      id: `BLD-${p.properties.parcel_id}`,
      properties: {
        building_id: `BLD-${p.properties.parcel_id}`,
        parcel_id: p.properties.parcel_id,
        area_m2: p.properties.building_m2,
        height_m: 6.5 + (idx % 4) * 3.2,
        floors: 2 + (idx % 3),
        confidence: p.properties.confidence,
        model_source: 'SegFormer-B3-FineTuned'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [bRing]
      }
    });
  });

  return {
    type: 'FeatureCollection',
    features: features
  };
}

// Generate AI Road Network GeoJSON (Centerlines & Corridors)
export function generateRoadsGeoJSON() {
  const originLng = 80.2310;
  const originLat = 13.0395;
  const dLng = 0.00045 + 0.00008;
  const dLat = 0.00040 + 0.00008;

  const features = [];

  // Horizontal corridors
  for (let r = 0; r <= 11; r++) {
    const lat = originLat + r * dLat - 0.00004;
    features.push({
      type: 'Feature',
      id: `ROAD-H-${r}`,
      properties: {
        road_id: `R-H${r}`,
        name: r === 5 ? 'Usman Road Arterial' : `Cross Street ${r + 1}`,
        road_type: r === 5 ? 'Arterial' : 'Local Access',
        width_m: r === 5 ? 18.0 : 8.5,
        confidence: 0.94
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [originLng - 0.0005, lat],
          [originLng + 12 * dLng + 0.0005, lat]
        ]
      }
    });
  }

  // Vertical corridors
  for (let c = 0; c <= 12; c++) {
    const lng = originLng + c * dLng - 0.00004;
    features.push({
      type: 'Feature',
      id: `ROAD-V-${c}`,
      properties: {
        road_id: `R-V${c}`,
        name: c === 6 ? 'Panagal Park Link' : `Sub-lane ${c + 1}`,
        road_type: c === 6 ? 'Collector' : 'Access',
        width_m: c === 6 ? 14.0 : 7.0,
        confidence: 0.92
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [lng, originLat - 0.0005],
          [lng, originLat + 11 * dLat + 0.0005]
        ]
      }
    });
  }

  return {
    type: 'FeatureCollection',
    features: features
  };
}
