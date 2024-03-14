import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsInt, IsNumber, IsOptional, Max, Min } from "class-validator";

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC'
}

export class PageMeta {
    searchs?: any = {};
    order: string[][] 

    constructor(
        public take: number = 50 ,
        public pageSize: number = 1
    ){
        this.searchs = {};
        this.order = [];
    }
}

export class PageDto<Type> {

    @ApiProperty({  description: 'Previous page' })
    public previousPage: number;

    @ApiProperty({  description: 'Current page' })
    public currentPage: number;

    @ApiProperty({  description: 'Next page' })
    public nextPage: number;
    
    @ApiProperty({ description: 'Total registers' })
    public total: number;

    @ApiProperty({ description: 'Number registers take' })
    public take: number;

    @ApiProperty({ description: 'Data' ,type: Type , isArray: true })
    public data: Type[]
}


export class PageOptionsDto {
    @ApiPropertyOptional({ minimum: 1, default: 1 })
    @IsInt()
    @Min(1)
    @IsOptional()   
    @Transform(({ value }) => {  return Number(value); })
    @IsNumber({}, { message: ' "page" atrribute should be a number' })
    public readonly page: number;
    
    @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10  })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    @Transform(({ value }) => { return Number(value); })
    @IsNumber({}, { message: ' "take" attribute should be a number ' })
    public readonly take: number;

    @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
    @IsEnum(SortOrder)
    @IsOptional()
    readonly order?: SortOrder = SortOrder.ASC;

    @ApiPropertyOptional()
    @IsOptional()
    readonly searchs?: string;
} 