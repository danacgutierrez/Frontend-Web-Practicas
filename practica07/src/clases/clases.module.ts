import { Module } from '@nestjs/common';
import { ClasesController } from './clases.controller.js';
import { ClasesService } from './clases.service.js';
import { ClaseMemoriaRepository } from './infra/clase-memoria.repository.js';
import { CLASE_REPOSITORY } from './clases.token.js';

@Module({
  controllers: [ClasesController],
  providers: [ClasesService, {
    provide: CLASE_REPOSITORY,
    useClass: ClaseMemoriaRepository
  }]
})
export class ClasesModule {}
