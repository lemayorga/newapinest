import { DataTypes } from 'sequelize';
import { Column, Model, Table, BelongsToMany } from 'sequelize-typescript';
import { Role } from './role.entity';
import { UsersRoles } from './users_roles.entity';


@Table({ schema: 'security',  modelName: 'user' })
export class User extends Model<User> {

  @Column({ type: DataTypes.INTEGER,  autoIncrement: true,   primaryKey: true })
  id: number;
  
  @Column({ allowNull: false, type: DataTypes.STRING(50) , unique: true, validate: { min: 3, max: 50 }})
  username: string;

  @Column({ allowNull: false, type: DataTypes.STRING(100) , validate: {  max: 100, isEmail: true }})
  email: string;

  @Column({ allowNull: false, type: DataTypes.STRING(100) , validate:  { min: 3, max: 100 }})
  firstname: string;

  @Column({ allowNull: false, type: DataTypes.STRING(100) , validate: { min: 3, max: 100 }})
  lastname: string;

  @Column({ allowNull: false, type: DataTypes.STRING(100) , validate: {  max: 100 }})
  password: string;

  @Column({ field: 'is_active',  type: DataTypes.BOOLEAN, defaultValue: true , allowNull: false})
  isActive: boolean;

  @BelongsToMany(() => Role, () => UsersRoles, 'id_user')
  roles?: Role[]

}

