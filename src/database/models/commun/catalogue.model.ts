import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';


@Table({ schema: 'commun',  modelName: 'catalogue' })
export class Catalogue extends Model<Catalogue> {
  @Column({ type: DataTypes.INTEGER,  autoIncrement: true,   primaryKey: true })
  id: number;
  
  @Column({ type: DataTypes.STRING(80),   allowNull: false })
  group: string;

  @Column({type: DataTypes.STRING(80),  allowNull: false })
  value: string;

  @Column({ field: 'is_active',  type: DataTypes.BOOLEAN, defaultValue: true , allowNull: false})
  isActive: boolean;

  @Column
  description: string;
}