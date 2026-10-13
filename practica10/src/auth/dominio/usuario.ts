export enum Rol {
  miembro = 'miembro',
  entrenador = 'entrenador',
  admin = 'admin',
}
 
export interface Usuario {
  id: number;
  correo: string;
  passwordHash: string;
  rol: Rol;
  miembroId: number | null; 
  creadoEn: Date;
}
 
export type NuevoUsuario = Omit<Usuario, 'id' | 'creadoEn'>;
 
// Lo que viaja DENTRO del token. NO va cifrado: cualquiera lo lee en
// jwt.io, asi que aqui no va nada secreto (ni el hash).
export interface PayloadJwt {
  sub: number;              // "subject": el id del usuario (nombre estandar, RFC 7519)
  correo: string;
  rol: Rol;
  miembroId: number | null;
}
