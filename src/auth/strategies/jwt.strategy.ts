import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt.config";
import { AuthJWTPayload } from "../types/auth-jwtPayload";
import { Inject, Injectable } from "@nestjs/common";
import { Role } from "../enums/role.enum";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { //  par defaut esm el strategie "jwt" so el jwt auth guard bch testa5del el strategie hethi 5ater 3malna AuthGuard('jwt')
  constructor(
    // jwtconfig.key hya "jwt" 5ater 3mlna export default
    //ConfigType<typeof jwtConfig> cause if we did nnot use configtype ts will not know what's inside instace of jwt service so we tell nest js what is the type we expecting from jwtconfig for auto completionn and type checking
    @Inject(jwtConfig.KEY) private jwtConfigurations: ConfigType<typeof jwtConfig>,
    private authservice : AuthService
  ) {
   super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfigurations.secret!, // get the secrekey to verify the token later
  ignoreExpiration:false
});

  }

  validate(payload: AuthJWTPayload) {
    const userId = payload.sub
return this.authservice.validateJWTUser(userId  )  }
}
