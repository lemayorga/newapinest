import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser } from './decorators';
import { UserLoginDto } from './dtos';
import { AuthService } from './services/auth.service';
import { User } from 'src/database/models/security';
import { encryptText } from 'src/utils';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  
  constructor(private readonly service: AuthService) {}

  @Post('login')
  async login(@Body() signInDto: UserLoginDto)  {
    let d = await encryptText ('Sadmin123'); //encryptPassword
    const result = await this.service.login(signInDto);
    return result;
  }
  
  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  getProfile(@Request() req) {
    return req.user;
  }


   @Auth()
   @ApiBearerAuth()
   @Get('private3')
   private3(@GetUser() user: User,){
 
     console.log(user);
 
     return {
       ok: true,
       message: user
     };
   }
  
}

