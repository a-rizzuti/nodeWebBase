import { Sequelize } from 'sequelize-typescript'
import logger from "../logger"
import conf from '@config'
export default class Database {
  instance!: Sequelize;
  async init () : Promise<void> {
    try {
     
      logger.info('[DB] Starting...')
      let fileExt = 'js'

      if (conf.IN_DEVELOPMENT) {
        fileExt = 'ts'
      }
      //console.log(`${__dirname}`)
      const models = [`${__dirname}/model/**/*.model.${fileExt}`]
      //const storage = `${__dirname}/${conf.MYSQL_STORAGE}`
     /*  const sequelize = new Sequelize({
        database: conf.MYSQL_DBNM, */
        /* port: port,
        username: conf.MYSQL_USER,
        password: conf.MYSQL_PASS,
        host: conf.MYSQL_HOST, */
      /*   dialect: conf.MYSQL_DIALECT, // da aggiungere in conf
        models: models,
        storage:storage,
        
        //timezone: '+02:00', // for writing to database // da aggiungere in conf
        logging: msg => logger.info(`[DB] ${msg}`)
      }) */
      const sequelize = this.buildSequelize(models)
      
      await sequelize.authenticate()
      /* if(conf.IN_DEVELOPMENT){
        await sequelize.sync({alter:true})
      }else{
      } */
      await sequelize.sync({force: false})
      this.instance = sequelize
      //console.log("Sequelize models:"+this.instance.models)
      logger.info('[DB] Starting success')
    } catch (e) {
      logger.error(`[DB] Connection failed: ${(e as Error).message}`)
      throw e
    }
  }
  private buildSequelize(models:string[]){
        if(conf.MYSQL_HAS_LOGIN){
          return new  Sequelize({
            database: conf.MYSQL_DBNM,
            port: conf.MYSQL_PORT,
            username: conf.MYSQL_USER,
            password: conf.MYSQL_PASS,
            host: conf.MYSQL_HOST,
            dialect: conf.MYSQL_DIALECT, 
            models: models,
            timezone: '+02:00', // for writing to database // da aggiungere in conf
            logging: msg => logger.info(`[DB] ${msg}`)
          })
        }
        if(conf.MYSQL_DIALECT == "sqlite"){
          const storage = `${__dirname}/${conf.MYSQL_STORAGE}`
          return new Sequelize({
            database: conf.MYSQL_DBNM,
            dialect: conf.MYSQL_DIALECT, 
            models: models,
            storage:storage,
            
        
            logging: msg => logger.info(`[DB] ${msg}`)
          })
        }
        throw Error("[DB] Invalid db configuration")
  }
  /**
  * @deprecated il metodo non dovrebbe essere usato, non sfrutto questa funzionalità, invoca eccezione
  **/
  async dropTables() : Promise<void>{
    try{
      throw new Error('Metodo deprecato')
      if(!conf.IN_DEVELOPMENT) throw new Error('Cannot drop tables in production!')
      await this.instance.drop();
      await this.instance.sync({force:false});
    }catch(e){
      logger.error(`[DB] Connection failed: ${(e as Error).message}`)
      throw e
    }

  }
  async stop () : Promise<void>{
    await this.instance.close()
  }
}