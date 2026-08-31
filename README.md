Practica 01 - TypeScript

Paso 2

1.- Hubo algun error, alguna advertencia o algo en la consola que avisara?

No. node multas.js ejecuto sin ningun error ni advertencia. El resultado fue 35050 en vez de 400, porque multa llego como texto y el + concateno en lugar de sumar. JavaScript no revisa tipos, asi que este error no lo ve.

Paso 3

1.- Si el archivo tiene un error de tipos, por que node lo ejecuta? Cual comando revisa y cual ejecuta?

npx tsc --noEmit revisa los tipos, pero no ejecuta nada. node ejecuta el .js ya compilado, y JavaScript no tiene tipos: la revision de TypeScript desaparece al compilar. Por eso node corre el archivo sin darse cuenta del error.

Paso 4

1.- De las dos lineas que usan const, por que solo una falla?

const protege la variable, no el contenido. Cambiar una propiedad del objeto (prestamo.multa = 400) no reasigna la variable, asi que funciona. Reasignar el objeto completo (prestamo = {...}) si intenta cambiar a que apunta la variable, y eso const lo prohibe.

2.- Al asignarle un texto a la variable con let, nadie escribio que fuera un numero. De donde salio ese tipo?

De la inferencia de tipos: TypeScript ve el valor inicial (5) y deduce automaticamente que la variable es de tipo number, sin necesidad de escribirlo.

Paso 6

Error 1: Type 'string' is not assignable to type 'number'. ts(2322)
Esperaba: number (tipo de ejemplar)
Recibio: string
Linea: multa: '500'

Error 2: Argument of type 'string' is not assignable to parameter of type 'Prestamo'. ts(2345)
Esperaba: Prestamo (objeto completo)
Recibio: string
Linea: console.log(calcularMulta('F001'))

Error 3: Property 'folioo' does not exist on type 'Prestamo'. Did you mean 'folio'? ts(2551)
Esperaba: propiedad existente (folio)
Recibio: folioo (no existe)
Linea: console.log(prestamo.folioo)