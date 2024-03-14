import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RepoResult } from 'src/api/shared/models/repo.interface';
import { CatalogueCreateDto, CatalogueDto, CatalogueUpdateDto } from '../dtos';
import { CatalogueService } from '../services';
import { PageOptionsDto } from 'src/api/shared/models';
import { ApiOkResponsePaginated } from 'src/api/shared/decorators/api-response-paginated';

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

  @Get('paginate')
  @ApiOkResponsePaginated(CatalogueDto)
  @ApiOperation({ summary: 'List pagination from entity catalogue records.' })
  @ApiResponse({ status: HttpStatus.OK, description:  'Request successful.'})
  async paginate(@Query() pageOptions: PageOptionsDto) {
    const result = await this.service.paginate(pageOptions);
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

