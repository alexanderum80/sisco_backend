import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsuariosResolver } from './usuarios.resolver';
import { UsuariosService } from './usuarios.service';
import { Usuarios } from './usuarios.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Usuarios])],
    providers: [UsuariosResolver, UsuariosService],
    exports: [UsuariosService],
})
export class UsuariosModule {}
