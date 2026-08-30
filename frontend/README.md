# Cadastrix AI: AI-Based Urban Parcel & Cadastral Feature Extraction — WebGIS Frontend

This repository houses the complete **Frontend / WebGIS Client (Member 5)** for **Cadastrix AI: AI-Based Urban Parcel & Cadastral Feature Extraction from Drone Imagery**, engineered according to the official Project Manager Implementation Blueprint.

---

## 🎯 Key Capabilities & Screen Alignments

| Blueprint Screen | Module / Component | Capability |
|---|---|---|
| **Projects Dashboard** | `pages/Dashboard.jsx`, `components/ProjectCard.jsx` | Survey project dashboard, urban survey cards (Chennai, Test Areas), topology health indicators (valid, repaired, review), KPI metrics bar. |
| **Drone Upload** | `pages/Upload.jsx`, `components/UploadBox.jsx` | Drone GeoTIFF / Orthomosaic upload zone, drag-and-drop support, CRS configuration (`EPSG:32644 - UTM 44N`), and instant 1-click **"Load Sample Chennai Orthomosaic"** demo dataset. |
| **Processing Pipeline** | `pages/Processing.jsx`, `components/ProcessingStatus.jsx` | 7-stage live autonomous pipeline visualization (`UPLOADING` → `PREPROCESSING` → `SEGMENTING` → `VECTORISING` → `RECONSTRUCTING` → `VALIDATING` → `COMPLETED`), animated progress bar, real-time tile/building counters, and system console logs. |
| **WebGIS Map Viewer** | `pages/MapViewer.jsx`, `map/MapView.jsx`, `components/LayerControl.jsx` | Full WebGIS interactive viewer with satellite basemap, drone orthomosaic overlay with opacity slider, AI building footprints, road network vectors, and topology issue indicators. |
| **Inspector** | `components/ParcelPanel.jsx` | Click-to-inspect parcel details matching blueprint benchmark: Parcel ID (`P017`), Area (`1432 m²`), Building (`351 m²`), Confidence (`93%`), and Geometry (`VALID`). Also flags defects (`P024` with boundary uncertainty). |
| **Phase 8** | `map/EditTools.jsx`, `components/ParcelPanel.jsx` | Human verification & field editing: **Move Vertices** (interactive drag handles), **Split Parcel** (subdivide into -A and -B), **Merge Parcels**, and **Approve Parcel** (surveyor stamp). |
| **Export** | `components/ExportButton.jsx`, `utils/export.js` | Cadastral **GeoJSON Export** (RFC 7946), Cadastral Survey Report (**CSV**), and OGC **GeoPackage** package metadata. |

---

## 📁 Repository Structure

Directly implementing the structure defined on Page 25 of the PM Blueprint:

```
WebGIS/
├── package.json               # Vite + React + MapLibre + Tailwind dependencies
├── vite.config.js             # Vite development server configuration
├── index.html                 # Main SPA template with MapLibre GL CSS
├── tailwind.config.js         # Cadastral color palette & typography
├── postcss.config.js          # PostCSS autogeneration
├── standalone.html            # Zero-dependency browser-ready bundle for instant judging
├── run_server.py              # 1-click Python webserver launcher
├── README.md                  # Comprehensive documentation
│
└── src/
    ├── main.jsx               # React DOM entry point
    ├── App.jsx                # Application state, router, and notification system
    ├── index.css              # Custom styling, scrollbars, and pulse animations
    │
    ├── pages/
    │   ├── Dashboard.jsx      # Projects Overview and cards
    │   ├── Upload.jsx         # Drone Upload: Drone GeoTIFF upload
    │   ├── Processing.jsx     # Pipeline Progress & checkpoints
    │   └── MapViewer.jsx      # Interactive WebGIS & Verification: WebGIS and surveyor editor
    │
    ├── components/
    │   ├── Navbar.jsx           # Cadastrix Header, project tag, status badge
    │   ├── ProjectCard.jsx      # Detailed project cards with topology health bars
    │   ├── UploadBox.jsx        # Drag-and-drop GeoTIFF ingestion & metadata
    │   ├── ProcessingStatus.jsx # 7-stage checklist, progress meter, console logs
    │   ├── LayerControl.jsx     # Drone, parcels, buildings, roads, topology toggles
    │   ├── ParcelPanel.jsx      # Parcel inspector & human verification actions
    │   └── ExportButton.jsx     # GeoJSON, CSV, and GeoPackage export triggers
    │
    ├── map/
    │   ├── MapView.jsx          # Interactive GIS viewport with pan/zoom/bearing
    │   ├── MapLayers.jsx        # SVG & raster layer orchestrator
    │   ├── ParcelLayer.jsx      # Cadastral polygons with confidence/validity colors
    │   ├── BuildingLayer.jsx    # AI-extracted building footprints
    │   ├── RoadLayer.jsx        # Road network corridors & centerlines
    │   └── EditTools.jsx        # Draggable boundary vertices (Phase 8)
    │
    ├── services/
    │   ├── api.js               # REST API client matching Phase 6 backend endpoints
    │   └── mockData.js          # Chennai T. Nagar benchmark survey dataset
    │
    └── utils/
        ├── geojson.js           # Spherical area calculations (m²), distance, bounding box
        └── export.js            # GeoJSON and CSV download generators
```

---

## 🚀 How to Run

### Option 1: Instant Launch (Zero Setup Required)

Run the included Python launcher to start a local server and immediately open the WebGIS in your default browser:

```powershell
python run_server.py
```
Or simply double-click or open `standalone.html` directly in Chrome, Edge, or Firefox!

### Option 2: Full Node.js / Vite Development Server

If Node.js is installed on your workstation:

```powershell
cd C:\Users\sivak\.gemini\antigravity\scratch\WebGIS
npm install
npm run dev
```

The Vite dev server will launch at `http://localhost:3000`.

---

## 🔗 Backend API Integration (Phase 6)

The frontend client in `src/services/api.js` is pre-wired to connect to the FastAPI backend at `http://localhost:8000/api`:

- `POST /api/projects` — Create project
- `POST /api/projects/{id}/imagery` — Upload drone GeoTIFF
- `POST /api/projects/{id}/process` — Start AI & GIS pipeline
- `GET /api/projects/{id}/status` — Poll pipeline progress (7 stages)
- `GET /api/projects/{id}/features` — Fetch parcels, buildings, roads
- `GET /api/projects/{id}/parcels` — Fetch GeoJSON cadastral boundaries
- `GET /api/projects/{id}/statistics` — Fetch summary metrics & topology counts
- `GET /api/projects/{id}/export/geojson` — Export official GeoJSON
- `PATCH /api/parcels/{id}` — Apply surveyor vertex edits / verification approvals

*Note: If the FastAPI backend is not running, the application seamlessly operates in stateful Evaluation Demo Mode with complete local persistence and simulated pipeline execution.*
