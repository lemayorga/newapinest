import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum OperationType {
    LIKE = 'LIKE',
    EQUAL = 'EQUAL',
    DIST = 'DIST',
    IN = 'IN'
}

export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC'
}

export class SearchPaginate{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'name'  })
    name: string

    @IsNotEmpty()
    @ApiProperty({ description: 'value'  })
    value: any
    
    @IsEnum(OperationType, { each: true })
    @ApiProperty({ description: 'operation'  })
    operation: OperationType;
}

export class Paginate {
    @ApiProperty({ type: SearchPaginate, isArray: true})
    @ApiProperty({ 
        description: 'search' ,
        example: [ 
            { "name": "property", "value": "ff", "operation": "LIKE" },  
            { "name": "property", "value": "ff", "operation": "DIST" },
            { "name": "property", "value": "str", "operation": "EQUAL" }, 
            { "name": "id", "value": "[1,2,3]", "operation": "IN" },
            { "name": "id", "value": "4", "operation": "EQUAL" },
        ]
    })
    search?: SearchPaginate[];

    @IsArray()
    @ApiProperty({ description: 'order', example: ["property", "DESC"]  })
    order?: ({ property: string, orderType: OrderType })[]


    @IsArray()
    @ApiProperty({ description: 'include' })
    include?: any[];
    
    @IsArray()
    @ApiProperty({ description: 'group' })
    group?: any[]
}  

