// servicios/gimnasio.ts — las llamadas a la API, tipadas.
// Los componentes sólo ven estas funciones, nunca a Axios.
import { api, type Sobre } from './api.ts';
import type { Clase, ClaseConHorarios, Inscripcion } from '../tipos.ts';

// POST /inscripciones: el miembro sale del token, solo se manda el horario
export async function inscribirse(horarioId: number): Promise<void> {
  await api.post('/inscripciones', { horarioId });
}

// GET /inscripciones/mias
export async function traerMisInscripciones(): Promise<Inscripcion[]> {
  const respuesta = await api.get<Sobre<Inscripcion[]>>('/inscripciones/mias');
  return respuesta.data.data;
}

// GET /clases
export async function traerClases(): Promise<Clase[]> {
  const respuesta = await api.get<Sobre<Clase[]>>('/clases');
  return respuesta.data.data; // .data de Axios, y .data del sobre
}

// GET /clases/:id → la clase con sus horarios
export async function traerClase(id: number): Promise<ClaseConHorarios> {
  const respuesta = await api.get<Sobre<ClaseConHorarios>>(`/clases/${id}`);
  return respuesta.data.data;
}
