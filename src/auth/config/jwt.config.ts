import { registerAs } from "@nestjs/config";
import { JwtModuleAsyncOptions, JwtModuleOptions } from "@nestjs/jwt";

export default registerAs("jwt" , (): JwtModuleOptions=>({
    secret:process.env.JWT_SECRET,
    signOptions:{
expiresIn:process.env.JWT_EXP

    }
}))