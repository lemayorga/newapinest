import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordUserDto, RolDto, UserCreateDto, UserDto, UserUpdateDto } from '../dtos';
import { UserService } from '../services';
import { PageDto, PageOptionsDto } from 'src/api/shared/models';
import { ApiOkResponsePaginated } from 'src/api/shared/decorators/api-response-paginated';

@ApiTags('User')
@Controller('security/user')
export class UserController {
  
  constructor(private readonly service: UserService) {}

  @Get()
  @ApiOkResponse({ type: UserDto, isArray: true }) 
  @ApiOperation({ summary: 'List all entity user records.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Request successful.'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async get() {
    const result = await this.service.getAll();
    return result;
  }

  @Get('paginate')
  @ApiOkResponsePaginated(UserDto)
  @ApiOperation({ summary: 'List pagination from entity user records.' })
  @ApiResponse({ status: HttpStatus.OK, description:  'Request successful.'})
  async paginate(@Query() pageOptions: PageOptionsDto) {
    const result = await this.service.paginate(pageOptions);
    return result;
  }

  @Get(':id')
  @ApiOkResponse({ type: UserDto }) 
  @ApiOperation({ summary: 'Get the entity record user by identifier.' })
  @ApiResponse({ status: HttpStatus.OK, description:  'Request successful.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async getById(@Param('id', ParseIntPipe) id: number) {
    return  await this.service.findById(id)
  }

  @Post()
  @ApiOkResponse({ type: UserDto }) 
  @ApiOperation({ summary: 'Create new record user.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been successfully created.'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async create(@Body() data: UserCreateDto) {
    const result = await this.service.create(data);
    return result;
  }
  
  @Put(':id')
  @ApiOkResponse({ type: UserDto }) 
  @ApiOperation({ summary: 'Update record user by identifier.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entity update successfully.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async update(@Param('id',ParseIntPipe) id: number, @Body() data: UserUpdateDto) {
    return this.service.updateById(id, data);
  }

  @Put('changePassword')
  @ApiOkResponse({ type: UserDto }) 
  @ApiOperation({ summary: 'Update password user.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entity update successfully.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async changePassword(@Body() data: ChangePasswordUserDto) {
    return this.service.changePassword(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete record user by identifier.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entity deleted successfully.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entity does not exist'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.'})
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    return  await this.service.deleteById(id);
  }
}

