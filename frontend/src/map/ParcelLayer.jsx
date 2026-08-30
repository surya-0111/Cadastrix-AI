import React from 'react';

export default function ParcelLayer({
  parcels,
  projectCoords,
  width,
  height,
  selectedParcel,
  onSelectParcel,
  showInvalid,
  showConfidence,
  isMergeMode,
  mergeSourceParcel,
  onFinishMerge
}) {
  if (!parcels || !parcels.features) return null;

  return (
    <g className="parcel-layer">
      {parcels.features.map((feature) => {
        const ring = feature.geometry.coordinates[0];
        if (!ring) return null;

        const points = ring
          .map(([lng, lat]) => {
            const [x, y] = projectCoords(lng, lat, width, height);
            return `${x},${y}`;
          })
          .join(' ');

        const isSelected = selectedParcel && (selectedParcel.id === feature.id || selectedParcel.properties.parcel_id === feature.properties.parcel_id);
        const isSourceMerge = mergeSourceParcel && mergeSourceParcel.properties.parcel_id === feature.properties.parcel_id;
        const isInvalid = !feature.properties.geometry_valid || feature.properties.issue;
        const isApproved = feature.properties.survey_status === 'APPROVED';

        // Styling based on state & confidence
        let strokeColor = '#3b82f6';
        let strokeWidth = 1.5;
        let fillColor = 'rgba(59, 130, 246, 0.15)';

        if (showConfidence) {
          const conf = feature.properties.confidence || 0.9;
          if (conf < 0.70) {
            strokeColor = '#ef4444';
            fillColor = 'rgba(239, 68, 68, 0.35)';
          } else if (conf < 0.85) {
            strokeColor = '#f59e0b';
            fillColor = 'rgba(245, 158, 11, 0.3)';
          } else {
            strokeColor = '#10b981';
            fillColor = 'rgba(16, 185, 129, 0.25)';
          }
        } else if (showInvalid && isInvalid) {
          strokeColor = '#ef4444';
          strokeWidth = 2.5;
          fillColor = 'url(#parcelFlagGrad)';
        } else if (isApproved) {
          strokeColor = '#10b981';
          fillColor = 'rgba(16, 185, 129, 0.15)';
        }

        if (isSelected) {
          strokeColor = '#fbbf24';
          strokeWidth = 3.5;
          fillColor = 'rgba(251, 191, 36, 0.35)';
        }

        if (isSourceMerge) {
          strokeColor = '#a855f7';
          strokeWidth = 3;
          fillColor = 'rgba(168, 85, 247, 0.4)';
        }

        // Center label for parcel ID
        const [cLng, cLat] = ring[0];
        const [lblX, lblY] = projectCoords(cLng + 0.00015, cLat + 0.00015, width, height);

        return (
          <g
            key={feature.id || feature.properties.parcel_id}
            className="cursor-pointer pointer-events-auto transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              if (isMergeMode && mergeSourceParcel && !isSourceMerge) {
                onFinishMerge(feature);
              } else {
                onSelectParcel(feature);
              }
            }}
          >
            <polygon
              points={points}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              className="hover:stroke-cyan-300 hover:stroke-[3] transition-all"
            />

            {/* Parcel ID Centroid Label */}
            <text
              x={lblX}
              y={lblY}
              fill={isSelected ? '#fbbf24' : isInvalid ? '#fca5a5' : '#94a3b8'}
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="600"
              textAnchor="middle"
              className="select-none pointer-events-none drop-shadow-md"
            >
              {feature.properties.parcel_id}
            </text>

            {/* Topology Alert Indicator Icon for flagged parcels */}
            {showInvalid && isInvalid && (
              <circle
                cx={lblX + 16}
                cy={lblY - 4}
                r="4.5"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="1"
                className="flag-pulse pointer-events-none"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
