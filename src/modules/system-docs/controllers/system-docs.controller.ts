import { Controller, Get, Param } from '@nestjs/common';
import { SystemDocsService } from '../services/system-docs.service';

@Controller('api/v1/system-docs')
export class SystemDocsController {
  constructor(private readonly docsService: SystemDocsService) {}

  @Get('modules')
  getAllModulesMetadata() {
    return this.docsService.getAllModulesDoc();
  }

  @Get('modules/:id')
  getModuleMetadataById(@Param('id') id: string) {
    return this.docsService.getModuleDocById(id);
  }
}
