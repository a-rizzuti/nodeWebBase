import userDetails from '@db/model/details/users/userDetails.model'

import { Table, Column, Model, Unique, HasMany, HasOne } from 'sequelize-typescript'

import superAdmin from './superAdmin.model'

@Table({timestamps: true, paranoid: true})
export default class user extends Model {
  @Column({unique: true})
  name!: string

  @Column
  email!:string
  
  @Column
  password!: string

  @Column
  active!: boolean

  
 
  @HasOne( ()=> superAdmin)
  superAdmin!: superAdmin

  
  @HasMany( () => userDetails)
  dettagli!: userDetails[]

  

}
