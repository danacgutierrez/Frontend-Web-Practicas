import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from '../decoradores/roles.decorator';
import { PayloadJwt, Rol } from '../dominio/usuario';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    // Los roles permitidos que dejó @Roles() en el método (o en la clase)
    const permitidos = this.reflector.getAllAndOverride<Rol[]>(ROLES, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);
    // Si la ruta no pide ningún rol, deja pasar
    if (!permitidos) return true;

    // req.user lo dejó el JwtAuthGuard (la JwtStrategy.validate)
    const { user } = contexto.switchToHttp().getRequest<{ user: PayloadJwt }>();

    // false hace que Nest responda 403 solo
    return permitidos.includes(user.rol);
  }
}