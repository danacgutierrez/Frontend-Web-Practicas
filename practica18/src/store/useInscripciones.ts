import { create } from 'zustand';
import { traerMisInscripciones } from '../servicios/gimnasio.ts';
import { mensajeDeError } from '../servicios/api.ts';
import type { Inscripcion } from '../tipos.ts';

interface EstadoInscripciones {
  inscripciones: Inscripcion[];
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  vaciar: () => void;
}

export const useInscripciones = create<EstadoInscripciones>((set) => ({
  inscripciones: [],
  cargando: false,
  error: null,

  cargar: async () => {
    set({ cargando: true, error: null });
    try {
      set({ inscripciones: await traerMisInscripciones() });
    } catch (e) {
      set({ error: mensajeDeError(e, 'No se pudieron traer tus inscripciones.') });
    } finally {
      set({ cargando: false });
    }
  },

  vaciar: () => set({ inscripciones: [], cargando: false, error: null }),
}));