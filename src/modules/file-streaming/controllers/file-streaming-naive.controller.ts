import { Body, Controller, Post } from '@nestjs/common';
import { FileStreamingNaiveService } from '../services/file-streaming-naive.service';
import { UploadFileDto } from '../dto/upload-file.dto';

@Controller('api/v1/file-streaming/naive')
export class FileStreamingNaiveController {
  constructor(private readonly naiveService: FileStreamingNaiveService) {}

  @Post('upload')
  processFileNaive(@Body() dto: UploadFileDto) {
    return this.naiveService.processFileNaive(dto);
  }
}
