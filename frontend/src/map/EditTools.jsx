import React, { useState } from 'react';
import { calculatePolygonArea } from '../utils/geojson';

export default function EditTools({ viewport, selectedParcel, onUpdateParcelGeometry }) {
  const ring = selectedParcel?.geometry?.coordinates?.[0] || [];
  const [activeVertexIndex, setActiveVertexIndex] = useState(null);

  const width = window.innerWidth || 1200;
  const height = window.innerHeight || 800;

  // Project [lng, lat] to pixel [x, y]
  const projectCoords = (lng, lat) => {
    const scale = Math.pow(2, viewport.zoom) * 140;
    const x = (lng - viewport.centerLng) * scale + width / 2;
    const y = -(lat - viewport.centerLat) * scale + height / 2;
    return [x, y];
  };

  // Inverse project [x, y] back to [lng, lat]
  const inverseCoords = (x, y) => {
    const scale = Math.pow(2, viewport.zoom) * 140;
    const lng = (x - width / 2) / scale + viewport.centerLng;
    const lat = -(y - height / 2) / scale + viewport.centerLat;
    return [lng, lat];
  };

  const handleVertexMouseDown = (index, e) => {
    e.stopPropagation();
    setActiveVertexIndex(index);

    const onMouseMove = (moveEvent) => {
      const rect = moveEvent.currentTarget?.getBoundingClientRect?.() || { left: 0, top: 0 };
      const clientX = moveEvent.clientX;
      const clientY = moveEvent.clientY;

      const [newLng, newLat] = inverseCoords(clientX, clientY);

      // Clone coordinates ring and update the vertex
      const newRing = [...ring];
      newRing[index] = [newLng, newLat];
      if (index === 0) newRing[newRing.length - 1] = [newLng, newLat]; // close ring

      const updatedGeometry = {
        type: 'Polygon',
        coordinates: [newRing]
      };

      const newArea = calculatePolygonArea([newRing]);

      onUpdateParcelGeometry(selectedParcel.properties.parcel_id, {
        geometry: updatedGeometry,
        properties: {
          area_m2: newArea,
          geometry_valid: true,
          survey_status: 'MANUALLY_EDITED',
          issue: null
        }
      });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      setActiveVertexIndex(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <svg className="w-full h-full">
        {ring.map(([lng, lat], idx) => {
          if (idx === ring.length - 1) return null; // skip duplicate closure vertex
          const [vx, vy] = projectCoords(lng, lat);
          const isDragging = activeVertexIndex === idx;

          return (
            <g key={idx} className="cursor-move pointer-events-auto">
              <circle
                cx={vx}
                cy={vy}
                r={isDragging ? 9 : 6}
                fill={isDragging ? '#fbbf24' : '#3b82f6'}
                stroke="#ffffff"
                strokeWidth="2.5"
                className="transition-all hover:scale-125 shadow-lg drop-shadow"
                onMouseDown={(e) => handleVertexMouseDown(idx, e)}
              />
              <text
                x={vx + 10}
                y={vy + 4}
                fill="#ffffff"
                fontSize="9"
                fontFamily="JetBrains Mono"
                className="select-none pointer-events-none drop-shadow"
              >
                V{idx + 1}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600/90 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xl border border-blue-400/30 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
        <span>Vertex Editing Active: Click and drag any boundary handle (V1-V4) to adjust</span>
      </div>
    </div>
  );
}
