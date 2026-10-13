import { SetMetadata } from '@nestjs/common';
import { Rol } from '../dominio/usuario';

export const ROLES = 'roles'; // la llave del dato

// Uso: @Roles(Rol.entrenador, Rol.admin)
export const Roles = (...roles: Rol[]) => SetMetadata(ROLES, roles);