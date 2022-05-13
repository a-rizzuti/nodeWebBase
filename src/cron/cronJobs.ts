import logger from "../logger"
import cron, { CronJob } from "cron";

class CronJobs {
    private static instance: CronJobs ;
    scheduled!: cron.CronJob[] ;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { this.scheduled = []}
  
    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): CronJobs {
        if (!CronJobs.instance) {
            CronJobs.instance = new CronJobs();
        }

        return CronJobs.instance;
    }
    init(){
        logger.info("[CRON] STARTING CRON")
        
        //AGGIUNGI JOBS QUA
        try{
            //this.scheduled.push(new cron.CronJob('5 0 * * * ', async () => regenerateCorse()));
            //this.scheduled.push(new cron.CronJob('*/4 * * * *', async () => deleteExpirePrenotazioni()));


            for(let i=0;i<this.scheduled.length;i++){
                this.scheduled[i].start();
            } 

        }catch(e){
            logger.error(`[CRON][INIT] ERROR IN STARTING JOB---- STARTING CRONJOBS ABORTED`);
            this.stop();
            return;
        }
        
        logger.info("[CRON] ALL JOBS STARTED")

    }
    stop(){
        logger.info("[CRON] STOPPING CRON")
        for(let i=0;i<this.scheduled.length;i++){
            this.scheduled[i].stop();
        }
        logger.info("[CRON] ALL JOBS STOPPED")


    }
    

    
}
export const cronObj = CronJobs.getInstance();

