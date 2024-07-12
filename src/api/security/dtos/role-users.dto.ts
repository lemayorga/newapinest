import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNumber, IsOptional } from "class-validator";

export class RolAsignateUsertDto { 
    @IsInt({ each: true })
    @ApiProperty({  description: 'Ids users', isArray: true  , type: [Number],   example: [13245, 54321], })
    @IsNumber({},{each: true})
    uesrIds: number[];

    @ApiPropertyOptional({  description: 'Boolean for activate if remove data existed, it is optional' })
    @IsBoolean()
    @IsOptional()
    removerData?:boolean = false;
}