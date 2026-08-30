import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Processing from './pages/Processing';
import MapViewer from './pages/MapViewer';
import { apiService } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  // Geospatial features state
  const [parcels, setParcels] = useState({ type: 'FeatureCollection', features: [] });
  const [buildings, setBuildings] = useState({ type: 'FeatureCollection', features: [] });
  const [roads, setRoads] = useState({ type: 'FeatureCollection', features: [] });

  // Processing pipeline state
  const [processingStage, setProcessingStage] = useState('COMPLETED');
  const [processingProgress, setProcessingProgress] = useState(100);
  const [processingStats, setProcessingStats] = useState(null);

  // Notification toast
  const [toast, setToast] = useState(null);

  const showNotification = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  // Initial load
  useEffect(() => {
    async function loadInitData() {
      const live = await apiService.checkBackendHealth();
      setIsLiveBackend(live);

      const projList = await apiService.getProjects();
      setProjects(projList);

      if (projList.length > 0) {
        const defaultProj = projList[0];
        setActiveProject(defaultProj);

        const feat = await apiService.getFeatures(defaultProj.id);
        setParcels(feat.parcels);
        setBuildings(feat.buildings);
        setRoads(feat.roads);
      }
    }
    loadInitData();
  }, []);

  // Run pipeline simulation for a project
  const runPipelineSimulation = (targetProject) => {
    setActiveProject(targetProject);
    setActivePage('processing');
    setProcessingProgress(5);
    setProcessingStage('UPLOADING');

    const stages = [
      { stage: 'UPLOADING', progress: 12, delay: 600 },
      { stage: 'PREPROCESSING', progress: 28, delay: 1300 },
      { stage: 'SEGMENTING', progress: 48, delay: 2100 },
      { stage: 'VECTORISING', progress: 66, delay: 2900 },
      { stage: 'RECONSTRUCTING', progress: 82, delay: 3600 },
      { stage: 'VALIDATING', progress: 94, delay: 4300 },
      { stage: 'COMPLETED', progress: 100, delay: 5000 },
    ];

    stages.forEach(({ stage, progress, delay }) => {
      setTimeout(async () => {
        setProcessingStage(stage);
        setProcessingProgress(progress);
        const statusData = await apiService.getProcessingStatus(targetProject.id, progress);
        setProcessingStats(statusData.stats);

        if (stage === 'COMPLETED') {
          const feat = await apiService.getFeatures(targetProject.id);
          setParcels(feat.parcels);
          setBuildings(feat.buildings);
          setRoads(feat.roads);
        }
      }, delay);
    });
  };

  // Handlers
  const handleSelectProject = async (project) => {
    setActiveProject(project);
    const feat = await apiService.getFeatures(project.id);
    setParcels(feat.parcels);
    setBuildings(feat.buildings);
    setRoads(feat.roads);
    setActivePage('map');
  };

  const handleUploadSubmit = async (formData) => {
    const newProj = await apiService.createProject(formData);
    setProjects((prev) => [newProj, ...prev]);
    runPipelineSimulation(newProj);
  };

  const handleUseSampleData = async () => {
    const sample = projects[0] || {
      id: "proj-001",
      name: "Urban Survey — Chennai",
      crs: "EPSG:32644 - UTM 44N"
    };
    runPipelineSimulation(sample);
  };

  const handleUpdateParcel = async (parcelId, updates) => {
    await apiService.updateParcel(parcelId, updates);
    const feat = await apiService.getFeatures(activeProject?.id);
    setParcels(feat.parcels);
  };

  const handleSplitParcel = (oldParcelId, newFeatures) => {
    const updated = apiService.splitParcelInCache(oldParcelId, newFeatures);
    setParcels(updated);
  };

  const handleMergeParcels = (pId1, pId2) => {
    const updated = apiService.mergeParcelsInCache(pId1, pId2);
    setParcels(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        activeProject={activeProject}
        isLiveBackend={isLiveBackend}
      />

      {/* Pages Container */}
      <main className="flex-1">
        {activePage === 'dashboard' && (
          <Dashboard
            projects={projects}
            onSelectProject={handleSelectProject}
            onStartNewProject={() => setActivePage('upload')}
            onProcessProject={runPipelineSimulation}
          />
        )}

        {activePage === 'upload' && (
          <Upload
            onUploadSubmit={handleUploadSubmit}
            onUseSampleData={handleUseSampleData}
          />
        )}

        {activePage === 'processing' && (
          <Processing
            currentStage={processingStage}
            progress={processingProgress}
            stats={processingStats}
            onViewInWebGIS={() => setActivePage('map')}
          />
        )}

        {activePage === 'map' && (
          <MapViewer
            project={activeProject}
            parcels={parcels}
            buildings={buildings}
            roads={roads}
            onBackToDashboard={() => setActivePage('dashboard')}
            onReprocess={() => runPipelineSimulation(activeProject)}
            onUpdateParcel={handleUpdateParcel}
            onSplitParcel={handleSplitParcel}
            onMergeParcels={handleMergeParcels}
            showNotification={showNotification}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
