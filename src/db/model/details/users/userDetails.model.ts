import user from '@db/model/entities/users/user.model'
import { Table, Column, Model, ForeignKey } from 'sequelize-typescript'
import {EuserDetailsKeys} from "../../../enums/EuserDetails"
@Table({timestamps: true, paranoid: true})
export default class userDetails extends Model {
  @Column
  @ForeignKey( () => user)
  user_id!: number

  @Column
  key!: EuserDetailsKeys
  
  @Column
  value!: string

}