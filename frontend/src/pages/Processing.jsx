import React from 'react';
import ProcessingStatus from '../components/ProcessingStatus';

export default function Processing({ 
  currentStage, 
  progress, 
  stats, 
  onViewInWebGIS 
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <ProcessingStatus
        currentStage={currentStage}
        progress={progress}
        stats={stats}
        onViewInWebGIS={onViewInWebGIS}
      />
    </div>
  );
}
