import { CrearClaseDto } from "../dto/crear-clase.dto.js";
import { ActualizarClaseDto } from "../dto/editar-clase.dto.js";
import { Clase } from "./entidades.js";

export interface ClaseRepository {
    listar(): Promise<Clase[]>;
    buscarPorId(id: number): Promise<Clase | null>;
    crear(datos: CrearClaseDto): Promise<Clase>;
    actualizar(id: number, datos: ActualizarClaseDto): Promise<Clase | null>;
    eliminar(id: number): Promise<Clase | null>
}