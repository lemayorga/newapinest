import { DataTypes } from 'sequelize';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';


@Table({ schema: 'commun',  modelName: 'catalogue' })
export class Catalogue extends Model<Catalogue> {
  
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER,  autoIncrement: true,   primaryKey: true })
  id: number;
  
  @Column({ type: DataTypes.STRING(80),   allowNull: false })
  group: string;

  @Column({type: DataTypes.STRING(80),  allowNull: false })
  value: string;

  @Column({ type: DataTypes.BOOLEAN, defaultValue: true , allowNull: false})
  isActive: boolean;

  @Column({ type: DataTypes.STRING(255), allowNull: true })
  description?: string;
}