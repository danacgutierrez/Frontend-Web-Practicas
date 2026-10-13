# Práctica 8: Prisma, esquema y migraciones

API del gimnasio hecha con NestJS. En esta práctica se instaló Prisma 7 sobre el código base y se mapearon sus cuatro entidades (Clase, Horario, Miembro e Inscripcion) a MySQL 8, generando una migración versionada por cada una.

## Cómo correrlo

1. Instalar dependencias:
```bash
   npm install
```
2. Crear un archivo `.env` en la raíz (no se sube al repositorio):
```env
   DATABASE_URL="mysql://root:TU_CONTRASEÑA@localhost:3306/gimnasio"
```
3. Aplicar las migraciones y generar el cliente:
```bash
   npx prisma migrate deploy
   npx prisma generate
```

## Evidencia: las cuatro tablas en el gestor

![Tablas creadas en MySQL](./capturas/tablas.png)

## Respuestas

**1. ¿Por qué el paquete del adaptador se llama adapter-mariadb si usamos MySQL?**

MySQL y MariaDB comparten el mismo protocolo de comunicación, porque MariaDB nació como un fork de MySQL. Por eso el mismo driver de Node funciona con los dos y Prisma usa un solo adaptador para ambos. El nombre se refiere al driver que utiliza, no al servidor al que me conecto.

**2. ¿Editar schema.prisma cambió algo en la base de datos antes de migrar?**

No. `schema.prisma` es solo un archivo de texto que describe cómo debe ser el modelo, no tiene conexión viva con la base. La base cambia hasta que se ejecuta `prisma migrate dev`, que compara el esquema con el historial, genera el archivo `.sql` con la diferencia y lo aplica.

**3. ¿La carpeta de migraciones es una foto del esquema o un historial?**

Es un historial. Cada carpeta guarda únicamente el cambio de ese momento (por ejemplo, `agrega_descripcion` solo contiene un `ALTER TABLE`), no el esquema completo. El esquema actual es el resultado de aplicar todas las migraciones en orden, y Prisma registra las aplicadas en la tabla `_prisma_migrations`. En este proyecto hay 5 migraciones.

**4. ¿Por qué Horario.clase sí crea columna y Clase.horarios no?**

En una relación de uno a muchos, la llave foránea vive en el lado "muchos". Una clase tiene muchos horarios, pero cada horario pertenece a una sola clase. Por eso `Horario.clase` declara `@relation(fields: [claseId], references: [id])`, que es lo que crea la columna `claseId` y la llave foránea. En cambio, `Clase.horarios` es un campo `Horario[]` que solo existe en Prisma Client para poder consultar la relación, y una lista no se puede guardar en una sola columna.

**6. ¿De dónde sale la relación de muchos a muchos entre Miembro y Horario, si nunca se declaró?**

Sale de la tabla `Inscripcion`, que funciona como tabla intermedia. Un miembro tiene muchas inscripciones, un horario tiene muchas inscripciones y cada inscripción apunta a un miembro y a un horario. Así un miembro puede inscribirse a muchos horarios y un horario puede tener muchos miembros. La restricción `@@unique([horarioId, miembroId])` evita inscribir dos veces al mismo miembro en el mismo horario, y la tabla guarda datos propios de la relación como `estado` y `creadoEn`.