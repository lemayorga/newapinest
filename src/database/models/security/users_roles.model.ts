import { DataTypes } from 'sequelize';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';
import { Role } from './role.model';


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

// https://blog.bozjatorium.com/2020/02/12/nestjs-sequelize-using-typescript-wrapper-many-to-many/
// https://github.com/sequelize/sequelize-typescript#many-to-many