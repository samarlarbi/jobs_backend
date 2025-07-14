import { Controller, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RefrechAuthGuard } from './guards/refrech-auth/refrech-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

@UseGuards(AuthGuard('local'))
  @Post("login")
async login(@Request() req){
  console.log(req.user);
 return this.authService.login(req.user.id)
 ;

}
@UseGuards(RefrechAuthGuard)
@Post('refresh')
refreshToken(@Req() req){
  return this.authService.RefreshToken(req.user.id)
}
@UseGuards(JwtAuthGuard)
@Post("signout")
signout(@Req() req){
  this.authService.signout(req.user.id)
  return "user signed out"
}
}
