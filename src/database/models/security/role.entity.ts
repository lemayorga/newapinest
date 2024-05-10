import { DataTypes } from 'sequelize';
import { AutoIncrement, BelongsToMany, Column, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { User } from './user.entity';
import { UsersRoles } from './users_roles.entity';

@Table({ schema: 'security',  modelName: 'role' })
export class Role extends Model<Role> {

  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataTypes.INTEGER,  autoIncrement: true,   primaryKey: true,  allowNull: false })
  id: number;

  // @Unique('rol_code')
  @Unique
  @Column({ allowNull: false ,  field: 'cod_rol', type: DataTypes.STRING(100) ,  unique: true, validate: { max: 100 }})
  codRol: string;

  @Column({ allowNull: false,  field: 'rol_name', type: DataTypes.STRING(100) , unique: true, validate: { max: 100 }})
  name: string;

  @BelongsToMany(() => User, () => UsersRoles,  'id_rol')
  users?: User[]
}

