import {
  saveFileToIndexedDB,
  getFileFromIndexedDB,
  getAllFilesFromIndexedDB,
  deleteFileFromIndexedDB,
  type StoredFileRecord
} from "../utils/indexedDB";

export const fileService = {
  async uploadFile(file: File, userEmail: string): Promise<StoredFileRecord> {
    const record: StoredFileRecord = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: file.name,
      size: file.size,
      type: file.type || file.name.split(".").pop()?.toUpperCase() || "GIS-FILE",
      uploadedAt: new Date().toISOString(),
      uploadedBy: userEmail,
      blob: file,
      status: "ready",
    };

    await saveFileToIndexedDB(record);
    return record;
  },

  async getAllFiles(): Promise<StoredFileRecord[]> {
    return getAllFilesFromIndexedDB();
  },

  async deleteFile(id: string): Promise<void> {
    await deleteFileFromIndexedDB(id);
  },

  async downloadFile(id: string): Promise<void> {
    const file = await getFileFromIndexedDB(id);
    if (!file) throw new Error("File not found");

    const url = URL.createObjectURL(file.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
