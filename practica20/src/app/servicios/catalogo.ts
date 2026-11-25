import { Injectable, computed, signal } from '@angular/core';
import { CLASES_LOCALES } from '../datos/clases-locales';
import type { Categoria, Clase } from '../modelos/clase';

@Injectable({ providedIn: 'root' })
export class Catalogo {
  readonly clases = signal<Clase[]>(CLASES_LOCALES);
  readonly categoria = signal<Categoria | 'todas'>('todas');
  readonly seleccionada = signal<Clase | null>(null);

  readonly visibles = computed(() => {
    const cat = this.categoria();
    return cat === 'todas'
      ? this.clases()
      : this.clases().filter((c) => c.categoria === cat);
  });

  readonly minutosTotales = computed(() =>
    this.visibles().reduce((suma, c) => suma + c.duracionMin, 0),
  );

  readonly clasesLargas = computed(
    () => this.visibles().filter((c) => c.duracionMin >= 60).length,
  );

  elegirCategoria(cat: Categoria | 'todas'): void {
    this.categoria.set(cat);
    // soltar la clase elegida si el filtro ya no la muestra
    const sel = this.seleccionada();
    if (sel && !this.visibles().some((c) => c.id === sel.id)) {
      this.seleccionada.set(null);
    }
  }

  seleccionar(clase: Clase): void {
    this.seleccionada.set(clase);
  }

  vaciar(): void {
    this.clases.set([]);
    this.seleccionada.set(null);
  }

  restaurar(): void {
    this.clases.set(CLASES_LOCALES);
  }
}