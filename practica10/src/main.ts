// Primera linea: carga el .env en process.env. `prisma.config.ts`
// hace lo mismo pero solo para el CLI de Prisma (migrate, studio);
// la app corriendo con `npm run start:dev` lo necesita por su
// cuenta, o PrismaService no encuentra DATABASE_URL.
import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DominioExceptionFilter } from './comun/filtros/dominio.filter';
import { LoggingInterceptor } from './comun/interceptores/logging.interceptor';
import { SobreInterceptor } from './comun/interceptores/sobre.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Solo estos dos origenes de desarrollo pueden llamar a la API
  // desde un navegador. Un cliente sin navegador (curl, Postman, el
  // propio peticiones.http) nunca pasa por CORS: esa proteccion la
  // aplica el navegador, no el servidor.
  app.enableCors({
    origin: ['http://localhost:5173'],
    exposedHeaders: ['Location', 'X-Request-Id'],
  });

  // whitelist: quita del body cualquier campo que no este en el DTO.
  // forbidNonWhitelisted: si mandan un campo de mas, 400 en vez de
  // ignorarlo en silencio.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new DominioExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new SobreInterceptor());

  const reflector = app.get(Reflector);             // el guard lo usa para leer @Publico()
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('API del Gimnasio')          // titulo que sale arriba de /docs
    .setVersion('1.0')
    .addBearerAuth()                       // agrega el boton Authorize
    .addSecurityRequirements('bearer')     // pone el candado en todas las rutas
    .build();
  const documento = SwaggerModule.createDocument(app, config); // recorre controllers y DTO
  SwaggerModule.setup('docs', app, documento);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
