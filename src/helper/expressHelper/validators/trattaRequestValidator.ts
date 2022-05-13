import {  Schema } from 'express-validator'

export const trattaRequestValidator : Schema = {
name: {
    errorMessage: 'Nome non valido',
    isString: true,
    isLength:{
    errorMessage: 'Lunghezza Nome non valida',
    options:{min: 1, max: 255}
    }
},
fornitoreId: {
    errorMessage: "fornitoreId non valido",
    in: ['body'],
    isInt: true,
    toInt: true
},
comuneNamePartenza: {
    errorMessage: "ComuneNamePartenza non valido",
    isString:true,
    isLength: {
        errorMessage: "Lunghezza comuneNamePartenza non valida",
        options:{min: 1}

    }  
},
descrizionePartenza: {
    errorMessage:  "descrizionePartenza non valida",
    isString:true,
    isLength:{
        errorMessage: "Lunghezza descrizionePartenza non valida",
        options:{min:1, max:255},
    }
},
comuneNameDestinazione: {
    errorMessage: "ComuneNameDestinazione non valido",
    isString:true,
    isLength: {
        errorMessage: "Lunghezza ComuneNameDestinazione non valida",
        options:{min: 1}

    }  
},
descrizioneDestinazione: {
    errorMessage:  "descrizioneDestinazione non valida",
    isString:true,
    isLength:{
        errorMessage: "Lunghezza descrizioneDestinazione non valida",
        options:{min:1, max:255},
    }
},

}


