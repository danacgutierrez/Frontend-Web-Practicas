import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { InscripcionesService } from './inscripciones.service';
import { CrearInscripcionDto } from './dto/crear-inscripcion.dto';
import { aInscripcionDto } from './dto/inscripcion-respuesta.dto';
import { UsuarioActual } from 'src/auth/decoradores/usuario-actual.decorator';
import { Rol, type PayloadJwt } from 'src/auth/dominio/usuario';
import { Roles } from 'src/auth/decoradores/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly servicio: InscripcionesService) { }

  @Get()
  async listar() {
    const lista = await this.servicio.listar();
    return lista.map(aInscripcionDto);
  }

  @Get(':id')
  async buscar(@Param('id') id: string) {
    const inscripcion = await this.servicio.buscar(Number(id));
    if (!inscripcion) {
      throw new NotFoundException(`No existe la inscripcion ${id}`);
    }
    return aInscripcionDto(inscripcion);
  }

  // El try/catch que traducia errores de dominio a HTTP ya no vive
  // aqui: lo hace DominioExceptionFilter, una sola vez para toda la
  // aplicacion. El ValidationPipe global valida horarioId/miembroId
  // antes de que este metodo corra.
  @Post()
  @HttpCode(201)
  async crear(
    @Body() dto: CrearInscripcionDto,
    @UsuarioActual() usuario: PayloadJwt,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (usuario.rol === Rol.miembro && usuario.miembroId !== dto.miembroId) {
      throw new ForbiddenException('Solo puedes inscribirte a ti mismo');
    }

    const inscripcion = await this.servicio.crear(dto);
    res.setHeader('Location', `/inscripciones/${inscripcion.id}`);
    return aInscripcionDto(inscripcion);
  }

  @Roles(Rol.entrenador, Rol.admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async cancelar(@Param('id') id: string,) {
    const cancelada = await this.servicio.cancelar(Number(id));
    if (!cancelada) {
      throw new NotFoundException(`No existe la inscripcion ${id}`);
    }
    return aInscripcionDto(cancelada);
  }
}
