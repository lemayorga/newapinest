import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table({ schema: 'commun', modelName: 'company' })
export class Company extends Model<Company> {

  @Column({ type: DataTypes.INTEGER,  autoIncrement: true,   primaryKey: true })
  id: number;
  
  @Column({ type: DataTypes.STRING(150),  allowNull: false })
  name: string;


  @Column({ type: DataTypes.BOOLEAN, field: 'is_active', defaultValue: true , allowNull: false})
  isActive: boolean;

  @Column({ type: DataTypes.INTEGER,  allowNull: true })
  companySuccessorId: number;
}