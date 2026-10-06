import { ActualizarMiembroDto } from '../dto/actualizar-miembro.dto.js';
import { CrearMiembroDto } from '../dto/crear-miembro.dto.js';
import { Miembro } from './entidades.js';

export interface MiembroRepository {
  listar(): Promise<Miembro[]>;
  buscarPorId(id: number): Promise<Miembro | null>;
  crear(datos: CrearMiembroDto): Promise<Miembro>;
  actualizar(id: number, datos: ActualizarMiembroDto): Promise<Miembro | null>;
  eliminar(id: number): Promise<Miembro | null>;
}