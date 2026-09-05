import type { Parcel, ProcessingLog } from "../types";
import {
  exportParcelPdf,
  exportValidationAuditPdf,
  exportAIProcessingPdf,
  exportAnalyticsPdf
} from "../utils/pdfGenerator";

export const reportService = {
  generateParcelCertificate(parcel: Parcel) {
    exportParcelPdf(parcel);
  },

  generateValidationAuditReport(parcels: Parcel[], stats: any) {
    exportValidationAuditPdf(parcels, stats);
  },

  generateAIInferenceReport(data: {
    tileName: string;
    coords: string;
    res: string;
    status: string;
    confidence: number;
    buildingCount: number;
    roadCount: number;
    parcelCount: number;
    logs: ProcessingLog[];
  }) {
    exportAIProcessingPdf(data);
  },

  generateAnalyticsReport(stats: any, landUseBreakdown: any[]) {
    exportAnalyticsPdf(stats, landUseBreakdown);
  },
};
