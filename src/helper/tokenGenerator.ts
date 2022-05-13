import { isJSDocThisTag } from 'typescript';
import Token from "@objects/Token";

export class tokenGenerator{
    //validTime:number = 300;
    private char = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    validTime:number = 15*60*1000; //15 minuti
    constructor(){
    }

    async getToken(){
        let value = this.generateToken()
        let genTime = Date.now();

        return new Token(value,genTime,this.validTime);
    }
    async getTokenWihtValue(value:string){
        
        let genTime = Date.now();

        return new Token(value,genTime,this.validTime*1000);
    }
    
    private generateToken(lenght: number = 16){
        const str_a = [];
        for (let i = 0; i < lenght; i++) {
        const rndNmbRaw = Math.random() * this.char.length;
        const rndNmb = Math.floor(rndNmbRaw);
        str_a.push(this.char[rndNmb])
        }
        return str_a.join('');
    }
}


