import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('IX_Conexiones', ['idUnidad', 'consolidado'], { unique: true })
@Index('PK_Conta_Conexiones', ['id'], { unique: true })
@Entity('Conta_Conexiones', { schema: 'dbo' })
export class ContaConexiones {
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
    id: number;

    @Column('int', { name: 'IdUnidad' })
    idUnidad: number;

    @Column('bit', { name: 'Consolidado' })
    consolidado: boolean;

    @Column('int', { name: 'IdDivision', default: () => '(0)' })
    idDivision: number;

    @Column('nvarchar', { name: 'IpRodas', nullable: true, length: 50 })
    ipRodas: string | null;

    @Column('nvarchar', { name: 'Usuario', nullable: true, length: 50 })
    usuario: string | null;

    @Column('nvarchar', { name: 'Contrasena', nullable: true })
    contrasena: string | null;

    @Column('nvarchar', { name: 'BaseDatos', nullable: true, length: 20 })
    baseDatos: string | null;
}
