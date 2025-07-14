import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt.config";
import { AuthJWTPayload } from "../types/auth-jwtPayload";
import { Inject, Injectable } from "@nestjs/common";
import refrechJwtConfig from "../config/refrech-jwt.config";
import { Request } from "express";
import { AuthService } from "../auth.service";

@Injectable()
export class RefrechJwtStrategy extends PassportStrategy(Strategy,'refrech-jwt') {
  constructor(
    @Inject(refrechJwtConfig.KEY) 
    private refrechjwtConfigurations: ConfigType<typeof refrechJwtConfig>,
    private authservice : AuthService
  ) {
   super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: refrechjwtConfigurations.secret!,
  ignoreExpiration:false,
  passReqToCallback:true
});

  }

  validate(req:Request,payload: AuthJWTPayload) {

    const refreshToken = req.get("authorization")?.replace("Bearer","").trim()
    const userid = payload.sub
    return this.authservice.validaterefreshtoken(userid,refreshToken!);
  }
}
