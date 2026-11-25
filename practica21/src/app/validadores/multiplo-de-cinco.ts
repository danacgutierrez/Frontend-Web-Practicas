import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const multiploDeCinco: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const valor = control.value;
  if (valor === null || valor === '') return null; 
  return Number(valor) % 5 === 0 ? null : { multiploDeCinco: { valor } };
};