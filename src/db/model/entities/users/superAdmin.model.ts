import { Table, Column, Model, Unique, ForeignKey, BelongsTo } from 'sequelize-typescript'
import user from './user.model'

@Table({timestamps: true, paranoid: true, tableName:"superAdmin"})
export default class superAdmin extends Model {
  @BelongsTo( () => user)
  user!:user;
  
  @Column({allowNull:false})
  @ForeignKey( () => user)
  user_id!: number


 

}