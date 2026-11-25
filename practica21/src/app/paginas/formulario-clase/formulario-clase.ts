import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CATEGORIAS, type Categoria, type ClaseNueva } from '../../modelos/clase';
import { multiploDeCinco } from '../../validadores/multiplo-de-cinco';

@Component({
  selector: 'app-formulario-clase',
  imports: [ReactiveFormsModule, JsonPipe, RouterLink],
  templateUrl: './formulario-clase.html',
  styleUrl: './formulario-clase.css',
})
export class FormularioClase {
  private readonly fb = inject(FormBuilder);
  protected readonly categorias = CATEGORIAS;

  protected readonly formulario = this.fb.group({
    nombre: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
    categoria: this.fb.nonNullable.control<Categoria | ''>('', [Validators.required]),
    descripcion: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
    duracionMin: this.fb.control<number | null>(null, [
      Validators.required, Validators.min(15), Validators.max(180), multiploDeCinco,
    ]),
    imagen: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^\/img\/.+/)]),
  });

  protected readonly aMandar = signal<ClaseNueva | null>(null);

  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.aMandar.set(null);
      return;
    }
    const v = this.formulario.getRawValue();
    this.aMandar.set({
      nombre: v.nombre.trim(),
      categoria: v.categoria as Categoria,
      descripcion: v.descripcion.trim(),
      duracionMin: Number(v.duracionMin),
      imagen: v.imagen,
    });
  }
}