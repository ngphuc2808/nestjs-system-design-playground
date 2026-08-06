export interface StreamPerformance {
  executionTimeMs: number;
  peakMemoryMb: number;
  strategy: 'FULL_FILE_MEMORY_BUFFER' | 'LINE_BY_LINE_STREAM_BACKPRESSURE';
  description: string;
}

export interface FileProcessingResult {
  filename: string;
  totalRowsProcessed: number;
  chunkSize: number;
  peakMemoryMb: number;
  performance: StreamPerformance;
}

export interface CsvGenerationResult {
  filepath: string;
  filename: string;
  totalRowsGenerated: number;
  fileSizeBytes: number;
}
