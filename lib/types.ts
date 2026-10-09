export type ToolCategory =
  | 'all'
  | 'organize'
  | 'optimize'
  | 'convert'
  | 'edit'
  | 'security'
  | 'other';

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  shortDescription: string;
  description: string;
  iconName: string;
  badgeBg: string;
  badgeColor: string;
  accentColor: string;
  acceptedFormats: string[]; // e.g. ['.pdf'], ['.jpg', '.png'], ['.docx'], ['.xlsx'], ['.pptx']
  maxFiles: number;
  featured?: boolean;
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  pageCount?: number;
  previewUrl?: string;
  arrayBuffer?: ArrayBuffer;
  status: 'pending' | 'loading' | 'ready' | 'error';
  errorMessage?: string;
}

export interface ProcessResult {
  success: boolean;
  downloadUrl?: string;
  downloadFilename?: string;
  mimeType?: string;
  sizeBytes?: number;
  originalSizeBytes?: number;
  pageCount?: number;
  message?: string;
  extraData?: any;
}

export interface PDFPageInfo {
  pageNumber: number;
  thumbnailUrl: string;
  rotation: number;
  selected?: boolean;
  width?: number;
  height?: number;
}
