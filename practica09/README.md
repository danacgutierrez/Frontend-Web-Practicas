# Práctica 9: Blindar la API

API del gimnasio hecha con NestJS. En esta práctica se conectó Prisma (MySQL) a la aplicación, reemplazando los cuatro repositorios en memoria, y se blindó la API con las piezas del ciclo de vida de una petición: validación en la frontera, traducción centralizada de errores y CORS.

## Cómo correrlo

1. Instalar dependencias:
```bash
   npm install
```
2. Crear un archivo `.env` en la raíz (no se sube al repositorio):
```env
   DATABASE_URL="mysql://root:TU_CONTRASEÑA@localhost:3306/gimnasio"
```
3. Aplicar las migraciones y levantar la API:
```bash
   npx prisma migrate deploy
   npx prisma generate
   npm run start:dev
```

## Evidencias

### 400: validación

Petición con un cuerpo inválido, rechazada por el `ValidationPipe` antes de llegar al controlador.

![400 de validación](./capturas/400-validacion.png)

### 409: conflicto traducido por el filtro

Inscripción con el cupo lleno. El filtro responde siempre con la misma estructura (`statusCode`, `error`, `message`, `path` y `timestamp`).

![409 traducido por el filtro](./capturas/409-filtro.png)

### Encabezados de CORS con dos orígenes

La misma petición con un origen permitido y con uno no permitido.

![Encabezados de CORS permitido](./capturas/cors_permitido.png)
![Encabezados de CORS no permitido](./capturas/cors_nopermitido.png)


## Respuestas

**1. ¿Qué línea del Service o del Controller tuvo que cambiar para que Clases hablara con MySQL?**

Ninguna. Lo único que cambió fue el `useClass` en `clases.module.ts`, que pasó de `ClaseMemoriaRepository` a `ClasePrismaRepository`. El Service depende de la interfaz `ClaseRepository`, que recibe por inyección con el token `CLASE_REPOSITORY`, así que no sabe si detrás hay un arreglo o una base de datos.

**2. ¿Por qué `InscripcionesService` no tuvo que cambiar ni una línea de las reglas de cupo y duplicados?**

Porque las reglas viven en el Service y este solo usa los métodos del contrato `InscripcionRepository` (`buscarPorHorario`, `buscarHorario`, `buscarMiembro` y `guardar`). El repositorio de Prisma implementa esos mismos métodos con las mismas firmas y devuelve los mismos datos, solo que ahora los lee de MySQL. Las reglas no saben de dónde vienen los datos, así que siguen funcionando igual.

**3. ¿Por qué una interfaz no puede validar nada en tiempo de ejecución?**

Porque TypeScript borra las interfaces al compilar a JavaScript: son solo información para el compilador y no existen cuando la aplicación corre.

**4. Al enviar un cuerpo inválido, ¿qué código de estado responde y qué trae en el cuerpo?**

Responde **400 Bad Request**. El cuerpo trae `statusCode: 400`, `error: "Bad Request"` y un arreglo `message` con una descripción por cada regla que se incumplió. Con un campo que no existe en el DTO, el mensaje indica que esa propiedad no debe existir, porque `forbidNonWhitelisted` rechaza el cuerpo en lugar de ignorar el campo en silencio.

**5. ¿Cuántas líneas quedó más corto el controlador?**

Se quitó el bloque `try/catch` que traducía los errores, porque ahora lo hace el filtro una sola vez para toda la aplicación.
Por lo que quedo mas corto.

**6. Si la respuesta llega en los dos casos, ¿quién bloquea realmente y a quién protege?**

Quien bloquea es el navegador, no el servidor. El servidor responde igual en ambos casos; la diferencia es que, con un origen no permitido, la respuesta no trae el encabezado `Access-Control-Allow-Origin`, y por eso el navegador no deja que el JavaScript de esa página lea la respuesta. Protege al usuario, para que una página maliciosa no pueda leer datos de la API usando su navegador. No protege a la API: un cliente que no es navegador (curl, Postman, REST Client) nunca pasa por CORS.