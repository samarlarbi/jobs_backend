import { registerAs } from "@nestjs/config";
import { JwtModuleAsyncOptions, JwtModuleOptions, JwtSignOptions } from "@nestjs/jwt";

export default registerAs("refrech-jwt" , (): JwtSignOptions=>({
    secret:process.env.REFRECH_JWT_SECRET,
expiresIn:process.env.REFRECH_JWT_EXP,


    
}))