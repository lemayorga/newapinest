import { DataTypes } from 'sequelize';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.entity';
import { Role } from './role.entity';


@Table({ schema: 'security',  modelName: 'usersroles' })
export class UsersRoles extends Model<UsersRoles> {

  @Column({ type: DataTypes.INTEGER,  autoIncrement: true,   primaryKey: true })
  id: number;

  @ForeignKey(() =>  User)
  @Column({field: 'id_user', type: DataTypes.INTEGER })
  idUser: number;
  
  @ForeignKey(() =>  Role )
  @Column({field: 'id_rol', type: DataTypes.INTEGER })
  idRol: number;
}

