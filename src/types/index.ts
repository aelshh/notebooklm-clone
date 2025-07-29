export interface DocumentMetadata {
  id: string;
  filename: string;
  uploadedAt: Date;
  totalPages: number;
  processed: boolean;
}

export interface ChatMessage {
  id: string;
  type: "user" | "ai" | "error";
  content: "string";
  citations?: Citation[];
  timestamp: Date;
}
export interface Citation {
  id: string;
  pageNumber: number;
  text: string;
  relevanceScore: number;
  startIndex: number;
  endIndex: number;
}

export interface ProcessedChunk {
  text: string;
  pageNumber: number;
  startIndex: number;
  endIndex: number;
  embedding?: number[];
}
