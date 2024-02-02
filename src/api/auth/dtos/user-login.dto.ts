import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class UserLoginDto {
    @ApiProperty()
    @IsEmail()
    readonly user: string;

    @ApiProperty()
    @IsString()
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
         message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    @ApiProperty()
    readonly password: string;
}

