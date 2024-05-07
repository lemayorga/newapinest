import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CatalogueDto  {

    @IsNumber()
    @ApiProperty({  description: 'Id database'  })
    id: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(80)
    @ApiProperty({ description: 'Group name'  })
    group: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(80)
    @ApiProperty({ description: 'Value'  })
    value: string;

    @IsBoolean()
    @ApiProperty({ description: 'Status active/inactive'  })
    isActive: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(150)
    @ApiProperty({ description: 'Description' , required: false  })
    description: string;
}  



export class CatalogueCreateDto {
    
    @IsString()
    @MinLength(1)
    @MaxLength(80)
    @ApiProperty({ description: 'Group name', minimum: 5,  maxLength: 80 , required: false })
    group: string;

    @IsString()
    @MinLength(1)
    @MaxLength(80)
    @ApiProperty({ description: 'Value', minimum: 1, maxLength: 80  })
    value: string;


    @IsString()
    @IsOptional()
    @MaxLength(150)
    @ApiProperty({  description: 'Description', minimum: 1,  maxLength: 150, required: false })
    description: string;

}

export class CatalogueUpdateDto extends PartialType(CatalogueCreateDto) { 

    @IsBoolean()
    @ApiProperty({  description: 'Status active/inactive', required: false  })
    isActive: boolean;

}