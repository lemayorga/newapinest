import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CompanyDto {
    
    @IsNumber()
    @ApiProperty({  description: 'Id database'  })
    id: number;

    @IsString()
    @MinLength(1)
    @MaxLength(80)
    @ApiProperty({
        description: 'Value',
        minimum: 1,
        maxLength: 150,
        required: true
    })
    name: string;

    @IsBoolean()
    @ApiProperty({
         description: 'Status active/inactive'
    })
    isActive: boolean;


    @IsNumber()
    @ApiProperty({
        description: 'Company successor',
        required: false
    })
    companySuccessorId?: number;
}  

export class CompanyCreateDto {


    @IsString()
    @MinLength(1)
    @MaxLength(80)
    @ApiProperty({
        description: 'Value',
        minimum: 1,
        maxLength: 150,
        required: true
    })
    name: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        description: 'Company successor',
        required: false
    })
    companySuccessorId?: number;

}

export class CompanyUpdateDto extends PartialType(CompanyCreateDto) {

    @IsBoolean()
    @ApiProperty({
         description: 'Status active/inactive'
    })
    isActive: boolean;

}