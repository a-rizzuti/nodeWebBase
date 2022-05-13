import { Table, Column, Model } from 'sequelize-typescript'


@Table({timestamps: false, paranoid: false, tableName:'app-settings'})

export default class appSetting extends Model {
    @Column({ allowNull: false, primaryKey:true, unique:true})
        key!: string
    
    @Column
        value!: boolean

    @Column
        descrizione!:string;

}