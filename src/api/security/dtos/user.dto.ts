import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UserDto {
    @IsNumber()
    @ApiProperty({  description: 'Id database'  })
    id: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({ description: 'User name', minimum: 3,  maxLength: 100 , required: true })
    username: string;
   
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({  description: 'First name', minimum: 3, maxLength: 100 , required: true })
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({  description: 'Last name', minimum: 3, maxLength: 100 , required: true })
    lastname: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({  description: 'Email', maxLength: 100 , required: true,  example: 'myemail@gmail.com', })
    email: string;

    @IsBoolean()
    @ApiProperty({ description: 'Status active/inactive'  })
    isActive: boolean;
}  
 

export class UserCreateDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({ description: 'User name', minimum: 3,  maxLength: 100 , required: true })
    username: string;
   
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({  description: 'First name', minimum: 3, maxLength: 100 , required: true })
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({  description: 'Last name', minimum: 3, maxLength: 100 , required: true })
    lastname: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({  description: 'Password', minimum: 3, maxLength: 100 , required: false })
    password: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
    @ApiProperty({  description: 'Email', maxLength: 100 , required: true })
    email: string;

}

export class UserUpdateDto extends PartialType(UserCreateDto) {

    @IsBoolean()
    @ApiProperty({ description: 'Status active/inactive'  })
    isActive: boolean;
}

export class ChangePasswordUserDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({ description: 'User name', minimum: 3,  maxLength: 100 , required: true })
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({  description: 'Current Password', minimum: 3, maxLength: 100 , required: true })
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({  description: 'New Password', minimum: 3, maxLength: 100 , required: true })
    newPassword: string;

    @IsBoolean()
    @ApiPropertyOptional()
    @ApiProperty({ description: 'Compare current Password and new password, avoid duplicate'  })
    comparePasswords!: boolean;
}