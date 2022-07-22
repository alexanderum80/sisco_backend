import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoUsuarios } from "./TipoUsuarios";

@Index("IX_Usuario", ["usuario", "idDivision"], { unique: true })
@Index("PK_Usuario", ["idUsuario"], { unique: true })
@Entity("Usuarios", { schema: "dbo" })
export class Usuarios {
  @PrimaryGeneratedColumn({ type: "int", name: "IdUsuario" })
  idUsuario: number;

  @Column("nvarchar", { name: "Usuario", length: 100 })
  usuario: string;

  @Column("nvarchar", { name: "Contrasena" })
  contrasena: string;

  @Column("int", { name: "IdDivision" })
  idDivision: number;

  @Column("bit", { name: "CambiarContrasena" })
  cambiarContrasena: boolean;

  @OneToOne(() => Usuarios, (usuarios) => usuarios.usuarios)
  @JoinColumn([{ name: "IdUsuario", referencedColumnName: "idUsuario" }])
  idUsuario2: Usuarios;

  @OneToOne(() => Usuarios, (usuarios) => usuarios.idUsuario2)
  usuarios: Usuarios;

  @ManyToOne(() => TipoUsuarios, (tipoUsuarios) => tipoUsuarios.usuarios)
  @JoinColumn([{ name: "IdTipoUsuario", referencedColumnName: "idTipo" }])
  idTipoUsuario: TipoUsuarios;
}
