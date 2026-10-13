import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClasesModule } from './clases/clases.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { MiembrosModule } from './miembros/miembros.module';
import { HorariosModule } from './horarios/horarios.module';
import { PeticionIdMiddleware } from './comun/middleware/peticion-id.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    ClasesModule,
    InscripcionesModule,
    MiembrosModule,
    HorariosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PeticionIdMiddleware).forRoutes('*');
  }
}
