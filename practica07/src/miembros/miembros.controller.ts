import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { MiembrosService } from './miembros.service.js';
import type { CrearMiembroDto } from './dto/crear-miembro.dto.js';
import type { ActualizarMiembroDto } from './dto/actualizar-miembro.dto.js';

@Controller('miembros')
export class MiembrosController {
    constructor(
        private readonly miembrosService: MiembrosService
    ){}

    @Get()
    listar(){
        return this.miembrosService.listar();
    }

    @Get(':id')
    async buscar(@Param('id') id: string){
        const miembro = await this.miembrosService.buscar(Number(id));
        if(!miembro){
            throw new NotFoundException("No existe el miembro");
        }
        return miembro;
    }

    @Post()
    @HttpCode(201)
    crear(@Body() dto: CrearMiembroDto){
        return this.miembrosService.crear(dto);
    }

    @Patch(':id')
    async actualizar(@Param('id') id: string, @Body() dto: ActualizarMiembroDto){
        const miembro = await this.miembrosService.actualizar(Number(id), dto);
        if(!miembro){
            throw new NotFoundException("No existe el miembro para actualizar");
        }
        return miembro;
    }

    @Delete(':id')
    async eliminar(@Param('id') id: string){
        const miembro = await this.miembrosService.eliminar(Number(id));
        if(!miembro){
            throw new NotFoundException("No existe el miembro que se desea eliminar");
        }
        return miembro;
    }
}