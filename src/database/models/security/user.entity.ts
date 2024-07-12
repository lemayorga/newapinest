import { DataTypes } from 'sequelize';
import { Column, Model, Table, BelongsToMany, PrimaryKey } from 'sequelize-typescript';
import { Role } from './role.entity';
import { UsersRoles } from './users_roles.entity';


@Table({ schema: 'security',  modelName: 'user' })
export class User extends Model<User> {
  
  @PrimaryKey
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

  @Column({ type: DataTypes.BOOLEAN, defaultValue: true , allowNull: false})
  isActive: boolean;

  @BelongsToMany(() => Role, () => UsersRoles, 'idUser')
  roles?: Role[]

   
  static applyActivatedScope() {
      // Aplicar el scope Orden predeterminado por la columna 'id' en orden ascendente
   //   this.addScope('defaultScope', {  order: [['id', 'ASC']], }, { override: true });
  }
}

