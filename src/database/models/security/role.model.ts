import { DataTypes } from 'sequelize';
import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';
import { UsersRoles } from './users_roles.model';

@Table({ schema: 'security',  modelName: 'role' })
export class Role extends Model<Role> {

  @Column({ type: DataTypes.INTEGER,  autoIncrement: true,   primaryKey: true,  allowNull: false })
  id: number;

  @Column({ allowNull: false ,  field: 'cod_rol', type: DataTypes.STRING(100) ,  unique: true, validate: { max: 100 }})
  codRol: string;

  @Column({ allowNull: false,  field: 'rol_name', type: DataTypes.STRING(100) , unique: true, validate: { max: 100 }})
  name: string;

  @BelongsToMany(() => User, () => UsersRoles,  'id_rol')
  users?: User[]
}

