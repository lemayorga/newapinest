import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class RolDto {

    @IsNumber()
    @ApiProperty({  description: 'Id database'  })
    id: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({ description: 'Code rol', minimum: 3,  maxLength: 100 , required: true })
    codRol: string;
   
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({  description: 'Rol name', minimum: 3, maxLength: 100 , required: true })
    name: string;
}  

export class RolCreateDto {

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    @Transform(({value}) => value.toUpperCase())
    @ApiProperty({ description: 'Code rol', minimum: 3,  maxLength: 100, required: true  })
    codRol: string;
   
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({  description: 'Rol name', minimum: 3, maxLength: 100, required: true  })
    name: string;
}

export class RolUpdateDto extends PartialType(RolCreateDto) {
    
}


export class RolUserResultDto {

    @IsNumber()
    @ApiProperty({  description: 'Id rol'  })
    idRol: number;

    @IsString()
    @ApiProperty({ description: 'Code rol'  })
    codRol: string;
   
    @IsString()
    @ApiProperty({  description: 'Rol name' })
    rolName: string;

    @IsString()
    @ApiProperty({ description: 'User name' })
    username: string;

    @IsString()
    @ApiProperty({  description: 'First name' })
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({  description: 'Last name' })
    lastname: string;
}