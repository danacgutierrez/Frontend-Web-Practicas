import { httpResource } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { API_URL } from '../config';
import type { Categoria, Clase, Sobre } from '../modelos/clase';
import { mensajeDeApi } from './errores';

@Injectable({ providedIn: 'root' })
export class Catalogo {
  private readonly respuesta = httpResource<Clase[]>(() => `${API_URL}/clases`, {
    parse: (raw) => (raw as Sobre<Clase[]>).data,
  });

  readonly clases = computed(() => (this.respuesta.hasValue() ? this.respuesta.value() : []));
  readonly cargando = computed(() => this.respuesta.isLoading());
  readonly error = computed(() => {
    const e = this.respuesta.error();
    return e ? mensajeDeApi(e) : null;
  });

  readonly categoria = signal<Categoria | 'todas'>('todas');
  readonly seleccionada = signal<Clase | null>(null);

  readonly visibles = computed(() => {
    const cat = this.categoria();
    return cat === 'todas' ? this.clases() : this.clases().filter((c) => c.categoria === cat);
  });
  readonly minutosTotales = computed(() =>
    this.visibles().reduce((suma, c) => suma + c.duracionMin, 0),
  );
  readonly clasesLargas = computed(
    () => this.visibles().filter((c) => c.duracionMin >= 60).length,
  );

  elegirCategoria(cat: Categoria | 'todas'): void {
    this.categoria.set(cat);
    const sel = this.seleccionada();
    if (sel && !this.visibles().some((c) => c.id === sel.id)) this.seleccionada.set(null);
  }
  seleccionar(clase: Clase): void { this.seleccionada.set(clase); }
  recargar(): void { this.respuesta.reload(); }
}