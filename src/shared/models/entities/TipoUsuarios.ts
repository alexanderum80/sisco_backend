import { Column, Entity, Index, OneToMany } from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("PK_Tipo_Usuarios", ["idTipo"], { unique: true })
@Entity("Tipo_Usuarios", { schema: "dbo" })
export class TipoUsuarios {
  @Column("int", { primary: true, name: "IdTipo" })
  idTipo: number;

  @Column("nvarchar", { name: "TipoUsuario", length: 50 })
  tipoUsuario: string;

  @OneToMany(() => Usuarios, (usuarios) => usuarios.idTipoUsuario)
  usuarios: Usuarios[];
}
