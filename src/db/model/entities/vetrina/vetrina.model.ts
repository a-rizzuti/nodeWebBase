import { Table, Column, Model, Unique } from 'sequelize-typescript'

@Table({timestamps: true, paranoid: true, tableName:"vetrina"})
export default class vetrina extends Model {
  @Column
  key!: string

  @Column
  record_id!:number

  
}