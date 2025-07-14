import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt.config";
import { AuthJWTPayload } from "../types/auth-jwtPayload";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY) private jwtConfigurations: ConfigType<typeof jwtConfig>,
  ) {
   super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfigurations.secret!, 
  ignoreExpiration:false
});

  }

  validate(payload: AuthJWTPayload) {
    return { id: payload.sub };
  }
}
