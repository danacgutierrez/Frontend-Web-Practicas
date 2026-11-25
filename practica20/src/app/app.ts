import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Catalogo } from './servicios/catalogo';
import { TarjetaClase } from './componentes/tarjeta-clase/tarjeta-clase';
import { FiltroCategoria } from './componentes/filtro-categoria/filtro-categoria';

@Component({
  selector: 'app-root',
  imports: [TarjetaClase, FiltroCategoria, TitleCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly catalogo = inject(Catalogo);
}