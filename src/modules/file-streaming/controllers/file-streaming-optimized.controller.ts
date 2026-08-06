import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { FileStreamingOptimizedService } from '../services/file-streaming-optimized.service';
import { UploadFileDto } from '../dto/upload-file.dto';
import { GenerateCsvDto } from '../dto/generate-csv.dto';

@Controller('api/v1/file-streaming')
export class FileStreamingOptimizedController {
  constructor(private readonly optimizedService: FileStreamingOptimizedService) {}

  @Post('optimized/stream-upload')
  processFileOptimized(@Body() dto: UploadFileDto) {
    return this.optimizedService.processFileOptimized(dto);
  }

  @Post('generate-sample-csv')
  generateSampleCsv(@Body() dto: GenerateCsvDto) {
    return this.optimizedService.generateSampleCsv(dto);
  }

  @Get('optimized/export-csv')
  exportCsvStream(@Res() res: Response) {
    return this.optimizedService.exportCsvStream(res);
  }
}
