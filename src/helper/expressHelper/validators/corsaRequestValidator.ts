import {  Schema } from 'express-validator'

/*
    export default class CorsaRequest{
    name!: string;
    trattaId!:number;
    dataArrivo!:Date;
    dataPartenza!:Date;
    posti!:number
    prezzo!:number
    sconto !: number
    id!:number
*/


 const corsaRequestValidatorNoId : Schema = {
    name: {
        errorMessage: 'Nome non valido',
        isString: true,
        isLength:{
        errorMessage: 'Lunghezza Nome non valida',
        options:{min: 1, max: 255}
        }
    },
    trattaId: {
        errorMessage: "trattaId non valido",
        in: ['body'],
        isInt: true,
        toInt: true
    },
    orarioArrivo: {
        errorMessage: "dataArrivo non valido",
        isString:true,
        toDate:true,
        
    },
    dataPartenza: {
        errorMessage:  "dataPartenza non valida",
        isString:true
    },
    posti: {
        errorMessage: "posti non valido",
        isInt:true,
        toInt:true, 
    },
    sconto: {
        errorMessage:  "sconto non valido",
        isDecimal:true,
        
    },
    
}
export function getCorsaRequestValidator(id:boolean){
    if(!id){
        return corsaRequestValidatorNoId;
    }
    let valid = corsaRequestValidatorNoId;
    valid.corsaId={
        errorMessage: "id non valido",
        in: ['body'],
        isInt: true,
        toInt: true
    
    }
    return valid;

}