import { Routes } from '@angular/router';
import { ListaClases } from './paginas/lista-clases/lista-clases';
import { FormularioClase } from './paginas/formulario-clase/formulario-clase';
import { Horarios } from './paginas/horarios/horarios';
import { Miembros } from './paginas/miembros/miembros';

export const routes: Routes = [
  { path: '', redirectTo: 'clases', pathMatch: 'full' },
  { path: 'clases', component: ListaClases },
  { path: 'clases/nueva', component: FormularioClase },
  { path: 'horarios', component: Horarios },
  { path: 'miembros', component: Miembros },
  { path: '**', redirectTo: 'clases' },
];