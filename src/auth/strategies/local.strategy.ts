import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){ // par defaut esem el startegie "local so el auth guarf will knowit"
    
    
    constructor (private authService:AuthService){
        //form the body
        super({
            usernameField : 'email',
           // passwordField par defaut password donc zayed nektbouh
                })
 
                
    }


    // bch yvalidi el password 9bal la yraja3 el token // ye5dem el login
    //bch y5dem el validate method from el authservice wvalidi enou el paswword s7i7
    validate(email:string ,password : string){
    return this.authService.validateUSer(email,password) // req.user
    
    }
}