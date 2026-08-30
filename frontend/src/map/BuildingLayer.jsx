import React from 'react';

export default function BuildingLayer({ buildings, projectCoords, width, height }) {
  if (!buildings || !buildings.features) return null;

  return (
    <g className="building-layer pointer-events-none">
      {buildings.features.map((feature) => {
        const ring = feature.geometry.coordinates[0];
        if (!ring) return null;

        const points = ring
          .map(([lng, lat]) => {
            const [x, y] = projectCoords(lng, lat, width, height);
            return `${x},${y}`;
          })
          .join(' ');

        return (
          <polygon
            key={feature.id || feature.properties.building_id}
            points={points}
            fill="url(#buildingGrad)"
            stroke="#06b6d4"
            strokeWidth="1.2"
            strokeLinejoin="round"
            className="opacity-90 drop-shadow-sm"
          />
        );
      })}
    </g>
  );
}
