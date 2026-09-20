export interface CapturedImage {
  uri: string;
  width?: number;
  height?: number;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
}

export type ScanStep = 'selection' | 'preview' | 'preparing';
