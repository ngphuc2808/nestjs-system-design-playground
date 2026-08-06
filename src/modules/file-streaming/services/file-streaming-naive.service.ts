import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { UploadFileDto } from '../dto/upload-file.dto';
import { FileProcessingResult } from '../interfaces/file-streaming.interface';

@Injectable()
export class FileStreamingNaiveService {
  async processFileNaive(dto: UploadFileDto): Promise<FileProcessingResult> {
    const startMs = performance.now();
    const targetFile = dto.filepath || path.join(process.cwd(), 'sample_large_dataset.csv');

    if (!fs.existsSync(targetFile)) {
      // Auto-generate if missing
      this.generateMockCsvSync(targetFile, 10000);
    }

    const startMemory = process.memoryUsage().heapUsed;

    // NAIVE APPROACH: Read entire multi-megabyte file into V8 RAM Buffer at once!
    const fileContent = fs.readFileSync(targetFile, 'utf-8');
    const lines = fileContent.split('\n');

    let totalRowsProcessed = 0;
    for (const line of lines) {
      if (line.trim()) {
        totalRowsProcessed++;
      }
    }

    const peakMemoryMb = Number(((process.memoryUsage().heapUsed - startMemory) / (1024 * 1024)).toFixed(2));
    const executionTimeMs = Number((performance.now() - startMs).toFixed(3));

    return {
      filename: path.basename(targetFile),
      totalRowsProcessed,
      chunkSize: lines.length,
      peakMemoryMb: Math.max(0.5, peakMemoryMb),
      performance: {
        executionTimeMs,
        peakMemoryMb: Math.max(0.5, peakMemoryMb),
        strategy: 'FULL_FILE_MEMORY_BUFFER',
        description: 'Read entire file content into RAM via readFileSync(); memory consumption scales linearly with file size (OOM crash risk)',
      },
    };
  }

  private generateMockCsvSync(filepath: string, count: number) {
    let content = 'id,name,email,amount,created_at\n';
    for (let i = 1; i <= count; i++) {
      content += `${i},User_${i},user_${i}@example.com,${(Math.random() * 500).toFixed(2)},2026-08-06T00:00:00Z\n`;
    }
    fs.writeFileSync(filepath, content);
  }
}
