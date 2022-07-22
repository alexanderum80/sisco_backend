import { Column, Entity } from 'typeorm';

@Entity('ActFijos_ClanaCNMB', { schema: 'dbo' })
export class ActFijosClanaCnmb {
    @Column('int', { name: 'IdCentro' })
    idCentro: number;

    @Column('int', { name: 'IdUnidad' })
    idUnidad: number;

    @Column('nvarchar', { name: 'CNMB', length: 10 })
    cnmb: string;

    @Column('nvarchar', { name: 'DCNMB', length: 40 })
    dcnmb: string;

    @Column('float', { name: 'TREPO', precision: 53 })
    trepo: number;
}
