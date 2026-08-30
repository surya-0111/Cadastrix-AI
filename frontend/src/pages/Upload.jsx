import React from 'react';
import UploadBox from '../components/UploadBox';

export default function Upload({ onUploadSubmit, onUseSampleData }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <UploadBox
        onUploadSubmit={onUploadSubmit}
        onUseSampleData={onUseSampleData}
      />
    </div>
  );
}
