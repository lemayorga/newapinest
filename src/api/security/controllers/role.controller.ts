import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser, Auth } from 'src/api/auth/decorators';
import { PageOptionsDto } from 'src/shared/models';
import { ApiOkResponsePaginated } from 'src/shared/decorators/api-response-paginated';
import { RolAsignateUsertDto, RolCreateDto, RolDto, RolUpdateDto, RolUserResultDto } from '../dtos';
import { RolService } from '../services';
@Auth()
@ApiBearerAuth()
@ApiTags('Role')
@Controller('security/role')
export class RolController {
  
  constructor(private readonly service: RolService) {}

  @Get()
  @ApiOkResponse({ type: RolDto, isArray: true }) 
  @ApiOperation({ summary: 'List all entity role records.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Request successful.'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async get( @GetUser() user: any) {
    const result = await this.service.getAll();
    return result;
  }

  @Get('getByCode')
  @ApiOkResponse({ type: RolDto }) 
  @ApiOperation({ summary: 'Get the entity record role by code.' })
  @ApiResponse({ status: HttpStatus.OK, description:  'Request successful.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async getByCode(@Query('code') code: string) {
    return  await this.service.findByCode(code)
  }

  @Get('getRolesUsersByCodeRol')
  @ApiOkResponse({ type: RolUserResultDto }) 
  @ApiOperation({ summary: 'Get the user asociato to role, filter by code.' })
  @ApiResponse({ status: HttpStatus.OK, description:  'Request successful.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async getRolesUsersByCodeRol(@Query('code') code: string) {
    return  await this.service.getRolesUsers(code, null);
  }


  @Get('getRolesUsersByUserId')
  @ApiOkResponse({ type: RolUserResultDto }) 
  @ApiOperation({ summary: 'Get the user asociato to role, filter by code.' })
  @ApiResponse({ status: HttpStatus.OK, description:  'Request successful.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async getRolesUsersByUserId(@Query('userId') userId: number) {
    return  await this.service.getRolesUsers( null, userId);
  }

  @Get('paginate')
  @ApiOkResponsePaginated(RolDto)
  @ApiOperation({ summary: 'List pagination from entity role records.' })
  @ApiResponse({ status: HttpStatus.OK, description:  'Request successful.'})
  async paginate(@Query() pageOptions: PageOptionsDto) {
    const result = await this.service.paginate(pageOptions);
    return result;
  }
  
  @Get(':id')
  @ApiOkResponse({ type: RolDto }) 
  @ApiOperation({ summary: 'Get the entity record role by identifier.' })
  @ApiResponse({ status: HttpStatus.OK, description:  'Request successful.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async getById(@Param('id', ParseIntPipe) id: number) {
    return  await this.service.findById(id)
  }

  @Post()
  @ApiOkResponse({ type: RolDto }) 
  @ApiOperation({ summary: 'Create new record role.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been successfully created.'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async create(@Body() data: RolCreateDto) {
    const result = await this.service.create(data);
    return result;
  }
  
  @Put(':id')
  @ApiOkResponse({ type: RolDto }) 
  @ApiOperation({ summary: 'Update record role by identifier.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entity update successfully.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async update(@Param('id',ParseIntPipe) id: number, @Body() data: RolUpdateDto) {
    return await this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete record role by identifier.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entity deleted successfully.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    return  await this.service.deleteById(id);
  }

  @Post('asignateUsersByCodeRole/:codeRole', )
  @ApiOkResponse({ type: RolUserResultDto }) 
  @ApiOperation({ summary: 'Asignate role to users by code role and user id'})
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been successfully created.'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async asignateUsersByCodeRole(@Param('codeRole') codeRole: string ,@Body()  data: RolAsignateUsertDto) {
    const result = await this.service.asignateUsersByCodeRole(codeRole, data);
    return result;
  }
}