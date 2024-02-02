import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../models/role.enum';
import { RoleProtected } from './roles.decorator';
import { UerRoleGuard } from '../guards/uer-role.guard';


export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UerRoleGuard),
  );
}