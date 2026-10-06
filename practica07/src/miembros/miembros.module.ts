import { Module } from '@nestjs/common';
import { MiembrosService } from './miembros.service.js';
import { MiembrosController } from './miembros.controller.js';
import { MIEMBRO_REPOSITORY } from './miembros.token.js';
import { MiembroMemoriaRepository } from './infra/miembro-memoria-repository.js';

@Module({
  controllers: [MiembrosController],
  providers: [
    MiembrosService,
    {
      provide: MIEMBRO_REPOSITORY, useClass: MiembroMemoriaRepository
    }
  ],
})
export class MiembrosModule {}