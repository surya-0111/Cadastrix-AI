/**
 * Geospatial utility functions for WebGIS
 * Implements Spherical geometry calculations for accurate parcel measurements
 */

// Calculate area of polygon in square meters using Shoelace formula with spherical distortion correction
export function calculatePolygonArea(coordinates) {
  if (!coordinates || coordinates.length < 3) return 0;
  
  const ring = coordinates[0];
  if (!ring || ring.length < 3) return 0;

  const R = 6378137; // Earth's mean radius in meters
  let area = 0;

  if (ring.length > 2) {
    for (let i = 0; i < ring.length - 1; i++) {
      const p1 = ring[i];
      const p2 = ring[i + 1];
      const x1 = (p1[0] * Math.PI) / 180;
      const y1 = (p1[1] * Math.PI) / 180;
      const x2 = (p2[0] * Math.PI) / 180;
      const y2 = (p2[1] * Math.PI) / 180;

      area += (x2 - x1) * (2 + Math.sin(y1) + Math.sin(y2));
    }
    area = Math.abs((area * R * R) / 2.0);
  }

  return Math.round(area * 10) / 10;
}

// Calculate perimeter in meters
export function calculatePerimeter(coordinates) {
  if (!coordinates || !coordinates[0]) return 0;
  const ring = coordinates[0];
  let perimeter = 0;

  for (let i = 0; i < ring.length - 1; i++) {
    perimeter += haversineDistance(ring[i], ring[i + 1]);
  }
  return Math.round(perimeter * 10) / 10;
}

// Haversine distance between two [lng, lat] points in meters
export function haversineDistance(c1, c2) {
  const R = 6378137;
  const dLat = ((c2[1] - c1[1]) * Math.PI) / 180;
  const dLon = ((c2[0] - c1[0]) * Math.PI) / 180;
  const lat1 = (c1[1] * Math.PI) / 180;
  const lat2 = (c2[1] * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Compute Bounding Box [minLng, minLat, maxLng, maxLat]
export function getBoundingBox(geojson) {
  let minLng = Infinity,
    minLat = Infinity,
    maxLng = -Infinity,
    maxLat = -Infinity;

  function traverse(coords) {
    if (typeof coords[0] === 'number') {
      const [lng, lat] = coords;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    } else {
      coords.forEach(traverse);
    }
  }

  if (geojson.type === 'FeatureCollection') {
    geojson.features.forEach((f) => traverse(f.geometry.coordinates));
  } else if (geojson.type === 'Feature') {
    traverse(geojson.geometry.coordinates);
  }

  return [minLng, minLat, maxLng, maxLat];
}

// Simple split polygon tool (horizontal or vertical bisector)
export function splitPolygon(feature) {
  const coords = feature.geometry.coordinates[0];
  if (!coords || coords.length < 4) return null;

  // Find centroid & bounding dimensions
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  coords.forEach(([x, y]) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });

  const midX = (minX + maxX) / 2;

  // Subdivide into west and east
  const polyA = [
    [minX, minY],
    [midX, minY],
    [midX, maxY],
    [minX, maxY],
    [minX, minY]
  ];
  const polyB = [
    [midX, minY],
    [maxX, minY],
    [maxX, maxY],
    [midX, maxY],
    [midX, minY]
  ];

  return [
    {
      ...feature,
      id: `${feature.id || feature.properties.parcel_id}-A`,
      properties: {
        ...feature.properties,
        parcel_id: `${feature.properties.parcel_id}-A`,
        area_m2: Math.round(feature.properties.area_m2 * 0.48),
        building_m2: Math.round(feature.properties.building_m2 * 0.5),
        geometry_valid: true,
        survey_status: 'SPLIT_PROVISIONAL'
      },
      geometry: { type: 'Polygon', coordinates: [polyA] }
    },
    {
      ...feature,
      id: `${feature.id || feature.properties.parcel_id}-B`,
      properties: {
        ...feature.properties,
        parcel_id: `${feature.properties.parcel_id}-B`,
        area_m2: Math.round(feature.properties.area_m2 * 0.52),
        building_m2: Math.round(feature.properties.building_m2 * 0.5),
        geometry_valid: true,
        survey_status: 'SPLIT_PROVISIONAL'
      },
      geometry: { type: 'Polygon', coordinates: [polyB] }
    }
  ];
}
