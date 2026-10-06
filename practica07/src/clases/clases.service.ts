import { Inject, Injectable } from '@nestjs/common';
import type { ClaseRepository } from './dominio/clase.repository.js';
import { CLASE_REPOSITORY } from './clases.token.js';
import { Clase } from './dominio/entidades.js';
import { CrearClaseDto } from './dto/crear-clase.dto.js';
import { ActualizarClaseDto } from './dto/editar-clase.dto.js';

@Injectable()
export class ClasesService {
  constructor(
    @Inject(CLASE_REPOSITORY)
    private readonly repo: ClaseRepository
  ){}

  listar(): Promise<Clase[]>{
    return this.repo.listar();
  }

  buscar(id: number): Promise<Clase | null>{
    return this.repo.buscarPorId(id);
  }

  crear(dto: CrearClaseDto): Promise<Clase>{
    return this.repo.crear(dto);
  }

  actualizar(id: number, dto: ActualizarClaseDto): Promise<Clase | null>{
    return this.repo.actualizar(id, dto);
  }

  eliminar(id: number): Promise<Clase | null>{
    return this.repo.eliminar(id);
  }
}
