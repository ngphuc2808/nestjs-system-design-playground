import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { SystemDocsService } from '../services/system-docs.service';
import { renderDocsHtml } from '../views/docs-template.html';

@Controller()
export class SystemDocsController {
  constructor(private readonly docsService: SystemDocsService) {}

  @Get('docs')
  getInteractiveDocs(@Res() res: Response) {
    const modules = this.docsService.getAllModulesDoc();
    const html = renderDocsHtml(modules);
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  @Get('api/v1/system-docs/modules')
  getAllModulesMetadata() {
    return this.docsService.getAllModulesDoc();
  }

  @Get('api/v1/system-docs/modules/:id')
  getModuleMetadataById(@Param('id') id: string) {
    return this.docsService.getModuleDocById(id);
  }
}
