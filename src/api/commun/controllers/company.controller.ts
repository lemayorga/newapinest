import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate } from 'src/api/shared/models/paginate.model';
import { CompanyCreateDto, CompanyDto, CompanyUpdateDto } from '../dtos';
import { CompanyService } from '../services';

@ApiTags('Company')
@Controller('commun/company')
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

  @Post('paginate/:pageSize/:pageNumber')
  @ApiOperation({ summary: 'List pagination from entity company records.' })
  @ApiResponse({ status: HttpStatus.OK, description:  'Request successful.'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async paginate(@Param('pageSize') pageSize: number, @Param('pageNumber') pageNumber: number, @Body() pag: Paginate){
    const result = await this.service.paginante(pageSize, pageNumber,pag);
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
    return this.service.updateById(id, data);
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

