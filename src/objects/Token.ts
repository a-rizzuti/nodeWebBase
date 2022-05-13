import hashHmacSha256 from "@auth/hashing/hashing"

export default class Token{
    value:string
    hashed!:string;
    generated:number
    lifeTime:number
    validUntil:number
    constructor(value:string,genDate:number,life:number){
        this.value = value;
        this.generated=genDate;
        this.lifeTime=life
        this.validUntil= genDate+life;
        this.hashed = hashHmacSha256(value);
    }
    isExpired(){
        let now = Date.now(); 
        return (now - this.generated) >  this.lifeTime
    }
    renew(){
        this.generated = Date.now();
    }
    toString(){
        return JSON.stringify(this)
    }

}