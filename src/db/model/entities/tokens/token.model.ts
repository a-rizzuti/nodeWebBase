import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript'
import user from "@db/model/entities/users/user.model"


@Table({timestamps: false, paranoid: false})

export default class token extends Model {
    
    @BelongsTo( () => user)
    user !: user
    @ForeignKey(() => user)
    @Column({ allowNull: false})
        uid!: number
    
    @Column
        value!: string

    @Column
        genAt!: string 

       
    @Column
        exp!:number
    
  

}