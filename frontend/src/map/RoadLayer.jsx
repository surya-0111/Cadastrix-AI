import React from 'react';

export default function RoadLayer({ roads, projectCoords, width, height }) {
  if (!roads || !roads.features) return null;

  return (
    <g className="road-layer pointer-events-none">
      {roads.features.map((feature) => {
        const coords = feature.geometry.coordinates;
        if (!coords || coords.length < 2) return null;

        const [p1, p2] = coords;
        const [x1, y1] = projectCoords(p1[0], p1[1], width, height);
        const [x2, y2] = projectCoords(p2[0], p2[1], width, height);

        const isArterial = feature.properties.road_type === 'Arterial';
        const strokeWidth = isArterial ? 10 : 6;

        return (
          <g key={feature.id || feature.properties.road_id}>
            {/* Road Outer Casing */}
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#0f172a"
              strokeWidth={strokeWidth + 2}
              strokeLinecap="round"
            />
            {/* Road Center Corridor */}
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isArterial ? '#f59e0b' : '#64748b'}
              strokeWidth={strokeWidth}
              strokeOpacity="0.75"
              strokeLinecap="round"
              strokeDasharray={isArterial ? 'none' : '4 4'}
            />
          </g>
        );
      })}
    </g>
  );
}
