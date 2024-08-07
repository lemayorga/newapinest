import { DataTypes } from 'sequelize';
import { Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from './user.entity';
import { Role } from './role.entity';


@Table({ schema: 'security',  modelName: 'usersroles' })
export class UsersRoles extends Model<UsersRoles> {
  
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER,  autoIncrement: true,   primaryKey: true })
  id: number;

  @ForeignKey(() =>  User)
  @Column({field: 'idUser', type: DataTypes.INTEGER })
  idUser: number;
  
  @ForeignKey(() =>  Role )
  @Column({field: 'idRol', type: DataTypes.INTEGER })
  idRol: number;
}

