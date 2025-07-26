import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { AuthJWTPayload } from './types/auth-jwtPayload';
import refrechJwtConfig from './config/refrech-jwt.config';
import * as argon2 from 'argon2';
import { Currency } from '@faker-js/faker/.';
import { CurrentUSer } from './types/current-user';
import { CreateUserDto } from '../DTO/user.dto';
@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtService: JwtService,
    @Inject(refrechJwtConfig.KEY) private refrechtokenconfig,
  ) {}
  async validateUSer(email: string, password: string) {
    const user = await this.userservice.findByEmail(email);
    if (!user) throw new UnauthorizedException('user not found !');
    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('invalid credentials !');

    return { id: user.id }; // req.user
  }


  async signUp(dto: CreateUserDto){
    
    const user = await this.userservice.create(dto) 
  return{id:user.id}
  
  }

  async login(userid: number) {
    // const payload:AuthJWTPayload={sub :userid}
    // const token= this.jwtService.sign(payload)

    // const refrechToken=  this.jwtService.sign(payload, this.refrechtokenconfig)

    const { accessToken, refreshToken } = await this.generateTokens(userid);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    this.userservice.updateHashedRefreshToken(userid, hashedRefreshToken);

    return { id: userid, accessToken, refreshToken };
  }

  async validaterefreshtoken(userid: number, refreshToken: string) {
    const user = await this.userservice.findOne(userid);
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Invalid Refresh Token');

    const refreshtokenmatch = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshtokenmatch)
      throw new UnauthorizedException('invalid refresh token');

    return { id: userid };
  }

  async generateTokens(userid: number) {
    const payload: AuthJWTPayload = { sub: userid };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refrechtokenconfig),
    ]);
    return { accessToken, refreshToken };
  }

 async  RefreshToken(userid: number) {
     const { accessToken, refreshToken } = await this.generateTokens(userid);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await  this.userservice.updateHashedRefreshToken(userid, hashedRefreshToken);

 
    const payload: AuthJWTPayload = { sub: userid };
    const token = this.jwtService.sign(payload);
    return {
      id:userid,
      token,
    };
  }

  async signout(userid:number){
    await this.userservice.updateHashedRefreshToken(userid,null)

  }


  async validateJWTUser (userid : number){
    const user = await this.userservice.findOne(userid)
    if(!user ) throw new UnauthorizedException('user not found')
      const currentuser : CurrentUSer = {
    id:user.id , role:user.role }

return currentuser
  }
}
