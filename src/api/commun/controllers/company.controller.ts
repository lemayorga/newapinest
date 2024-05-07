import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, HttpStatus, Query, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyCreateDto, CompanyDto, CompanyUpdateDto } from '../dtos';
import { CompanyService } from '../services';
import { PageOptionsDto } from 'src/api/shared/models';
import { ApiOkResponsePaginated } from 'src/api/shared/decorators/api-response-paginated';
@ApiTags('Company')
@Controller('commun/company')
@UseInterceptors(ClassSerializerInterceptor)
export class CompanyController {

  constructor(private readonly service: CompanyService) {}

  @Get()
  @ApiOkResponse({ type: CompanyDto, isArray: true }) 
  @ApiOperation({ summary: 'List all entity company records.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Request successful.'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async get() {
    const result = await this.service.getAll();
    return result;
  }
  
  @Get('paginate')
  @ApiOkResponsePaginated(CompanyDto)
  @ApiOperation({ summary: 'List pagination from entity company records.' })
  @ApiResponse({ status: HttpStatus.OK, description:  'Request successful.'})
  async paginate(@Query() pageOptions: PageOptionsDto) {
    const result = await this.service.paginate(pageOptions);
    return result;
  }

  @Get(':id')
  @ApiOkResponse({ type: CompanyDto }) 
  @ApiOperation({ summary: 'Get the entity record company by identifier.' })
  @ApiResponse({ status: HttpStatus.OK, description:  'Request successful.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async getById(@Param('id', ParseIntPipe) id: number) {
    return  await this.service.findById(id)
  }

  @Post()
  @ApiOkResponse({ type: CompanyDto }) 
  @ApiOperation({ summary: 'Create new record company.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been successfully created.'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async create(@Body() data: CompanyCreateDto) {
    const result = await this.service.create(data);
    return result;
  }
  
  @Put(':id')
  @ApiOkResponse({ type: CompanyDto }) 
  @ApiOperation({ summary: 'Update record company by identifier.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entity update successfully.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async update(@Param('id',ParseIntPipe) id: number, @Body() data: CompanyUpdateDto) {
    return await this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete record company by identifier.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entity deleted successfully.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    return  await this.service.deleteById(id);
  }
}

