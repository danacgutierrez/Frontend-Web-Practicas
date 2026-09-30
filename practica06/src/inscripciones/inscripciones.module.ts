import { Module } from '@nestjs/common';
import { InscripcionesController } from './inscripciones.controller.js';
import { InscripcionesService } from './inscripciones.service.js';
import { InscripcionMemoriaRepository } from './infra/inscripcion-memoria.repository.js';


@Module({
  controllers: [InscripcionesController],
  providers: [InscripcionesService, 
    {
        // NOTAS CLASE:
        // Como las interfaces desaparecen al compilar con js, no podemos pasarle la interfaz como provider,
        // pero esta sirve para que si queremos cambiar el memoria repository a una base de datos en un futuro,
        // no tengamos que afectar las demas implementaciones, entonces creamos un token, hacemos el inject en el service
        // y aqui podemos utilizar que inscripcion repository sera reemplazado por la clase que apliquemos, en este caso
        // la que esta en memoria, pero asi no rompemos la arquitectura y podemos seguir utilizando la interfaz
        // y cuando este cambio exista en un futuro, lo unico que se cambia es el useClass: 
        provide: "INSCRIPCION_REPOSITORY", useClass: InscripcionMemoriaRepository
    }]
})
export class InscripcionesModule {}
