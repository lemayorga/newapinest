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

  @Unique
  @Column({ allowNull: false , type: DataTypes.STRING(100) ,  unique: true, validate: { max: 100 }})
  codRol: string;

  @Column({ allowNull: false, type: DataTypes.STRING(100) , unique: true, validate: { max: 100 }})
  name: string;

  @BelongsToMany(() => User, () => UsersRoles,  'idRol')
  users?: User[]
}

