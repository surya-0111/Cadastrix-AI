import { PROCESSING_LOGS, IMAGE_TILES } from "../data/mockData";
import type { ProcessingLog } from "../types";

export interface ProcessingState {
  status: "idle" | "running" | "paused" | "completed" | "failed";
  progress: number;
  selectedTileIndex: number;
  logs: ProcessingLog[];
  confidence: number;
  buildingCount: number;
  roadCount: number;
  parcelCount: number;
}

export const processingService = {
  getInitialState(): ProcessingState {
    return {
      status: "running",
      progress: 73,
      selectedTileIndex: 2,
      logs: PROCESSING_LOGS.slice(0, 10),
      confidence: 87.4,
      buildingCount: 1847,
      roadCount: 74,
      parcelCount: 312,
    };
  },

  getNextLogs(currentCount: number): ProcessingLog | null {
    const remaining = PROCESSING_LOGS.slice(currentCount);
    return remaining.length > 0 ? remaining[0] : null;
  },
};
