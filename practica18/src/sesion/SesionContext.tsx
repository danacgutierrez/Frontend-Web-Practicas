
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as servicio from '../servicios/sesion.ts';
import type { Sesion, Usuario } from '../tipos.ts';
import { useInscripciones } from '../store/useInscripciones.ts';

interface ValorSesion {
  usuario: Usuario | null;
  entrar: (correo: string, password: string) => Promise<void>;
  registrar: (nombre: string, correo: string, password: string) => Promise<void>;
  salir: () => void;
}

const SesionContext = createContext<ValorSesion | null>(null);

function leerUsuario(): Usuario | null {
  const guardado = localStorage.getItem('usuario');
  return guardado ? (JSON.parse(guardado) as Usuario) : null;
}

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(leerUsuario);
  // Con sesión (al entrar, al registrarse o al recargar) se llena el store
  useEffect(() => {
    if (usuario) void useInscripciones.getState().cargar();
  }, [usuario]);

  function guardar(sesion: Sesion) {
    localStorage.setItem('token', sesion.token);
    localStorage.setItem('usuario', JSON.stringify(sesion.usuario));
    setUsuario(sesion.usuario);
  }

  async function entrar(correo: string, password: string) {
    guardar(await servicio.entrar(correo, password));
  }

  async function registrar(nombre: string, correo: string, password: string) {
    guardar(await servicio.registrar(nombre, correo, password));
  }

  function salir() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    useInscripciones.getState().vaciar();
    setUsuario(null);
  }

  return (
    <SesionContext value={{ usuario, entrar, registrar, salir }}>
      {children}
    </SesionContext>
  );
}

export function useSesion() {
  const valor = useContext(SesionContext);
  if (!valor) throw new Error('useSesion() tiene que usarse dentro de <ProveedorSesion>');
  return valor;
}