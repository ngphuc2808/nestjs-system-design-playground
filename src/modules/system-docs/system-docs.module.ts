import { Module } from '@nestjs/common';
import { SystemDocsService } from './services/system-docs.service';
import { SystemDocsController } from './controllers/system-docs.controller';

@Module({
  controllers: [SystemDocsController],
  providers: [SystemDocsService],
  exports: [SystemDocsService],
})
export class SystemDocsModule {}
