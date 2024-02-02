import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RepoResult } from 'src/api/shared/models/repo.interface';
import { Paginate } from 'src/api/shared/models/paginate.model';
import { CatalogueCreateDto, CatalogueDto, CatalogueUpdateDto } from '../dtos';
import { CatalogueService } from '../services';

@ApiTags('Catalogue')
@Controller('commun/catalogue')
export class CatalogueController {
  
  constructor(private readonly service: CatalogueService) {}

  @Get()
  @ApiOkResponse({ type: CatalogueDto, isArray: true }) 
  @ApiOperation({ summary: 'List all entity catalogue records.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Request successful.'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async get() {
    const result = await this.service.getAll();
    return result;
  }

  @Post('paginate/:pageSize/:pageNumber')
  @ApiOperation({ summary: 'List pagination from entity catalogue records.' })
  @ApiResponse({ status: HttpStatus.OK, description:  'Request successful.'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async paginate(@Param('pageSize') pageSize: number, @Param('pageNumber') pageNumber: number, @Body() pag: Paginate): RepoResult<CatalogueDto[]> {
    const result = await this.service.paginante(pageSize, pageNumber,pag);
    return result;
  }

  @Get(':id')
  @ApiOkResponse({ type: CatalogueDto }) 
  @ApiOperation({ summary: 'Get the entity record catalogue by identifier.' })
  @ApiResponse({ status: HttpStatus.OK, description:  'Request successful.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async getById(@Param('id', ParseIntPipe) id: number) {
    return  await this.service.findById(id)
  }

  @Post()
  @ApiOkResponse({ type: CatalogueDto }) 
  @ApiOperation({ summary: 'Create new record catalogue.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been successfully created.'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async create(@Body() data: CatalogueCreateDto) : RepoResult<CatalogueDto> {
    const result = await this.service.create(data);
    return result;
  }
  
  @Put(':id')
  @ApiOkResponse({ type: CatalogueDto }) 
  @ApiOperation({ summary: 'Update record catalogue by identifier.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entity update successfully.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async update(@Param('id',ParseIntPipe) id: number, @Body() data: CatalogueUpdateDto) : RepoResult<CatalogueDto> {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete record catalogue by identifier.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entity deleted successfully.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async deleteById(@Param('id', ParseIntPipe) id: number) : RepoResult<boolean> {
    return  await this.service.deleteById(id);
  }
}

